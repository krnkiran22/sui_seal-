'use client';

import React, { useState, useCallback } from 'react';
import { useCurrentAccount, ConnectButton } from '@mysten/dapp-kit';
import { Upload, Download, WalletIcon, Image as ImageIcon, Loader2, CheckCircle, AlertCircle, Lock, X } from 'lucide-react';
import { WalrusService, EncryptionResult } from '../lib/walrusService';
import '@mysten/dapp-kit/dist/index.css';

const walrusService = new WalrusService(5); // Store for 5 epochs

export default function WalrusImageDemo() {
  const currentAccount = useCurrentAccount();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<EncryptionResult | null>(null);
  const [retrieveBlobId, setRetrieveBlobId] = useState('');
  const [retrieveEncryptionId, setRetrieveEncryptionId] = useState('');
  const [isRetrieving, setIsRetrieving] = useState(false);
  const [retrievedImageUrl, setRetrievedImageUrl] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Handle file selection with validation
  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      return;
    }

    setSelectedFile(file);
    setError('');
    setSuccess('');
    setUploadResult(null);
    console.log('📁 File selected:', file.name, file.size, 'bytes');
  }, []);

  // Handle encrypted image upload
  const handleUpload = useCallback(async () => {
    if (!selectedFile) {
      setError('Please select a file first');
      return;
    }
    if (!currentAccount) {
      setError('Please connect your wallet first');
      return;
    }

    setIsUploading(true);
    setError('');
    setSuccess('');

    try {
      console.log('🔐 Starting encrypted upload to Walrus...');
      const result = await walrusService.storeImage(selectedFile, currentAccount.address);
      if (result.success && result.blobId) {
        setUploadResult(result);
        setSuccess(`🎉 Image encrypted and uploaded successfully! Blob ID: ${result.blobId}`);
        console.log('✅ Encrypted upload completed:', result);
      } else {
        throw new Error(result.error || 'Unknown encryption error');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Upload failed';
      setError(`Encrypted upload failed: ${errorMessage}`);
      console.error('❌ Upload error:', err);
    } finally {
      setIsUploading(false);
    }
  }, [selectedFile, currentAccount]);

  // Handle plain image upload (for testing performance)
  const handlePlainUpload = useCallback(async () => {
    if (!selectedFile) {
      setError('Please select a file first');
      return;
    }
    if (!currentAccount) {
      setError('Please connect your wallet first');
      return;
    }

    setIsUploading(true);
    setError('');
    setSuccess('');

    try {
      console.log('🚀 Starting plain upload to Walrus...');
      const blobId = await walrusService.storePlainImage(selectedFile);
      setUploadResult({ success: true, blobId, encryptionId: 'PLAIN_STORAGE', suiRef: '' });
      setSuccess(`🎉 Plain image uploaded successfully! Blob ID: ${blobId}`);
      console.log('✅ Plain upload completed:', blobId);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Upload failed';
      setError(`Plain upload failed: ${errorMessage}`);
      console.error('❌ Plain upload error:', err);
    } finally {
      setIsUploading(false);
    }
  }, [selectedFile, currentAccount]);

  // Handle image retrieval (plain or encrypted)
  const handleRetrieve = useCallback(async () => {
    if (!retrieveBlobId.trim()) {
      setError('Please enter a blob ID to retrieve');
      return;
    }

    setIsRetrieving(true);
    setError('');
    setRetrievedImageUrl('');
    setSuccess('');

    try {
      console.log('🔍 Retrieving image from Walrus...', { blobId: retrieveBlobId });
      if (retrieveEncryptionId.trim()) {
        // Encrypted image retrieval
        console.log('🔐 Decrypting with encryption ID:', retrieveEncryptionId);
        const decryptedBlob = await walrusService.retrieveImage(retrieveBlobId, retrieveEncryptionId);
        const dataUrl = await walrusService.blobToDataUrl(decryptedBlob);
        setRetrievedImageUrl(dataUrl);
        setSuccess('🎉 Image retrieved and decrypted successfully!');
        console.log('✅ Decrypted image retrieved:', dataUrl);
      } else {
        // Plain image retrieval
        const imageUrl = walrusService.getBlobUrl(retrieveBlobId);
        setRetrievedImageUrl(imageUrl);
        setSuccess('🎉 Plain image retrieved successfully!');
        console.log('✅ Plain image retrieved:', imageUrl);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Retrieval failed';
      setError(`Retrieval failed: ${errorMessage}`);
      console.error('❌ Retrieval error:', err);
    } finally {
      setIsRetrieving(false);
    }
  }, [retrieveBlobId, retrieveEncryptionId]);

  // Clear form state
  const handleClear = useCallback(() => {
    setSelectedFile(null);
    setUploadResult(null);
    setRetrieveBlobId('');
    setRetrieveEncryptionId('');
    setRetrievedImageUrl('');
    setError('');
    setSuccess('');
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
          <Lock className="w-8 h-8 text-blue-600" />
          Walrus Storage Demo
        </h1>
        <p className="text-gray-600">
          Store and retrieve images using Walrus decentralized storage with optional encryption
        </p>
      </div>

      {/* Wallet Connection Section */}
      <div className="mb-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <WalletIcon className="w-6 h-6 text-blue-600" />
            <div>
              <h3 className="font-semibold text-blue-900">Wallet Status</h3>
              {currentAccount ? (
                <p className="text-sm text-blue-700">
                  Connected: {currentAccount.address.slice(0, 8)}...{currentAccount.address.slice(-6)}
                </p>
              ) : (
                <p className="text-sm text-blue-700">Not connected</p>
              )}
            </div>
          </div>
          <ConnectButton />
        </div>
      </div>

      {/* Error/Success Messages */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <p className="text-red-800">{error}</p>
        </div>
      )}
      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
          <p className="text-green-800">{success}</p>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-8">
        {/* Upload Section */}
        <div className="space-y-6">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 justify-center">
              <Upload className="w-5 h-5" />
              Store Image on Walrus
            </h2>
            <div className="space-y-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {selectedFile && (
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <ImageIcon className="w-4 h-4" />
                    <span>{selectedFile.name}</span>
                    <span className="text-gray-500">
                      ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                    </span>
                  </div>
                </div>
              )}
              <div className="space-y-2">
                <button
                  onClick={handleUpload}
                  disabled={!selectedFile || isUploading || !currentAccount}
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Encrypting & Uploading...
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      Store Encrypted Image
                    </>
                  )}
                </button>
                <button
                  onClick={handlePlainUpload}
                  disabled={!selectedFile || isUploading || !currentAccount}
                  className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Uploading Plain...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      Store Plain Image
                    </>
                  )}
                </button>
                <button
                  onClick={handleClear}
                  className="w-full bg-gray-200 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-300 transition-colors flex items-center justify-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Clear
                </button>
              </div>
            </div>
            {uploadResult && uploadResult.success && (
              <div className="mt-4 p-4 bg-green-50 rounded-lg text-left">
                <h4 className="text-sm text-green-800 font-semibold mb-2">Upload Result:</h4>
                <div className="space-y-1 text-xs text-green-700 font-mono">
                  <div><strong>Blob ID:</strong> {uploadResult.blobId}</div>
                  {uploadResult.encryptionId !== 'PLAIN_STORAGE' && (
                    <>
                      <div><strong>Encryption ID:</strong> {uploadResult.encryptionId}</div>
                      <div><strong>Sui Ref:</strong> {uploadResult.suiRef || 'N/A'}</div>
                    </>
                  )}
                  {uploadResult.encryptionId === 'PLAIN_STORAGE' && (
                    <div><strong>Storage:</strong> Plain (no encryption)</div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Retrieve Section */}
        <div className="space-y-6">
          <div className="border-2 border-gray-300 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Download className="w-5 h-5" />
              Retrieve Image from Walrus
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Blob ID</label>
                <input
                  type="text"
                  value={retrieveBlobId}
                  onChange={(e) => setRetrieveBlobId(e.target.value)}
                  placeholder="Enter blob ID to retrieve..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm font-mono"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Encryption ID (optional for plain images)
                </label>
                <input
                  type="text"
                  value={retrieveEncryptionId}
                  onChange={(e) => setRetrieveEncryptionId(e.target.value)}
                  placeholder="Enter encryption ID for decryption..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm font-mono"
                />
              </div>
              <button
                onClick={handleRetrieve}
                disabled={!retrieveBlobId.trim() || isRetrieving}
                className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isRetrieving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Retrieving...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    Retrieve Image
                  </>
                )}
              </button>
              {uploadResult && uploadResult.blobId && (
                <button
                  onClick={() => {
                    setRetrieveBlobId(uploadResult.blobId!);
                    setRetrieveEncryptionId(uploadResult.encryptionId || '');
                  }}
                  className="w-full text-blue-600 text-sm hover:text-blue-700"
                >
                  Use uploaded blob ID
                </button>
              )}
            </div>
            {retrievedImageUrl && (
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  {retrieveEncryptionId ? 'Decrypted Image:' : 'Retrieved Image:'}
                </h3>
                <div className="border rounded-lg p-2 bg-gray-50">
                  <img
                    src={retrievedImageUrl}
                    alt={retrieveEncryptionId ? 'Decrypted from Walrus' : 'Retrieved from Walrus'}
                    className="max-w-full h-auto rounded"
                    onError={() => setError('Failed to load image from Walrus')}
                    onLoad={() => console.log('✅ Image loaded successfully from Walrus')}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2 break-all">
                  <strong>URL:</strong> {retrievedImageUrl}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Information Section */}
      <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <Lock className="w-5 h-5 text-blue-600" />
          How Walrus Storage Works:
        </h3>
        <ul className="text-sm text-gray-700 space-y-2">
          <li>• <strong>Plain Storage:</strong> Images are stored directly on Walrus testnet for 5 epochs.</li>
          <li>• <strong>Encrypted Storage:</strong> Images are encrypted using Seal protocol before storage.</li>
          <li>• <strong>Retrieval:</strong> Fetch plain images with Blob ID or encrypted images with both Blob ID and Encryption ID.</li>
          <li>• <strong>Decryption:</strong> Encrypted images require the correct encryption ID for decryption.</li>
          <li>• <strong>Blockchain Integration:</strong> Uses Sui blockchain for wallet authentication and encryption operations.</li>
        </ul>
      </div>
    </div>
  );
}