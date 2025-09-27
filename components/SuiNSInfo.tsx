'use client';

import React from 'react';
import { ExternalLink, Info, Star, Zap } from 'lucide-react';

export function SuiNSInfo() {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6 mb-4">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
          <Star className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
            Get Your SuiNS Name! 
            <Zap className="w-4 h-4 text-yellow-500" />
          </h3>
          
          <p className="text-sm text-gray-700 mb-4">
            Transform your long wallet address into a memorable name like <strong>yourname.sui</strong>. 
            It's like having a username for your Sui wallet!
          </p>
          
          <div className="bg-white rounded-lg p-4 mb-4">
            <h4 className="font-medium text-gray-900 text-sm mb-3">✨ Benefits of SuiNS:</h4>
            <ul className="text-sm text-gray-700 space-y-1.5">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                Easy to remember and share (alice.sui vs 0x1234...5678)
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                Professional identity on Sui blockchain
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                Works across all Sui dApps automatically
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                One-time purchase, yours forever
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-lg p-4 mb-4">
            <h4 className="font-medium text-gray-900 text-sm mb-3">🚀 How to get your SuiNS name:</h4>
            <ol className="text-sm text-gray-700 space-y-2">
              <li className="flex gap-2">
                <span className="w-5 h-5 bg-blue-100 text-blue-600 rounded-full text-xs flex items-center justify-center font-medium flex-shrink-0 mt-0.5">1</span>
                <span>Visit the official SuiNS website</span>
              </li>
              <li className="flex gap-2">
                <span className="w-5 h-5 bg-blue-100 text-blue-600 rounded-full text-xs flex items-center justify-center font-medium flex-shrink-0 mt-0.5">2</span>
                <span>Connect your Sui wallet</span>
              </li>
              <li className="flex gap-2">
                <span className="w-5 h-5 bg-blue-100 text-blue-600 rounded-full text-xs flex items-center justify-center font-medium flex-shrink-0 mt-0.5">3</span>
                <span>Search for your preferred name (e.g., "alice", "mycompany")</span>
              </li>
              <li className="flex gap-2">
                <span className="w-5 h-5 bg-blue-100 text-blue-600 rounded-full text-xs flex items-center justify-center font-medium flex-shrink-0 mt-0.5">4</span>
                <span>Pay the registration fee (varies by name length)</span>
              </li>
              <li className="flex gap-2">
                <span className="w-5 h-5 bg-blue-100 text-blue-600 rounded-full text-xs flex items-center justify-center font-medium flex-shrink-0 mt-0.5">5</span>
                <span>Set it as your primary name and enjoy!</span>
              </li>
            </ol>
          </div>

          <div className="flex flex-wrap gap-3">
            <a
              href="https://suins.io"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-sm"
            >
              <Zap className="w-4 h-4" />
              Get Your SuiNS Name
              <ExternalLink className="w-3 h-3" />
            </a>
            <a
              href="https://docs.suins.io"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Info className="w-4 h-4" />
              Learn More
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}