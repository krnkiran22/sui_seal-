import React from 'react';

export default function TermsOfService() {
  return (
    <div className="p-6 max-w-4xl py-20 mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Terms of Service – SuiPatent dApp</h1>
      <p className="italic">Last updated: September 27, 2025</p>

      <p>
        Welcome to <strong>SuiPatent</strong>, a decentralized patent protection platform built on the <strong>Sui blockchain</strong>. 
        By accessing or using this dApp, you agree to comply with these Terms of Service (“Terms”). 
        If you do not agree, you may not use the platform.
      </p>

      <hr />

      <h2 className="text-2xl font-semibold">1. Eligibility</h2>
      <p>
        You must be at least 18 years old, or have legal consent from a parent or guardian, to use SuiPatent. 
        You must also have a valid blockchain wallet compatible with Sui testnet or mainnet.
      </p>

      <hr />

      <h2 className="text-2xl font-semibold">2. Account and Wallet</h2>
      <ul className="list-disc list-inside space-y-1">
        <li>You are responsible for maintaining the security of your wallet and private keys. Loss of access is irreversible.</li>
        <li>SuiPatent is non-custodial: we do not store your private keys or control your wallet.</li>
        <li>All blockchain transactions are executed via your wallet; you are responsible for associated gas fees.</li>
      </ul>

      <hr />

      <h2 className="text-2xl font-semibold">3. Intellectual Property & NFT Ownership</h2>
      <ul className="list-disc list-inside space-y-1">
        <li>You retain ownership of all intellectual property (IP) files you upload.</li>
        <li>NFTs minted through SuiPatent serve as proof of ownership and may include metadata such as blob IDs, SuiNS names, and timestamps.</li>
        <li>You grant SuiPatent a limited license to display NFTs for verification, attestation, and public transparency purposes.</li>
      </ul>

      <hr />

      <h2 className="text-2xl font-semibold">4. Permitted Use</h2>
      <ul className="list-disc list-inside space-y-1">
        <li>Upload your own IP files (PDFs/images, max 100MB) for encryption, storage, and NFT minting.</li>
        <li>Use whitelisting to authorize other wallets for decryption or verification.</li>
        <li>Interact with SuiPatent in accordance with applicable laws and these Terms.</li>
      </ul>

      <hr />

      <h2 className="text-2xl font-semibold">5. Prohibited Conduct</h2>
      <ul className="list-disc list-inside space-y-1">
        <li>Uploading content you do not own or have permission to use.</li>
        <li>Attempting to hack, disrupt, or interfere with SuiPatent, Seal, Walrus, Nautilus, or Sui blockchain operations.</li>
        <li>Misusing whitelisting to access unauthorized documents.</li>
        <li>Engaging in illegal activities or violating local laws using the platform.</li>
      </ul>

      <hr />

      <h2 className="text-2xl font-semibold">6. Disclaimers</h2>
      <ul className="list-disc list-inside space-y-1">
        <li>SuiPatent is provided “as-is” without warranties of any kind.</li>
        <li>We do not guarantee official recognition of NFTs or blockchain-based “Patent Proofs” by patent offices.</li>
        <li>The platform may experience bugs, downtime, or delays inherent in blockchain or third-party SDK services.</li>
      </ul>

      <hr />

      <h2 className="text-2xl font-semibold">7. Limitation of Liability</h2>
      <p>
        SuiPatent, its developers, and affiliated services are not liable for any direct, indirect, incidental, or consequential damages arising from your use of the dApp, including loss of IP, NFTs, funds, or data.
      </p>

      <hr />

      <h2 className="text-2xl font-semibold">8. Modifications to Terms</h2>
      <p>
        SuiPatent may update these Terms of Service to reflect technical, legal, or governance changes. Updates will be posted publicly via our GitHub repository. Continued use of the platform constitutes acceptance of updated Terms.
      </p>

      <hr />

      <h2 className="text-2xl font-semibold">9. Governing Law</h2>
      <p>
        These Terms are governed by the laws of the jurisdiction in which you access SuiPatent. By using the platform, you consent to the jurisdiction for any disputes arising from these Terms.
      </p>

      <hr />

      <h2 className="text-2xl font-semibold">10. Contact</h2>
      <p>
        For questions regarding these Terms of Service, contact us at:<br />
        📧 <a href="mailto:fortiv.pvt.ltd@gmail.com" className="text-blue-600 underline">fortiv.pvt.ltd@gmail.com</a><br />
        🌐 <a href="https://github.com/EmmanuellDev/walrus-front" className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">https://github.com/EmmanuellDev/walrus-front</a>
      </p>

      <hr />

      <p><em>End of Terms of Service</em></p>
    </div>
  );
}