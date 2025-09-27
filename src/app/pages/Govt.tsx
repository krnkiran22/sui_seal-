"use client";

import React, { useState } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { 
  Search, 
  Eye, 
  FileText, 
  Image, 
  Video, 
  Download, 
  Clock, 
  User,
  Hash,
  AlertCircle,
  CheckCircle,
  Wallet
} from 'lucide-react';
import { useCurrentAccount, ConnectButton } from '@mysten/dapp-kit';
import Button from '../components/Button';
import Card from '../components/Card';
import Table from '../components/Table';
import { documentDecryptionService, SimpleBlobDecryption } from '../../lib/decryptionService';

interface DecryptedDocument {
  id: string;
  name: string;
  type: string;
  size: number;
  blobId: string;
  decryptedAt: Date;
  status: 'decrypted' | 'failed';
  imageUrl?: string; // URL for decrypted image
  error?: string;
}

const GovtPage: React.FC = () => {
  const currentAccount = useCurrentAccount();
  const [blobId, setBlobId] = useState('');
  const [decrypting, setDecrypting] = useState(false);
  const [currentDocument, setCurrentDocument] = useState<DecryptedDocument | null>(null);
  const [decryptedHistory, setDecryptedHistory] = useState<DecryptedDocument[]>([]); // Only real decrypted data
  const [decryptionProgress, setDecryptionProgress] = useState<string>('');
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleDecrypt = async () => {
    if (!currentAccount) {
      setNotification({ type: 'error', message: 'Please connect your wallet first' });
      return;
    }

    if (!blobId.trim()) {
      setNotification({ type: 'error', message: 'Please enter a blob ID' });
      return;
    }

    setDecrypting(true);
    setDecryptionProgress('');
    setCurrentDocument(null);
    
    try {
      console.log('🔓 Starting real decryption for blob:', blobId);
      
      const result: SimpleBlobDecryption = await documentDecryptionService.decryptSingleBlob(
        blobId,
        currentAccount.address,
        (progress) => setDecryptionProgress(progress)
      );
      
      if (result.decryptedImageUrl) {
        const decryptedDoc: DecryptedDocument = {
          id: Math.random().toString(36).substr(2, 9),
          name: `decrypted_image_${blobId.slice(-6)}.jpg`,
          type: 'image/jpeg',
          size: 0, // Size unknown for now
          blobId: blobId,
          decryptedAt: new Date(),
          status: 'decrypted',
          imageUrl: result.decryptedImageUrl
        };

        setCurrentDocument(decryptedDoc);
        setDecryptedHistory(prev => [decryptedDoc, ...prev]);
        setNotification({ type: 'success', message: 'Image retrieved and decrypted successfully!' });
        console.log('✅ Decryption successful:', decryptedDoc);
        
      } else {
        const failedDoc: DecryptedDocument = {
          id: Math.random().toString(36).substr(2, 9),
          name: `failed_${blobId.slice(-6)}`,
          type: 'unknown',
          size: 0,
          blobId: blobId,
          decryptedAt: new Date(),
          status: 'failed',
          error: result.error || 'Unknown error'
        };
        
        setCurrentDocument(failedDoc);
        setDecryptedHistory(prev => [failedDoc, ...prev]);
        setNotification({ type: 'error', message: `Failed to decrypt: ${result.error}` });
        console.error('❌ Decryption failed:', result.error);
      }
      
    } catch (error) {
      console.error('❌ Decryption error:', error);
      setNotification({ 
        type: 'error', 
        message: `Decryption failed: ${error instanceof Error ? error.message : 'Unknown error'}` 
      });
    } finally {
      setDecrypting(false);
      setDecryptionProgress('');
    }

    setTimeout(() => setNotification(null), 5000);
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return Image;
    if (type.startsWith('video/')) return Video;
    return FileText;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatBlobId = (id: string) => `${id.slice(0, 8)}...${id.slice(-8)}`;

  return (
    <>
      <Head>
        <title>Government Portal - Emma Patent</title>
      </Head>

      <div className="min-h-screen bg-white">
        {/* Creative Background Elements */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-bl from-[#4da2ff]/5 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#4da2ff]/3 rounded-full blur-3xl"></div>
        
        <div className="relative py-12 px-6 lg:px-12">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-16 mt-20">
              <div className="mb-8">
                <div className="flex items-center mb-8">
                  <div className="w-12 h-px bg-[#4da2ff] mr-6"></div>
                  <h1 className="text-4xl font-clash font-light text-gray-900">
                    Government Portal
                  </h1>
                </div>
                <p className="text-lg text-gray-600 font-clash font-light leading-relaxed max-w-3xl">
                  Decrypt and review submitted patent documents with authorized government access
                </p>
              </div>
            </div>

            {/* Notifications */}
            {notification && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className={`mb-8 rounded-2xl p-6 font-clash ${
                  notification.type === "success"
                    ? "bg-[#4da2ff]/5 border border-[#4da2ff]/30 text-[#4da2ff]"
                    : "bg-red-50 border border-red-200 text-red-800"
                }`}
              >
                <div className="flex items-center space-x-3">
                  {notification.type === "success" ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <AlertCircle className="w-5 h-5" />
                  )}
                  <span className="font-medium">{notification.message}</span>
                </div>
              </motion.div>
            )}

            {/* Wallet Connection Check */}
            {!currentAccount && (
              <div className="mb-8 p-8 bg-yellow-50 border border-yellow-200 rounded-2xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Wallet className="w-8 h-8 text-yellow-600" />
                    <div className="flex-1">
                      <h3 className="font-clash font-semibold text-yellow-800 text-lg">
                        Government Wallet Connection Required
                      </h3>
                      <p className="text-yellow-700 font-clash font-light mt-2">
                        Connect your authorized government wallet to access and decrypt patent documents.
                      </p>
                    </div>
                  </div>
                  <ConnectButton />
                </div>
              </div>
            )}

            {currentAccount && (
              <div className="mb-8 p-6 bg-green-50 border border-green-200 rounded-2xl">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-clash font-medium text-green-800">Government Wallet Connected</p>
                    <p className="text-sm text-green-700 font-mono mt-1">{currentAccount.address}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Document Selection */}
              <div>
                <div className="bg-white rounded-2xl border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-500">
                  <div className="border-b border-gray-100 px-8 py-6">
                    <div className="flex items-center space-x-2">
                      <Search className="w-5 h-5 text-[#4da2ff]" />
                      <h3 className="text-xl font-clash font-medium text-gray-900">
                        Select Document
                      </h3>
                    </div>
                    <p className="text-gray-600 text-sm mt-2 font-clash font-light">
                      Choose a document to decrypt and review
                    </p>
                  </div>

                  <div className="p-8">
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-clash font-medium text-gray-700 mb-4">
                          Blob ID
                        </label>
                        <input
                          type="text"
                          value={blobId}
                          onChange={(e) => setBlobId(e.target.value)}
                          placeholder="0x1234567890abcdef..."
                          className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:border-[#4da2ff] text-sm font-mono text-gray-800 placeholder-gray-400 transition-all duration-300 hover:border-gray-300"
                        />
                      </div>

                      <div className="text-center text-gray-500 font-clash font-light">— OR —</div>

                      <div className="mb-6">
                        <p className="text-sm text-gray-600 font-clash">
                          Enter the blob ID of the encrypted document you want to decrypt.
                        </p>
                      </div>

                      {/* Progress indicator */}
                      {decryptionProgress && (
                        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <p className="text-sm text-blue-800 font-clash">{decryptionProgress}</p>
                        </div>
                      )}

                      <button
                        onClick={handleDecrypt}
                        disabled={decrypting || !blobId.trim()}
                        className={`w-full py-4 px-6 rounded-2xl text-white font-clash font-medium transition-all duration-300 flex items-center justify-center space-x-2 ${
                          decrypting || !blobId.trim()
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-[#4da2ff] hover:bg-[#3d91ef] shadow-lg hover:shadow-xl hover:shadow-[#4da2ff]/25"
                        }`}
                      >
                        {decrypting ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>Decrypting...</span>
                          </>
                        ) : (
                          <>
                            <Eye className="w-4 h-4" />
                            <span>Decrypt Document</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="border-t border-gray-100 px-8 py-6 bg-gray-50 rounded-b-2xl">
                      <div className="flex items-start space-x-3">
                        <AlertCircle className="w-4 h-4 text-gray-500 mt-1 flex-shrink-0" />
                        <div className="text-xs text-gray-600 leading-relaxed font-clash">
                          <p className="font-medium mb-2 text-gray-700">Authorized Access Only</p>
                          <p>This portal is restricted to verified government entities for patent document review.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Document Viewer */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-500">
                  <div className="border-b border-gray-100 px-8 py-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <FileText className="w-5 h-5 text-[#4da2ff]" />
                        <h3 className="text-xl font-clash font-medium text-gray-900">
                          Document Viewer
                        </h3>
                      </div>
                      {currentDocument && (
                        <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 font-clash font-medium rounded-xl hover:border-[#4da2ff] hover:text-[#4da2ff] transition-all duration-300 flex items-center space-x-2">
                          <Download className="w-4 h-4" />
                          <span>Download</span>
                        </button>
                      )}
                    </div>
                    <p className="text-gray-600 text-sm mt-2 font-clash font-light">
                      Review decrypted document content
                    </p>
                  </div>

                  {currentDocument ? (
                    <div className="p-8">
                      <div className="space-y-6">
                        {/* Document Info */}
                        <div className="bg-gray-50 p-6 rounded-xl">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="font-clash font-medium text-gray-700">File Name:</span>
                              <p className="text-gray-600 mt-1 font-clash">{currentDocument.name}</p>
                            </div>
                            <div>
                              <span className="font-clash font-medium text-gray-700">Size:</span>
                              <p className="text-gray-600 mt-1 font-clash">{formatFileSize(currentDocument.size)}</p>
                            </div>
                            <div>
                              <span className="font-clash font-medium text-gray-700">Status:</span>
                              <p className="text-gray-600 mt-1 font-clash capitalize">{currentDocument.status}</p>
                            </div>
                            <div>
                              <span className="font-clash font-medium text-gray-700">Decrypted:</span>
                              <p className="text-gray-600 mt-1 font-clash">{currentDocument.decryptedAt.toLocaleString()}</p>
                            </div>
                          </div>
                          <div className="mt-4">
                            <span className="font-clash font-medium text-gray-700">Blob ID:</span>
                            <p className="text-gray-600 font-mono text-xs mt-1 break-all font-clash">
                              {currentDocument.blobId}
                            </p>
                          </div>
                        </div>

                        {/* Document Content */}
                        <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 min-h-96 bg-gray-50">
                          {currentDocument.type === 'application/pdf' && (
                            <div className="text-center">
                              <FileText className="mx-auto w-16 h-16 text-gray-400 mb-6" />
                              <p className="text-gray-600 mb-6 font-clash font-medium">PDF Document Preview</p>
                              <div className="bg-white p-6 rounded-xl shadow-sm text-left max-w-2xl mx-auto border border-gray-100">
                                <h4 className="font-clash font-semibold text-lg mb-4 text-gray-900">Patent Application Document</h4>
                                <p className="text-gray-700 leading-relaxed font-clash">
                                  This is a simulated PDF document view. In a real implementation, 
                                  this would display the actual PDF content using a PDF viewer component 
                                  or embed. The decrypted document contains detailed patent specifications, 
                                  technical drawings, claims, and supporting documentation.
                                </p>
                                <div className="mt-4 p-4 bg-[#4da2ff]/5 rounded-xl border border-[#4da2ff]/20">
                                  <p className="text-sm text-[#4da2ff] font-clash">
                                    Document content has been successfully decrypted and is ready for review.
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}

                          {currentDocument.type.startsWith('image/') && (
                            <div className="text-center">
                              {currentDocument.imageUrl ? (
                                <>
                                  <p className="text-gray-600 mb-6 font-clash font-medium">Decrypted Image Preview</p>
                                  <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 inline-block">
                                    <img 
                                      src={currentDocument.imageUrl} 
                                      alt="Decrypted document" 
                                      className="max-w-full max-h-96 rounded-lg shadow-sm"
                                      style={{ maxHeight: '400px', maxWidth: '100%' }}
                                    />
                                  </div>
                                  <div className="mt-4 p-4 bg-green-50 rounded-xl border border-green-200 max-w-2xl mx-auto">
                                    <p className="text-sm text-green-800 font-clash">
                                      ✅ Image successfully retrieved and decrypted from Walrus storage
                                    </p>
                                  </div>
                                </>
                              ) : (
                                <>
                                  <Image className="mx-auto w-16 h-16 text-gray-400 mb-6" />
                                  <p className="text-gray-600 mb-6 font-clash font-medium">Image Document Preview</p>
                                  <div className="bg-red-50 p-4 rounded-xl border border-red-200 max-w-2xl mx-auto">
                                    <p className="text-sm text-red-800 font-clash">
                                      ❌ Failed to decrypt image: {currentDocument.error || 'Unknown error'}
                                    </p>
                                  </div>
                                </>
                              )}
                            </div>
                          )}

                          {currentDocument.type.startsWith('video/') && (
                            <div className="text-center">
                              <Video className="mx-auto w-16 h-16 text-gray-400 mb-6" />
                              <p className="text-gray-600 mb-6 font-clash font-medium">Video Document Preview</p>
                              <div className="bg-gray-900 rounded-xl p-8 max-w-2xl mx-auto">
                                <div className="aspect-video bg-gray-800 rounded-xl flex items-center justify-center">
                                  <Video className="w-12 h-12 text-white" />
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-16 text-center">
                      <Eye className="mx-auto w-16 h-16 text-gray-300 mb-6" />
                      <p className="text-lg text-gray-500 font-clash font-light mb-2">No Document Selected</p>
                      <p className="text-sm text-gray-400 font-clash">
                        Enter a blob ID or select a document to decrypt and view
                      </p>
                    </div>
                  )}
                </div>
              </div>
          </div>

            {/* Decryption History */}
            <div className="mt-8">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-500">
                <div className="border-b border-gray-100 px-8 py-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-5 h-5 text-[#4da2ff]" />
                      <h3 className="text-xl font-clash font-medium text-gray-900">
                        Decryption History
                      </h3>
                    </div>
                    <div className="text-sm text-gray-600 bg-[#4da2ff]/10 px-4 py-2 rounded-xl border border-[#4da2ff]/20">
                      <span className="font-clash font-medium">{decryptedHistory.length} documents accessed</span>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mt-2 font-clash font-light">
                    Review previously decrypted documents
                  </p>
                </div>

                {decryptedHistory.length === 0 ? (
                  <div className="p-16 text-center">
                    <Clock className="mx-auto w-12 h-12 text-gray-300 mb-6" />
                    <p className="text-lg text-gray-500 font-clash font-light mb-2">No documents decrypted yet</p>
                    <p className="text-sm text-gray-400 font-clash">Decrypt documents to see history here</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                          <th className="px-8 py-4 text-left text-xs font-clash font-medium text-gray-600 uppercase tracking-wider">Document</th>
                          <th className="px-8 py-4 text-left text-xs font-clash font-medium text-gray-600 uppercase tracking-wider">Uploader</th>
                          <th className="px-8 py-4 text-left text-xs font-clash font-medium text-gray-600 uppercase tracking-wider">Blob ID</th>
                          <th className="px-8 py-4 text-left text-xs font-clash font-medium text-gray-600 uppercase tracking-wider">Decrypted</th>
                          <th className="px-8 py-4 text-left text-xs font-clash font-medium text-gray-600 uppercase tracking-wider">Status</th>
                          <th className="px-8 py-4 text-center text-xs font-clash font-medium text-gray-600 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {decryptedHistory.map((doc, index) => {
                          const FileIcon = getFileIcon(doc.type);
                          return (
                            <tr
                              key={doc.id}
                              className="hover:bg-gray-50 transition-colors group"
                            >
                              <td className="px-8 py-6 whitespace-nowrap">
                                <div className="flex items-center space-x-3">
                                  <FileIcon className="w-5 h-5 text-gray-600" />
                                  <div>
                                    <p className="text-sm font-clash font-medium text-gray-900 truncate max-w-48">
                                      {doc.name}
                                    </p>
                                    <p className="text-xs text-gray-600 font-clash">
                                      {formatFileSize(doc.size)}
                                    </p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-8 py-6 whitespace-nowrap">
                                <div className="flex items-center space-x-2">
                                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                    doc.status === 'decrypted' 
                                      ? 'bg-green-100 text-green-800' 
                                      : 'bg-red-100 text-red-800'
                                  }`}>
                                    {doc.status}
                                  </span>
                                </div>
                              </td>
                              <td className="px-8 py-6 whitespace-nowrap">
                                <code className="text-sm font-mono text-[#4da2ff] bg-[#4da2ff]/5 px-3 py-2 rounded-xl border border-[#4da2ff]/20">
                                  {formatBlobId(doc.blobId)}
                                </code>
                              </td>
                              <td className="px-8 py-6 whitespace-nowrap text-sm text-gray-600 font-clash font-light">
                                {doc.decryptedAt.toLocaleDateString()}
                              </td>
                              <td className="px-8 py-6 whitespace-nowrap">
                                <span className={`inline-flex items-center px-3 py-1 rounded-xl text-xs font-clash font-medium ${
                                  doc.status === 'decrypted' 
                                    ? 'bg-[#4da2ff]/10 text-[#4da2ff] border border-[#4da2ff]/20' 
                                    : 'bg-red-50 text-red-800 border border-red-200'
                                }`}>
                                  {doc.status}
                                </span>
                              </td>
                              <td className="px-8 py-6 whitespace-nowrap text-center">
                                <div className="flex items-center justify-center space-x-2">
                                  <button
                                    onClick={() => setCurrentDocument(doc)}
                                    className="p-2 rounded-xl text-gray-400 hover:text-[#4da2ff] hover:bg-[#4da2ff]/5 transition-all duration-300 border border-transparent hover:border-[#4da2ff]/20"
                                    title="View document"
                                  >
                                    <Eye className="w-4 h-4" />
                                  </button>
                                  <button
                                    className="p-2 rounded-xl text-gray-400 hover:text-[#4da2ff] hover:bg-[#4da2ff]/5 transition-all duration-300 border border-transparent hover:border-[#4da2ff]/20"
                                    title="Download document"
                                  >
                                    <Download className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default GovtPage;