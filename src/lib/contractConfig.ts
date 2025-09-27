// Simple Whitelist Contract Configuration  
// Generated from deployment transaction: 8dxDFH1HUpdQG9QCj52FCJ4FiTNeEBZhdLERQXjctKvg

export const MULTI_ADMIN_WHITELIST_CONFIG = {
  packageId: '0x75ca17f12a335945207502f250f396e96b17609b641696af4af097b26ea85df7',
  whitelistObjectId: '0x1549b2b36e25f8b157b70571586bd3f7013111e8495adb3e0f4a70a0255d4e48',
  adminCapIds: {
    // Single admin cap for this deployment
    admin: '0x8c679ac66b27d009e187b50862c48bfd3e36a03137f72a729e6b1817dd6cfade'
  },
  adminAddresses: {
    admin: '0xbc5f1715965ee6b959d912c8de19ab012042407813614267141eb7197914711b'
  },
  network: 'testnet',
  transactionHash: '8dxDFH1HUpdQG9QCj52FCJ4FiTNeEBZhdLERQXjctKvg'
};

// For backward compatibility with existing components
export const CONTRACT_CONFIG = MULTI_ADMIN_WHITELIST_CONFIG;