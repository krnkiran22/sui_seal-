import { SuiClient } from '@mysten/sui/client';
import { Transaction } from '@mysten/sui/transactions';
import { SealClient, EncryptedObject } from '@mysten/seal';
import { fromHex } from '@mysten/sui/utils';

// Import the contract configuration
import { MULTI_ADMIN_WHITELIST_CONFIG } from './contractConfig';

// Configuration matching the latest deployment
const SUI_CLIENT = new SuiClient({ url: 'https://fullnode.testnet.sui.io:443' });
const PACKAGE_ID = MULTI_ADMIN_WHITELIST_CONFIG.packageId; // Updated to new deployment
const GOVERNMENT_WHITELIST_ID = MULTI_ADMIN_WHITELIST_CONFIG.whitelistObjectId; // Updated to new deployment

console.log('🔧 Using contract configuration:');
console.log('📦 Package ID:', PACKAGE_ID);
console.log('📋 Whitelist ID:', GOVERNMENT_WHITELIST_ID);

// Seal server configurations
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
  decryptedFileUrls?: string[];
  error?: string;
  personalMessage?: string;
}

export interface DocumentMetadata {
  blob_id: string;
  encryption_id: string;
  did_type?: string;
  document_type?: string;
  file_name?: string;
  created_at?: string;
  verification_completed?: boolean;
  verification_status?: string;
  walrus_url?: string;
  sui_explorer_url?: string;
}

// Simplified interface for single blob decryption
export interface SimpleBlobDecryption {
  blobId: string;
  decryptedImageUrl?: string;
  error?: string;
}

export type MoveCallConstructor = (tx: Transaction, id: string) => void;

export class DocumentDecryptionService {
  
  /**
   * Check if address is authorized for government access
   */
  async isGovernmentAuthorized(address: string): Promise<boolean> {
    try {
      console.log('🔍 Checking government authorization for:', address);
      console.log('📍 Using whitelist ID:', GOVERNMENT_WHITELIST_ID);
      
      // Call the contract's is_whitelisted function to check authorization
      const tx = new Transaction();
      tx.moveCall({
        target: `${PACKAGE_ID}::simple_whitelist::is_whitelisted`,
        arguments: [
          tx.object(GOVERNMENT_WHITELIST_ID),
          tx.pure.address(address),
        ],
      });

      const result = await SUI_CLIENT.devInspectTransactionBlock({
        transactionBlock: tx,
        sender: address,
      });

      if (result.results && result.results[0] && result.results[0].returnValues) {
        const returnValue = result.results[0].returnValues[0];
        if (returnValue && returnValue[0]) {
          const isWhitelisted = returnValue[0][0] === 1; // 1 = true, 0 = false
          console.log(`✅ Authorization check result: ${isWhitelisted ? 'AUTHORIZED' : 'NOT AUTHORIZED'}`);
          return isWhitelisted;
        }
      }
      
      console.log('❌ Could not verify government authorization - no return value');
      return false;
    } catch (error) {
      console.error('❌ Government authorization check failed:', error);
      return false;
    }
  }

  /**
   * Creates the move call constructor for simple whitelist authorization
   */
  private createMoveCallConstructor(whitelistId: string): MoveCallConstructor {
    return (tx: Transaction, fullId: string) => {
      tx.moveCall({
        target: `${PACKAGE_ID}::simple_whitelist::seal_approve`,
        arguments: [
          tx.pure.vector('u8', fromHex(fullId)),
          tx.object(whitelistId)
        ],
      });
    };
  }

  /**
   * Simplified method to decrypt/retrieve a single blob by ID
   * Currently handles plain storage retrieval with whitelist verification
   */
  async decryptSingleBlob(
    blobId: string,
    userAddress: string,
    onProgress?: (progress: string) => void
  ): Promise<SimpleBlobDecryption> {
    try {
      console.log('📥 Starting blob retrieval/decryption:', blobId);
      console.log('👤 User address:', userAddress);
      
      // Step 1: Check if user is authorized as government
      onProgress?.('Verifying government access permissions...');
      const isAuthorized = await this.isGovernmentAuthorized(userAddress);
      
      if (!isAuthorized) {
        return {
          blobId,
          error: 'Access denied: Your address is not authorized to decrypt documents'
        };
      }
      
      console.log('✅ Access authorized, retrieving blob...');
      onProgress?.('Retrieving blob from Walrus...');

      // For now, since we're storing without encryption, just retrieve the blob
      const blob = await this.downloadEncryptedFile(blobId, onProgress);
      
      if (!blob) {
        return {
          blobId,
          error: 'Failed to download blob from Walrus'
        };
      }

      // Create a URL for the blob
      const imageUrl = URL.createObjectURL(new Blob([blob], { type: 'image/jpeg' }));
      
      onProgress?.('Blob retrieved successfully!');
      
      return {
        blobId,
        decryptedImageUrl: imageUrl
      };

    } catch (error) {
      console.error('❌ Blob retrieval failed:', error);
      return {
        blobId,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }

  /**
   * Downloads and retrieves documents (for future encrypted content)
   */
  async downloadAndDecryptDocuments(
    documents: DocumentMetadata[],
    userAddress: string,
    onProgress?: (progress: string) => void
  ): Promise<DecryptionResult> {
    try {
      console.log('🔓 Starting document decryption process...');
      console.log('📄 Documents to decrypt:', documents.length);

      if (!documents.length) {
        return {
          success: false,
          error: 'No documents provided for decryption'
        };
      }

      // Check if user is authorized as government
      const isAuthorized = await this.isGovernmentAuthorized(userAddress);
      if (!isAuthorized) {
        return {
          success: false,
          error: 'Access denied: Your address is not authorized for government document access'
        };
      }

      const decryptedFileUrls: string[] = [];
      const moveCallConstructor = this.createMoveCallConstructor(GOVERNMENT_WHITELIST_ID);

      // Process each document
      for (let i = 0; i < documents.length; i++) {
        const doc = documents[i];
        onProgress?.(`Decrypting document ${i + 1}/${documents.length}: ${doc.file_name || 'unknown'}...`);

        try {
          // Step 1: Download encrypted file from Walrus
          const encryptedData = await this.downloadEncryptedFile(doc.blob_id, onProgress);
          
          if (!encryptedData) {
            console.error(`Failed to download blob ${doc.blob_id}`);
            continue;
          }

          // For now, treat as plain data since we're not encrypting yet
          const mimeType = this.getMimeType(doc.file_name || 'image.jpg');
          const blob = new Blob([encryptedData], { type: mimeType });
          const url = URL.createObjectURL(blob);
          decryptedFileUrls.push(url);

          console.log(`✅ Retrieved ${doc.file_name || 'unknown'}`);

        } catch (error) {
          console.error(`Failed to process ${doc.file_name || 'unknown'}:`, error);
          // Continue with other documents even if one fails
        }
      }

      if (decryptedFileUrls.length === 0) {
        return {
          success: false,
          error: 'Failed to retrieve any documents from Walrus.'
        };
      }

      onProgress?.(`Successfully retrieved ${decryptedFileUrls.length} of ${documents.length} documents.`);

      return {
        success: true,
        decryptedFileUrls
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
   * Downloads a single file from Walrus with aggregator failover
   */
  private async downloadEncryptedFile(
    blobId: string,
    onProgress?: (progress: string) => void
  ): Promise<ArrayBuffer | null> {
    const reliableAggregators = [
      'https://aggregator.walrus-testnet.walrus.space',
      'https://wal-aggregator-testnet.staketab.org',
      'https://aggregator.walrus.banansen.dev',
      'https://suiftly-testnet-agg.mhax.io',
      'https://sui-walrus-tn-aggregator.bwarelabs.com'
    ];

    for (const aggregatorBase of reliableAggregators) {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 10000);
        
        const aggregatorUrl = `${aggregatorBase}/v1/blobs/${blobId}`;
        console.log(`Attempting download from ${aggregatorBase}`);
        onProgress?.(`Trying ${aggregatorBase}...`);
        
        const response = await fetch(aggregatorUrl, { 
          signal: controller.signal,
          mode: 'cors'
        });
        
        clearTimeout(timeout);
        
        if (response.ok) {
          console.log(`✅ Successfully downloaded from ${aggregatorBase}`);
          onProgress?.(`Downloaded from ${aggregatorBase}`);
          return await response.arrayBuffer();
        }
      } catch (err) {
        console.log(`Failed from ${aggregatorBase}:`, err);
        continue;
      }
    }

    console.error(`All download attempts failed for blob ${blobId}`);
    return null;
  }

  /**
   * Helper to determine mime type from filename
   */
  private getMimeType(filename: string): string {
    const ext = filename.split('.').pop()?.toLowerCase();
    const mimeTypes: { [key: string]: string } = {
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'png': 'image/png',
      'gif': 'image/gif',
      'pdf': 'application/pdf',
      'doc': 'application/msword',
      'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    };
    return mimeTypes[ext || ''] || 'application/octet-stream';
  }

  /**
   * Cleanup function to revoke blob URLs
   */
  static cleanupBlobUrls(urls: string[]): void {
    urls.forEach(url => URL.revokeObjectURL(url));
  }

  /**
   * Helper method to get Walrus blob URL
   */
  static getBlobUrl(blobId: string): string {
    return `https://sui-walrus-tn-aggregator.bwarelabs.com/v1/blobs/${blobId}`;
  }

  /**
   * Helper method to get Sui explorer URL
   */
  static getSuiExplorerUrl(objectId: string, type: 'tx' | 'object' = 'object'): string {
    const baseUrl = type === 'tx' 
      ? 'https://suiscan.xyz/testnet/tx' 
      : 'https://suiscan.xyz/testnet/object';
    return `${baseUrl}/${objectId}`;
  }
}

export const documentDecryptionService = new DocumentDecryptionService();