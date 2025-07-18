'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

type WorkflowStep = 'download' | 'external' | 'upload' | 'verification';

export default function NotaryWorkflow() {
  const [currentStep, setCurrentStep] = useState<WorkflowStep>('download');
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const jobData = {
    id: 'NJ-2024-001',
    client: 'Al Madar Property Management',
    type: 'Legal Notices',
    count: 350,
    approvedCount: 347,
    zipSize: '45.2 MB'
  };

  const workflowSteps = [
    { id: 'download', label: 'Download Documents', icon: '📥' },
    { id: 'external', label: 'External Notarization', icon: '🏛️' },
    { id: 'upload', label: 'Upload Notarized', icon: '📤' },
    { id: 'verification', label: 'Final Verification', icon: '✅' }
  ];

  const handleDownload = async () => {
    setDownloadProgress(0);
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setDownloadProgress(i);
    }
    setTimeout(() => setCurrentStep('external'), 1000);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSelectedFiles(files);
  };

  const handleUpload = async () => {
    setUploadProgress(0);
    for (let i = 0; i <= 100; i += 5) {
      await new Promise(resolve => setTimeout(resolve, 100));
      setUploadProgress(i);
    }
    setTimeout(() => setCurrentStep('verification'), 1000);
  };

  const getStepStatus = (step: WorkflowStep) => {
    const stepIndex = workflowSteps.findIndex(s => s.id === step);
    const currentIndex = workflowSteps.findIndex(s => s.id === currentStep);
    
    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'current';
    return 'pending';
  };

  return (
    <div className="min-h-screen bg-praxeti-100">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <Link href="/notary/review" className="text-nuit-600 hover:text-nuit-800">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
              <h1 className="text-3xl font-bold text-midnight-900">External Notarization Workflow</h1>
            </div>
            <p className="text-midnight-600">Download, notarize externally, and upload completed documents</p>
          </div>
          
          <div className="text-right">
            <div className="text-sm text-midnight-600">Job ID: {jobData.id}</div>
            <div className="font-medium text-midnight-900">{jobData.client}</div>
          </div>
        </div>

        {/* Enhanced Progress Stepper */}
        <motion.div 
          className="relative bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-between relative">
            {/* Background line */}
            <div className="absolute top-6 left-6 right-6 h-0.5 bg-gray-200 -z-10"></div>
            
            {workflowSteps.map((step, index) => {
              const status = getStepStatus(step.id as WorkflowStep);
              return (
                <motion.div 
                  key={step.id} 
                  className="flex flex-col items-center relative z-10"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <motion.div 
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-medium transition-all duration-500 ${
                      status === 'completed' 
                        ? 'bg-gradient-to-br from-mantis-500 to-mantis-600 text-white shadow-lg' 
                        : status === 'current'
                        ? 'bg-gradient-to-br from-nuit-600 to-nuit-700 text-white shadow-lg ring-4 ring-nuit-200'
                        : 'bg-gray-100 text-gray-400 border-2 border-gray-200'
                    }`}
                    whileHover={{ scale: status === 'current' ? 1.1 : 1.05 }}
                    transition={{ duration: 0.2 }}
                  >
                    {status === 'completed' ? (
                      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <span className="text-sm">{index + 1}</span>
                    )}
                  </motion.div>
                  <div className={`mt-3 text-center transition-colors duration-300 ${
                    status === 'current' ? 'text-nuit-700' : status === 'completed' ? 'text-mantis-700' : 'text-midnight-600'
                  }`}>
                    <div className="text-sm font-medium">{step.label}</div>
                    {status === 'current' && (
                      <motion.div 
                        className="text-xs text-nuit-600 mt-1"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                      >
                        Current step
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          {currentStep === 'download' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100"
            >
              <div className="text-center mb-8">
                <motion.div 
                  className="w-20 h-20 bg-gradient-to-br from-nuit-100 to-nuit-200 rounded-2xl flex items-center justify-center mx-auto mb-6"
                  whileHover={{ scale: 1.05, rotate: 2 }}
                  transition={{ duration: 0.3 }}
                >
                  <svg className="h-10 w-10 text-nuit-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                  </svg>
                </motion.div>
                <h2 className="text-3xl font-medium text-midnight-900 mb-3">Ready to Download</h2>
                <p className="text-midnight-600 max-w-lg mx-auto text-lg">
                  {jobData.approvedCount} documents are ready for external notarization
                </p>
              </div>

              <div className="bg-gradient-to-r from-praxeti-50 to-gray-50 rounded-2xl p-6 mb-8">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-nuit-700 mb-1">{jobData.approvedCount}</div>
                    <div className="text-sm text-midnight-600">Documents</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-spring-700 mb-1">{jobData.zipSize}</div>
                    <div className="text-sm text-midnight-600">File Size</div>
                  </div>
                  <div className="text-center">
                    <div className="inline-flex items-center space-x-2">
                      <div className="w-3 h-3 bg-mantis-500 rounded-full animate-pulse"></div>
                      <span className="text-lg font-semibold text-mantis-700">Ready</span>
                    </div>
                    <div className="text-sm text-midnight-600">Status</div>
                  </div>
                </div>
              </div>

              {downloadProgress > 0 && downloadProgress < 100 && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-midnight-600">Preparing download...</span>
                    <span className="text-sm text-midnight-600">{downloadProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <motion.div 
                      className="bg-nuit-600 h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${downloadProgress}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center justify-center space-x-4">
                <motion.button
                  onClick={handleDownload}
                  disabled={downloadProgress > 0 && downloadProgress < 100}
                  className="relative overflow-hidden px-8 py-4 bg-gradient-to-r from-nuit-600 to-nuit-700 text-white rounded-xl font-medium shadow-lg hover:shadow-xl disabled:opacity-50 transition-all duration-300"
                  whileHover={{ scale: downloadProgress > 0 && downloadProgress < 100 ? 1 : 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="relative z-10 flex items-center">
                    {downloadProgress === 100 ? (
                      <>
                        <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Downloaded Successfully
                      </>
                    ) : downloadProgress > 0 ? (
                      <>
                        <div className="mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Downloading...
                      </>
                    ) : (
                      <>
                        <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Download Documents
                      </>
                    )}
                  </span>
                </motion.button>
                
                {downloadProgress === 100 && (
                  <motion.button
                    onClick={() => setCurrentStep('external')}
                    className="px-6 py-3 bg-mantis-500 hover:bg-mantis-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Continue →
                  </motion.button>
                )}
              </div>
            </motion.div>
          )}

          {currentStep === 'external' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="card card-padded bg-white"
            >
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="h-8 w-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h2 className="text-2xl font-semibold text-midnight-900 mb-2">External Notarization Process</h2>
                <p className="text-midnight-600 max-w-2xl mx-auto">
                  Process the downloaded documents through your licensed notarization system. 
                  Complete the signing, stamping, and QR coding as required.
                </p>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-6">
                <h3 className="font-semibold text-amber-800 mb-4">External System Checklist:</h3>
                <div className="space-y-3">
                  {[
                    'Upload documents to MOJ/Notary portal',
                    'Complete digital signature process',
                    'Apply official notary stamp/seal',
                    'Generate QR verification codes',
                    'Download finalized notarized documents',
                    'Ensure all documents have proper metadata'
                  ].map((item, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-5 h-5 border-2 border-amber-400 rounded flex items-center justify-center">
                        <div className="w-2 h-2 bg-amber-400 rounded"></div>
                      </div>
                      <span className="text-amber-800">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-center">
                <button
                  onClick={() => setCurrentStep('upload')}
                  className="btn btn-primary btn-lg"
                >
                  I&apos;ve Completed External Notarization
                  <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </motion.div>
          )}

          {currentStep === 'upload' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="card card-padded bg-white"
            >
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-mantis-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="h-8 w-8 text-mantis-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <h2 className="text-2xl font-semibold text-midnight-900 mb-2">Upload Notarized Documents</h2>
                <p className="text-midnight-600 max-w-2xl mx-auto">
                  Upload the completed, notarized documents back to the platform. Ensure all documents 
                  include proper stamps, signatures, and QR verification codes.
                </p>
              </div>

              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 mb-6 text-center">
                <input
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="notarized-upload"
                />
                <label htmlFor="notarized-upload" className="cursor-pointer">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  <div className="text-lg font-medium text-midnight-900 mb-2">
                    {selectedFiles.length > 0 ? `${selectedFiles.length} files selected` : 'Drop files here or click to browse'}
                  </div>
                  <div className="text-sm text-midnight-600">
                    Upload notarized PDFs, batch ZIP files, or individual documents
                  </div>
                </label>
              </div>

              {selectedFiles.length > 0 && (
                <div className="bg-gray-50 rounded-xl p-4 mb-6">
                  <h4 className="font-medium text-midnight-900 mb-3">Selected Files:</h4>
                  <div className="space-y-2">
                    {selectedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-white rounded border">
                        <div className="flex items-center space-x-3">
                          <svg className="h-5 w-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <span className="text-sm font-medium text-midnight-900">{file.name}</span>
                        </div>
                        <span className="text-sm text-midnight-600">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {uploadProgress > 0 && uploadProgress < 100 && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-midnight-600">Uploading and verifying...</span>
                    <span className="text-sm text-midnight-600">{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <motion.div 
                      className="bg-mantis-600 h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${uploadProgress}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center justify-center space-x-4">
                <button
                  onClick={handleUpload}
                  disabled={selectedFiles.length === 0 || (uploadProgress > 0 && uploadProgress < 100)}
                  className="btn btn-primary btn-lg disabled:opacity-50"
                >
                  {uploadProgress === 100 ? 'Uploaded ✓' : uploadProgress > 0 ? 'Uploading...' : 'Upload Notarized Documents'}
                </button>
              </div>
            </motion.div>
          )}

          {currentStep === 'verification' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="card card-padded bg-white"
            >
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-mantis-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="h-8 w-8 text-mantis-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-semibold text-midnight-900 mb-2">Final Verification Complete</h2>
                <p className="text-midnight-600 max-w-2xl mx-auto">
                  All documents have been successfully verified and processed. The notarization job is now complete.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="text-center p-6 bg-mantis-50 rounded-xl">
                  <div className="text-3xl font-bold text-mantis-600 mb-2">{jobData.approvedCount}</div>
                  <div className="text-sm text-mantis-700">Documents Notarized</div>
                </div>
                <div className="text-center p-6 bg-spring-50 rounded-xl">
                  <div className="text-3xl font-bold text-spring-700 mb-2">100%</div>
                  <div className="text-sm text-spring-700">Verification Rate</div>
                </div>
                <div className="text-center p-6 bg-nuit-50 rounded-xl">
                  <div className="text-3xl font-bold text-nuit-700 mb-2">AED 2,100</div>
                  <div className="text-sm text-nuit-700">Earnings (This Job)</div>
                </div>
              </div>

              <div className="bg-mantis-50 border border-mantis-200 rounded-xl p-6 mb-6">
                <div className="flex items-start space-x-3">
                  <svg className="h-5 w-5 text-mantis-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <h3 className="font-medium text-mantis-800 mb-1">Job Completed Successfully</h3>
                    <p className="text-sm text-mantis-700">
                      All {jobData.approvedCount} documents have been notarized and verified. Payment has been processed 
                      and added to your ledger. Client has been notified of completion.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center space-x-4">
                <Link href="/notary/ledger">
                  <button className="btn btn-secondary">
                    View Ledger
                  </button>
                </Link>
                <Link href="/notary">
                  <button className="btn btn-primary">
                    Return to Dashboard
                  </button>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}