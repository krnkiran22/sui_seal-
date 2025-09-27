import React, { useEffect } from 'react';
import { useCurrentAccount } from '@mysten/dapp-kit';

const WalletAddressHelper: React.FC = () => {
  const currentAccount = useCurrentAccount();

  useEffect(() => {
    if (currentAccount) {
      console.log('=== YOUR WALLET ADDRESS ===');
      console.log(currentAccount.address);
      console.log('=== COPY THIS ADDRESS ===');
      
      // Also display in alert for easy copying
      alert(`Your wallet address is: ${currentAccount.address}\n\nCopy this address to update the contract configuration.`);
    }
  }, [currentAccount]);

  if (!currentAccount) {
    return (
      <div className="p-4 bg-yellow-100 border border-yellow-400 rounded">
        <p>Connect your wallet to see your address</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-green-100 border border-green-400 rounded">
      <h3 className="font-bold mb-2">Your Wallet Address:</h3>
      <p className="font-mono text-sm break-all">{currentAccount.address}</p>
      <button 
        onClick={() => navigator.clipboard.writeText(currentAccount.address)}
        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Copy Address
      </button>
    </div>
  );
};

export default WalletAddressHelper;