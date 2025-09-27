"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCurrentAccount, useSignAndExecuteTransaction, ConnectButton } from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';
import { Shield, UserPlus, CheckCircle, AlertCircle, Users, Hash, Key, Wallet } from 'lucide-react';
import { MULTI_ADMIN_WHITELIST_CONFIG } from '../../lib/contractConfig';
import AddressDisplay from '../../components/AddressDisplay';
import { useToast } from '../../components/Toast';

const AdminPage: React.FC = () => {
  const currentAccount = useCurrentAccount();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  
  const [userToAdd, setUserToAdd] = useState('');
  const [whitelistedUsers, setWhitelistedUsers] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const { showSuccess, showError } = useToast();

  // Check if current user is an admin
  const isAdmin = currentAccount && (
    currentAccount.address === MULTI_ADMIN_WHITELIST_CONFIG.adminAddresses.deployer ||
    currentAccount.address === MULTI_ADMIN_WHITELIST_CONFIG.adminAddresses.configured
  );

  useEffect(() => {
    if (currentAccount && isAdmin) {
      loadWhitelistedUsers();
    }
  }, [currentAccount, isAdmin]);

  const loadWhitelistedUsers = async () => {
    try {
      console.log('Loading government addresses from whitelist...');
      
      // For demo purposes, we'll show some sample addresses
      // In a real implementation, you would query the contract's government_addresses table
      const sampleAddresses = [
        MULTI_ADMIN_WHITELIST_CONFIG.adminAddresses.deployer,
        MULTI_ADMIN_WHITELIST_CONFIG.adminAddresses.configured
      ];
      
      setWhitelistedUsers(sampleAddresses);
    } catch (error) {
      console.error('Failed to load whitelisted users:', error);
    }
  };

  const handleAddUser = async () => {
    if (!currentAccount || !isAdmin) {
      showError('Access Denied', 'Admin access required');
      return;
    }

    if (!userToAdd.trim()) {
      showError('Invalid Input', 'Please enter a valid address');
      return;
    }

    setLoading(true);

    try {
      const tx = new Transaction();
      
      // Determine which AdminCap to use based on current user
      const adminCapId = currentAccount.address === MULTI_ADMIN_WHITELIST_CONFIG.adminAddresses.deployer 
        ? MULTI_ADMIN_WHITELIST_CONFIG.adminCapIds.deployer
        : MULTI_ADMIN_WHITELIST_CONFIG.adminCapIds.configured;
      
      console.log('🔧 Using AdminCap:', adminCapId, 'for address:', currentAccount.address);
      
      // Call the simple whitelist contract to add address to whitelist
      tx.moveCall({
        target: `${MULTI_ADMIN_WHITELIST_CONFIG.packageId}::simple_whitelist::add_address`,
        arguments: [
          tx.object(MULTI_ADMIN_WHITELIST_CONFIG.whitelistObjectId),
          tx.object(adminCapId), // Use correct admin cap based on current user
          tx.pure.address(userToAdd.trim()),
        ],
      });

      signAndExecute(
        { transaction: tx },
        {
          onSuccess: (result) => {
            console.log('✅ Government address added:', result);
            showSuccess(
              'Address Added Successfully!', 
              `Transaction: ${result.digest.slice(0, 8)}...`
            );
            setUserToAdd('');
            loadWhitelistedUsers();
          },
          onError: (error) => {
            console.error('❌ Failed to add government address:', error);
            showError('Transaction Failed', error.message);
          },
        }
      );
    } catch (error) {
      console.error('❌ Transaction error:', error);
      showError('Transaction Error', error instanceof Error ? error.message : 'Transaction failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-bl from-[#4da2ff]/5 to-transparent"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#4da2ff]/3 rounded-full blur-3xl"></div>
      
      <div className="relative py-12 px-6 lg:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16 mt-20">
            <div className="mb-8">
              <div className="flex items-center mb-8">
                <div className="w-12 h-px bg-[#4da2ff] mr-6"></div>
                <h1 className="text-4xl font-clash font-light text-gray-900">
                  Admin Dashboard
                </h1>
              </div>
              <p className="text-lg text-gray-600 font-clash font-light leading-relaxed max-w-3xl">
                Add government officials to the whitelist so they can decrypt any encrypted documents uploaded by users
              </p>
            </div>

            {/* Admin Wallet Status */}
            {currentAccount && (
              <div className={`mb-8 p-6 rounded-2xl ${isAdmin ? 'bg-blue-50 border border-blue-200' : 'bg-yellow-50 border border-yellow-200'}`}>
                <div className="flex items-center space-x-3">
                  <Shield className={`w-5 h-5 ${isAdmin ? 'text-blue-600' : 'text-yellow-600'}`} />
                  <div className="flex-1">
                    <p className={`font-clash font-medium ${isAdmin ? 'text-blue-800' : 'text-yellow-800'}`}>
                      {isAdmin ? 'Admin Wallet Connected' : 'Wallet Connected (Not Admin)'}
                    </p>
                    <div className="text-sm mt-2 space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className={isAdmin ? 'text-blue-700' : 'text-yellow-700'}>Your Address:</span>
                        <code className="bg-gray-100 px-2 py-1 rounded text-xs font-mono">
                          {currentAccount.address}
                        </code>
                      </div>
                      <div className={`text-xs ${isAdmin ? 'text-blue-600' : 'text-yellow-600'}`}>
                        <p>Expected Admin Addresses:</p>
                        <p>• Deployer: {MULTI_ADMIN_WHITELIST_CONFIG.adminAddresses.deployer}</p>
                        <p>• Configured: {MULTI_ADMIN_WHITELIST_CONFIG.adminAddresses.configured}</p>
                        <p className="mt-1">
                          Status: {currentAccount.address === MULTI_ADMIN_WHITELIST_CONFIG.adminAddresses.deployer || 
                                  currentAccount.address === MULTI_ADMIN_WHITELIST_CONFIG.adminAddresses.configured 
                                  ? '✅ Match Found' : '❌ No Match'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>

          {!currentAccount && (
            <div className="mb-8 p-6 bg-yellow-50 border border-yellow-200 rounded-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Wallet className="w-5 h-5 text-yellow-600" />
                  <div>
                    <p className="font-clash font-medium text-yellow-800">Admin Access Required</p>
                    <p className="text-sm text-yellow-700 mt-1">Connect your admin wallet to manage government addresses</p>
                  </div>
                </div>
                <ConnectButton 
                  connectText="Connect Admin Wallet"
                  className="bg-[#4da2ff] hover:bg-[#3d91ef] text-white px-6 py-2 rounded-lg transition-all duration-300 font-clash font-medium"
                />
              </div>
            </div>
          )}

          {currentAccount && !isAdmin && (
            <div className="mb-8 space-y-4">
              <div className="p-6 bg-red-50 border border-red-200 rounded-xl">
                <div className="flex items-center space-x-3">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <div>
                    <p className="font-clash font-medium text-red-800">Insufficient Permissions</p>
                    <p className="text-sm text-red-700 mt-1">Your address is not authorized to perform admin functions</p>
                  </div>
                </div>
              </div>
              
              <div className="p-6 bg-blue-50 border border-blue-200 rounded-xl">
                <h3 className="font-clash font-medium text-blue-800 mb-4">Fix This Issue:</h3>
                <div className="mt-4 text-sm text-blue-700">
                  <p className="mb-2"><strong>Your Address:</strong> <code className="bg-white px-2 py-1 rounded">{currentAccount.address}</code></p>
                  <p className="mb-2"><strong>Solution:</strong> Update the contract configuration with your address as admin</p>
                  <p className="text-xs text-blue-600">Contact the administrator to add your address to the admin list</p>
                </div>
              </div>
            </div>
          )}

          {/* Information Box */}
          {currentAccount && isAdmin && (
            <div className="mb-8 p-6 bg-blue-50 border border-blue-200 rounded-xl">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-clash font-medium text-blue-800">How Whitelist Works</p>
                  <p className="text-sm text-blue-700 mt-1 leading-relaxed">
                    When you add a wallet address to this whitelist, that government official will be able to decrypt any encrypted files uploaded by users. 
                    They can use the Government Portal to enter a file's blob ID and decrypt it for review.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Admin Interface */}
          {currentAccount && isAdmin && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-500">
                <div className="border-b border-gray-100 px-8 py-6">
                                    <h2 className="text-xl font-clash font-medium text-gray-900 tracking-wide flex items-center">
                    <UserPlus className="w-5 h-5 mr-3 text-[#4da2ff]" />
                    Add Government Address to Whitelist
                  </h2>
                  <p className="text-gray-600 text-sm mt-2 font-clash font-light">
                    Grant decryption access to government officials who can decrypt any encrypted documents
                  </p>
                </div>
                
                <div className="px-8 py-6">
                  <div className="mb-6">
                    <label className="block text-sm font-clash font-medium text-gray-700 mb-3">
                      Government Official Address
                    </label>
                    <input
                      type="text"
                      value={userToAdd}
                      onChange={(e) => setUserToAdd(e.target.value)}
                      placeholder="0x... government wallet address to authorize for decryption"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#4da2ff]/20 focus:border-[#4da2ff] transition-colors font-clash font-light"
                    />
                  </div>
                  
                  <button
                    onClick={handleAddUser}
                    disabled={loading || !userToAdd.trim()}
                    className="w-full bg-[#4da2ff] text-white font-clash font-medium py-3 px-6 rounded-xl hover:bg-[#4da2ff]/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Adding...</span>
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4" />
                        <span>Add to Whitelist</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-500">
                <div className="border-b border-gray-100 px-8 py-6">
                  <h2 className="text-xl font-clash font-medium text-gray-900 tracking-wide flex items-center">
                    <Users className="w-5 h-5 mr-3 text-[#4da2ff]" />
                    Authorized Government Addresses ({whitelistedUsers.length})
                  </h2>
                  <p className="text-gray-600 text-sm mt-2 font-clash font-light">
                    Government officials authorized to decrypt any encrypted documents
                  </p>
                </div>
                
                <div className="px-8 py-6 max-h-96 overflow-y-auto">
                  {whitelistedUsers.length === 0 ? (
                    <p className="text-gray-500 font-clash font-light text-center py-8">
                      No government addresses authorized yet
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {whitelistedUsers.map((address, index) => (
                        <div
                          key={index}
                          className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-100"
                        >
                          <Hash className="w-4 h-4 text-[#4da2ff] mr-3 flex-shrink-0" />
                          <span className="font-mono text-sm text-gray-700 truncate">
                            {address}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="mt-8 bg-white rounded-2xl border border-gray-100 shadow-lg p-8">
            <h3 className="text-lg font-clash font-medium text-gray-900 mb-6 flex items-center">
              <Key className="w-5 h-5 mr-3 text-[#4da2ff]" />
              Contract Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm font-clash font-light">
              <div>
                <p className="text-gray-600 mb-2">Package ID:</p>
                <code className="block w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg font-mono text-sm text-gray-800 break-all">
                  {MULTI_ADMIN_WHITELIST_CONFIG.packageId}
                </code>
              </div>
              <div>
                <p className="text-gray-600 mb-2">Whitelist Object:</p>
                <code className="block w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg font-mono text-sm text-gray-800 break-all">
                  {MULTI_ADMIN_WHITELIST_CONFIG.whitelistObjectId}
                </code>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
