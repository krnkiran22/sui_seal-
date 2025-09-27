"use client";

import React, { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRouter } from "next/navigation";

export default function Home() {
  const [scrollDirection, setScrollDirection] = useState("down");
  const [lastScrollY, setLastScrollY] = useState(0);
  const { scrollY } = useScroll();
  const router = useRouter();

  const handleClick = () => {
    router.push("/patend");
  };

    const handleClickDocs = () => {
    router.push("/docs");
  };

    const handleClickUpload = () => {
    router.push("/upload");
  };

  useEffect(() => {
    const updateScrollDirection = () => {
      const scrollY = window.scrollY;
      const direction = scrollY > lastScrollY ? "down" : "up";
      if (
        direction !== scrollDirection &&
        (scrollY - lastScrollY > 10 || scrollY - lastScrollY < -10)
      ) {
        setScrollDirection(direction);
      }
      setLastScrollY(scrollY > 0 ? scrollY : 0);
    };
    window.addEventListener("scroll", updateScrollDirection);
    return () => window.removeEventListener("scroll", updateScrollDirection);
  }, [scrollDirection, lastScrollY]);

  const features = [
    {
      title: "Secure Document Upload & Encryption",
      description:
        "Upload intellectual property documents (images, PDFs up to 100MB), encrypt them using Seal protocol, and store securely on Walrus decentralized storage.",
    },
    {
      title: "Ownership Attestation & NFT Minting",
      description:
        "Attest ownership through Nautilus, mint a 'Patent Proof' NFT with embedded Walrus blob ID in metadata for verifiable proof of creation.",
    },
    {
      title: "Permissioned Verification Access",
      description:
        "Whitelist specific wallet addresses (e.g., patent offices, courts) for controlled decryption and verification of protected documents.",
    },
    {
      title: "Branding & Identity Management",
      description:
        "Leverage SuiNS for professional branding (e.g., inventor.sui) to establish credible, decentralized identities for creators and institutions.",
    },
  ];

  const painPoints = [
    {
      title: "Centralized Vulnerabilities",
      description:
        "Traditional systems expose IP to single points of failure, hacking risks, and unauthorized access—SuiPatent distributes control via blockchain.",
    },
    {
      title: "High Costs & Delays",
      description:
        "Conventional patent processes involve expensive fees and lengthy approvals—SuiPatent enables instant, low-cost decentralized protection.",
    },
    {
      title: "Lack of Transparency",
      description:
        "Opaque ownership records lead to disputes—SuiPatent provides immutable, auditable trails on the Sui blockchain.",
    },
    {
      title: "Global Accessibility Issues",
      description:
        "Jurisdictional barriers limit protection—SuiPatent offers borderless, permissioned verification for international collaboration.",
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="min-h-screen bg-white relative overflow-hidden">
        {/* Creative Background Elements */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-bl from-[#4da2ff]/5 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#4da2ff]/3 rounded-full blur-3xl"></div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-12 pt-32">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center min-h-[calc(100vh-8rem)]">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="inline-flex items-center px-4 py-2 bg-[#4da2ff]/10 rounded-full mb-8">
                  <div className="w-2 h-2 bg-[#4da2ff] rounded-full mr-3 animate-pulse"></div>
                  <span className="text-[#4da2ff] font-clash font-medium text-sm tracking-wide">
                    Blockchain IP Protection
                  </span>
                </div>

                <h1 className="text-6xl lg:text-8xl font-clash font-light text-gray-900 leading-none mb-6">
                  Sui<span className="text-[#4da2ff] font-medium">Patent</span>
                </h1>

                <p className="text-xl text-gray-600 font-clash font-light leading-relaxed max-w-2xl mb-8">
                  Revolutionary intellectual property protection through
                  decentralized blockchain technology. Secure your innovations
                  with cryptographic proof of ownership.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 mb-12">
                  <button onClick={handleClickUpload}
                  className="px-8 py-4 bg-[#4da2ff] cursor-pointer text-white font-clash font-medium rounded-2xl hover:bg-[#3d91ef] transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-[#4da2ff]/25">
                    Start Protecting IP
                  </button>
    <button
      onClick={handleClick}
      className="px-8 cursor-pointer py-4 border-2 border-gray-200 text-gray-700 font-clash font-medium rounded-2xl hover:border-[#4da2ff] hover:text-[#4da2ff] transition-all duration-300"
    >
      Learn More
    </button>
                </div>

                {/* Stats */}
                <div className="flex items-center space-x-8 pt-8 border-t border-gray-100">
                  <div>
                    <div className="text-2xl font-clash font-semibold text-gray-900">
                      2.8M+
                    </div>
                    <div className="text-sm text-gray-500 font-clash">
                      Block Height
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-clash font-semibold text-gray-900">
                      0.001s
                    </div>
                    <div className="text-sm text-gray-500 font-clash">
                      Finality
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-clash font-semibold text-gray-900">
                      $0.01
                    </div>
                    <div className="text-sm text-gray-500 font-clash">
                      Avg Cost
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right Visual Element */}
            <div className="lg:col-span-5">
              <motion.div
                initial={{ opacity: 0, x: 60 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 0.3 }}
                className="relative"
              >
                {/* Main Card */}
                <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100 relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 bg-[#4da2ff] rounded-xl flex items-center justify-center">
                      <span className="text-white font-clash font-semibold text-lg">
                        S
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-[#4da2ff] rounded-full animate-pulse"></div>
                      <span className="text-sm text-gray-600 font-clash">
                        Live
                      </span>
                    </div>
                  </div>

                  <h3 className="text-xl font-clash font-semibold text-gray-900 mb-4">
                    Patent Protection Active
                  </h3>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 font-clash text-sm">
                        Encryption Status
                      </span>
                      <span className="text-[#4da2ff] font-clash font-medium text-sm">
                        Sealed
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 font-clash text-sm">
                        Blockchain Proof
                      </span>
                      <span className="text-[#4da2ff] font-clash font-medium text-sm">
                        Verified
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 font-clash text-sm">
                        Access Control
                      </span>
                      <span className="text-[#4da2ff] font-clash font-medium text-sm">
                        Permissioned
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-[#4da2ff] to-[#3d91ef] rounded-full w-[87%]"></div>
                    </div>
                    <p className="text-xs text-gray-500 font-clash mt-2">
                      Protection Level: 87%
                    </p>
                  </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute -top-4 -right-4 w-20 h-20 bg-[#4da2ff]/10 rounded-2xl flex items-center justify-center z-20">
                  <div className="w-8 h-8 bg-[#4da2ff] rounded-lg"></div>
                </div>
                <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-gradient-to-br from-[#4da2ff]/20 to-transparent rounded-xl"></div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-16"
          >
            <div className="flex items-center mb-8">
              <div className="w-12 h-px bg-[#4da2ff] mr-6"></div>
              <h2 className="text-4xl font-clash font-light text-gray-900">
                Core Capabilities
              </h2>
            </div>
            <p className="text-lg text-gray-600 font-clash font-light max-w-3xl leading-relaxed">
              Advanced blockchain infrastructure designed for intellectual
              property protection and verification.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.7,
                  delay: index * 0.1,
                  ease: "easeOut",
                }}
                className="group"
              >
                <div className="bg-white rounded-2xl p-8 hover:shadow-xl transition-all duration-500 border border-gray-100 group-hover:border-[#4da2ff]/30 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-[#4da2ff]/5 rounded-full blur-2xl group-hover:bg-[#4da2ff]/10 transition-all duration-500"></div>
                  <div className="relative z-10">
                    <div className="w-12 h-12 bg-[#4da2ff]/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#4da2ff]/20 transition-all duration-300">
                      <div className="w-6 h-6 bg-[#4da2ff] rounded-lg"></div>
                    </div>
                    <h3 className="text-xl font-clash font-medium text-gray-900 mb-4">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed font-clash font-light">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Technical Infrastructure Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden"
          >
            <div className="border-b border-gray-200 px-8 py-6">
              <h2 className="text-2xl font-light text-gray-900 tracking-wide">
                Technical Infrastructure
              </h2>
              <p className="text-gray-600 text-sm mt-2 font-light">
                Built on Sui's high-performance blockchain with integrated
                ecosystem protocols.
              </p>
            </div>

            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <h4 className="text-sm font-medium text-[#4da2ff] mb-3 tracking-widest uppercase">
                    Encryption & Storage
                  </h4>
                  <p className="text-gray-600 text-sm font-light">
                    Seal encryption with Walrus decentralized blob storage for
                    scalable, secure IP handling.
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-[#4da2ff] mb-3 tracking-widest uppercase">
                    Attestation & Minting
                  </h4>
                  <p className="text-gray-600 text-sm font-light">
                    Nautilus for ownership proofs; NFT minting with metadata
                    integration on Sui.
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-[#4da2ff] mb-3 tracking-widest uppercase">
                    Access & Identity
                  </h4>
                  <p className="text-gray-600 text-sm font-light">
                    Whitelisting via smart contracts; SuiNS for domain-based
                    branding and verification.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24 bg-gradient-to-br from-[#4da2ff] to-[#3d91ef] relative overflow-hidden">
        <div className="absolute inset-0 bg-black/5"></div>
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-10">
          <div className="w-full h-full bg-gradient-to-bl from-white/20 to-transparent"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center"
          >
            <h2 className="text-5xl lg:text-6xl font-clash font-light text-white mb-8">
              Ready to Innovate?
            </h2>

            <p className="text-xl text-white/90 mb-12 max-w-3xl mx-auto font-clash font-light leading-relaxed">
              Start protecting your intellectual property with
              blockchain-verified ownership and decentralized verification.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button onClick={handleClickUpload}
              className="px-10 cursor-pointer py-4 bg-white text-[#4da2ff] font-clash font-semibold rounded-2xl hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl">
                Launch Platform
              </button>
              <button onClick={handleClickDocs}
              className="px-10 cursor-pointer py-4 border-2 border-white/30 text-white rounded-2xl hover:bg-white/10 transition-all duration-300 font-clash font-medium backdrop-blur-sm">
                Documentation
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
