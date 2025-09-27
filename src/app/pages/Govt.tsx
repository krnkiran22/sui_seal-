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
  CheckCircle
} from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';
import Table from '../components/Table';

interface DecryptedDocument {
  id: string;
  name: string;
  type: string;
  size: number;
  blobId: string;
  decryptedAt: Date;
  uploader: string;
  status: 'decrypted' | 'failed';
  content?: string;
}

interface UploadedDocument {
  id: string;
  name: string;
  blobId: string;
  uploadedAt: Date;
  uploader: string;
}

const GovtPage: React.FC = () => {
  const [blobId, setBlobId] = useState('');
  const [selectedDocument, setSelectedDocument] = useState<UploadedDocument | null>(null);
  const [decrypting, setDecrypting] = useState(false);
  const [currentDocument, setCurrentDocument] = useState<DecryptedDocument | null>(null);
  const [decryptedHistory, setDecryptedHistory] = useState<DecryptedDocument[]>([
    {
      id: '1',
      name: 'patent_application_2024_001.pdf',
      type: 'application/pdf',
      size: 2048000,
      blobId: '0x1234567890abcdef1234567890abcdef12345678901234567890abcdef123456',
      decryptedAt: new Date('2024-01-20T10:30:00'),
      uploader: 'inventor.sui',
      status: 'decrypted',
    },
    {
      id: '2',
      name: 'invention_diagram.png',
      type: 'image/png',
      size: 1024000,
      blobId: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
      decryptedAt: new Date('2024-01-19T14:15:00'),
      uploader: 'researcher.sui',
      status: 'decrypted',
    }
  ]);
  const [uploadedDocuments] = useState<UploadedDocument[]>([
    {
      id: '1',
      name: 'patent_application_2024_001.pdf',
      blobId: '0x1234567890abcdef1234567890abcdef12345678901234567890abcdef123456',
      uploadedAt: new Date('2024-01-15T09:00:00'),
      uploader: 'inventor.sui',
    },
    {
      id: '2',
      name: 'invention_diagram.png',
      blobId: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
      uploadedAt: new Date('2024-01-18T11:30:00'),
      uploader: 'researcher.sui',
    }
  ]);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleDecrypt = async () => {
    if (!blobId && !selectedDocument) {
      setNotification({ type: 'error', message: 'Please enter a blob ID or select a document' });
      return;
    }

    setDecrypting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const targetBlobId = selectedDocument ? selectedDocument.blobId : blobId;
      const docName = selectedDocument ? selectedDocument.name : 'unknown_document.pdf';
      const uploader = selectedDocument ? selectedDocument.uploader : 'unknown.sui';
      
      const decryptedDoc: DecryptedDocument = {
        id: Math.random().toString(36).substr(2, 9),
        name: docName,
        type: docName.endsWith('.pdf') ? 'application/pdf' : docName.endsWith('.png') ? 'image/png' : 'application/octet-stream',
        size: Math.floor(Math.random() * 5000000) + 500000,
        blobId: targetBlobId,
        decryptedAt: new Date(),
        uploader,
        status: 'decrypted',
        content: 'This is the decrypted content of the document. In a real implementation, this would contain the actual decrypted file content.'
      };

      setCurrentDocument(decryptedDoc);
      setDecryptedHistory(prev => [decryptedDoc, ...prev]);
      setNotification({ type: 'success', message: 'Document decrypted successfully' });
      
    } catch (error) {
      setNotification({ type: 'error', message: 'Failed to decrypt document' });
    } finally {
      setDecrypting(false);
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

                      <div>
                        <label className="block text-sm font-clash font-medium text-gray-700 mb-4">
                          Select from Uploaded Documents
                        </label>
                        <div className="space-y-3 max-h-48 overflow-y-auto">
                          {uploadedDocuments.map((doc) => (
                            <div
                              key={doc.id}
                              onClick={() => {
                                setSelectedDocument(doc);
                                setBlobId('');
                              }}
                              className={`p-4 border rounded-xl cursor-pointer transition-all duration-300 ${
                                selectedDocument?.id === doc.id
                                  ? 'border-[#4da2ff] bg-[#4da2ff]/5'
                                  : 'border-gray-200 hover:border-[#4da2ff]/50 hover:bg-gray-50'
                              }`}
                            >
                              <div className="flex items-center space-x-3">
                                <FileText className="w-4 h-4 text-gray-600" />
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-clash font-medium text-gray-900 truncate">
                                    {doc.name}
                                  </p>
                                  <p className="text-xs text-gray-600 font-clash">
                                    {doc.uploader} • {doc.uploadedAt.toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <button
                        onClick={handleDecrypt}
                        disabled={decrypting || (!blobId && !selectedDocument)}
                        className={`w-full py-4 px-6 rounded-2xl text-white font-clash font-medium transition-all duration-300 flex items-center justify-center space-x-2 ${
                          decrypting || (!blobId && !selectedDocument)
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
                              <span className="font-clash font-medium text-gray-700">Uploader:</span>
                              <p className="text-gray-600 mt-1 font-clash">{currentDocument.uploader}</p>
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
                              <Image className="mx-auto w-16 h-16 text-gray-400 mb-6" />
                              <p className="text-gray-600 mb-6 font-clash font-medium">Image Document Preview</p>
                              <div className="bg-white p-6 rounded-xl shadow-sm max-w-lg mx-auto border border-gray-100">
                                <div className="w-full h-64 bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl flex items-center justify-center">
                                  <span className="text-gray-500 font-clash">Image content would display here</span>
                                </div>
                              </div>
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
                                  <User className="w-4 h-4 text-gray-500" />
                                  <span className="text-sm text-gray-600 font-clash">{doc.uploader}</span>
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