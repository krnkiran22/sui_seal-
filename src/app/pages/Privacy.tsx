import React from 'react';

export default function Policy() {
  return (
    <div className="p-6 py-20 max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Privacy Policy – SuiPatent dApp</h1>
      <p className="italic">Last updated: September 27, 2025</p>

      <p>
        SuiPatent is a decentralized patent protection platform built on the <strong>Sui blockchain</strong>. 
        This Privacy Policy explains how SuiPatent handles data when you use the dApp. Because SuiPatent is 
        <strong> decentralized and non-custodial</strong>, you retain ownership of your data and control who can access it.
      </p>

      <hr />

      <h2 className="text-2xl font-semibold">1. Data We Collect</h2>
      <ul className="list-disc list-inside space-y-1">
        <li><strong>Uploaded Content:</strong> Intellectual property (IP) files you upload (PDFs, images, up to 100MB). These files are encrypted on your device before storage.</li>
        <li><strong>Wallet Information:</strong> Public wallet addresses (Sui addresses) you connect to interact with the dApp.</li>
        <li><strong>SuiNS Identifiers:</strong> If you choose to use a SuiNS name (e.g., inventor.sui), it may be stored on-chain as part of NFT metadata.</li>
        <li><strong>Transaction Metadata:</strong> Document hashes, Walrus blob IDs, timestamps, and NFT details are immutably recorded on the Sui blockchain.</li>
        <li><strong>Whitelisted Wallets:</strong> Wallet addresses you authorize for decryption/verification.</li>
      </ul>
      <p>We do <strong>not</strong> collect private keys, passwords, or sensitive identifying information.</p>

      <hr />

      <h2 className="text-2xl font-semibold">2. How Data Is Used</h2>
      <ul className="list-disc list-inside space-y-1">
        <li><strong>Encryption & Storage:</strong> Uploaded documents are encrypted client-side using <strong>Seal</strong> before being stored on <strong>Walrus</strong>.</li>
        <li><strong>Verification & Attestation:</strong> <strong>Nautilus</strong> is used to verify file integrity and record attestations on-chain.</li>
        <li><strong>NFT Minting:</strong> Encrypted files are referenced via blob IDs in NFT metadata to serve as a proof of ownership.</li>
        <li><strong>Whitelisting:</strong> Only wallets explicitly added by you can decrypt and access documents.</li>
        <li><strong>Branding:</strong> Your chosen <strong>SuiNS</strong> name may be displayed in association with your NFT.</li>
      </ul>

      <hr />

      <h2 className="text-2xl font-semibold">3. Data Sharing</h2>
      <ul className="list-disc list-inside space-y-1">
        <li><strong>Blockchain Transparency:</strong> Certain information (wallet addresses, NFT metadata, whitelists, blob IDs) is public on the Sui blockchain and cannot be removed.</li>
        <li><strong>Authorized Access:</strong> Only whitelisted wallets (e.g., patent offices, courts) can decrypt encrypted files via Seal.</li>
        <li><strong>Third-Party SDKs:</strong> SuiPatent integrates third-party SDKs (Seal, Walrus, Nautilus, SuiNS). Their privacy practices apply.</li>
      </ul>

      <hr />

      <h2 className="text-2xl font-semibold">4. Your Rights & Control</h2>
      <ul className="list-disc list-inside space-y-1">
        <li><strong>Ownership:</strong> You remain the sole owner of your uploaded content.</li>
        <li><strong>Access Control:</strong> You decide which wallets are whitelisted and can revoke access at any time (on-chain).</li>
        <li><strong>Portability:</strong> Because SuiPatent uses open blockchain standards, your NFTs and blob IDs are portable across wallets and platforms.</li>
        <li><strong>No Central Custody:</strong> We do not store, control, or have the ability to modify or delete your encrypted files.</li>
      </ul>

      <hr />

      <h2 className="text-2xl font-semibold">5. Security</h2>
      <ul className="list-disc list-inside space-y-1">
        <li><strong>End-to-End Encryption:</strong> Files are encrypted <strong>before leaving your device</strong> using Seal.</li>
        <li><strong>Decentralized Storage:</strong> Files are stored on <strong>Walrus</strong>, a decentralized storage layer.</li>
        <li><strong>Non-Custodial Design:</strong> We never have access to your private keys or decrypted files.</li>
        <li><strong>Gas Costs Only:</strong> Interactions incur only blockchain gas fees; we do not charge or store payment details.</li>
      </ul>

      <hr />

      <h2 className="text-2xl font-semibold">6. Children’s Privacy</h2>
      <p>
        SuiPatent is intended for creators and professionals. It is not directed toward individuals under the age of 18. 
        If you are a parent or guardian and believe your child has used SuiPatent, you may request blockchain whitelisting removal, 
        though data recorded on-chain cannot be erased.
      </p>

      <hr />

      <h2 className="text-2xl font-semibold">7. Limitations</h2>
      <ul className="list-disc list-inside space-y-1">
        <li><strong>Immutable Data:</strong> On-chain data (wallets, blob IDs, NFT records) cannot be deleted.</li>
        <li><strong>Third-Party Risks:</strong> Patent offices or other whitelisted entities are responsible for their own data handling.</li>
        <li><strong>Patent Office Acceptance:</strong> NFT-based “Patent Proofs” are designed for prior art and IP protection but may not be recognized by all jurisdictions.</li>
      </ul>

      <hr />

      <h2 className="text-2xl font-semibold">8. Updates to This Policy</h2>
      <p>
        We may update this Privacy Policy to reflect technical, legal, or community governance changes. Updates will be posted publicly via the SuiPatent GitHub repository and project documentation.
      </p>

      <hr />

      <h2 className="text-2xl font-semibold">9. Contact</h2>
      <p>
        For questions, issues, or feedback regarding privacy in SuiPatent, you may reach out through:
      </p>
      <p>
        📧 <a href="mailto:fortiv.pvt.ltd@gmail.com" className="text-blue-600 underline">fortiv.pvt.ltd@gmail.com</a><br />
        🌐 <a href="https://github.com/EmmanuellDev/walrus-front" className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">https://github.com/EmmanuellDev/walrus-front</a>
      </p>

      <hr />

      <p><em>End of Privacy Policy</em></p>
    </div>
  );
}