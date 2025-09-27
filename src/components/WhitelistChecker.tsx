"use client";

import React, { useEffect, useState } from 'react';
import { useCurrentAccount, useSuiClient } from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';
import { MULTI_ADMIN_WHITELIST_CONFIG } from '../lib/contractConfig';

const WhitelistChecker: React.FC = () => {
  const currentAccount = useCurrentAccount();
  const suiClient = useSuiClient();
  const [isWhitelisted, setIsWhitelisted] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkWhitelistStatus = async () => {
    if (!currentAccount || !suiClient) return;

    setLoading(true);
    setError(null);

    try {
      // Call the contract's is_whitelisted function
      const tx = new Transaction();
      tx.moveCall({
        target: `${MULTI_ADMIN_WHITELIST_CONFIG.packageId}::simple_whitelist::is_whitelisted`,
        arguments: [
          tx.object(MULTI_ADMIN_WHITELIST_CONFIG.whitelistObjectId),
          tx.pure.address(currentAccount.address),
        ],
      });

      const result = await suiClient.devInspectTransactionBlock({
        transactionBlock: tx,
        sender: currentAccount.address,
      });

      if (result.results && result.results[0] && result.results[0].returnValues) {
        const returnValue = result.results[0].returnValues[0];
        // returnValue is [number[], string] where first element is the actual value
        const isWhitelistedResult = returnValue[0][0] === 1; // Move boolean true = 1, false = 0
        setIsWhitelisted(isWhitelistedResult);
        console.log('Whitelist status:', isWhitelistedResult);
      } else {
        throw new Error('Failed to get whitelist status');
      }
    } catch (err) {
      console.error('Error checking whitelist status:', err);
      setError(err instanceof Error ? err.message : 'Failed to check whitelist status');
      setIsWhitelisted(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkWhitelistStatus();
  }, [currentAccount]);

  if (!currentAccount) {
    return <div className="p-4 text-gray-500">Connect wallet to check whitelist status</div>;
  }

  return (
    <div className="p-4 border border-gray-200 rounded-lg">
      <h3 className="font-bold mb-2">Whitelist Status Checker</h3>
      <p className="text-sm text-gray-600 mb-2">Address: {currentAccount.address}</p>
      
      {loading && <p className="text-blue-600">Checking whitelist status...</p>}
      
      {error && (
        <div className="p-2 bg-red-100 border border-red-300 rounded text-red-700 text-sm">
          Error: {error}
        </div>
      )}
      
      {isWhitelisted !== null && !loading && (
        <div className={`p-2 rounded text-sm ${
          isWhitelisted 
            ? 'bg-green-100 border border-green-300 text-green-700' 
            : 'bg-red-100 border border-red-300 text-red-700'
        }`}>
          {isWhitelisted ? '✅ You are WHITELISTED' : '❌ You are NOT whitelisted'}
        </div>
      )}

      <button 
        onClick={checkWhitelistStatus}
        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        disabled={loading}
      >
        {loading ? 'Checking...' : 'Recheck Status'}
      </button>
    </div>
  );
};

export default WhitelistChecker;