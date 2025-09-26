'use client';

import React, { useState, useCallback } from 'react';
import { useCurrentAccount, ConnectButton } from '@mysten/dapp-kit';
import { 
  UserPlus, 
  UserMinus, 
  Search, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  Shield,
  Key,
  Trash2,
  WalletIcon
} from 'lucide-react';

// Contract configuration from deployment
const CONTRACT_CONFIG = {
  packageId: '0x75ca17f12a335945207502f250f396e96b17609b641696af4af097b26ea85df7',
  whitelistObjectId: '0x1549b2b36e25f8b157b70571586bd3f7013111e8495adb3e0f4a70a0255d4e48',
  adminCapId: '0x8c679ac66b27d009e187b50862c48bfd3e36a03137f72a729e6b1817dd6cfade'
};

export default function WhitelistManager() {
  const currentAccount = useCurrentAccount();
  
  const [addressToAdd, setAddressToAdd] = useState('');
  const [addressToRemove, setAddressToRemove] = useState('');
  const [addressToCheck, setAddressToCheck] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string>('');
  const [error, setError] = useState<string>('');

  // Clear messages
  const clearMessages = useCallback(() => {
    setResult('');
    setError('');
  }, []);

  // Call backend whitelist API
  const callWhitelistAPI = async (action: 'add' | 'remove', address: string) => {
    const response = await fetch('http://localhost:3001/whitelist', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        encryption_id: CONTRACT_CONFIG.whitelistObjectId,
        wallet_address: address,
        action: action
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  };

  // Add address to whitelist
  const handleAddAddress = useCallback(async () => {
    if (!addressToAdd.trim()) {
      setError('Please enter an address to add');
      return;
    }
    if (!currentAccount) {
      setError('Please connect your wallet first');
      return;
    }

    setIsLoading(true);
    clearMessages();

    try {
      console.log('Adding address to whitelist:', addressToAdd);
      
      const response = await callWhitelistAPI('add', addressToAdd.trim());
      
      if (response.success) {
        setResult(`✅ Successfully added ${addressToAdd} to whitelist!`);
        setAddressToAdd('');
      } else {
        setError(`Failed to add address: ${response.error}`);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(`Add operation failed: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  }, [addressToAdd, currentAccount, clearMessages]);

  // Remove address from whitelist
  const handleRemoveAddress = useCallback(async () => {
    if (!addressToRemove.trim()) {
      setError('Please enter an address to remove');
      return;
    }
    if (!currentAccount) {
      setError('Please connect your wallet first');
      return;
    }

    setIsLoading(true);
    clearMessages();

    try {
      console.log('Removing address from whitelist:', addressToRemove);
      
      const response = await callWhitelistAPI('remove', addressToRemove.trim());
      
      if (response.success) {
        setResult(`✅ Successfully removed ${addressToRemove} from whitelist!`);
        setAddressToRemove('');
      } else {
        setError(`Failed to remove address: ${response.error}`);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(`Remove operation failed: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  }, [addressToRemove, currentAccount, clearMessages]);

  // Check whitelist status
  const handleCheckStatus = useCallback(async () => {
    if (!addressToCheck.trim()) {
      setError('Please enter an address to check');
      return;
    }

    setIsLoading(true);
    clearMessages();

    try {
      console.log('Checking whitelist status for:', addressToCheck);
      
      const response = await fetch(`http://localhost:3001/whitelist/${CONTRACT_CONFIG.whitelistObjectId}`);
      const data = await response.json();
      
      if (data.success) {
        const isWhitelisted = data.data.whitelist.includes(addressToCheck.trim());
        setResult(`📋 Address ${addressToCheck} is ${isWhitelisted ? 'WHITELISTED' : 'NOT WHITELISTED'}`);
      } else {
        setError(`Failed to check status: ${data.error}`);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(`Status check failed: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  }, [addressToCheck, clearMessages]);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-3">
          <Shield className="w-7 h-7 text-purple-600" />
          Whitelist Management
        </h2>
        <p className="text-gray-600">
          Manage addresses that can decrypt Seal-encrypted blobs
        </p>
      </div>

      {/* Contract Info */}
      <div className="mb-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
        <h3 className="font-semibold text-purple-900 mb-2">Contract Information</h3>
        <div className="text-sm text-purple-700 space-y-1">
          <div><strong>Package ID:</strong> <code className="bg-purple-100 px-1 rounded">{CONTRACT_CONFIG.packageId}</code></div>
          <div><strong>Whitelist Object:</strong> <code className="bg-purple-100 px-1 rounded">{CONTRACT_CONFIG.whitelistObjectId}</code></div>
          <div><strong>Admin Cap:</strong> <code className="bg-purple-100 px-1 rounded">{CONTRACT_CONFIG.adminCapId}</code></div>
        </div>
      </div>

      {/* Wallet Status */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-center gap-3">
          <Key className="w-5 h-5 text-blue-600" />
          <div>
            <h3 className="font-semibold text-blue-900">Admin Status</h3>
            {currentAccount ? (
              <p className="text-sm text-blue-700">
                Connected as: {currentAccount.address.slice(0, 10)}...{currentAccount.address.slice(-8)}
              </p>
            ) : (
              <p className="text-sm text-blue-700">Please connect your wallet to manage whitelist</p>
            )}
          </div>
        </div>
      </div>

      {/* Error/Success Messages */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <p className="text-red-800">{error}</p>
        </div>
      )}
      {result && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
          <p className="text-green-800">{result}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Add Address */}
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-green-600" />
            Add Address
          </h3>
          <div className="space-y-4">
            <input
              type="text"
              value={addressToAdd}
              onChange={(e) => setAddressToAdd(e.target.value)}
              placeholder="0x... (address to whitelist)"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
              disabled={isLoading}
            />
            <button
              onClick={handleAddAddress}
              disabled={isLoading || !currentAccount || !addressToAdd.trim()}
              className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm font-medium"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <UserPlus className="w-4 h-4" />
              )}
              Add to Whitelist
            </button>
          </div>
        </div>

        {/* Remove Address */}
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <UserMinus className="w-5 h-5 text-red-600" />
            Remove Address
          </h3>
          <div className="space-y-4">
            <input
              type="text"
              value={addressToRemove}
              onChange={(e) => setAddressToRemove(e.target.value)}
              placeholder="0x... (address to remove)"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
              disabled={isLoading}
            />
            <button
              onClick={handleRemoveAddress}
              disabled={isLoading || !currentAccount || !addressToRemove.trim()}
              className="w-full bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm font-medium"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
              Remove from Whitelist
            </button>
          </div>
        </div>

        {/* Check Status */}
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Search className="w-5 h-5 text-blue-600" />
            Check Status
          </h3>
          <div className="space-y-4">
            <input
              type="text"
              value={addressToCheck}
              onChange={(e) => setAddressToCheck(e.target.value)}
              placeholder="0x... (address to check)"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              disabled={isLoading}
            />
            <button
              onClick={handleCheckStatus}
              disabled={isLoading || !addressToCheck.trim()}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm font-medium"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
              Check Status
            </button>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h3 className="font-semibold text-blue-900 mb-2">Instructions</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• <strong>Add Address:</strong> Whitelist an address to allow decryption of Seal-encrypted blobs</li>
          <li>• <strong>Remove Address:</strong> Remove an address from the whitelist (admin only)</li>
          <li>• <strong>Check Status:</strong> Verify if an address is currently whitelisted</li>
          <li>• Only the admin (contract deployer) can add/remove addresses from the whitelist</li>
          <li>• Whitelisted addresses can decrypt blobs using the Seal protocol</li>
        </ul>
      </div>
    </div>
  );
}