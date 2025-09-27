/**
 * Whitelist Management Utility
 * Functions to interact with the simple_whitelist contract
 */

import { SuiClient } from '@mysten/sui/client';
import { Transaction } from '@mysten/sui/transactions';
import { MULTI_ADMIN_WHITELIST_CONFIG } from './contractConfig';

const SUI_CLIENT = new SuiClient({ url: 'https://fullnode.testnet.sui.io:443' });

export interface AddToWhitelistResult {
  success: boolean;
  txDigest?: string;
  error?: string;
}

export class WhitelistManager {
  
  /**
   * Add a user to the whitelist (admin function)
   */
  async addToWhitelist(
    adminAddress: string,
    userToAdd: string,
    signAndExecute: (tx: Transaction) => Promise<any>
  ): Promise<AddToWhitelistResult> {
    try {
      console.log('📝 Adding user to whitelist:', userToAdd);
      console.log('👤 Admin address:', adminAddress);
      
      const tx = new Transaction();
      
      // Call the add_user function
      tx.moveCall({
        target: `${MULTI_ADMIN_WHITELIST_CONFIG.packageId}::simple_whitelist::add_user`,
        arguments: [
          tx.object(MULTI_ADMIN_WHITELIST_CONFIG.whitelistObjectId),
          tx.pure.address(userToAdd),
          tx.object(MULTI_ADMIN_WHITELIST_CONFIG.adminCapIds.deployer),
        ],
      });

      console.log('🚀 Executing add_user transaction...');
      const result = await signAndExecute(tx);
      
      console.log('✅ User added to whitelist successfully!');
      console.log('📋 Transaction digest:', result.digest);
      
      return {
        success: true,
        txDigest: result.digest
      };
      
    } catch (error) {
      console.error('❌ Failed to add user to whitelist:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }

  /**
   * Check if a user is whitelisted
   */
  async isUserWhitelisted(userAddress: string): Promise<boolean> {
    try {
      console.log('🔍 Checking whitelist status for:', userAddress);
      
      const result = await SUI_CLIENT.getObject({
        id: MULTI_ADMIN_WHITELIST_CONFIG.whitelistObjectId,
        options: {
          showContent: true,
        },
      });

      if (result.data?.content && 'fields' in result.data.content) {
        const fields = result.data.content.fields as any;
        const whitelisted = fields.whitelisted || [];
        
        const isListed = whitelisted.includes(userAddress);
        console.log(isListed ? '✅ Address is whitelisted' : '❌ Address not whitelisted');
        
        return isListed;
      }
      
      console.log('❌ Could not read whitelist data');
      return false;
    } catch (error) {
      console.error('❌ Whitelist check failed:', error);
      return false;
    }
  }

  /**
   * Get all whitelisted users
   */
  async getAllWhitelistedUsers(): Promise<string[]> {
    try {
      console.log('📋 Fetching all whitelisted users...');
      
      const result = await SUI_CLIENT.getObject({
        id: MULTI_ADMIN_WHITELIST_CONFIG.whitelistObjectId,
        options: {
          showContent: true,
        },
      });

      if (result.data?.content && 'fields' in result.data.content) {
        const fields = result.data.content.fields as any;
        const whitelisted = fields.whitelisted || [];
        
        console.log('📋 Whitelisted users:', whitelisted);
        return whitelisted;
      }
      
      console.log('❌ Could not read whitelist data');
      return [];
    } catch (error) {
      console.error('❌ Failed to fetch whitelisted users:', error);
      return [];
    }
  }
}

export const whitelistManager = new WhitelistManager();