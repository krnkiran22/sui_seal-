"use client";

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, Image, Video, Trash2, CheckCircle, AlertCircle, Hash, Zap, Hexagon, Triangle, Layers, Wallet } from 'lucide-react';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { walrusService, EncryptionResult } from '../../lib/walrusService';

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  blobId: string;
  uploadedAt: Date;
}

const UploadPage: React.FC = () => {
  const currentAccount = useCurrentAccount();
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const newFiles = Array.from(e.dataTransfer.files);
      setFiles(prev => [...prev, ...newFiles]);
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
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

  const handleUpload = async () => {
    if (!currentAccount) {
      setNotification({ type: 'error', message: 'Please connect your wallet first' });
      return;
    }

    if (files.length === 0) {
      setNotification({ type: 'error', message: 'Please select files to upload' });
      return;
    }

    setUploading(true);
    
    try {
      console.log('🚀 Starting real Walrus upload for', files.length, 'files...');
      console.log('👤 Wallet address:', currentAccount.address);
      
      const newUploadedFiles: UploadedFile[] = [];
      
      // Upload each file to Walrus using real encryption
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        console.log(`📤 Uploading file ${i + 1}/${files.length}: ${file.name}`);
        
        const result: EncryptionResult = await walrusService.storeImage(file, currentAccount.address);
        
        if (result.success && result.blobId) {
          newUploadedFiles.push({
            id: result.blobId, // Use real blob ID as unique identifier
            name: file.name,
            size: file.size,
            type: file.type,
            blobId: result.blobId,
            uploadedAt: new Date(),
          });
          console.log(`✅ Successfully uploaded: ${file.name} -> ${result.blobId}`);
        } else {
          console.error(`❌ Failed to upload: ${file.name}`, result.error);
          throw new Error(`Failed to upload ${file.name}: ${result.error}`);
        }
      }

      // Only update with real uploaded files
      setUploadedFiles(prev => [...prev, ...newUploadedFiles]);
      setFiles([]);
      setNotification({ 
        type: 'success', 
        message: `Successfully uploaded ${newUploadedFiles.length} file(s) to Walrus storage with encryption` 
      });
      
      console.log('🎉 All files uploaded and encrypted successfully!', newUploadedFiles);
    } catch (error) {
      console.error('❌ Upload failed:', error);
      setNotification({ 
        type: 'error', 
        message: `Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}` 
      });
    } finally {
      setUploading(false);
    }

    setTimeout(() => setNotification(null), 5000);
  };

  const clearFiles = () => {
    setFiles([]);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Creative Background Elements */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-bl from-[#4da2ff]/5 to-transparent"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#4da2ff]/3 rounded-full blur-3xl"></div>
      
      {/* Main Content */}
      <div className="relative py-12 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-16 mt-20">
            <div className="mb-8">
              <div className="flex items-center mb-8">
                <div className="w-12 h-px bg-[#4da2ff] mr-6"></div>
                <h1 className="text-4xl font-clash font-light text-gray-900">
                  Upload Documents
                </h1>
              </div>
              <p className="text-lg text-gray-600 font-clash font-light leading-relaxed max-w-3xl">
                Securely upload and encrypt your documents with advanced protection for intellectual property verification
              </p>
            </div>
          </div>

          {/* Notifications */}
          <AnimatePresence>
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
          </AnimatePresence>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Upload Section */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-500">
                <div className="border-b border-gray-100 px-8 py-6">
                  <h2 className="text-xl font-clash font-medium text-gray-900 tracking-wide">
                    Document Upload
                  </h2>
                  <p className="text-gray-600 text-sm mt-2 font-clash font-light">
                    Upload files for secure encryption and storage
                  </p>
                </div>
                
                <div className="p-8">
                  {/* Wallet Connection Check */}
                  {!currentAccount && (
                    <div className="mb-8 p-6 bg-yellow-50 border border-yellow-200 rounded-xl">
                      <div className="flex items-center space-x-3">
                        <Wallet className="w-5 h-5 text-yellow-600" />
                        <div>
                          <p className="font-clash font-medium text-yellow-800">Wallet Connection Required</p>
                          <p className="text-sm text-yellow-700 mt-1">Please connect your Sui wallet using the Connect Wallet button in the navigation bar to upload and encrypt files</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Drag and Drop Area */}
                  <div
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 ${
                      dragActive
                        ? 'border-[#4da2ff] bg-[#4da2ff]/5'
                        : 'border-gray-200 hover:border-[#4da2ff]/50 hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.mp4,.mov"
                      onChange={handleFileInput}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      title="Select files to upload"
                    />
                    
                    <div className="space-y-6">
                      <div
                        className={`mx-auto w-16 h-16 rounded-xl flex items-center justify-center transition-all duration-300 ${
                          dragActive ? 'bg-[#4da2ff] text-white' : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        <Upload className="w-8 h-8" />
                      </div>
                      <div>
                        <p className="text-xl font-clash font-medium text-gray-900 mb-2">
                          Drop files here or click to browse
                        </p>
                        <p className="text-sm text-gray-600 font-clash font-light">
                          Supports PDF, DOC, Images, Videos (M4V, MP4)
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Selected Files */}
                  <AnimatePresence>
                    {files.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-8"
                      >
                        <h3 className="text-lg font-clash font-medium text-gray-900 mb-4 flex items-center space-x-2">
                          <FileText className="w-5 h-5" />
                          <span>Selected Files ({files.length})</span>
                        </h3>
                        <div className="space-y-3 max-h-64 overflow-y-auto">
                          {files.map((file, index) => {
                            const FileIcon = getFileIcon(file.type);
                            return (
                              <div
                                key={index}
                                className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl border border-gray-100 hover:bg-gray-100 transition-all duration-300"
                              >
                                <div className="p-2 bg-gray-200 rounded-lg">
                                  <FileIcon className="w-5 h-5 text-gray-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-clash font-medium text-gray-900 truncate">
                                    {file.name}
                                  </p>
                                  <p className="text-xs text-gray-600 font-clash">
                                    {formatFileSize(file.size)}
                                  </p>
                                </div>
                                <button
                                  onClick={() => removeFile(index)}
                                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-300"
                                  title="Remove file"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Action Buttons */}
                  <div className="flex space-x-4 mt-8">
                    <button
                      onClick={handleUpload}
                      disabled={uploading || files.length === 0}
                      className={`flex-1 py-4 px-6 rounded-2xl text-white font-clash font-medium transition-all duration-300 flex items-center justify-center space-x-2 ${
                        uploading || files.length === 0
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-[#4da2ff] hover:bg-[#3d91ef] shadow-lg hover:shadow-xl hover:shadow-[#4da2ff]/25"
                      }`}
                    >
                      {uploading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Processing...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="w-5 h-5" />
                          <span>Upload & Encrypt</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={clearFiles}
                      disabled={files.length === 0}
                      className="px-6 py-4 bg-white border border-gray-200 text-gray-700 font-clash font-medium rounded-2xl hover:border-[#4da2ff] hover:text-[#4da2ff] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Clear All
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Upload History */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-500">
                <div className="border-b border-gray-100 px-8 py-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-[#4da2ff]/10 rounded-xl">
                      <FileText className="w-6 h-6 text-[#4da2ff]" />
                    </div>
                    <div>
                      <h3 className="text-xl font-clash font-medium text-gray-900">
                        Upload History
                      </h3>
                      <p className="text-gray-600 text-sm font-clash font-light">
                        Recently uploaded documents
                      </p>
                    </div>
                  </div>
                </div>
                
                {uploadedFiles.length === 0 ? (
                  <div className="p-16 text-center">
                    <FileText className="mx-auto w-12 h-12 text-gray-300 mb-6" />
                    <p className="text-lg text-gray-500 font-clash font-light mb-2">
                      No files uploaded yet
                    </p>
                    <p className="text-sm text-gray-400 font-clash">
                      Upload documents to see them here
                    </p>
                  </div>
                ) : (
                  <div className="p-8">
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {uploadedFiles.map((file, index) => {
                        const FileIcon = getFileIcon(file.type);
                        return (
                          <div
                            key={file.id}
                            className="p-6 border border-gray-100 rounded-xl hover:bg-gray-50 transition-all duration-300"
                          >
                            <div className="flex items-start space-x-4">
                              <div className="p-2 bg-gray-200 rounded-lg">
                                <FileIcon className="w-6 h-6 text-gray-600" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-clash font-medium text-gray-900 truncate mb-1">
                                  {file.name}
                                </p>
                                <p className="text-xs text-gray-600 font-clash mb-3">
                                  {formatFileSize(file.size)} • {file.uploadedAt.toLocaleDateString()}
                                </p>
                                <div className="flex items-center space-x-2">
                                  <Hash className="w-3 h-3 text-gray-500" />
                                  <p className="text-xs font-mono text-gray-500 truncate bg-gray-100 px-2 py-1 rounded">
                                    {file.blobId}
                                  </p>
                                </div>
                              </div>
                              <div className="flex-shrink-0">
                                <CheckCircle className="w-6 h-6 text-[#4da2ff]" />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;