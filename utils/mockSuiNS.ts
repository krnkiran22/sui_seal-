'use client';

import React from 'react';
import { addMockSuiNSName } from '../hooks/useSuiNS';

/**
 * Utility component to add mock SuiNS names for testing
 * You can call this from the browser console or use it temporarily
 */
export function setupMockSuiNSNames() {
  // Add your wallet addresses here with desired names
  
  // Example addresses - replace with your actual wallet addresses
  addMockSuiNSName('0xbc5f1715965ee6b959d912c8de19ab012042407813614267141eb7197914711b', 'kiran.sui');
  addMockSuiNSName('0x0129fc626e3656cfa624cb324826dd5e60782d6f309d11a4450ebde0d974e0a5', 'krndev.sui');
  
  console.log('🎯 Mock SuiNS names configured!');
}

// Auto-setup on import (for convenience)
if (typeof window !== 'undefined') {
  setupMockSuiNSNames();
  
  // Make it available globally for console access
  (window as any).addMockSuiNSName = addMockSuiNSName;
}