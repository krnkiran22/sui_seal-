/// Document Verification NFT Contract
/// Mints NFTs when documents are uploaded to Walrus storage
/// NFT metadata includes wallet address (or SuiNS name), blob ID, and timestamp
module whitelist::document_nft {
    use sui::object::{UID, ID};
    use sui::tx_context::{TxContext, sender};
    use sui::transfer;
    use sui::event;
    use sui::url::{Self, Url};
    use sui::display::{Self, Display};
    use sui::package::Publisher;
    use std::string::{Self, String};
    use sui::clock::{Self, Clock};

    // Error codes
    const EInvalidBlobId: u64 = 1;
    const EEmptyMetadata: u64 = 2;
    const EInvalidTimestamp: u64 = 3;

    /// Document Verification NFT
    public struct DocumentNFT has key, store {
        id: UID,
        /// Wallet address or SuiNS name of the document owner
        wallet_address: String,
        /// Blob ID from Walrus storage
        blob_id: String,
        /// Timestamp when document was verified and uploaded
        timestamp: u64,
        /// Image URL for the NFT
        image_url: Url,
        /// Document name/title
        name: String,
        /// Description of the document
        description: String,
        /// MIME type of the original document
        doc_type: String,
        /// Size of the document in bytes
        doc_size: u64,
    }

    /// One-time witness for creating Display
    public struct DOCUMENT_NFT has drop {}

    // Events
    public struct NFTMinted has copy, drop {
        nft_id: ID,
        wallet_address: String,
        blob_id: String,
        timestamp: u64,
        minted_by: address,
    }

    /// Initialize function to set up the NFT display
    fun init(otw: DOCUMENT_NFT, ctx: &mut TxContext) {
        let keys = vector[
            string::utf8(b"name"),
            string::utf8(b"description"),
            string::utf8(b"image_url"),
            string::utf8(b"wallet_address"),
            string::utf8(b"blob_id"),
            string::utf8(b"timestamp"),
            string::utf8(b"doc_type"),
            string::utf8(b"doc_size"),
        ];

        let values = vector[
            string::utf8(b"Document Verification Certificate #{name}"),
            string::utf8(b"This NFT certifies the secure upload and verification of document '{name}' to Walrus storage. Blob ID: {blob_id} | Owner: {wallet_address} | Verified: {timestamp}"),
            string::utf8(b"{image_url}"),
            string::utf8(b"{wallet_address}"),
            string::utf8(b"{blob_id}"),
            string::utf8(b"{timestamp}"),
            string::utf8(b"{doc_type}"),
            string::utf8(b"{doc_size} bytes"),
        ];

        let publisher = sui::package::claim(otw, ctx);
        let mut display = sui::display::new_with_fields<DocumentNFT>(
            &publisher, keys, values, ctx
        );

        display::update_version(&mut display);

        transfer::public_transfer(publisher, sender(ctx));
        transfer::public_transfer(display, sender(ctx));
    }

    /// Mint a new Document Verification NFT
    public fun mint_document_nft(
        wallet_address: String,
        blob_id: String,
        clock: &Clock,
        name: String,
        description: String,
        doc_type: String,
        doc_size: u64,
        ctx: &mut TxContext
    ): DocumentNFT {
        // Validation
        assert!(!string::is_empty(&wallet_address), EEmptyMetadata);
        assert!(!string::is_empty(&blob_id), EInvalidBlobId);
        assert!(!string::is_empty(&name), EEmptyMetadata);

        let timestamp = clock::timestamp_ms(clock);
        
        // Use the provided image URL for all NFTs
        let image_url = url::new_unsafe_from_bytes(
            b"https://imgs.search.brave.com/-9LoRSi_lck1m78j6cS-DZIFsw4dv5FvVk-72jFP2nE/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9sb2dv/ZGl4LmNvbS9sb2dv/LzIwNTgyMjcuanBn"
        );

        let nft = DocumentNFT {
            id: object::new(ctx),
            wallet_address,
            blob_id,
            timestamp,
            image_url,
            name,
            description,
            doc_type,
            doc_size,
        };

        // Emit event
        event::emit(NFTMinted {
            nft_id: object::id(&nft),
            wallet_address: nft.wallet_address,
            blob_id: nft.blob_id,
            timestamp: nft.timestamp,
            minted_by: sender(ctx),
        });

        nft
    }

    /// Public entry function to mint and transfer NFT to the uploader
    public entry fun mint_and_transfer_nft(
        wallet_address: String,
        blob_id: String,
        clock: &Clock,
        name: String,
        description: String,
        doc_type: String,
        doc_size: u64,
        recipient: address,
        ctx: &mut TxContext
    ) {
        let nft = mint_document_nft(
            wallet_address,
            blob_id,
            clock,
            name,
            description,
            doc_type,
            doc_size,
            ctx
        );

        // Transfer the NFT to the recipient (usually the document uploader)
        transfer::public_transfer(nft, recipient);
    }

    /// Get NFT metadata
    public fun get_nft_metadata(nft: &DocumentNFT): (String, String, u64, String) {
        (nft.wallet_address, nft.blob_id, nft.timestamp, nft.name)
    }

    /// Get NFT blob ID
    public fun get_blob_id(nft: &DocumentNFT): String {
        nft.blob_id
    }

    /// Get NFT wallet address
    public fun get_wallet_address(nft: &DocumentNFT): String {
        nft.wallet_address
    }

    /// Get NFT timestamp
    public fun get_timestamp(nft: &DocumentNFT): u64 {
        nft.timestamp
    }

    /// Get NFT image URL
    public fun get_image_url(nft: &DocumentNFT): Url {
        nft.image_url
    }

    /// Get document type
    public fun get_doc_type(nft: &DocumentNFT): String {
        nft.doc_type
    }

    /// Get document size
    public fun get_doc_size(nft: &DocumentNFT): u64 {
        nft.doc_size
    }

    /// Update NFT description (only by current owner)
    public entry fun update_description(
        nft: &mut DocumentNFT,
        new_description: String,
        ctx: &mut TxContext
    ) {
        nft.description = new_description;
    }

    #[test_only]
    public fun init_for_testing(ctx: &mut TxContext) {
        init(DOCUMENT_NFT {}, ctx);
    }
}