"use client";"use client";"use client";



import React, { useState, useEffect } from 'react';

import { motion, AnimatePresence } from 'framer-motion';

import { Shield, UserPlus, CheckCircle, AlertCircle, Users, Hash, Key } from 'lucide-react';import React, { useState, useEffect } from 'react';import React, { useState, useEffect } from "react";

import { useCurrentAccount, useSignAndExecuteTransaction } from '@mysten/dapp-kit';

import { whitelistManager, AddToWhitelistResult } from '../../lib/whitelistManager';import { motion, AnimatePresence } from 'framer-motion';import { motion, AnimatePresence } from "framer-motion";

import { MULTI_ADMIN_WHITELIST_CONFIG } from '../../lib/contractConfig';

import { Shield, UserPlus, CheckCircle, AlertCircle, Users, Hash, Key } from 'lucide-react';import {

const AdminPage: React.FC = () => {

  const currentAccount = useCurrentAccount();import { useCurrentAccount, useSignAndExecuteTransaction } from '@mysten/dapp-kit';  Shield,

  const { mutate: signAndExecute } = useSignAndExecuteTransaction();

  import { whitelistManager, AddToWhitelistResult } from '../../lib/whitelistManager';  UserPlus,

  const [userToAdd, setUserToAdd] = useState('');

  const [whitelistedUsers, setWhitelistedUsers] = useState<string[]>([]);import { MULTI_ADMIN_WHITELIST_CONFIG } from '../../lib/contractConfig';  Users,

  const [loading, setLoading] = useState(false);

  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);  AlertCircle,



  // Check if current user is an adminconst AdminPage: React.FC = () => {  CheckCircle,

  const isAdmin = currentAccount && (

    currentAccount.address === MULTI_ADMIN_WHITELIST_CONFIG.adminAddresses.deployer ||  const currentAccount = useCurrentAccount();  Hash,

    currentAccount.address === MULTI_ADMIN_WHITELIST_CONFIG.adminAddresses.configured

  );  const { mutate: signAndExecute } = useSignAndExecuteTransaction();  Key,



  useEffect(() => {    Clock,

    loadWhitelistedUsers();

  }, []);  const [userToAdd, setUserToAdd] = useState('');} from "lucide-react";



  const loadWhitelistedUsers = async () => {  const [whitelistedUsers, setWhitelistedUsers] = useState<string[]>([]);import { useCurrentAccount, useSignAndExecuteTransaction } from '@mysten/dapp-kit';

    try {

      const users = await whitelistManager.getAllWhitelistedUsers();  const [loading, setLoading] = useState(false);import { whitelistManager, AddToWhitelistResult } from '../../lib/whitelistManager';

      setWhitelistedUsers(users);

    } catch (error) {  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);import { MULTI_ADMIN_WHITELIST_CONFIG } from '../../lib/contractConfig';

      console.error('Failed to load whitelisted users:', error);

    }

  };

  // Check if current user is an adminconst AdminPage: React.FC = () => {

  const handleAddUser = async () => {

    if (!currentAccount || !isAdmin) {  const isAdmin = currentAccount && (  const currentAccount = useCurrentAccount();

      setNotification({ type: 'error', message: 'Admin access required' });

      return;    currentAccount.address === MULTI_ADMIN_WHITELIST_CONFIG.adminAddresses.deployer ||  const { mutate: signAndExecute } = useSignAndExecuteTransaction();

    }

    currentAccount.address === MULTI_ADMIN_WHITELIST_CONFIG.adminAddresses.configured  

    if (!userToAdd.trim()) {

      setNotification({ type: 'error', message: 'Please enter a valid address' });  );  const [userToAdd, setUserToAdd] = useState('');

      return;

    }  const [whitelistedUsers, setWhitelistedUsers] = useState<string[]>([]);



    setLoading(true);  useEffect(() => {  const [loading, setLoading] = useState(false);



    try {    loadWhitelistedUsers();  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

      const result: AddToWhitelistResult = await whitelistManager.addToWhitelist(

        currentAccount.address,  }, []);  const [currentTime, setCurrentTime] = useState(new Date());

        userToAdd.trim(),

        (tx) => new Promise((resolve, reject) => {

          signAndExecute(

            { transaction: tx },  const loadWhitelistedUsers = async () => {  // Check if current user is an admin

            {

              onSuccess: (result) => resolve(result),    try {  const isAdmin = currentAccount && (

              onError: (error) => reject(error)

            }      const users = await whitelistManager.getAllWhitelistedUsers();    currentAccount.address === MULTI_ADMIN_WHITELIST_CONFIG.adminAddresses.deployer ||

          );

        })      setWhitelistedUsers(users);    currentAccount.address === MULTI_ADMIN_WHITELIST_CONFIG.adminAddresses.configured

      );

    } catch (error) {  );

      if (result.success) {

        setNotification({ type: 'success', message: `User added to whitelist! TX: ${result.txDigest?.slice(0, 8)}...` });      console.error('Failed to load whitelisted users:', error);

        setUserToAdd('');

        await loadWhitelistedUsers();    }  useEffect(() => {

      } else {

        setNotification({ type: 'error', message: result.error || 'Failed to add user' });  };    const timer = setInterval(() => setCurrentTime(new Date()), 1000);

      }

    loadWhitelistedUsers();

    } catch (error) {

      console.error('Add user failed:', error);  const handleAddUser = async () => {    return () => clearInterval(timer);

      setNotification({ type: 'error', message: 'Transaction failed' });

    } finally {    if (!currentAccount || !isAdmin) {  }, []);

      setLoading(false);

    }      setNotification({ type: 'error', message: 'Admin access required' });



    setTimeout(() => setNotification(null), 5000);      return;  const loadWhitelistedUsers = async () => {

  };

    }    try {

  return (

    <div className="min-h-screen bg-white">      const users = await whitelistManager.getAllWhitelistedUsers();

      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-bl from-[#4da2ff]/5 to-transparent"></div>

      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#4da2ff]/3 rounded-full blur-3xl"></div>    if (!userToAdd.trim()) {      setWhitelistedUsers(users);

      

      <div className="relative py-12 px-6 lg:px-12">      setNotification({ type: 'error', message: 'Please enter a valid address' });    } catch (error) {

        <div className="max-w-6xl mx-auto">

          <div className="mb-16 mt-20">      return;      console.error('Failed to load whitelisted users:', error);

            <div className="mb-8">

              <div className="flex items-center mb-8">    }    }

                <div className="w-12 h-px bg-[#4da2ff] mr-6"></div>

                <h1 className="text-4xl font-clash font-light text-gray-900">  };

                  Admin Dashboard

                </h1>    setLoading(true);

              </div>

              <p className="text-lg text-gray-600 font-clash font-light leading-relaxed max-w-3xl">  const handleAddUser = async () => {

                Manage whitelist access for document decryption authorization

              </p>    try {    if (!currentAccount || !isAdmin) {

            </div>

          </div>      const result: AddToWhitelistResult = await whitelistManager.addToWhitelist(      setNotification({ type: 'error', message: 'Admin access required' });



          <AnimatePresence>        currentAccount.address,      return;

            {notification && (

              <motion.div        userToAdd.trim(),    }

                initial={{ opacity: 0, height: 0 }}

                animate={{ opacity: 1, height: "auto" }}        (tx) => new Promise((resolve, reject) => {

                exit={{ opacity: 0, height: 0 }}

                className={`mb-8 rounded-2xl p-6 font-clash ${          signAndExecute(    if (!userToAdd.trim()) {

                  notification.type === "success"

                    ? "bg-[#4da2ff]/5 border border-[#4da2ff]/30 text-[#4da2ff]"            { transaction: tx },      setNotification({ type: 'error', message: 'Please enter a valid address' });

                    : "bg-red-50 border border-red-200 text-red-800"

                }`}            {      return;

              >

                <div className="flex items-center space-x-3">              onSuccess: (result) => resolve(result),    }

                  {notification.type === "success" ? (

                    <CheckCircle className="w-5 h-5" />              onError: (error) => reject(error)

                  ) : (

                    <AlertCircle className="w-5 h-5" />            }    setLoading(true);

                  )}

                  <span className="font-medium">{notification.message}</span>          );

                </div>

              </motion.div>        })    try {

            )}

          </AnimatePresence>      );      const result: AddToWhitelistResult = await whitelistManager.addToWhitelist(



          {!currentAccount && (        currentAccount.address,

            <div className="mb-8 p-6 bg-yellow-50 border border-yellow-200 rounded-xl">

              <div className="flex items-center space-x-3">      if (result.success) {        userToAdd.trim(),

                <Shield className="w-5 h-5 text-yellow-600" />

                <div>        setNotification({ type: 'success', message: `User added to whitelist successfully! TX: ${result.txDigest?.slice(0, 8)}...` });        (tx) => new Promise((resolve, reject) => {

                  <p className="font-clash font-medium text-yellow-800">Admin Access Required</p>

                  <p className="text-sm text-yellow-700 mt-1">Please connect your admin wallet using the navigation bar</p>        setUserToAdd('');          signAndExecute(

                </div>

              </div>        await loadWhitelistedUsers(); // Refresh the list            { transaction: tx },

            </div>

          )}      } else {            {



          {currentAccount && !isAdmin && (        setNotification({ type: 'error', message: result.error || 'Failed to add user' });              onSuccess: (result) => resolve(result),

            <div className="mb-8 p-6 bg-red-50 border border-red-200 rounded-xl">

              <div className="flex items-center space-x-3">      }              onError: (error) => reject(error)

                <AlertCircle className="w-5 h-5 text-red-600" />

                <div>            }

                  <p className="font-clash font-medium text-red-800">Insufficient Permissions</p>

                  <p className="text-sm text-red-700 mt-1">Your address is not authorized to perform admin functions</p>    } catch (error) {          );

                  <p className="text-xs text-red-600 mt-2">Connected: {currentAccount.address}</p>

                </div>      console.error('Add user failed:', error);        })

              </div>

            </div>      setNotification({ type: 'error', message: 'Transaction failed' });      );

          )}

    } finally {

          {currentAccount && isAdmin && (

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">      setLoading(false);      if (result.success) {

              <div className="bg-white rounded-2xl border border-gray-100 shadow-lg">

                <div className="border-b border-gray-100 px-8 py-6">    }        setNotification({ type: 'success', message: `User added to whitelist successfully! TX: ${result.txDigest?.slice(0, 8)}...` });

                  <h2 className="text-xl font-clash font-medium text-gray-900 tracking-wide flex items-center">

                    <UserPlus className="w-5 h-5 mr-3 text-[#4da2ff]" />        setUserToAdd('');

                    Add User to Whitelist

                  </h2>    setTimeout(() => setNotification(null), 5000);        await loadWhitelistedUsers(); // Refresh the list

                  <p className="text-gray-600 text-sm mt-2 font-clash font-light">

                    Grant decryption access to new users  };      } else {

                  </p>

                </div>        setNotification({ type: 'error', message: result.error || 'Failed to add user' });

                

                <div className="px-8 py-6">  return (      }

                  <div className="mb-6">

                    <label className="block text-sm font-clash font-medium text-gray-700 mb-3">    <div className="min-h-screen bg-white">

                      User Address

                    </label>      {/* Creative Background Elements */}    } catch (error) {

                    <input

                      type="text"      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-bl from-[#4da2ff]/5 to-transparent"></div>      console.error('Add user failed:', error);

                      value={userToAdd}

                      onChange={(e) => setUserToAdd(e.target.value)}      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#4da2ff]/3 rounded-full blur-3xl"></div>      setNotification({ type: 'error', message: 'Transaction failed' });

                      placeholder="0x... address to whitelist"

                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#4da2ff]/20 focus:border-[#4da2ff] transition-colors font-clash font-light"          } finally {

                    />

                  </div>      {/* Main Content */}      setLoading(false);

                  

                  <button      <div className="relative py-12 px-6 lg:px-12">    }

                    onClick={handleAddUser}

                    disabled={loading || !userToAdd.trim()}        <div className="max-w-6xl mx-auto">

                    className="w-full bg-[#4da2ff] text-white font-clash font-medium py-3 px-6 rounded-xl hover:bg-[#4da2ff]/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"

                  >          {/* Header */}    setTimeout(() => setNotification(null), 5000);

                    {loading ? (

                      <>          <div className="mb-16 mt-20">  };

                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>

                        <span>Adding...</span>            <div className="mb-8">      await new Promise((resolve) => setTimeout(resolve, 800));

                      </>

                    ) : (              <div className="flex items-center mb-8">

                      <>

                        <UserPlus className="w-4 h-4" />                <div className="w-12 h-px bg-[#4da2ff] mr-6"></div>      const newEntries: WhitelistEntry[] = addresses.map((address) => ({

                        <span>Add to Whitelist</span>

                      </>                <h1 className="text-4xl font-clash font-light text-gray-900">        id: Math.random().toString(36).substr(2, 9),

                    )}

                  </button>                  Admin Dashboard        address,

                </div>

              </div>                </h1>        addedAt: new Date(),



              <div className="bg-white rounded-2xl border border-gray-100 shadow-lg">              </div>        addedBy: "admin.sui",

                <div className="border-b border-gray-100 px-8 py-6">

                  <h2 className="text-xl font-clash font-medium text-gray-900 tracking-wide flex items-center">              <p className="text-lg text-gray-600 font-clash font-light leading-relaxed max-w-3xl">      }));

                    <Users className="w-5 h-5 mr-3 text-[#4da2ff]" />

                    Whitelisted Users ({whitelistedUsers.length})                Manage whitelist access for document decryption authorization

                  </h2>

                  <p className="text-gray-600 text-sm mt-2 font-clash font-light">              </p>      setWhitelistEntries((prev) => [...prev, ...newEntries]);

                    Users authorized for document decryption

                  </p>            </div>      setWalletInput("");

                </div>

                          </div>      setNotification({

                <div className="px-8 py-6 max-h-96 overflow-y-auto">

                  {whitelistedUsers.length === 0 ? (        type: "success",

                    <p className="text-gray-500 font-clash font-light text-center py-8">

                      No users whitelisted yet          {/* Notifications */}        message: `${addresses.length} address${

                    </p>

                  ) : (          <AnimatePresence>          addresses.length > 1 ? "es" : ""

                    <div className="space-y-3">

                      {whitelistedUsers.map((address, index) => (            {notification && (        } added successfully`,

                        <div

                          key={index}              <motion.div      });

                          className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-100"

                        >                initial={{ opacity: 0, height: 0 }}    } catch (error) {

                          <Hash className="w-4 h-4 text-[#4da2ff] mr-3 flex-shrink-0" />

                          <span className="font-mono text-sm text-gray-700 truncate">                animate={{ opacity: 1, height: "auto" }}      setNotification({

                            {address}

                          </span>                exit={{ opacity: 0, height: 0 }}        type: "error",

                        </div>

                      ))}                className={`mb-8 rounded-2xl p-6 font-clash ${        message: "Operation failed. Please try again.",

                    </div>

                  )}                  notification.type === "success"      });

                </div>

              </div>                    ? "bg-[#4da2ff]/5 border border-[#4da2ff]/30 text-[#4da2ff]"    } finally {

            </div>

          )}                    : "bg-red-50 border border-red-200 text-red-800"      setAdding(false);



          <div className="mt-8 bg-gray-50 rounded-2xl p-6">                }`}    }

            <h3 className="text-lg font-clash font-medium text-gray-900 mb-4 flex items-center">

              <Key className="w-5 h-5 mr-3 text-[#4da2ff]" />              >

              Contract Information

            </h3>                <div className="flex items-center space-x-3">    setTimeout(() => setNotification(null), 4000);

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm font-clash font-light">

              <div>                  {notification.type === "success" ? (  };

                <p className="text-gray-600">Package ID:</p>

                <p className="font-mono text-gray-800 break-all">{MULTI_ADMIN_WHITELIST_CONFIG.packageId}</p>                    <CheckCircle className="w-5 h-5" />

              </div>

              <div>                  ) : (  const handleRemoveFromWhitelist = async (id: string) => {

                <p className="text-gray-600">Whitelist Object:</p>

                <p className="font-mono text-gray-800 break-all">{MULTI_ADMIN_WHITELIST_CONFIG.whitelistObjectId}</p>                    <AlertCircle className="w-5 h-5" />    try {

              </div>

              <div>                  )}      await new Promise((resolve) => setTimeout(resolve, 200));

                <p className="text-gray-600">Admin (Deployer):</p>

                <p className="font-mono text-gray-800 break-all">{MULTI_ADMIN_WHITELIST_CONFIG.adminAddresses.deployer}</p>                  <span className="font-medium">{notification.message}</span>

              </div>

              <div>                </div>      setWhitelistEntries((prev) => prev.filter((entry) => entry.id !== id));

                <p className="text-gray-600">Admin (Configured):</p>

                <p className="font-mono text-gray-800 break-all">{MULTI_ADMIN_WHITELIST_CONFIG.adminAddresses.configured}</p>              </motion.div>      setNotification({

              </div>

            </div>            )}        type: "success",

          </div>

        </div>          </AnimatePresence>        message: "Address removed successfully",

      </div>

    </div>      });

  );

};          {/* Access Control */}



export default AdminPage;          {!currentAccount && (      setTimeout(() => setNotification(null), 3000);

            <div className="mb-8 p-6 bg-yellow-50 border border-yellow-200 rounded-xl">    } catch (error) {

              <div className="flex items-center space-x-3">      setNotification({ type: "error", message: "Removal failed" });

                <Shield className="w-5 h-5 text-yellow-600" />    }

                <div>  };

                  <p className="font-clash font-medium text-yellow-800">Admin Access Required</p>

                  <p className="text-sm text-yellow-700 mt-1">Please connect your admin wallet using the navigation bar</p>  const formatAddress = (address: string) => {

                </div>    return `${address.slice(0, 8)}...${address.slice(-6)}`;

              </div>  };

            </div>

          )}  const formatTime = (date: Date) => {

    return date.toLocaleTimeString("en-US", {

          {currentAccount && !isAdmin && (      hour12: false,

            <div className="mb-8 p-6 bg-red-50 border border-red-200 rounded-xl">      hour: "2-digit",

              <div className="flex items-center space-x-3">      minute: "2-digit",

                <AlertCircle className="w-5 h-5 text-red-600" />      second: "2-digit",

                <div>    });

                  <p className="font-clash font-medium text-red-800">Insufficient Permissions</p>  };

                  <p className="text-sm text-red-700 mt-1">Your address is not authorized to perform admin functions</p>

                  <p className="text-xs text-red-600 mt-2">Connected: {currentAccount.address}</p>  return (

                </div>    <div className="min-h-screen bg-white">

              </div>      <div className="py-12 px-6 lg:px-12">

            </div>        <div className="max-w-7xl mx-auto">

          )}          {/* Header */}

          <div className="mb-16 mt-20">

          {currentAccount && isAdmin && (            <div className="mb-8">

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">              <div className="flex items-center mb-8">

              {/* Add User Section */}                <div className="w-12 h-px bg-[#4da2ff] mr-6"></div>

              <div className="bg-white rounded-2xl border border-gray-100 shadow-lg">                <h1 className="text-4xl font-clash font-light text-gray-900">

                <div className="border-b border-gray-100 px-8 py-6">                  Administrative Console

                  <h2 className="text-xl font-clash font-medium text-gray-900 tracking-wide flex items-center">                </h1>

                    <UserPlus className="w-5 h-5 mr-3 text-[#4da2ff]" />              </div>

                    Add User to Whitelist              <p className="text-lg text-gray-600 font-clash font-light leading-relaxed max-w-3xl">

                  </h2>                Manage institutional access and system permissions for

                  <p className="text-gray-600 text-sm mt-2 font-clash font-light">                intellectual property verification

                    Grant decryption access to new users              </p>

                  </p>            </div>

                </div>

                            {/* Status Bar */}

                <div className="px-8 py-6">            <div className="bg-white rounded-2xl border border-gray-100 px-8 py-6 shadow-lg">

                  <div className="mb-6">              <div className="flex justify-between items-center">

                    <label className="block text-sm font-clash font-medium text-gray-700 mb-3">                <div className="flex items-center space-x-8">

                      User Address                  <div className="flex items-center space-x-3">

                    </label>                    <div className="w-3 h-3 bg-[#4da2ff] rounded-full animate-pulse"></div>

                    <input                    <span className="text-sm text-gray-600 font-clash font-medium">

                      type="text"                      System Online

                      value={userToAdd}                    </span>

                      onChange={(e) => setUserToAdd(e.target.value)}                  </div>

                      placeholder="0x... address to whitelist"                  <div className="flex items-center space-x-3">

                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#4da2ff]/20 focus:border-[#4da2ff] transition-colors font-clash font-light"                    <Database className="w-4 h-4 text-gray-500" />

                    />                    <span className="text-sm text-gray-600 font-clash">

                  </div>                      {whitelistEntries.length} Authorized

                                      </span>

                  <button                  </div>

                    onClick={handleAddUser}                  <div className="flex items-center space-x-3">

                    disabled={loading || !userToAdd.trim()}                    <Activity className="w-4 h-4 text-gray-500" />

                    className="w-full bg-[#4da2ff] text-white font-clash font-medium py-3 px-6 rounded-xl hover:bg-[#4da2ff]/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"                    <span className="text-sm text-gray-600 font-clash">

                  >                      Active Sessions: 3

                    {loading ? (                    </span>

                      <>                  </div>

                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>                </div>

                        <span>Adding...</span>                <div className="flex items-center space-x-2 text-sm text-gray-500">

                      </>                  <Clock className="w-4 h-4" />

                    ) : (                  <span className="font-mono font-clash">

                      <>                    {formatTime(currentTime)}

                        <UserPlus className="w-4 h-4" />                  </span>

                        <span>Add to Whitelist</span>                </div>

                      </>              </div>

                    )}            </div>

                  </button>          </div>

                </div>

              </div>          {/* Notifications */}

          <AnimatePresence>

              {/* Whitelisted Users */}            {notification && (

              <div className="bg-white rounded-2xl border border-gray-100 shadow-lg">              <motion.div

                <div className="border-b border-gray-100 px-8 py-6">                initial={{ opacity: 0, height: 0 }}

                  <h2 className="text-xl font-clash font-medium text-gray-900 tracking-wide flex items-center">                animate={{ opacity: 1, height: "auto" }}

                    <Users className="w-5 h-5 mr-3 text-[#4da2ff]" />                exit={{ opacity: 0, height: 0 }}

                    Whitelisted Users ({whitelistedUsers.length})                className={`mb-8 rounded-2xl p-6 font-clash ${

                  </h2>                  notification.type === "success"

                  <p className="text-gray-600 text-sm mt-2 font-clash font-light">                    ? "bg-[#4da2ff]/5 border border-[#4da2ff]/30 text-[#4da2ff]"

                    Users authorized for document decryption                    : "bg-red-50 border border-red-200 text-red-800"

                  </p>                }`}

                </div>              >

                                <div className="flex items-center space-x-3">

                <div className="px-8 py-6 max-h-96 overflow-y-auto">                  {notification.type === "success" ? (

                  {whitelistedUsers.length === 0 ? (                    <CheckCircle className="w-5 h-5" />

                    <p className="text-gray-500 font-clash font-light text-center py-8">                  ) : (

                      No users whitelisted yet                    <AlertCircle className="w-5 h-5" />

                    </p>                  )}

                  ) : (                  <span className="font-medium">{notification.message}</span>

                    <div className="space-y-3">                </div>

                      {whitelistedUsers.map((address, index) => (              </motion.div>

                        <div            )}

                          key={index}          </AnimatePresence>

                          className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-100"

                        >          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

                          <Hash className="w-4 h-4 text-[#4da2ff] mr-3 flex-shrink-0" />            {/* Address Management */}

                          <span className="font-mono text-sm text-gray-700 truncate">            <div className="lg:col-span-2">

                            {address}              <div className="bg-white rounded-2xl border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-500">

                          </span>                <div className="border-b border-gray-100 px-8 py-6">

                        </div>                  <h2 className="text-xl font-clash font-medium text-gray-900 tracking-wide">

                      ))}                    Address Management

                    </div>                  </h2>

                  )}                  <p className="text-gray-600 text-sm mt-2 font-clash font-light">

                </div>                    Add new addresses to the institutional whitelist

              </div>                  </p>

            </div>                </div>

          )}

                <div className="p-8">

          {/* Contract Info */}                  <div className="mb-8">

          <div className="mt-8 bg-gray-50 rounded-2xl p-6">                    <label className="block text-sm font-clash font-medium text-gray-700 mb-4">

            <h3 className="text-lg font-clash font-medium text-gray-900 mb-4 flex items-center">                      Wallet Addresses

              <Key className="w-5 h-5 mr-3 text-[#4da2ff]" />                    </label>

              Contract Information                    <textarea

            </h3>                      value={walletInput}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm font-clash font-light">                      onChange={(e) => setWalletInput(e.target.value)}

              <div>                      placeholder="Enter wallet addresses (one per line)&#10;&#10;0x1234567890abcdef1234567890abcdef12345678&#10;0xabcdef1234567890abcdef1234567890abcdef12"

                <p className="text-gray-600">Package ID:</p>                      rows={8}

                <p className="font-mono text-gray-800 break-all">{MULTI_ADMIN_WHITELIST_CONFIG.packageId}</p>                      className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:border-[#4da2ff] text-sm font-mono text-gray-800 placeholder-gray-400 resize-none transition-all duration-300 hover:border-gray-300"

              </div>                    />

              <div>                  </div>

                <p className="text-gray-600">Whitelist Object:</p>

                <p className="font-mono text-gray-800 break-all">{MULTI_ADMIN_WHITELIST_CONFIG.whitelistObjectId}</p>                  <button

              </div>                    onClick={handleAddToWhitelist}

              <div>                    disabled={adding || !walletInput.trim()}

                <p className="text-gray-600">Admin (Deployer):</p>                    className={`w-full py-4 px-6 rounded-2xl text-white font-clash font-medium transition-all duration-300 ${

                <p className="font-mono text-gray-800 break-all">{MULTI_ADMIN_WHITELIST_CONFIG.adminAddresses.deployer}</p>                      adding || !walletInput.trim()

              </div>                        ? "bg-gray-400 cursor-not-allowed"

              <div>                        : "bg-[#4da2ff] hover:bg-[#3d91ef] shadow-lg hover:shadow-xl hover:shadow-[#4da2ff]/25"

                <p className="text-gray-600">Admin (Configured):</p>                    }`}

                <p className="font-mono text-gray-800 break-all">{MULTI_ADMIN_WHITELIST_CONFIG.adminAddresses.configured}</p>                  >

              </div>                    {adding ? (

            </div>                      <span className="flex items-center justify-center space-x-2">

          </div>                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />

        </div>                        <span>Processing...</span>

      </div>                      </span>

    </div>                    ) : (

  );                      <span className="flex items-center justify-center space-x-2">

};                        <Plus className="w-4 h-4" />

                        <span>Add to Whitelist</span>

export default AdminPage;                      </span>
                    )}
                  </button>
                </div>

                <div className="border-t border-gray-100 px-8 py-6 bg-gray-50 rounded-b-2xl">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="w-4 h-4 text-gray-500 mt-1 flex-shrink-0" />
                    <div className="text-xs text-gray-600 leading-relaxed font-clash">
                      <p className="font-medium mb-2 text-gray-700">
                        Requirements:
                      </p>
                      <p className="mb-1">
                        • Addresses must begin with "0x" followed by 40
                        hexadecimal characters
                      </p>
                      <p className="mb-1">
                        • Each address should be on a separate line
                      </p>
                      <p>
                        • Duplicate addresses will be automatically filtered
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Whitelist Table */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-500">
                <div className="border-b border-gray-100 px-8 py-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-xl font-clash font-medium text-gray-900 tracking-wide">
                        Authorized Addresses
                      </h2>
                      <p className="text-gray-600 text-sm mt-2 font-clash font-light">
                        Currently whitelisted institutional addresses
                      </p>
                    </div>
                    <div className="text-sm text-gray-600 bg-[#4da2ff]/10 px-4 py-2 rounded-xl border border-[#4da2ff]/20">
                      <span className="font-clash font-medium">
                        {whitelistEntries.length} Total
                      </span>
                    </div>
                  </div>
                </div>

                {whitelistEntries.length === 0 ? (
                  <div className="p-16 text-center">
                    <Users className="mx-auto w-12 h-12 text-gray-300 mb-6" />
                    <p className="text-lg text-gray-500 font-clash font-light mb-2">
                      No authorized addresses
                    </p>
                    <p className="text-sm text-gray-400 font-clash">
                      Add addresses using the management panel
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                          <th className="px-8 py-4 text-left text-xs font-clash font-medium text-gray-600 uppercase tracking-wider">
                            Address
                          </th>
                          <th className="px-8 py-4 text-left text-xs font-clash font-medium text-gray-600 uppercase tracking-wider">
                            Added Date
                          </th>
                          <th className="px-8 py-4 text-left text-xs font-clash font-medium text-gray-600 uppercase tracking-wider">
                            Added By
                          </th>
                          <th className="px-8 py-4 text-center text-xs font-clash font-medium text-gray-600 uppercase tracking-wider">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {whitelistEntries.map((entry, index) => (
                          <motion.tr
                            key={entry.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: index * 0.05 }}
                            className="hover:bg-gray-50 transition-colors group"
                          >
                            <td className="px-8 py-6 whitespace-nowrap">
                              <code className="text-sm font-mono text-[#4da2ff] bg-[#4da2ff]/5 px-3 py-2 rounded-xl border border-[#4da2ff]/20">
                                {formatAddress(entry.address)}
                              </code>
                            </td>
                            <td className="px-8 py-6 whitespace-nowrap text-sm text-gray-600 font-clash font-light">
                              {entry.addedAt.toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })}
                            </td>
                            <td className="px-8 py-6 whitespace-nowrap">
                              <span className="text-xs text-gray-600 bg-gray-100 px-3 py-1 rounded-xl border border-gray-200 font-mono">
                                {entry.addedBy}
                              </span>
                            </td>
                            <td className="px-8 py-6 whitespace-nowrap text-center">
                              <button
                                onClick={() =>
                                  handleRemoveFromWhitelist(entry.id)
                                }
                                className="p-2 rounded-xl text-gray-400 hover:text-[#4da2ff] hover:bg-[#4da2ff]/5 transition-all duration-300 border border-transparent hover:border-[#4da2ff]/20"
                                title="Remove address"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="mt-16 pt-8 border-t border-gray-100">
            <p className="text-sm text-gray-500 font-clash font-light text-center">
              Administrative actions are logged and monitored for security
              compliance
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
