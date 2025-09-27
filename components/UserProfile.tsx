'use client';

import React, { useState } from 'react';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { AddressDisplay } from './AddressDisplay';
import { SuiNSInfo } from './SuiNSInfo';
import { User, Wallet, Copy, Check, Crown } from 'lucide-react';
import { useSuiNS } from '../hooks/useSuiNS';

export function UserProfile() {
  const currentAccount = useCurrentAccount();
  const { name: suinsName, isLoading } = useSuiNS(currentAccount?.address || null);
  const [copied, setCopied] = useState(false);

  if (!currentAccount) {
    return null;
  }

  const copyAddress = async () => {
    await navigator.clipboard.writeText(currentAccount.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 8)}...${address.slice(-6)}`;
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className={`p-3 rounded-full ${suinsName ? 'bg-gradient-to-br from-blue-500 to-purple-600' : 'bg-gray-100'}`}>
            {suinsName ? (
              <Crown className="w-6 h-6 text-white" />
            ) : (
              <User className="w-6 h-6 text-gray-600" />
            )}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              Your Profile
              {suinsName && (
                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                  SuiNS
                </span>
              )}
            </h3>
            <p className="text-sm text-gray-600">
              {suinsName ? 'You have a SuiNS name!' : 'Connected wallet'}
            </p>
          </div>
        </div>
        
        <div className="space-y-3">
          {/* SuiNS Name Display */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Display Name
            </label>
            {isLoading ? (
              <div className="h-8 bg-gray-200 rounded animate-pulse w-48"></div>
            ) : suinsName ? (
              <div className="flex items-center gap-2 p-2 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg">
                <span className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  {suinsName}
                </span>
                <Crown className="w-4 h-4 text-yellow-500" />
              </div>
            ) : (
              <div className="p-2 bg-gray-50 border border-gray-200 rounded-lg">
                <span className="text-gray-500 italic">No SuiNS name</span>
              </div>
            )}
          </div>

          {/* Wallet Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Wallet Address
            </label>
            <div className="flex items-center gap-2 p-2 bg-gray-50 border border-gray-200 rounded-lg">
              <Wallet className="w-4 h-4 text-gray-500" />
              <code className="text-sm text-gray-800 flex-1 font-mono">
                {formatAddress(currentAccount.address)}
              </code>
              <button
                onClick={copyAddress}
                className="p-1 text-gray-500 hover:text-gray-700 transition-colors rounded"
                title="Copy full address"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-600" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1 font-mono">
              {currentAccount.address}
            </p>
          </div>
        </div>
      </div>

      {/* Show SuiNS info if user doesn't have a name */}
      {!isLoading && !suinsName && (
        <SuiNSInfo />
      )}
    </div>
  );
}