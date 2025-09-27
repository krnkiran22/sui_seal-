'use client';

import React, { useState } from 'react';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { Settings, RefreshCw, Eye } from 'lucide-react';
import { setMockSuiNSName } from '../hooks/useSuiNS';
import { AddressDisplay } from './AddressDisplay';

export function SuiNSDemo() {
  const currentAccount = useCurrentAccount();
  const [customAddress, setCustomAddress] = useState('');
  const [customName, setCustomName] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSetMockName = () => {
    if (customAddress && customName) {
      setMockSuiNSName(customAddress, customName);
      setCustomAddress('');
      setCustomName('');
      // Force refresh of components
      setRefreshKey(prev => prev + 1);
    }
  };

  const presetAddresses = [
    { address: '0xbc5f1715965ee6b959d912c8de19ab012042407813614267141eb7197914711b', name: 'kiran.sui' },
    { address: '0x0129fc626e3656cfa624cb324826dd5e60782d6f309d11a4450ebde0d974e0a5', name: 'kiran.sui' },
    { address: '0x8c679ac66b27d009e187b50862c48bfd3e36a03137f72a729e6b1817dd6cfade', name: 'krndev.sui' },
    { address: '0x1549b2b36e25f8b157b70571586bd3f7013111e8495adb3e0f4a70a0255d4e48', name: 'krndev.sui' },
  ];

  return (
    <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg border border-purple-200 p-6 mb-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center">
          <Settings className="w-4 h-4 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">SuiNS Mock Demo</h3>
          <p className="text-sm text-gray-600">Testing SuiNS name resolution with mock data</p>
        </div>
      </div>

      {/* Current User Demo */}
      {currentAccount && (
        <div className="mb-6 p-4 bg-white rounded-lg border border-gray-200">
          <h4 className="font-medium text-gray-900 mb-2">Your Connected Wallet:</h4>
          <div key={refreshKey} className="flex items-center gap-3">
            <AddressDisplay address={currentAccount.address} />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Address: <code>{currentAccount.address}</code>
          </p>
        </div>
      )}

      {/* Preset Examples */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-900 mb-3">Example Addresses with Mock Names:</h4>
        <div className="space-y-2">
          {presetAddresses.map((preset, index) => (
            <div key={`${preset.address}-${refreshKey}`} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
              <AddressDisplay address={preset.address} />
              <span className="text-xs text-gray-500">→ {preset.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Custom Mock Setting */}
      <div className="border-t border-gray-200 pt-4">
        <h4 className="font-medium text-gray-900 mb-3">Set Custom Mock Name:</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input
            type="text"
            placeholder="0x... (wallet address)"
            value={customAddress}
            onChange={(e) => setCustomAddress(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
          />
          <input
            type="text"
            placeholder="name.sui"
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
          />
          <button
            onClick={handleSetMockName}
            disabled={!customAddress || !customName}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm font-medium"
          >
            <Settings className="w-4 h-4" />
            Set Mock Name
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-start gap-2">
          <Eye className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">How Mock SuiNS Works:</p>
            <ul className="space-y-1 text-xs">
              <li>• Addresses containing 'bc5f', '0129', or ending in '711b' → kiran.sui</li>
              <li>• Addresses containing '8c67', '1549', 'abc', or 'def' → krndev.sui</li>
              <li>• Other addresses alternate between names based on last character</li>
              <li>• Custom mappings override automatic patterns</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}