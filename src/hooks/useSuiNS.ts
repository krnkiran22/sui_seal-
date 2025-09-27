"use client";

import { useState, useEffect } from 'react';
import { SuiClient } from '@mysten/sui/client';

interface SuiNSData {
  name: string | null;
  loading: boolean;
  error: string | null;
}

// Real SuiNS hook that will query the SuiNS registry
export const useSuiNS = (address: string | null, suiClient: SuiClient | null): SuiNSData => {
  const [name, setName] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!address || !suiClient) {
      setName(null);
      setLoading(false);
      setError(null);
      return;
    }

    const resolveSuiNSName = async () => {
      setLoading(true);
      setError(null);

      try {
        // Query SuiNS registry for reverse resolution
        // This is a simplified implementation - you'd want to use the official SuiNS SDK
        // For now, we'll implement a basic version that works with common SuiNS patterns
        
        // Try to find if this address has a registered SuiNS name
        // In a real implementation, you'd query the SuiNS registry contract
        // For demo purposes, we'll simulate the lookup
        
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
        
        // For now, return null - this would be replaced with actual SuiNS lookup
        setName(null);
      } catch (err) {
        console.error('Error resolving SuiNS name:', err);
        setError(err instanceof Error ? err.message : 'Failed to resolve SuiNS name');
        setName(null);
      } finally {
        setLoading(false);
      }
    };

    resolveSuiNSName();
  }, [address, suiClient]);

  return { name, loading, error };
};

// Helper function to format address or name for display
export const formatAddressOrName = (address: string | null, suinsName: string | null): string => {
  if (suinsName) {
    return suinsName;
  }
  
  if (address) {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }
  
  return 'Not connected';
};

// Simplified SuiNS hook using a mock implementation
// Since the official SuiNS SDK might not be fully available yet
export const useMockSuiNS = (address: string | null) => {
  const [name, setName] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!address) {
      setName(null);
      return;
    }

    setLoading(true);
    
    // Simulate checking for SuiNS name
    // In production, this would query the actual SuiNS registry
    setTimeout(() => {
      // Mock some addresses having SuiNS names for demo
      const mockSuiNSNames: { [key: string]: string } = {
        // Add some mock addresses with SuiNS names for testing
        '0x1234567890abcdef1234567890abcdef12345678': 'alice.sui',
        '0xabcdef1234567890abcdef1234567890abcdef12': 'bob.sui',
        '0x9876543210fedcba9876543210fedcba98765432': 'charlie.sui',
        // Add common admin addresses that might be used
        '0x7b8e0864967427247b2c5c946f9667d8c7a8a2d7': 'admin.sui',
        '0x5f8a9b7c6d4e3f2a1b9c8d7e6f5a4b3c2d1e0f9': 'government.sui',
        '0xa1b2c3d4e5f6789012345678901234567890abcd': 'deployer.sui',
      };

      const suinsName = mockSuiNSNames[address.toLowerCase()];
      setName(suinsName || null);
      setLoading(false);
    }, 500);
  }, [address]);

  return { name, loading, error: null };
};