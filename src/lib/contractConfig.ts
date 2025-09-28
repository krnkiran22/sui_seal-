// Simple Whitelist Contract Configuration  
// Generated from deployment transaction: BSW67ehViuxS4svULQqesENaBKk9o6NrtE3kEqR2krWa
// ✅ UPDATED: Your address is now pre-whitelisted and has admin capabilities

export const MULTI_ADMIN_WHITELIST_CONFIG = {
  packageId: '0xf5eb37ecb6228973a40d068c2b93e557bdde968931c654a339f8a02a53c07ff9',
  whitelistObjectId: '0x54e37bd42ca0dff71fea7b25f8db7d8f33b0b50a20b363095c448968a929b0e9',
  adminCapIds: {
    // Deployer admin cap (for deployer address)
    deployer: '0x866e667ecd04a3eed33e9de2bd1d845018dc384db0f83902c2710004b980dfd3',
    // Your admin cap (for your specific address)
    configured: '0xfaed774b49dc3865d45ac72b36a764c5d229fa166258e370a0fb3dca71034d6f'
  },
  adminAddresses: {
    deployer: '0xbc5f1715965ee6b959d912c8de19ab012042407813614267141eb7197914711b', // Deployer address
    configured: '0x0129fc626e3656cfa624cb324826dd5e60782d6f309d11a4450ebde0d974e0a5' // Your wallet address - PRE-WHITELISTED
  },
  network: 'testnet',
  transactionHash: 'BSW67ehViuxS4svULQqesENaBKk9o6NrtE3kEqR2krWa'
};

// Document NFT Contract Configuration
// Generated from deployment transaction: 9HqiH7cnpHRcwULCyfHir8jPstTM2BPj8EHEoaiZJaks
export const DOCUMENT_NFT_CONFIG = {
  packageId: '0x8e7ff481c57b84777c58f9003a7aabb90205f5329f547e8bd564adc52f91a387',
  displayObjectId: '0xe5ce34fe0b1b407edd68444e86c4b12a93a5351deb1cab4c19306b846d04f0e5',
  publisherObjectId: '0xe1521b79be308978cb400cf69c635498f60a6801315a3e001c56afbad7cc3bbc',
  moduleName: 'document_nft',
  functionName: 'mint_and_transfer_nft',
  network: 'testnet',
  transactionHash: '9HqiH7cnpHRcwULCyfHir8jPstTM2BPj8EHEoaiZJaks',
  clockObjectId: '0x6', // Sui Clock object ID
};

// For backward compatibility with existing components
export const CONTRACT_CONFIG = MULTI_ADMIN_WHITELIST_CONFIG;