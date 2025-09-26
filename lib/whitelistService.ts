/**
 * Whitelist Service for managing Seal decryption access
 * Handles adding/removing addresses from the whitelist contract
 */

import { SuiClient } from '@mysten/sui/client';
import { Transaction } from '@mysten/sui/transactions';

// Contract configuration
const SUI_CLIENT = new SuiClient({ url: 'https://fullnode.testnet.sui.io:443' });
const PACKAGE_ID = '0x75ca17f12a335945207502f250f396e96b17609b641696af4af097b26ea85df7';
const WHITELIST_OBJECT_ID = '0x1549b2b36e25f8b157b70571586bd3f7013111e8495adb3e0f4a70a0255d4e48';
const ADMIN_CAP_ID = '0x8c679ac66b27d009e187b50862c48bfd3e36a03137f72a729e6b1817dd6cfade';

export interface WhitelistResult {
  success: boolean;
  txDigest?: string;
  error?: string;
}

export interface WhitelistStatus {
  success: boolean;
  isWhitelisted?: boolean;
  error?: string;
}

export class WhitelistService {
  private suiClient: SuiClient;

  constructor() {
    this.suiClient = SUI_CLIENT;
  }

  /**
   * Add an address to the whitelist (admin only)
   */
  async addToWhitelist(
    addressToAdd: string,
    adminAddress: string,
    signAndExecute: (transaction: { transaction: Transaction }) => Promise<any>
  ): Promise<WhitelistResult> {
    try {
      console.log('➕ Adding address to whitelist:', {
        addressToAdd,
        adminAddress,
        whitelistId: WHITELIST_OBJECT_ID,
        adminCapId: ADMIN_CAP_ID
      });

      const tx = new Transaction();
      
      tx.moveCall({
        target: `${PACKAGE_ID}::simple_whitelist::add_to_whitelist`,
        arguments: [
          tx.object(WHITELIST_OBJECT_ID),
          tx.object(ADMIN_CAP_ID),
          tx.pure.address(addressToAdd)
        ],
      });

      console.log('📝 Executing add to whitelist transaction...');
      const result = await signAndExecute({ transaction: tx });
      
      console.log('✅ Address added to whitelist successfully:', result);
      return {
        success: true,
        txDigest: result.digest
      };

    } catch (error) {
      console.error('❌ Failed to add address to whitelist:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }

  /**
   * Remove an address from the whitelist (admin only)
   */
  async removeFromWhitelist(
    addressToRemove: string,
    adminAddress: string,
    signAndExecute: (transaction: { transaction: Transaction }) => Promise<any>
  ): Promise<WhitelistResult> {
    try {
      console.log('➖ Removing address from whitelist:', {
        addressToRemove,
        adminAddress,
        whitelistId: WHITELIST_OBJECT_ID,
        adminCapId: ADMIN_CAP_ID
      });

      const tx = new Transaction();
      
      tx.moveCall({
        target: `${PACKAGE_ID}::simple_whitelist::remove_from_whitelist`,
        arguments: [
          tx.object(WHITELIST_OBJECT_ID),
          tx.object(ADMIN_CAP_ID),
          tx.pure.address(addressToRemove)
        ],
      });

      console.log('📝 Executing remove from whitelist transaction...');
      const result = await signAndExecute({ transaction: tx });
      
      console.log('✅ Address removed from whitelist successfully:', result);
      return {
        success: true,
        txDigest: result.digest
      };

    } catch (error) {
      console.error('❌ Failed to remove address from whitelist:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }

  /**
   * Check if an address is whitelisted
   */
  async isWhitelisted(address: string): Promise<WhitelistStatus> {
    try {
      console.log('🔍 Checking whitelist status for address:', address);

      const tx = new Transaction();
      tx.moveCall({
        target: `${PACKAGE_ID}::simple_whitelist::is_whitelisted`,
        arguments: [
          tx.object(WHITELIST_OBJECT_ID),
          tx.pure.address(address)
        ],
      });

      const result = await this.suiClient.devInspectTransactionBlock({
        transactionBlock: tx,
        sender: address,
      });

      if (result.results && result.results[0]?.returnValues) {
        const returnValue = result.results[0].returnValues[0];
        const isWhitelisted = returnValue && returnValue[0] && returnValue[0][0] === 1; // boolean is returned as nested array
        
        console.log('📋 Whitelist status:', { address, isWhitelisted, returnValue });
        return {
          success: true,
          isWhitelisted: !!isWhitelisted
        };
      }

      return {
        success: false,
        error: 'Unable to determine whitelist status'
      };

    } catch (error) {
      console.error('❌ Failed to check whitelist status:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }

  /**
   * Get contract configuration
   */
  getContractConfig() {
    return {
      packageId: PACKAGE_ID,
      whitelistObjectId: WHITELIST_OBJECT_ID,
      adminCapId: ADMIN_CAP_ID
    };
  }

  /**
   * Create a Seal approval transaction for decryption
   */
  createSealApprovalTransaction(encryptionId: string): Transaction {
    const tx = new Transaction();
    
    tx.moveCall({
      target: `${PACKAGE_ID}::simple_whitelist::seal_approve`,
      arguments: [
        tx.pure.vector('u8', Array.from(Buffer.from(encryptionId.replace('0x', ''), 'hex'))),
        tx.object(WHITELIST_OBJECT_ID)
      ],
    });

    return tx;
  }
}

export const whitelistService = new WhitelistService();