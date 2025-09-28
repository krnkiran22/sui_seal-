import { SuiClient } from '@mysten/sui/client';
import { Transaction } from '@mysten/sui/transactions';
import { WalletAccount } from '@mysten/wallet-standard';

// NFT Contract Configuration
export const NFT_CONTRACT_CONFIG = {
  PACKAGE_ID: '0x8e7ff481c57b84777c58f9003a7aabb90205f5329f547e8bd564adc52f91a387', // Document NFT Contract
  MODULE_NAME: 'document_nft',
  FUNCTION_NAME: 'mint_and_transfer_nft',
  NETWORK: 'testnet',
  RPC_URL: 'https://fullnode.testnet.sui.io:443',
  CLOCK_OBJECT_ID: '0x6', // Sui Clock object ID
};

export interface NFTMetadata {
  wallet_address: string;
  blob_id: string;
  timestamp: string;
  name: string;
  description: string;
  doc_type: string;
  doc_size: number;
}

export interface MintNFTParams {
  walletAddress: string;
  suiNSName?: string;
  blobId: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  currentAccount: WalletAccount;
}

export interface MintNFTResult {
  success: boolean;
  transactionDigest?: string;
  nftId?: string;
  error?: string;
}

class DocumentNFTService {
  private client: SuiClient;

  constructor() {
    this.client = new SuiClient({
      url: NFT_CONTRACT_CONFIG.RPC_URL,
    });
  }

  /**
   * Mint a Document Verification NFT after successful file upload
   */
  async mintDocumentNFT(params: MintNFTParams): Promise<MintNFTResult> {
    try {
      console.log('🎨 Starting NFT minting process...', params);

      const {
        walletAddress,
        suiNSName,
        blobId,
        fileName,
        fileType,
        fileSize,
        currentAccount,
      } = params;

      // Use SuiNS name if available, otherwise use wallet address
      const displayAddress = suiNSName || walletAddress;

      // Create transaction
      const tx = new Transaction();

      // Prepare NFT metadata
      const nftName = `Document: ${fileName}`;
      const nftDescription = `Verified document uploaded to Walrus storage by ${displayAddress}. This NFT serves as proof of ownership and verification timestamp.`;
      
      // Call the mint_and_transfer_nft function
      tx.moveCall({
        target: `${NFT_CONTRACT_CONFIG.PACKAGE_ID}::${NFT_CONTRACT_CONFIG.MODULE_NAME}::${NFT_CONTRACT_CONFIG.FUNCTION_NAME}`,
        arguments: [
          tx.pure.string(displayAddress), // wallet_address (or SuiNS name)
          tx.pure.string(blobId), // blob_id
          tx.sharedObjectRef({
            objectId: NFT_CONTRACT_CONFIG.CLOCK_OBJECT_ID,
            initialSharedVersion: 1,
            mutable: false,
          }), // clock
          tx.pure.string(nftName), // name
          tx.pure.string(nftDescription), // description
          tx.pure.string(fileType), // doc_type
          tx.pure.u64(fileSize), // doc_size
          tx.pure.address(currentAccount.address), // recipient
        ],
      });

      console.log('📋 Transaction prepared for NFT minting');
      console.log('Metadata:', {
        wallet_address: displayAddress,
        blob_id: blobId,
        name: nftName,
        description: nftDescription,
        doc_type: fileType,
        doc_size: fileSize,
      });

      return {
        success: true,
        // Note: The actual signing and execution will be handled by the wallet
        // We return the transaction object for the frontend to execute
        transactionDigest: 'PENDING_EXECUTION',
      };
    } catch (error) {
      console.error('❌ NFT minting failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Get NFT details by object ID
   */
  async getNFTDetails(nftId: string) {
    try {
      const nftObject = await this.client.getObject({
        id: nftId,
        options: {
          showContent: true,
          showDisplay: true,
          showType: true,
        },
      });

      if (!nftObject.data) {
        throw new Error('NFT not found');
      }

      return {
        success: true,
        data: nftObject.data,
      };
    } catch (error) {
      console.error('❌ Failed to get NFT details:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Get all NFTs owned by a specific address
   */
  async getNFTsByOwner(ownerAddress: string) {
    try {
      const ownedObjects = await this.client.getOwnedObjects({
        owner: ownerAddress,
        filter: {
          StructType: `${NFT_CONTRACT_CONFIG.PACKAGE_ID}::${NFT_CONTRACT_CONFIG.MODULE_NAME}::DocumentNFT`,
        },
        options: {
          showContent: true,
          showDisplay: true,
          showType: true,
        },
      });

      return {
        success: true,
        nfts: ownedObjects.data,
      };
    } catch (error) {
      console.error('❌ Failed to get user NFTs:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        nfts: [],
      };
    }
  }

  /**
   * Prepare transaction for signing (returns Transaction object)
   */
  async prepareMintTransaction(params: MintNFTParams): Promise<Transaction> {
    const {
      walletAddress,
      suiNSName,
      blobId,
      fileName,
      fileType,
      fileSize,
      currentAccount,
    } = params;

    const displayAddress = suiNSName || walletAddress;
    const nftName = `Document: ${fileName}`;
    const nftDescription = `Verified document uploaded to Walrus storage by ${displayAddress}. This NFT serves as proof of ownership and verification timestamp.`;

    const tx = new Transaction();

    tx.moveCall({
      target: `${NFT_CONTRACT_CONFIG.PACKAGE_ID}::${NFT_CONTRACT_CONFIG.MODULE_NAME}::${NFT_CONTRACT_CONFIG.FUNCTION_NAME}`,
      arguments: [
        tx.pure.string(displayAddress),
        tx.pure.string(blobId),
        tx.sharedObjectRef({
          objectId: NFT_CONTRACT_CONFIG.CLOCK_OBJECT_ID,
          initialSharedVersion: 1,
          mutable: false,
        }),
        tx.pure.string(nftName),
        tx.pure.string(nftDescription),
        tx.pure.string(fileType),
        tx.pure.u64(fileSize),
        tx.pure.address(currentAccount.address),
      ],
    });

    return tx;
  }
}

export const documentNFTService = new DocumentNFTService();
export default documentNFTService;