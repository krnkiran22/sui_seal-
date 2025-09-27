"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Trash2,
  Users,
  AlertCircle,
  CheckCircle,
  Activity,
  Database,
  Clock,
} from "lucide-react";

interface WhitelistEntry {
  id: string;
  address: string;
  addedAt: Date;
  addedBy: string;
}

const AdminPage: React.FC = () => {
  const [walletInput, setWalletInput] = useState("");
  const [whitelistEntries, setWhitelistEntries] = useState<WhitelistEntry[]>([
    {
      id: "1",
      address: "0x1234567890abcdef1234567890abcdef12345678",
      addedAt: new Date("2024-01-15"),
      addedBy: "admin.sui",
    },
    {
      id: "2",
      address: "0xabcdef1234567890abcdef1234567890abcdef12",
      addedAt: new Date("2024-01-20"),
      addedBy: "admin.sui",
    },
  ]);
  const [adding, setAdding] = useState(false);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const parseWalletAddresses = (input: string): string[] => {
    return input
      .split(/[,\n]/)
      .map((addr) => addr.trim())
      .filter((addr) => addr.length > 0);
  };

  const validateAddress = (address: string): boolean => {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  };

  const handleAddToWhitelist = async () => {
    const addresses = parseWalletAddresses(walletInput);

    if (addresses.length === 0) {
      setNotification({
        type: "error",
        message: "Please enter at least one wallet address",
      });
      return;
    }

    const invalidAddresses = addresses.filter((addr) => !validateAddress(addr));
    if (invalidAddresses.length > 0) {
      setNotification({
        type: "error",
        message: `Invalid address format detected`,
      });
      return;
    }

    const duplicateAddresses = addresses.filter((addr) =>
      whitelistEntries.some(
        (entry) => entry.address.toLowerCase() === addr.toLowerCase()
      )
    );
    if (duplicateAddresses.length > 0) {
      setNotification({
        type: "error",
        message: "One or more addresses already exist in whitelist",
      });
      return;
    }

    setAdding(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 800));

      const newEntries: WhitelistEntry[] = addresses.map((address) => ({
        id: Math.random().toString(36).substr(2, 9),
        address,
        addedAt: new Date(),
        addedBy: "admin.sui",
      }));

      setWhitelistEntries((prev) => [...prev, ...newEntries]);
      setWalletInput("");
      setNotification({
        type: "success",
        message: `${addresses.length} address${
          addresses.length > 1 ? "es" : ""
        } added successfully`,
      });
    } catch (error) {
      setNotification({
        type: "error",
        message: "Operation failed. Please try again.",
      });
    } finally {
      setAdding(false);
    }

    setTimeout(() => setNotification(null), 4000);
  };

  const handleRemoveFromWhitelist = async (id: string) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 200));

      setWhitelistEntries((prev) => prev.filter((entry) => entry.id !== id));
      setNotification({
        type: "success",
        message: "Address removed successfully",
      });

      setTimeout(() => setNotification(null), 3000);
    } catch (error) {
      setNotification({ type: "error", message: "Removal failed" });
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 8)}...${address.slice(-6)}`;
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="py-12 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-16 mt-20">
            <div className="mb-8">
              <div className="flex items-center mb-8">
                <div className="w-12 h-px bg-[#4da2ff] mr-6"></div>
                <h1 className="text-4xl font-clash font-light text-gray-900">
                  Administrative Console
                </h1>
              </div>
              <p className="text-lg text-gray-600 font-clash font-light leading-relaxed max-w-3xl">
                Manage institutional access and system permissions for
                intellectual property verification
              </p>
            </div>

            {/* Status Bar */}
            <div className="bg-white rounded-2xl border border-gray-100 px-8 py-6 shadow-lg">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-8">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-[#4da2ff] rounded-full animate-pulse"></div>
                    <span className="text-sm text-gray-600 font-clash font-medium">
                      System Online
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Database className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600 font-clash">
                      {whitelistEntries.length} Authorized
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Activity className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600 font-clash">
                      Active Sessions: 3
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <Clock className="w-4 h-4" />
                  <span className="font-mono font-clash">
                    {formatTime(currentTime)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <AnimatePresence>
            {notification && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className={`mb-8 rounded-2xl p-6 font-clash ${
                  notification.type === "success"
                    ? "bg-[#4da2ff]/5 border border-[#4da2ff]/30 text-[#4da2ff]"
                    : "bg-red-50 border border-red-200 text-red-800"
                }`}
              >
                <div className="flex items-center space-x-3">
                  {notification.type === "success" ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <AlertCircle className="w-5 h-5" />
                  )}
                  <span className="font-medium">{notification.message}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Address Management */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-500">
                <div className="border-b border-gray-100 px-8 py-6">
                  <h2 className="text-xl font-clash font-medium text-gray-900 tracking-wide">
                    Address Management
                  </h2>
                  <p className="text-gray-600 text-sm mt-2 font-clash font-light">
                    Add new addresses to the institutional whitelist
                  </p>
                </div>

                <div className="p-8">
                  <div className="mb-8">
                    <label className="block text-sm font-clash font-medium text-gray-700 mb-4">
                      Wallet Addresses
                    </label>
                    <textarea
                      value={walletInput}
                      onChange={(e) => setWalletInput(e.target.value)}
                      placeholder="Enter wallet addresses (one per line)&#10;&#10;0x1234567890abcdef1234567890abcdef12345678&#10;0xabcdef1234567890abcdef1234567890abcdef12"
                      rows={8}
                      className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:border-[#4da2ff] text-sm font-mono text-gray-800 placeholder-gray-400 resize-none transition-all duration-300 hover:border-gray-300"
                    />
                  </div>

                  <button
                    onClick={handleAddToWhitelist}
                    disabled={adding || !walletInput.trim()}
                    className={`w-full py-4 px-6 rounded-2xl text-white font-clash font-medium transition-all duration-300 ${
                      adding || !walletInput.trim()
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-[#4da2ff] hover:bg-[#3d91ef] shadow-lg hover:shadow-xl hover:shadow-[#4da2ff]/25"
                    }`}
                  >
                    {adding ? (
                      <span className="flex items-center justify-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Processing...</span>
                      </span>
                    ) : (
                      <span className="flex items-center justify-center space-x-2">
                        <Plus className="w-4 h-4" />
                        <span>Add to Whitelist</span>
                      </span>
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
