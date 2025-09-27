/// Simple Whitelist Contract for Seal Decryption Access
/// Allows specific addresses to decrypt encrypted blobs using their encryption IDs
/// Admin can add/remove addresses from whitelist
/// Modified to support multiple admin capabilities
module whitelist::simple_whitelist {

use sui::object::{Self, UID, ID};
use sui::tx_context::{Self, TxContext};
use sui::table::{Self, Table};
use sui::transfer;
use sui::event;
use std::vector;

// Error codes
const ENoAccess: u64 = 1;
const EInvalidCap: u64 = 2;
const EDuplicate: u64 = 3;
const ENotInWhitelist: u64 = 4;

/// Whitelist object to store authorized addresses
public struct Whitelist has key {
    id: UID,
    /// Addresses that can decrypt blobs
    authorized_addresses: Table<address, bool>,
    /// Primary admin address (deployer)
    admin: address,
    /// Secondary admin address (configured address)
    secondary_admin: address,
}

/// Admin capability for whitelist management
public struct AdminCap has key {
    id: UID,
    whitelist_id: ID,
    /// Address that owns this capability
    owner: address,
}

// Events
public struct AddressWhitelisted has copy, drop {
    whitelist_id: ID,
    address: address,
    added_by: address,
}

public struct AddressRemoved has copy, drop {
    whitelist_id: ID,
    address: address,
    removed_by: address,
}

/// Initialize function - automatically called when contract is deployed
/// Creates admin capabilities for both deployer and configured address
fun init(ctx: &mut TxContext) {
    let deployer = tx_context::sender(ctx);
    // The configured admin address
    let configured_admin = @0x0129fc626e3656cfa624cb324826dd5e60782d6f309d11a4450ebde0d974e0a5;
    
    let whitelist = Whitelist {
        id: object::new(ctx),
        authorized_addresses: table::new(ctx),
        admin: deployer,
        secondary_admin: configured_admin,
    };
    
    let whitelist_id = object::id(&whitelist);
    
    // Create admin capability for deployer
    let deployer_cap = AdminCap {
        id: object::new(ctx),
        whitelist_id,
        owner: deployer,
    };
    
    // Create admin capability for configured address
    let configured_cap = AdminCap {
        id: object::new(ctx),
        whitelist_id,
        owner: configured_admin,
    };
    
    // Share the whitelist object so anyone can read it
    transfer::share_object(whitelist);
    
    // Transfer admin capabilities to respective owners
    transfer::transfer(deployer_cap, deployer);
    transfer::transfer(configured_cap, configured_admin);
}

/// Create whitelist with admin capability (for manual creation)
public fun create_whitelist(ctx: &mut TxContext): (AdminCap, Whitelist) {
    let admin = tx_context::sender(ctx);
    
    let whitelist = Whitelist {
        id: object::new(ctx),
        authorized_addresses: table::new(ctx),
        admin,
        secondary_admin: admin, // Same as primary if manually created
    };
    
    let cap = AdminCap {
        id: object::new(ctx),
        whitelist_id: object::id(&whitelist),
        owner: admin,
    };
    
    (cap, whitelist)
}

/// Add address to whitelist (admin only)
/// Can be called by either admin capability owner
public entry fun add_address(
    whitelist: &mut Whitelist,
    cap: &AdminCap,
    address_to_add: address,
    ctx: &TxContext
) {
    // Verify this is a valid admin cap for this whitelist
    assert!(cap.whitelist_id == object::id(whitelist), EInvalidCap);
    
    // Verify the caller owns this admin capability
    let caller = tx_context::sender(ctx);
    assert!(cap.owner == caller, ENoAccess);
    
    // Verify caller is one of the authorized admins
    assert!(caller == whitelist.admin || caller == whitelist.secondary_admin, ENoAccess);
    
    // Check for duplicates
    assert!(!table::contains(&whitelist.authorized_addresses, address_to_add), EDuplicate);
    
    table::add(&mut whitelist.authorized_addresses, address_to_add, true);
    
    event::emit(AddressWhitelisted {
        whitelist_id: object::id(whitelist),
        address: address_to_add,
        added_by: caller,
    });
}

/// Remove address from whitelist (admin only)
/// Can be called by either admin capability owner
public entry fun remove_address(
    whitelist: &mut Whitelist,
    cap: &AdminCap,
    address_to_remove: address,
    ctx: &TxContext
) {
    // Verify this is a valid admin cap for this whitelist
    assert!(cap.whitelist_id == object::id(whitelist), EInvalidCap);
    
    // Verify the caller owns this admin capability
    let caller = tx_context::sender(ctx);
    assert!(cap.owner == caller, ENoAccess);
    
    // Verify caller is one of the authorized admins
    assert!(caller == whitelist.admin || caller == whitelist.secondary_admin, ENoAccess);
    
    // Check if address exists in whitelist
    assert!(table::contains(&whitelist.authorized_addresses, address_to_remove), ENotInWhitelist);
    
    table::remove(&mut whitelist.authorized_addresses, address_to_remove);
    
    event::emit(AddressRemoved {
        whitelist_id: object::id(whitelist),
        address: address_to_remove,
        removed_by: caller,
    });
}

/// Check if address is whitelisted
public fun is_whitelisted(
    whitelist: &Whitelist,
    address: address
): bool {
    table::contains(&whitelist.authorized_addresses, address)
}

/// Seal approval function - called by Seal network to verify access
/// Only whitelisted addresses can decrypt blobs
entry fun seal_approve(
    encryption_id: vector<u8>,
    whitelist: &Whitelist,
    ctx: &TxContext
) {
    let caller = tx_context::sender(ctx);
    assert!(table::contains(&whitelist.authorized_addresses, caller), ENoAccess);
}

/// Check if caller can access document (for frontend validation)
public fun can_access_document(
    whitelist: &Whitelist,
    caller: address,
    _encryption_id: vector<u8>
): bool {
    table::contains(&whitelist.authorized_addresses, caller)
}

/// Get primary admin address
public fun get_admin(whitelist: &Whitelist): address {
    whitelist.admin
}

/// Get secondary admin address
public fun get_secondary_admin(whitelist: &Whitelist): address {
    whitelist.secondary_admin
}

/// Check if address is an admin (primary or secondary)
public fun is_admin(whitelist: &Whitelist, address: address): bool {
    address == whitelist.admin || address == whitelist.secondary_admin
}

/// Get all admin addresses
public fun get_all_admins(whitelist: &Whitelist): (address, address) {
    (whitelist.admin, whitelist.secondary_admin)
}

#[test_only]
public fun destroy_for_testing(whitelist: Whitelist, cap: AdminCap) {
    let Whitelist { id, authorized_addresses, admin: _, secondary_admin: _ } = whitelist;
    table::drop(authorized_addresses);
    object::delete(id);
    
    let AdminCap { id, whitelist_id: _, owner: _ } = cap;
    object::delete(id);
}

}