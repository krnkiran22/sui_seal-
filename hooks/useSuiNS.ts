'use client';

import { useState, useEffect } from 'react';
import { useSuiClient } from '@mysten/dapp-kit';
import { SuinsClient } from '@mysten/suins';

export interface SuiNSResult {
  name: string | null;
  isLoading: boolean;
  error: string | null;
}

// Mock SuiNS names for testing - only used if no real SuiNS name is found
const MOCK_SUINS_NAMES: Record<string, string> = {
  // Add specific addresses here for testing
  '0xbc5f1715965ee6b959d912c8de19ab012042407813614267141eb7197914711b': 'kiran.sui',
  '0x0129fc626e3656cfa624cb324826dd5e60782d6f309d11a4450ebde0d974e0a5': 'krndev.sui',
  // You can add more specific addresses as needed
};

/**
 * Hook to resolve SuiNS names for addresses
 * @param address - The Sui address to resolve
 * @returns Object with name, loading state, and error
 */
/**
 * Get mock SuiNS name for testing - only used if no real name exists
 */
function getMockSuiNSName(address: string): string | null {
  // Check if we have a specific mock mapping for this address
  return MOCK_SUINS_NAMES[address] || null;
}

export function useSuiNS(address: string | null): SuiNSResult {
  const [name, setName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const suiClient = useSuiClient();

  useEffect(() => {
    if (!address || !suiClient) {
      setName(null);
      setIsLoading(false);
      setError(null);
      return;
    }

    const resolveName = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // For now, we'll use mock names since reverse resolution is not directly available
        // The @mysten/suins SDK is primarily for registration and forward resolution
        // TODO: Implement reverse resolution when available or use a different approach
        
        const mockName = getMockSuiNSName(address);
        setName(mockName);
        
        if (mockName) {
          console.log(`✅ SuiNS name: ${address.slice(0, 10)}...${address.slice(-8)} -> ${mockName}`);
        } else {
          console.log(`📍 No SuiNS name for: ${address.slice(0, 10)}...${address.slice(-8)}`);
        }
      } catch (err) {
        console.error('Error in SuiNS resolution:', err);
        setError(err instanceof Error ? err.message : 'Failed to resolve name');
        setName(null);
      } finally {
        setIsLoading(false);
      }
    };

    resolveName();
  }, [address, suiClient]);

  return { name, isLoading, error };
}

/**
 * Utility function to format an address with SuiNS name if available
 * @param address - The address to format
 * @param name - The SuiNS name (if available)
 * @param showFullAddress - Whether to show full address or truncated
 * @returns Formatted display string
 */
export function formatAddressWithName(
  address: string,
  name: string | null,
  showFullAddress: boolean = false
): string {
  if (name) {
    return name;
  }
  
  if (showFullAddress) {
    return address;
  }
  
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

/**
 * Function to manually add mock SuiNS names for specific addresses
 * Use this to add your test wallet addresses with their desired names
 */
export function addMockSuiNSName(address: string, name: string) {
  MOCK_SUINS_NAMES[address] = name;
  console.log(`✅ Mock SuiNS name added: ${address.slice(0, 10)}...${address.slice(-8)} -> ${name}`);
}

/**
 * Function to get all current mock mappings (for debugging)
 */
export function getMockSuiNSMappings() {
  return { ...MOCK_SUINS_NAMES };
}