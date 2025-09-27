// Updated Contract Configuration with your current wallet address
// You need to replace 'YOUR_WALLET_ADDRESS_HERE' with your actual wallet address

export const MULTI_ADMIN_WHITELIST_CONFIG = {
  packageId: '0x75ca17f12a335945207502f250f396e96b17609b641696af4af097b26ea85df7',
  whitelistObjectId: '0x1549b2b36e25f8b157b70571586bd3f7013111e8495adb3e0f4a70a0255d4e48',
  adminCapIds: {
    // Deployer admin cap
    deployer: '0x8c679ac66b27d009e187b50862c48bfd3e36a03137f72a729e6b1817dd6cfade',
    // The configured admin will get their cap automatically
  },
  adminAddresses: {
    deployer: 'YOUR_WALLET_ADDRESS_HERE', // Replace with your actual wallet address
    configured: '0x0129fc626e3656cfa624cb324826dd5e60782d6f309d11a4450ebde0d974e0a5' // Pre-configured admin
  },
  network: 'testnet',
  transactionHash: '8dxDFH1HUpdQG9QCj52FCJ4FiTNeEBZhdLERQXjctKvg'
};

// For backward compatibility
export const CONTRACT_CONFIG = MULTI_ADMIN_WHITELIST_CONFIG;