'use client';

import React from 'react';
import { CheckCircle, ExternalLink } from 'lucide-react';
import { AddressDisplay } from './AddressDisplay';

interface TransactionResultProps {
  type: 'add' | 'remove';
  address: string;
  txHash: string;
  explorerUrl?: string;
}

export function TransactionResult({ type, address, txHash, explorerUrl }: TransactionResultProps) {
  const action = type === 'add' ? 'added to' : 'removed from';
  const baseUrl = explorerUrl || 'https://suiscan.xyz/testnet/tx';
  
  return (
    <div className="flex items-start gap-3">
      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="text-green-800">
          <span className="font-medium">Successfully {action} whitelist!</span>
        </p>
        <div className="mt-1 space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-sm text-green-700">Address:</span>
            <AddressDisplay 
              address={address}
              className="text-green-800"
              showIcon={false}
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-green-700">Transaction:</span>
            <a 
              href={`${baseUrl}/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm text-green-600 hover:text-green-800 underline"
            >
              <code className="text-xs">{txHash.slice(0, 8)}...{txHash.slice(-8)}</code>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}