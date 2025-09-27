'use client';

import React from 'react';
import { useSuiNS, formatAddressWithName } from '../hooks/useSuiNS';
import { Loader2, User, Copy } from 'lucide-react';

interface AddressDisplayProps {
  address: string;
  showFullAddress?: boolean;
  showIcon?: boolean;
  className?: string;
  copyable?: boolean;
  showSuiNSBadge?: boolean;
}

export function AddressDisplay({ 
  address, 
  showFullAddress = false, 
  showIcon = true,
  className = "",
  copyable = true,
  showSuiNSBadge = true
}: AddressDisplayProps) {
  const { name, isLoading } = useSuiNS(address);

  const handleCopy = async () => {
    if (copyable) {
      try {
        await navigator.clipboard.writeText(address);
        // You could add a toast notification here
        console.log('Address copied to clipboard');
      } catch (err) {
        console.error('Failed to copy address:', err);
      }
    }
  };

  const displayText = formatAddressWithName(address, name, showFullAddress);

  return (
    <div 
      className={`inline-flex items-center gap-2 ${copyable ? 'cursor-pointer hover:bg-opacity-80 rounded px-2 py-1 transition-colors' : ''} ${className}`}
      onClick={handleCopy}
      title={name ? `${name} (${address}) - Click to copy` : `${address} - Click to copy`}
    >
      {showIcon && <User className="w-4 h-4 text-gray-500" />}
      
      <div className="flex items-center gap-2">
        {isLoading ? (
          <div className="flex items-center gap-1">
            <Loader2 className="w-3 h-3 animate-spin" />
            <span className="text-xs text-gray-500">Loading name...</span>
          </div>
        ) : (
          <>
            <span className={name ? "font-medium text-purple-700" : "font-mono text-sm"}>
              {name || `${address.slice(0, 6)}...${address.slice(-4)}`}
            </span>
            
            {name && showSuiNSBadge && (
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-700">
                .sui
              </span>
            )}
            
            {name && !showFullAddress && (
              <span className="text-xs text-gray-500 font-mono">
                ({address.slice(0, 6)}...{address.slice(-4)})
              </span>
            )}
          </>
        )}
        
        {copyable && !isLoading && (
          <Copy className="w-3 h-3 text-gray-400 hover:text-gray-600" />
        )}
      </div>
    </div>
  );
}