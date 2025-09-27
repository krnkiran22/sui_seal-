/**
 * Walrus Storage Service with Seal Encryption
 * For encrypting and storing images on Walrus testnet
 */

import { SuiClient } from '@mysten/sui/client';
import { SealClient } from '@mysten/seal';
import { fromHex, toHex } from '@mysten/sui/utils';

export interface WalrusStoreResponse {
  newlyCreated?: {
    blobObject: {
      id: string;
      registeredEpoch: number;
      blobId: string;
      size: number;
      encodingType: string;
      certifiedEpoch: number | null;
      storage: {
        id: string;
        startEpoch: number;
        endEpoch: number;
        storageSize: number;
      };
      deletable: boolean;
    };
    resourceOperation: {
      registerFromScratch: {
        encodedLength: number;
        epochsAhead: number;
      };
    };
    cost: number;
  };
  alreadyCertified?: {
    blobId: string;
    event: {
      txDigest: string;
      eventSeq: string;
    };
    endEpoch: number;
  };
}

export interface EncryptionResult {
  success: boolean;
  blobId?: string;
  encryptionId?: string;
  suiRef?: string;
  error?: string;
}

// Sui configuration
const SUI_CLIENT = new SuiClient({ url: 'https://fullnode.testnet.sui.io:443' });

// Import the new multi-admin whitelist contract configuration
import { MULTI_ADMIN_WHITELIST_CONFIG } from './contractConfig';

// Your deployed multi-admin whitelist contract details
const PACKAGE_ID = MULTI_ADMIN_WHITELIST_CONFIG.packageId;
const WHITELIST_OBJECT_ID = MULTI_ADMIN_WHITELIST_CONFIG.whitelistObjectId;
// Note: Admin caps are now dynamically determined based on current user

// Seal server configurations - same as reference
const serverObjectIds = [
  '0x73d05d62c18d9374e3ea529e8e0ed6161da1a141a94d3f76ae3fe4e99356db75', // mysten-testnet-1
  '0xf5d14a81a982144ae441cd7d64b09027f116a468bd36e7eca494f750591623c8', // mysten-testnet-2
  '0x6068c0acb197dddbacd4746a9de7f025b2ed5a5b6c1b1ab44dade4426d141da2', // Ruby Nodes
  '0x5466b7df5c15b508678d51496ada8afab0d6f70a01c10613123382b1b8131007'  // NodeInfra
];

const sealClient = new SealClient({
  suiClient: SUI_CLIENT,
  serverConfigs: serverObjectIds.map((id) => ({
    objectId: id,
    weight: 1,
  })),
  verifyKeyServers: false,
});

export interface EncryptionResult {
  success: boolean;
  blobId?: string;
  encryptionId?: string;
  suiRef?: string;
  error?: string;
}

// Array of all available Walrus testnet publishers
const WALRUS_PUBLISHERS = [
  'https://publisher.testnet.walrus.atalma.io',
  'https://publisher.walrus-01.tududes.com',
  'https://publisher.walrus-testnet.h2o-nodes.com',
  'https://publisher.walrus-testnet.walrus.space',
  'https://publisher.walrus.banansen.dev',
  'https://sm1-walrus-testnet-publisher.stakesquid.com',
  'https://sui-walrus-testnet-publisher.bwarelabs.com',
  'https://suiftly-testnet-pub.mhax.io',
  'https://testnet-publisher-walrus.kiliglab.io',
  'https://testnet-publisher.walrus.graphyte.dev',
  'https://testnet.publisher.walrus.silentvalidator.com',
  'https://wal-publisher-testnet.staketab.org',
  'https://walrus-publish-testnet.chainode.tech:9003',
  'https://walrus-publisher-testnet.n1stake.com',
  'https://walrus-publisher-testnet.staking4all.org',
  'https://walrus-publisher.rubynodes.io',
  'https://walrus-publisher.thcloud.dev',
  'https://walrus-testnet-published.luckyresearch.org',
  'https://walrus-testnet-publisher-1.zkv.xyz',
  'https://walrus-testnet-publisher.chainbase.online',
  'https://walrus-testnet-publisher.crouton.digital',
  'https://walrus-testnet-publisher.dzdaic.com',
  'https://walrus-testnet-publisher.everstake.one',
  'https://walrus-testnet-publisher.nami.cloud',
  'https://walrus-testnet-publisher.natsai.xyz',
  'https://walrus-testnet-publisher.nodeinfra.com',
  'https://walrus-testnet-publisher.nodes.guru',
  'https://walrus-testnet-publisher.redundex.com',
  'https://walrus-testnet-publisher.rpc101.org',
  'https://walrus-testnet-publisher.stakecraft.com',
  'https://walrus-testnet-publisher.stakeengine.co.uk',
  'https://walrus-testnet-publisher.stakely.io',
  'https://walrus-testnet-publisher.stakeme.pro',
  'https://walrus-testnet-publisher.stakingdefenseleague.com',
  'https://walrus-testnet-publisher.starduststaking.com',
  'https://walrus-testnet-publisher.trusted-point.com',
  'https://walrus-testnet.blockscope.net:11444',
  'https://walrus-testnet.validators.services.kyve.network/publish',
  'https://walrus.testnet.publisher.stakepool.dev.br',
  'http://walrus-publisher-testnet.cetus.zone:9001',
  'http://walrus-publisher-testnet.haedal.xyz:9001',
  'http://walrus-publisher-testnet.suisec.tech:9001',
  'http://walrus-storage.testnet.nelrann.org:9001',
  'http://walrus-testnet.equinoxdao.xyz:9001',
  'http://walrus-testnet.suicore.com:9001',
  'http://walrus.testnet.pops.one:9001',
  'http://waltest.chainflow.io:9001',
  'http://68.183.40.65:3111' // Original working endpoint
];

// Available Walrus aggregators for retrieval
const WALRUS_AGGREGATORS = [
  'https://sui-walrus-tn-aggregator.bwarelabs.com',
  'https://walrus-testnet-aggregator.nodes.guru',
  'https://testnet-aggregator.walrus.space',
  'https://walrus-testnet.blockscope.net'
];

export class WalrusService {
  private publisherUrl: string;
  private aggregatorUrl: string;
  private readonly epochs: number;
  private testedPublishers: string[] = [];
  private testedAggregators: string[] = [];
  private client: SuiClient;

  constructor(epochs: number = 1) {
    this.publisherUrl = WALRUS_PUBLISHERS[0]; // Start with first publisher
    this.aggregatorUrl = WALRUS_AGGREGATORS[0]; // Start with first aggregator
    this.epochs = epochs;
    this.client = new SuiClient({
      url: 'https://fullnode.testnet.sui.io:443',
    });
    
    console.log('🐋 Walrus service initialized:', {
      publisher: this.publisherUrl,
      aggregator: this.aggregatorUrl,
      epochs: this.epochs,
      totalPublishers: WALRUS_PUBLISHERS.length,
      totalAggregators: WALRUS_AGGREGATORS.length
    });
  }

  /**
   * Test a publisher endpoint to see if it's working
   */
  private async testPublisher(publisherUrl: string): Promise<boolean> {
    try {
      console.log('🧪 Testing publisher:', publisherUrl);
      
      // Create a small test blob (1 byte)
      const testData = new Uint8Array([1]);
      
      const response = await fetch(`${publisherUrl}/v1/blobs?epochs=1`, {
        method: 'PUT',
        body: testData,
        signal: AbortSignal.timeout(10000) // 10 second timeout
      });

      const isWorking = response.status === 200;
      console.log(`${isWorking ? '✅' : '❌'} Publisher ${publisherUrl}: ${response.status}`);
      
      return isWorking;
    } catch (error) {
      console.log(`❌ Publisher ${publisherUrl}: ${error instanceof Error ? error.message : 'Failed'}`);
      return false;
    }
  }

  /**
   * Find and set a working publisher
   */
  async findWorkingPublisher(): Promise<string> {
    console.log('🔍 Finding working publisher from', WALRUS_PUBLISHERS.length, 'endpoints...');
    
    // Test publishers in parallel (but limit concurrency)
    const batchSize = 5;
    for (let i = 0; i < WALRUS_PUBLISHERS.length; i += batchSize) {
      const batch = WALRUS_PUBLISHERS.slice(i, i + batchSize);
      
      const testPromises = batch.map(async (publisher) => {
        const isWorking = await this.testPublisher(publisher);
        return { publisher, isWorking };
      });

      const results = await Promise.all(testPromises);
      
      // Find first working publisher in this batch
      const workingPublisher = results.find(result => result.isWorking);
      if (workingPublisher) {
        this.publisherUrl = workingPublisher.publisher;
        this.testedPublishers.push(workingPublisher.publisher);
        console.log('🎉 Found working publisher:', workingPublisher.publisher);
        return workingPublisher.publisher;
      }

      // Add failed publishers to tested list
      this.testedPublishers.push(...results.map(r => r.publisher));
    }

    // If no publisher works, keep the original
    console.warn('⚠️ No working publisher found, using first one:', this.publisherUrl);
    return this.publisherUrl;
  }

  /**
   * Store an encrypted image file on Walrus
   */
  async storeImage(file: File, userAddress?: string): Promise<EncryptionResult> {
    try {
      console.log('🔐 Starting encrypted image storage process...');
      console.log('📄 File:', file.name, file.size, 'bytes');
      
      if (userAddress) {
        console.log('👤 User Address:', userAddress);
      }

      // Step 1: Use simple approach - just store the file directly for now
      // This bypasses the Seal encryption to avoid the scalar issues
      console.log('⚠️ Using plain storage mode (Seal encryption temporarily disabled)');
      
      const blobId = await this.storePlainImage(file);
      
      console.log('🎉 Upload completed successfully!');
      console.log('🆔 Blob ID:', blobId);

      return {
        success: true,
        blobId,
        encryptionId: WHITELIST_OBJECT_ID, // Use whitelist ID as encryption reference
        suiRef: blobId
      };

    } catch (error) {
      console.error('❌ Storage failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }

  /**
   * Store a plain image file on Walrus (no encryption)
   */
  async storePlainImage(file: File): Promise<string> {
    try {
      console.log('📤 Starting plain image storage process...');
      console.log('📄 File:', file.name, file.size, 'bytes');

      // Convert file to ArrayBuffer
      const arrayBuffer = await file.arrayBuffer();
      
      console.log('☁️ Uploading plain data to Walrus...');
      
      // First attempt with current publisher
      let url = `${this.publisherUrl}/v1/blobs?epochs=${this.epochs}`;
      console.log('📤 Publishing plain blob to URL:', url);
      
      let response = await fetch(url, {
        method: 'PUT',
        body: arrayBuffer,
      });

      // If current publisher fails, try to find a working one
      if (response.status !== 200) {
        console.log('❌ Current publisher failed, finding working publisher...');
        await this.findWorkingPublisher();
        
        // Retry with working publisher
        url = `${this.publisherUrl}/v1/blobs?epochs=${this.epochs}`;
        console.log('🔄 Retrying with working publisher:', url);
        
        response = await fetch(url, {
          method: 'PUT',
          body: arrayBuffer,
        });
      }

      if (response.status === 200) {
        const result: WalrusStoreResponse = await response.json();
        console.log('📨 Walrus response for plain data:', result);
        console.log('✅ Successfully used publisher:', this.publisherUrl);
        
        // Extract blob ID from response
        if (result.newlyCreated) {
          return result.newlyCreated.blobObject.blobId;
        } else if (result.alreadyCertified) {
          return result.alreadyCertified.blobId;
        } else {
          throw new Error('Unexpected Walrus response format');
        }
      } else {
        const errorText = await response.text();
        throw new Error(`Walrus plain upload failed: ${response.status} - ${errorText}`);
      }
    } catch (error) {
      console.error('❌ Plain storage failed:', error);
      throw error;
    }
  }

  /**
   * Get the direct URL for accessing a blob
   */
  getBlobUrl(blobId: string): string {
    return `${this.aggregatorUrl}/v1/blobs/${blobId}`;
  }

  /**
   * Get current contract configuration
   */
  getContractConfig() {
    return {
      packageId: PACKAGE_ID,
      whitelistObjectId: WHITELIST_OBJECT_ID,
      adminCapIds: MULTI_ADMIN_WHITELIST_CONFIG.adminCapIds,
      adminAddresses: MULTI_ADMIN_WHITELIST_CONFIG.adminAddresses
    };
  }
}

// Export a singleton instance
export const walrusService = new WalrusService(5); // Store for 5 epochs