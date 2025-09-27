"use client";

import React from 'react';
import { useCurrentAccount, ConnectButton, useDisconnectWallet } from '@mysten/dapp-kit';
import { motion } from 'framer-motion';
import { LogOut, User, AlertTriangle } from 'lucide-react';
import AddressDisplay from './AddressDisplay';

interface WalletConnectionProps {
  className?: string;
  showFullAddress?: boolean;
  showDisconnect?: boolean;
}

const WalletConnection: React.FC<WalletConnectionProps> = ({ 
  className = '',
  showFullAddress = false,
  showDisconnect = true
}) => {
  const currentAccount = useCurrentAccount();
  const { mutate: disconnect } = useDisconnectWallet();

  // Add error handling for wallet connection issues
  if (typeof window === 'undefined') {
    // Server-side rendering - show loading state
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <div className="w-4 h-4 border-2 border-gray-300 border-t-transparent rounded-full animate-spin"></div>
        <span className="text-sm text-gray-500">Loading wallet...</span>
      </div>
    );
  }

  if (!currentAccount) {
    return (
      <ConnectButton 
        connectText="Connect Wallet"
        className={`flex items-center gap-2 bg-[#4da2ff] hover:bg-[#3d91ef] text-white px-6 py-3 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-[#4da2ff]/25 font-clash font-medium ${className}`}
      />
    );
  }

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {/* Connected State with SuiNS */}
      <div className="flex items-center space-x-3 bg-green-50 border border-green-200 px-4 py-2.5 rounded-2xl">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        <User className="w-4 h-4 text-green-600" />
        <AddressDisplay 
          address={currentAccount.address}
          className="font-clash font-medium text-green-800 text-sm"
          showFull={showFullAddress}
          enableSuiNS={true}
        />
      </div>

      {/* Disconnect Button */}
      {showDisconnect && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => disconnect()}
          className="flex items-center justify-center w-10 h-10 bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 rounded-xl transition-all duration-300 border border-red-200 hover:border-red-300"
          title="Disconnect Wallet"
        >
          <LogOut className="w-4 h-4" />
        </motion.button>
      )}
    </div>
  );
};

export default WalletConnection;