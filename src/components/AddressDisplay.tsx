"use client";

import React from 'react';
import { useSuiClient } from '@mysten/dapp-kit';
import { useSuiNS, useMockSuiNS, formatAddressOrName } from '../hooks/useSuiNS';

interface AddressDisplayProps {
  address: string | null;
  className?: string;
  showFull?: boolean;
  enableSuiNS?: boolean;
}

const AddressDisplay: React.FC<AddressDisplayProps> = ({ 
  address, 
  className = '', 
  showFull = false,
  enableSuiNS = true 
}) => {
  const suiClient = useSuiClient();
  
  // Use mock SuiNS for now - replace with real implementation when available
  const { name: suinsName, loading } = enableSuiNS 
    ? useMockSuiNS(address)
    : { name: null, loading: false };

  if (!address) {
    return <span className={className}>Not connected</span>;
  }

  if (loading) {
    return (
      <span className={`${className} flex items-center space-x-2`}>
        <div className="w-3 h-3 border border-gray-300 border-t-transparent rounded-full animate-spin"></div>
        <span>Loading...</span>
      </span>
    );
  }

  const displayText = suinsName 
    ? suinsName 
    : showFull 
      ? address 
      : `${address.slice(0, 6)}...${address.slice(-4)}`;

  return (
    <span className={className} title={address}>
      {displayText}
    </span>
  );
};

export default AddressDisplay;