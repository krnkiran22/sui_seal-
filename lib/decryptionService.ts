/**
 * Decryption Service for Seal-encrypted blobs with whitelist support
 * Works with the deployed whitelist contract for access control
 */

import { SuiClient } from '@mysten/sui/client';
import { Transaction } from '@mysten/sui/transactions';
import { SealClient, SessionKey, EncryptedObject } from '@mysten/seal';
import { fromHex } from '@mysten/sui/utils';

// Contract configuration (from deployment: 8dxDFH1HUpdQG9QCj52FCJ4FiTNeEBZhdLERQXjctKvg)
const SUI_CLIENT = new SuiClient({ url: 'https://fullnode.testnet.sui.io:443' });
const PACKAGE_ID = '0x75ca17f12a335945207502f250f396e96b17609b641696af4af097b26ea85df7';
const WHITELIST_OBJECT_ID = '0x1549b2b36e25f8b157b70571586bd3f7013111e8495adb3e0f4a70a0255d4e48';

// Seal server configurations - same as encryption
const serverObjectIds = [
  '0x73d05d62c18d9374e3ea529e8e0ed6161da1a141a94d3f76ae3fe4e99356db75', // mysten-testnet-1
  '0xf5d14a81a982144ae441cd7d64b09027f116a468bd36e7eca494f750591623c8', // mysten-testnet-2
  '0x6068c0acb197dddbacd4746a9de7f025b2ed5a5b6c1b1ab44dade4426d141da2', // Ruby Nodes
  '0x5466b7df5c15b508678d51496ada8afab0d6f70a01c10613123382b1b8131007'  // NodeInfra
];

// Initialize Seal client
const sealClient = new SealClient({
  suiClient: SUI_CLIENT,
  serverConfigs: serverObjectIds.map((id) => ({
    objectId: id,
    weight: 1,
  })),
  verifyKeyServers: false,
});

export interface DecryptionResult {
  success: boolean;
  decryptedData?: Uint8Array;
  decryptedUrl?: string;
  error?: string;
}

export class DecryptionService {
  private TTL_MIN = 10;

  /**
   * Creates a session key for decryption
   * Note: In production, this would need proper session key creation
   */
  createSessionKey(userAddress: string): SessionKey | null {
    // For now, return null to indicate session key needs to be created through wallet
    // In production, this would create a proper SessionKey
    console.log('Session key creation needed for address:', userAddress);
    return null;
  }

  /**
   * Creates the move call transaction for whitelist authorization
   */
  private createWhitelistApprovalTransaction(encryptionId: string): Transaction {
    const tx = new Transaction();
    
    tx.moveCall({
      target: `${PACKAGE_ID}::simple_whitelist::seal_approve`,
      arguments: [
        tx.pure.vector('u8', Array.from(fromHex(encryptionId))),
        tx.object(WHITELIST_OBJECT_ID)
      ],
    });

    return tx;
  }

  /**
   * Download and decrypt a blob using Seal with whitelist authorization
   * Note: This is a simplified version for demo purposes
   */
  async decryptBlob(
    blobId: string,
    encryptionId: string,
    userAddress: string,
    onProgress?: (message: string) => void
  ): Promise<DecryptionResult> {
    try {
      console.log('🔓 Starting decryption process...', { blobId, encryptionId, userAddress });

      onProgress?.('Checking whitelist status...');
      
      // Step 1: Check if user is whitelisted
      const isWhitelisted = await this.isUserWhitelisted(userAddress);
      if (!isWhitelisted) {
        return {
          success: false,
          error: 'Address is not whitelisted for decryption. Please contact the admin to be added to the whitelist.'
        };
      }

      onProgress?.('Downloading encrypted blob from Walrus...');
      
      // Step 2: Download encrypted data from Walrus
      const encryptedData = await this.downloadEncryptedBlob(blobId);
      if (!encryptedData) {
        return {
          success: false,
          error: `Failed to download blob ${blobId} from Walrus`
        };
      }

      onProgress?.('Blob downloaded successfully!');

      // For demo purposes, we'll return the encrypted data as a downloadable blob
      // Full decryption requires proper session key management and wallet integration
      const blob = new Blob([encryptedData], { type: 'application/octet-stream' });
      const decryptedUrl = URL.createObjectURL(blob);

      console.log('✅ Encrypted blob downloaded successfully, size:', encryptedData.byteLength);

      return {
        success: true,
        decryptedData: new Uint8Array(encryptedData),
        decryptedUrl,
        error: 'Note: This is encrypted data. Full decryption requires session key and wallet signature.'
      };

    } catch (error) {
      console.error('❌ Decryption process failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }

  /**
   * Download encrypted blob from Walrus aggregators
   */
  private async downloadEncryptedBlob(blobId: string): Promise<ArrayBuffer | null> {
    const aggregators = [
      'https://sui-walrus-tn-aggregator.bwarelabs.com',
      'https://aggregator.walrus-testnet.walrus.space',
      'https://wal-aggregator-testnet.staketab.org',
      'https://aggregator.walrus.banansen.dev',
      'https://suiftly-testnet-agg.mhax.io'
    ];

    for (const aggregator of aggregators) {
      try {
        console.log(`📥 Trying to download from ${aggregator}...`);
        const response = await fetch(`${aggregator}/v1/blobs/${blobId}`, {
          signal: AbortSignal.timeout(10000) // 10 second timeout
        });

        if (response.ok) {
          console.log(`✅ Successfully downloaded from ${aggregator}`);
          return await response.arrayBuffer();
        }
      } catch (error) {
        console.log(`❌ Failed to download from ${aggregator}:`, error);
        continue;
      }
    }

    console.error(`❌ All download attempts failed for blob ${blobId}`);
    return null;
  }

  /**
   * Check if user is whitelisted for decryption
   */
  async isUserWhitelisted(userAddress: string): Promise<boolean> {
    try {
      const tx = new Transaction();
      tx.moveCall({
        target: `${PACKAGE_ID}::simple_whitelist::is_whitelisted`,
        arguments: [
          tx.object(WHITELIST_OBJECT_ID),
          tx.pure.address(userAddress)
        ],
      });

      const result = await SUI_CLIENT.devInspectTransactionBlock({
        transactionBlock: tx,
        sender: userAddress,
      });

      if (result.results && result.results[0]?.returnValues) {
        const returnValue = result.results[0].returnValues[0];
        return returnValue && returnValue[0] && returnValue[0][0] === 1;
      }

      return false;
    } catch (error) {
      console.error('Failed to check whitelist status:', error);
      return false;
    }
  }

  /**
   * Get contract configuration
   */
  getContractConfig() {
    return {
      packageId: PACKAGE_ID,
      whitelistObjectId: WHITELIST_OBJECT_ID,
      suiClient: SUI_CLIENT
    };
  }

  /**
   * Cleanup blob URLs to prevent memory leaks
   */
  static cleanupBlobUrl(url: string) {
    URL.revokeObjectURL(url);
  }
}

export const decryptionService = new DecryptionService();