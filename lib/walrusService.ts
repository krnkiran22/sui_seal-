/**
 * Walrus Storage Service with Seal Encryption
 * For encrypting and storing images on Walrus testnet
 */

import { SuiClient } from '@mysten/sui/client';
import { SealClient } from '@mysten/seal';
import { fromHex, toHex } from '@mysten/sui/utils';

export interface Wa  /**
   * Store an encrypted image file on Walrus with whitelist integration
   */
  async storeImage(file: File, userAddress?: string): Promise<EncryptionResult> {
    try {
      console.log('🔐 Starting encrypted image storage process...');
      console.log('📄 File:', file.name, file.size, 'bytes');
      
      if (userAddress) {
        console.log('👤 User Address:', userAddress);
      }sponse {
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

// Sui configuration
const SUI_CLIENT = new SuiClient({ url: 'https://fullnode.testnet.sui.io:443' });

// Your deployed whitelist contract details
const PACKAGE_ID = '0x75ca17f12a335945207502f250f396e96b17609b641696af4af097b26ea85df7';
const WHITELIST_OBJECT_ID = '0x1549b2b36e25f8b157b70571586bd3f7013111e8495adb3e0f4a70a0255d4e48';
const ADMIN_CAP_ID = '0x8c679ac66b27d009e187b50862c48bfd3e36a03137f72a729e6b1817dd6cfade';

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

export class WalrusService {
  private publisherUrl: string;
  private readonly aggregatorUrl: string;
  private readonly epochs: number;
  private testedPublishers: string[] = [];

  constructor(epochs: number = 1) {
    this.publisherUrl = WALRUS_PUBLISHERS[0]; // Start with first publisher
    this.aggregatorUrl = 'https://sui-walrus-tn-aggregator.bwarelabs.com';
    this.epochs = epochs;
    
    console.log('🐋 Walrus service initialized:', {
      publisher: this.publisherUrl,
      aggregator: this.aggregatorUrl,
      epochs: this.epochs,
      totalPublishers: WALRUS_PUBLISHERS.length
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
   * Get current publisher URL
   */
  getPublisherUrl(): string {
    return this.publisherUrl;
  }

  /**
   * Get list of tested publishers
   */
  getTestedPublishers(): string[] {
    return this.testedPublishers;
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
   * Store an encrypted image file on Walrus
   */
  async storeImage(file: File, userAddress?: string): Promise<EncryptionResult> {
    try {
      console.log('� Starting encrypted image storage process...');
      console.log('📄 File:', file.name, file.size, 'bytes');
      
      if (userAddress) {
        console.log('👤 User Address:', userAddress);
      }

      // Step 1: Generate encryption ID using the whitelist object ID
      const nonce = crypto.getRandomValues(new Uint8Array(5));
      const policyObjectBytes = fromHex(WHITELIST_OBJECT_ID);
      const encryptionId = toHex(new Uint8Array([...policyObjectBytes, ...nonce]));
      
      console.log('🔑 Generated Encryption ID:', encryptionId);

      // Step 2: Convert file to ArrayBuffer
      const arrayBuffer = await file.arrayBuffer();
      const fileData = new Uint8Array(arrayBuffer);
      
      console.log('📊 File converted to Uint8Array:', fileData.length, 'bytes');

      // Step 3: Encrypt with Seal
      console.log('🔒 Encrypting with Seal protocol...');
      const { encryptedObject: encryptedBytes } = await sealClient.encrypt({
        threshold: 2,
        packageId: PACKAGE_ID,
        id: encryptionId,
        data: fileData,
      });
      
      console.log('✅ Image encrypted successfully');
      console.log('📦 Encrypted data size:', encryptedBytes.length, 'bytes');

      // Step 4: Upload encrypted data to Walrus
      console.log('☁️ Uploading encrypted data to Walrus...');
      const storageInfo = await this.storeEncryptedData(encryptedBytes);
      
      if (!storageInfo) {
        throw new Error('Failed to upload encrypted data to Walrus storage');
      }

      console.log('🎉 Encrypted upload completed successfully!');
      
      // Step 5: Extract blob information
      let blobId: string;
      let suiRef: string;
      
      if ('alreadyCertified' in storageInfo.info) {
        blobId = storageInfo.info.alreadyCertified.blobId;
        suiRef = storageInfo.info.alreadyCertified.event.txDigest;
        console.log('📋 Status: Already certified');
      } else if ('newlyCreated' in storageInfo.info) {
        blobId = storageInfo.info.newlyCreated.blobObject.blobId;
        suiRef = storageInfo.info.newlyCreated.blobObject.id;
        console.log('📋 Status: Newly created');
      } else {
        console.error('Unhandled successful response!', storageInfo);
        throw new Error('Unexpected storage response format');
      }

      console.log('🆔 Blob ID:', blobId);
      console.log('🔗 Sui Reference:', suiRef);
      console.log('🔐 Encryption ID:', encryptionId);

      return {
        success: true,
        blobId,
        encryptionId,
        suiRef
      };

    } catch (error) {
      console.error('❌ Encrypted storage failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }

  /**
   * Store encrypted data on Walrus with automatic publisher selection
   */
  private async storeEncryptedData(encryptedData: Uint8Array): Promise<any> {
    try {
      console.log('📤 Uploading', encryptedData.length, 'bytes of encrypted data to Walrus...');
      
      // First attempt with current publisher
      let url = `${this.publisherUrl}/v1/blobs?epochs=${this.epochs}`;
      console.log('📤 Publishing encrypted blob to URL:', url);
      
      let response = await fetch(url, {
        method: 'PUT',
        body: new Uint8Array(encryptedData),
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
          body: new Uint8Array(encryptedData),
        });
      }

      if (response.status === 200) {
        const result = await response.json();
        console.log('📨 Walrus response for encrypted data:', result);
        console.log('✅ Successfully used publisher:', this.publisherUrl);
        return { info: result };
      } else {
        const errorText = await response.text();
        throw new Error(`Walrus encrypted upload failed: ${response.status} - ${errorText}`);
      }
    } catch (error) {
      console.error('❌ Walrus encrypted upload error:', error);
      throw error;
    }
  }

  /**
   * Store image data as ArrayBuffer on Walrus
   */
  async storeImageData(imageData: ArrayBuffer, contentType: string = 'image/jpeg'): Promise<string> {
    try {
      console.log('📤 Storing image data on Walrus:', {
        size: imageData.byteLength,
        type: contentType,
      });

      const response = await fetch(`${this.publisherUrl}/v1/blobs?epochs=${this.epochs}`, {
        method: 'PUT',
        headers: {
          'Content-Type': contentType,
        },
        body: imageData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to store on Walrus: ${response.status} - ${errorText}`);
      }

      const result: WalrusStoreResponse = await response.json();
      console.log('✅ Image data stored on Walrus:', result);

      // Extract blob ID from response
      if (result.newlyCreated) {
        return result.newlyCreated.blobObject.blobId;
      } else if (result.alreadyCertified) {
        return result.alreadyCertified.blobId;
      } else {
        throw new Error('Unexpected Walrus response format');
      }
    } catch (error) {
      console.error('❌ Error storing image data on Walrus:', error);
      throw error;
    }
  }

  /**
   * Retrieve and decrypt an image from Walrus by blob ID
   */
  async retrieveImage(blobId: string, encryptionId: string): Promise<Blob> {
    try {
      console.log('📥 Retrieving encrypted image from Walrus:', { blobId, encryptionId });

      // Step 1: Retrieve encrypted data from Walrus
      const response = await fetch(`${this.aggregatorUrl}/v1/blobs/${blobId}`);

      if (!response.ok) {
        throw new Error(`Failed to retrieve from Walrus: ${response.status}`);
      }

      const encryptedBlob = await response.blob();
      const encryptedData = new Uint8Array(await encryptedBlob.arrayBuffer());
      
      console.log('📦 Retrieved encrypted data:', {
        blobId,
        size: encryptedData.length,
      });

      // Step 2: Decrypt with Seal (simplified version - note: for full decryption, session key and transaction are needed)
      console.log('🔓 Decrypting with Seal protocol...');
      
      // For now, we'll throw an error since full decryption requires session key and transaction
      throw new Error('Full decryption requires session key and move call transaction. This is a simplified demo - encrypted data is stored securely but decryption needs additional wallet signatures.');
    } catch (error) {
      console.error('❌ Error retrieving and decrypting image from Walrus:', error);
      throw error;
    }
  }

  /**
   * Retrieve raw encrypted data from Walrus (for debugging)
   */
  async retrieveEncryptedImage(blobId: string): Promise<Blob> {
    try {
      console.log('📥 Retrieving raw encrypted data from Walrus:', { blobId });

      const response = await fetch(`${this.aggregatorUrl}/v1/blobs/${blobId}`);

      if (!response.ok) {
        throw new Error(`Failed to retrieve from Walrus: ${response.status}`);
      }

      const blob = await response.blob();
      console.log('✅ Raw encrypted data retrieved from Walrus:', {
        blobId,
        size: blob.size,
        type: blob.type,
      });

      return blob;
    } catch (error) {
      console.error('❌ Error retrieving encrypted data from Walrus:', error);
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
   * Convert File to Uint8Array
   */
  async fileToUint8Array(file: File): Promise<Uint8Array> {
    const arrayBuffer = await file.arrayBuffer();
    return new Uint8Array(arrayBuffer);
  }

  /**
   * Convert Blob to data URL for display
   */
  async blobToDataUrl(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }



  /**
   * Get current contract configuration
   */
  getContractConfig() {
    return {
      packageId: PACKAGE_ID,
      whitelistObjectId: WHITELIST_OBJECT_ID,
      adminCapId: ADMIN_CAP_ID
    };
  }
}