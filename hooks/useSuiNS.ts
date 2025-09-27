import { useState, useEffect } from 'react';
import { useSuiClient } from '@mysten/dapp-kit';
import { SuinsClient } from '@suins/toolkit';

export interface SuiNSResult {
  name: string | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * Hook to resolve SuiNS names for addresses
 * @param address - The Sui address to resolve
 * @returns Object with name, loading state, and error
 */
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
        const suinsClient = new SuinsClient({
          client: suiClient,
          network: 'testnet' // or 'mainnet' based on your network
        });

        const result = await suinsClient.getName(address);
        setName(result || null);
      } catch (err) {
        console.error('Error resolving SuiNS name:', err);
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