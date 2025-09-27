'use client';

import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import { AddressDisplay } from './AddressDisplay';

interface WhitelistStatusProps {
  address: string;
  isWhitelisted: boolean;
}

export function WhitelistStatus({ address, isWhitelisted }: WhitelistStatusProps) {
  return (
    <div className="flex items-start gap-3">
      {isWhitelisted ? (
        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
      ) : (
        <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
      )}
      <div className="flex-1">
        <p className={`font-medium ${isWhitelisted ? 'text-green-800' : 'text-red-800'}`}>
          Address is {isWhitelisted ? 'WHITELISTED' : 'NOT WHITELISTED'}
        </p>
        <div className="mt-1">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Address:</span>
            <AddressDisplay 
              address={address}
              className={isWhitelisted ? 'text-green-800' : 'text-red-800'}
              showIcon={false}
            />
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          {isWhitelisted 
            ? 'This address can decrypt Seal-encrypted blobs' 
            : 'This address cannot decrypt Seal-encrypted blobs'
          }
        </p>
      </div>
    </div>
  );
}