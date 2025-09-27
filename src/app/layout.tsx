import type { Metadata } from "next";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import WalletProviders from "../providers/WalletProvider";
import { ToastProvider } from "../components/Toast";

export const metadata: Metadata = {
  title: "SuiSeal - Secure Document Encryption & Government Access",
  description: "Revolutionary blockchain-based document encryption platform with secure government access controls. Built on Sui Network with advanced cryptographic protection.",
  keywords: "blockchain, document encryption, sui network, government access, secure documents, patent protection",
  authors: [{ name: "SuiSeal Team" }],
  creator: "SuiSeal",
  publisher: "SuiSeal",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://suiseal.com",
    title: "SuiSeal - Secure Document Encryption Platform",
    description: "Revolutionary blockchain-based document encryption with government access controls",
    siteName: "SuiSeal",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "SuiSeal - Secure Document Encryption Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SuiSeal - Secure Document Encryption Platform",
    description: "Revolutionary blockchain-based document encryption with government access controls",
    images: ["/logo.png"],
    creator: "@suiseal",
  },
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Poppins:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <WalletProviders>
          <ToastProvider>
            <div className="min-h-screen bg-white flex flex-col">
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          </ToastProvider>
        </WalletProviders>
      </body>
    </html>
  );
}