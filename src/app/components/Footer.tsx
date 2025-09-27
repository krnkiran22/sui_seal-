"use client";

import React from 'react';
import { motion } from 'framer-motion';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto py-16 px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
                className="w-10 h-10 bg-[#4da2ff] rounded-xl flex items-center justify-center shadow-lg"
              >
                <span className="text-white font-clash font-semibold text-lg">S</span>
              </motion.div>
              <span className="font-clash font-medium text-2xl text-gray-900 tracking-tight">
                SuiPatent
              </span>
            </div>
            <p className="text-gray-600 text-lg leading-relaxed max-w-md font-clash font-light">
              Revolutionary intellectual property protection through decentralized blockchain technology on the Sui network.
            </p>
          </div>

          <div>
            <h3 className="text-gray-900 font-clash font-medium text-lg mb-6 tracking-wide">
              Platform
            </h3>
            <ul className="space-y-3">
              <li><a href="/" className="text-gray-600 hover:text-[#4da2ff] text-base font-clash font-light transition-colors duration-300">Home</a></li>
              <li><a href="/upload" className="text-gray-600 hover:text-[#4da2ff] text-base font-clash font-light transition-colors duration-300">Upload Documents</a></li>
              <li><a href="/admin" className="text-gray-600 hover:text-[#4da2ff] text-base font-clash font-light transition-colors duration-300">Admin Portal</a></li>
              <li><a href="/govt" className="text-gray-600 hover:text-[#4da2ff] text-base font-clash font-light transition-colors duration-300">Government</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-gray-900 font-clash font-medium text-lg mb-6 tracking-wide">
              Resources
            </h3>
            <ul className="space-y-3">
              <li><a href="/docs" className="text-gray-600 hover:text-[#4da2ff] text-base font-clash font-light transition-colors duration-300">Documentation</a></li>
              <li><a href="/support" className="text-gray-600 hover:text-[#4da2ff] text-base font-clash font-light transition-colors duration-300">Support</a></li>
              <li><a href="/privacy" className="text-gray-600 hover:text-[#4da2ff] text-base font-clash font-light transition-colors duration-300">Privacy Policy</a></li>
              <li><a href="/terms" className="text-gray-600 hover:text-[#4da2ff] text-base font-clash font-light transition-colors duration-300">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-100">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
            <p className="text-gray-500 text-sm font-clash font-light">
              © {currentYear} SuiPatent. All rights reserved. Built on Sui Network.
            </p>
            
            <div className="inline-flex items-center px-4 py-2 bg-[#4da2ff]/5 border border-[#4da2ff]/20 rounded-full">
              <span className="w-2 h-2 bg-[#4da2ff] rounded-full mr-3 animate-pulse"></span>
              <span className="text-[#4da2ff] text-sm font-clash font-medium tracking-wide">POWERED BY SUI BLOCKCHAIN</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;