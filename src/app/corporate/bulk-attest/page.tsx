'use client';

import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';

interface BulkFile {
  id: string;
  file: File;
  name: string;
  size: string;
  status: 'pending' | 'analyzing' | 'processed' | 'error';
  progress: number;
  analysisResult?: {
    documentType: string;
    confidence: number;
    estimatedCost: number;
    isValid: boolean;
    validationIssues?: string[];
    recommendations?: string[];
  };
}

export default function BulkAttestPage() {
  const [files, setFiles] = useState<BulkFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileUpload = useCallback((uploadedFiles: FileList) => {
    const newFiles: BulkFile[] = Array.from(uploadedFiles).map(file => ({
      id: `${Date.now()}-${Math.random()}`,
      file,
      name: file.name,
      size: formatFileSize(file.size),
      status: 'pending',
      progress: 0
    }));

    setFiles(prev => [...prev, ...newFiles]);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length > 0) {
      handleFileUpload(droppedFiles);
    }
  }, [handleFileUpload]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      handleFileUpload(selectedFiles);
    }
  }, [handleFileUpload]);

  const processFiles = async () => {
    setIsProcessing(true);
    
    for (let i = 0; i < files.length; i++) {
      if (files[i].status === 'pending') {
        // Start analyzing
        setFiles(prev => prev.map((file, index) => 
          index === i ? { ...file, status: 'analyzing', progress: 25 } : file
        ));

        // Simulate AI analysis
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Update with analysis results
        const validityRandom = Math.random();
        const isValid = validityRandom > 0.25; // 75% valid, 25% invalid
        
        setFiles(prev => prev.map((file, index) => 
          index === i ? { 
            ...file, 
            status: 'processed',
            progress: 100,
            analysisResult: {
              documentType: ['Birth Certificate', 'Educational Certificate', 'Commercial Contract', 'Marriage Certificate'][Math.floor(Math.random() * 4)],
              confidence: 85 + Math.floor(Math.random() * 15),
              estimatedCost: 120 + Math.floor(Math.random() * 100),
              isValid,
              validationIssues: !isValid ? [
                'Document quality too low',
                'Missing required stamps',
                'Incomplete information',
                'Unsupported language'
              ].slice(0, Math.ceil(Math.random() * 2) + 1) : undefined,
              recommendations: !isValid ? [
                'Re-scan with higher resolution',
                'Obtain official stamps',
                'Complete missing fields',
                'Provide translation'
              ].slice(0, Math.ceil(Math.random() * 2) + 1) : ['Document ready for attestation']
            }
          } : file
        ));

        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
    
    setIsProcessing(false);
  };

  const simulateBulkUpload = () => {
    // Generate 20 diverse documents with different types and validity levels
    const documentTypes = [
      'Birth Certificate', 'Educational Certificate', 'Marriage Certificate', 'Commercial Contract',
      'Power of Attorney', 'Legal Notice', 'Court Order', 'Medical Certificate',
      'Employment Letter', 'Bank Statement', 'Property Deed', 'Driving License',
      'Passport Copy', 'Trade License', 'Invoice', 'Tax Certificate',
      'Insurance Policy', 'Rental Agreement', 'Affidavit', 'Divorce Certificate'
    ];

    const companyNames = [
      'Al Mansouri Trading', 'Emirates Corp', 'Dubai Holdings', 'Gulf Industries',
      'Sharjah Enterprises', 'Abu Dhabi Ltd', 'Middle East Co', 'Arabian Business',
      'UAE Ventures', 'Persian Gulf Inc', 'Falcon Group', 'Desert Wind LLC',
      'Palm Tree Corp', 'Golden Sands', 'Blue Ocean', 'Mountain View',
      'City Center', 'Royal Plaza', 'Crown Holdings', 'Star Enterprises'
    ];

    const mockFiles: BulkFile[] = Array.from({ length: 20 }, (_, i) => {
      const validityRandom = Math.random();
      let status: 'pending' | 'analyzing' | 'processed' | 'error';
      let progress: number;
      
      // 15% pending, 25% analyzing, 55% processed, 5% error
      if (validityRandom < 0.15) {
        status = 'pending';
        progress = 0;
      } else if (validityRandom < 0.4) {
        status = 'analyzing';
        progress = 10 + Math.floor(Math.random() * 40);
      } else if (validityRandom < 0.95) {
        status = 'processed';
        progress = 100;
      } else {
        status = 'error';
        progress = 0;
      }

      const fileName = `${companyNames[i]}_${documentTypes[i]}.pdf`.replace(/\s+/g, '_').toLowerCase();
      const mockFile = new File([''], fileName, { type: 'application/pdf' });

      return {
        id: `${Date.now()}-${i}`,
        file: mockFile,
        name: fileName,
        size: `${(1.2 + Math.random() * 4).toFixed(1)} MB`,
        status,
        progress,
        analysisResult: status === 'processed' ? {
          documentType: documentTypes[i],
          confidence: 75 + Math.floor(Math.random() * 25),
          estimatedCost: 80 + Math.floor(Math.random() * 150),
          isValid: Math.random() > 0.25,
          validationIssues: Math.random() > 0.25 ? undefined : [
            'Document quality too low',
            'Missing required stamps',
            'Incomplete information'
          ].slice(0, Math.ceil(Math.random() * 2) + 1),
          recommendations: Math.random() > 0.25 ? ['Document ready for attestation'] : [
            'Re-scan with higher resolution',
            'Obtain official stamps',
            'Complete missing fields'
          ].slice(0, Math.ceil(Math.random() * 2) + 1)
        } : undefined
      };
    });

    setFiles(mockFiles);

    // Simulate real-time updates for processing documents
    const processingFiles = mockFiles.filter(file => file.status === 'analyzing' || file.status === 'pending');
    
    processingFiles.forEach((file, index) => {
      setTimeout(() => {
        setFiles(prev => prev.map(f => 
          f.id === file.id 
            ? { 
                ...f, 
                progress: Math.min(f.progress + 30 + Math.floor(Math.random() * 40), 100),
                status: f.progress >= 70 ? 'processed' as const : 'analyzing' as const,
                analysisResult: f.progress >= 50 && !f.analysisResult ? {
                  documentType: documentTypes[index % documentTypes.length],
                  confidence: 75 + Math.floor(Math.random() * 25),
                  estimatedCost: 80 + Math.floor(Math.random() * 150),
                  isValid: Math.random() > 0.25,
                  validationIssues: Math.random() > 0.25 ? undefined : [
                    'Document quality too low',
                    'Missing required stamps'
                  ].slice(0, 1),
                  recommendations: Math.random() > 0.25 ? ['Document ready for attestation'] : [
                    'Re-scan with higher resolution',
                    'Obtain official stamps'
                  ].slice(0, 1)
                } : f.analysisResult
              }
            : f
        ));
      }, 1000 + index * 300);
    });
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(file => file.id !== id));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-gray-600 bg-gray-100';
      case 'analyzing': return 'text-nuit-600 bg-nuit-100';
      case 'processed': return 'text-mantis-600 bg-mantis-100';
      case 'error': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const totalCost = files.reduce((sum, file) => sum + (file.analysisResult?.estimatedCost || 0), 0);
  const processedFiles = files.filter(file => file.status === 'processed').length;
  const validFiles = files.filter(file => file.analysisResult?.isValid).length;
  const invalidFiles = files.filter(file => file.analysisResult?.isValid === false).length;

  return (
    <div className="min-h-screen bg-praxeti-100">
      <Navbar />

      {/* Header */}
      <header className="max-w-full border-b border-gray-200 mx-auto px-6 sm:px-8 lg:px-12 py-6">
        <div className="flex items-center justify-between">
          <div>
            <Link
              href="/corporate"
              className="flex items-center gap-2 text-sm font-medium text-brand-600 hover:text-brand-700 mb-2"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Corporate Dashboard
            </Link>
            <h1 className="text-3xl font-semibold text-midnight-900">Bulk Document Attestation</h1>
            <p className="text-midnight-600 mt-1">Upload multiple documents for batch attestation processing</p>
          </div>
          
          {files.length > 0 && (
            <div className="text-right">
              <div className="text-sm text-midnight-600">
                {processedFiles} of {files.length} processed
              </div>
              <div className="text-lg font-semibold text-brand-600">
                Estimated: AED {totalCost.toLocaleString()}
              </div>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-8">
        {/* Upload Zone */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div
            className={`border-2 border-dashed rounded-xl p-12 transition-all duration-300 ${
              isDragOver 
                ? 'border-brand-500 bg-brand-50' 
                : 'border-gray-300 bg-white hover:border-brand-400 hover:bg-brand-50'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="text-center">
              <motion.div
                className="mx-auto w-16 h-16 bg-brand-600 rounded-full flex items-center justify-center mb-6"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                </svg>
              </motion.div>
              <h3 className="text-xl font-semibold text-midnight-900 mb-2">Drop documents here or click to browse</h3>
              <p className="text-midnight-600 mb-6">Upload multiple PDF, image, or Word files for bulk attestation</p>
              <div className="flex space-x-4">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-8 py-3 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Select Files
                </button>
                <button
                  onClick={simulateBulkUpload}
                  className="px-8 py-3 bg-nuit-600 text-white rounded-lg hover:bg-nuit-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Simulate Bulk Upload (20 Files)
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-4">Supports PDF, JPG, JPEG, PNG, DOC, DOCX files</p>
            </div>
            
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
        </motion.div>

        {/* Validation Summary - appears when files are processed */}
        {processedFiles > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="card p-6 mb-6"
          >
            <div className="flex items-center justify-between">
              {/* Left: Summary Stats */}
              <div className="flex items-center space-x-8">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-mantis-500 rounded-full"></div>
                  <span className="text-sm font-medium text-midnight-900">{validFiles} Valid</span>
                </div>
                {invalidFiles > 0 && (
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-sm font-medium text-midnight-900">{invalidFiles} Invalid</span>
                  </div>
                )}
                <div className="text-sm text-midnight-600">
                  Total: <span className="font-semibold text-brand-600">AED {totalCost.toLocaleString()}</span>
                </div>
              </div>

              {/* Right: Action Buttons */}
              <div className="flex items-center space-x-3">
                {invalidFiles > 0 && (
                  <button
                    className="px-4 py-2 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-all duration-200 font-medium"
                    onClick={() => {
                      // Scroll to invalid documents section
                      const invalidSection = document.getElementById('invalid-documents');
                      if (invalidSection) {
                        invalidSection.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                  >
                    Review Issues ({invalidFiles})
                  </button>
                )}
                
                {validFiles > 0 && (
                  <button
                    onClick={() => router.push('/corporate')}
                    className="px-6 py-2 text-sm bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-all duration-200 font-medium"
                  >
                    {invalidFiles > 0 ? `Proceed with ${validFiles} Valid` : 'Proceed to Payment'}
                  </button>
                )}
              </div>
            </div>

            {/* Compact Invalid Documents List */}
            {invalidFiles > 0 && (
              <motion.div
                id="invalid-documents"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-4 pt-4 border-t border-gray-200"
              >
                <div className="text-sm font-medium text-red-700 mb-3">Documents needing attention:</div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                  {files
                    .filter(file => file.analysisResult?.isValid === false)
                    .map(file => (
                      <div key={file.id} className="flex items-start justify-between p-3 bg-red-50 rounded-lg border border-red-100">
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-midnight-900 truncate">{file.name}</div>
                          <div className="text-xs text-red-600 mt-1">
                            {file.analysisResult?.validationIssues?.slice(0, 2).join(', ')}
                          </div>
                        </div>
                        <button
                          onClick={() => removeFile(file.id)}
                          className="ml-3 text-red-400 hover:text-red-600 transition-colors"
                        >
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* File List */}
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="card mb-8"
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-midnight-900">
                  Uploaded Files ({files.length})
                </h2>
                <div className="flex space-x-4">
                  {files.some(file => file.status === 'pending') && (
                    <button
                      onClick={processFiles}
                      disabled={isProcessing}
                      className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                        isProcessing
                          ? 'bg-gray-400 text-white cursor-not-allowed'
                          : 'bg-brand-600 text-white hover:bg-brand-700 shadow-md hover:shadow-lg'
                      }`}
                    >
                      {isProcessing ? (
                        <div className="flex items-center space-x-2">
                          <motion.svg 
                            className="h-4 w-4"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </motion.svg>
                          <span>Processing...</span>
                        </div>
                      ) : (
                        'Process All Files'
                      )}
                    </button>
                  )}
                  <button
                    onClick={() => setFiles([])}
                    className="px-4 py-2 bg-gray-100 text-midnight-700 rounded-lg hover:bg-gray-200 transition-all duration-200"
                  >
                    Clear All
                  </button>
                </div>
              </div>
            </div>

            <div className="divide-y divide-gray-200">
              <AnimatePresence>
                {files.map((file) => (
                  <motion.div
                    key={file.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2 }}
                    className="p-6 hover:bg-praxeti-200 transition-colors duration-150"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 flex-1">
                        <div className="flex-shrink-0 h-10 w-10 bg-brand-100 rounded-lg flex items-center justify-center">
                          <svg className="h-6 w-6 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-4">
                            <div>
                              <p className="text-sm font-medium text-midnight-900 truncate">{file.name}</p>
                              <div className="flex items-center space-x-4 mt-1">
                                <p className="text-sm text-midnight-600">{file.size}</p>
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(file.status)}`}>
                                  {file.status}
                                </span>
                                {file.analysisResult && (
                                  <>
                                    <span className="text-sm text-midnight-600">
                                      {file.analysisResult.documentType}
                                    </span>
                                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                                      file.analysisResult.isValid 
                                        ? 'bg-mantis-100 text-mantis-700' 
                                        : 'bg-red-100 text-red-700'
                                    }`}>
                                      {file.analysisResult.isValid ? 'Valid' : 'Invalid'}
                                    </span>
                                    <span className="text-sm font-medium text-brand-600">
                                      AED {file.analysisResult.estimatedCost}
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          {/* Progress Bar */}
                          <div className="mt-3">
                            <div className="flex items-center">
                              <div className="w-full bg-gray-200 rounded-full h-2 mr-4">
                                <motion.div 
                                  className="bg-brand-600 h-2 rounded-full"
                                  initial={{ width: 0 }}
                                  animate={{ width: `${file.progress}%` }}
                                  transition={{ duration: 0.5 }}
                                />
                              </div>
                              <span className="text-sm text-midnight-600 min-w-[3rem]">{file.progress}%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => removeFile(file.id)}
                        className="ml-4 p-1 text-gray-400 hover:text-red-600 transition-colors duration-200"
                      >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

          </motion.div>
        )}

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="card p-6"
        >
          <h3 className="text-lg font-semibold text-midnight-900 mb-4">Bulk Attestation Process</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-brand-600 font-semibold">1</span>
              </div>
              <h4 className="font-medium text-midnight-900 mb-2">Upload Documents</h4>
              <p className="text-sm text-midnight-600">Upload multiple documents in supported formats</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-brand-600 font-semibold">2</span>
              </div>
              <h4 className="font-medium text-midnight-900 mb-2">AI Analysis</h4>
              <p className="text-sm text-midnight-600">Our AI analyzes each document and recommends services</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-brand-600 font-semibold">3</span>
              </div>
              <h4 className="font-medium text-midnight-900 mb-2">Batch Processing</h4>
              <p className="text-sm text-midnight-600">All documents are processed simultaneously</p>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}