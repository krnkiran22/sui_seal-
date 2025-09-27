"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { motion, useScroll, useTransform } from "framer-motion";
import { Menu, X, Wallet } from "lucide-react";
import { useCurrentAccount, ConnectButton, useDisconnectWallet } from '@mysten/dapp-kit';
import WalletConnection from '../../components/WalletConnection';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const currentAccount = useCurrentAccount();

  // Track scroll position for navbar styling
  useEffect(() => {
    const updateScrolled = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", updateScrolled);
    return () => window.removeEventListener("scroll", updateScrolled);
  }, []);

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Upload Documents", href: "/upload" },
    { name: "Admin Portal", href: "/admin" },
    { name: "Government", href: "/govt" },
  ];

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed w-full z-50 transition-all duration-500 ${
        scrolled
          ? "bg-white/98 backdrop-blur-xl shadow-xl shadow-black/5"
          : "bg-white/90 backdrop-blur-lg shadow-lg shadow-black/3"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex justify-between items-center h-20">
          {/* Logo Section */}
          <Link href="/" className="flex items-center space-x-3 group">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
              className="relative"
            >
              <div className="w-10 h-10 bg-[#4da2ff] rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                <span className="text-white font-clash font-semibold text-lg">
                  S
                </span>
              </div>
            </motion.div>
            <span className="font-clash font-medium text-2xl text-gray-900 tracking-tight">
              SuiPatent
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navigation.map((item, index) => (
              <Link key={item.name} href={item.href}>
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  whileHover={{ y: -1 }}
                  className={`relative px-5 py-2.5 rounded-xl text-sm font-clash font-medium transition-all duration-300 ${
                    isActive(item.href)
                      ? "text-[#4da2ff] bg-[#4da2ff]/10 shadow-sm"
                      : "text-gray-700 hover:text-[#4da2ff] hover:bg-gray-50 hover:shadow-sm"
                  }`}
                >
                  {item.name}
                  {isActive(item.href) && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 bg-[#4da2ff]/10 rounded-xl -z-10 shadow-sm"
                      transition={{ duration: 0.2 }}
                    />
                  )}
                </motion.div>
              </Link>
            ))}

            {/* Connect Wallet Button with SuiNS */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.5 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="ml-8"
            >
              <WalletConnection showDisconnect={true} />
            </motion.div>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsOpen(!isOpen)}
              className="p-3 text-gray-700 hover:text-[#4da2ff] hover:bg-gray-50 rounded-xl transition-all duration-300 hover:shadow-sm"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <motion.div
        initial={false}
        animate={{
          height: isOpen ? "auto" : 0,
          opacity: isOpen ? 1 : 0,
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="lg:hidden overflow-hidden bg-white/98 backdrop-blur-xl shadow-lg shadow-black/5"
      >
        <div className="px-6 py-6 space-y-2">
          {navigation.map((item, index) => (
            <Link key={item.name} href={item.href}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: isOpen ? 1 : 0, x: isOpen ? 0 : -20 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className={`block px-5 py-3.5 rounded-xl text-base font-clash font-medium transition-all duration-300 ${
                  isActive(item.href)
                    ? "text-[#4da2ff] bg-[#4da2ff]/10 shadow-sm"
                    : "text-gray-700 hover:text-[#4da2ff] hover:bg-gray-50 hover:shadow-sm"
                }`}
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </motion.div>
            </Link>
          ))}

          {/* Mobile Connect Button with SuiNS */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: isOpen ? 1 : 0, x: isOpen ? 0 : -20 }}
            transition={{ duration: 0.3, delay: navigation.length * 0.05 }}
            className="mt-6"
          >
            <WalletConnection 
              className="w-full" 
              showDisconnect={true}
              showFullAddress={false}
            />
          </motion.div>
        </div>
      </motion.div>
    </motion.nav>
  );
};

export default Navbar;
