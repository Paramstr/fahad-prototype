'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

export default function NotaryVerification() {
  const [selectedJob, setSelectedJob] = useState<string | null>('NJ-2024-001');
  const [verificationResults, setVerificationResults] = useState<Record<string, 'verified' | 'failed' | 'pending'>>({});

  const completedJobs = [
    {
      id: 'NJ-2024-001',
      client: 'Al Madar Property Management',
      type: 'Legal Notices',
      uploadedCount: 350,
      completedAt: '2024-01-16T14:30:00',
      status: 'pending-verification',
      documents: [
        { 
          id: 'doc-1', 
          name: 'Eviction Notice - Unit 205A.pdf', 
          size: '1.2 MB',
          qrVerified: true,
          stampValid: true,
          signatureValid: true,
          metadataComplete: true
        },
        { 
          id: 'doc-2', 
          name: 'Eviction Notice - Unit 309B.pdf', 
          size: '1.1 MB',
          qrVerified: false,
          stampValid: true,
          signatureValid: true,
          metadataComplete: true
        },
        { 
          id: 'doc-3', 
          name: 'Rent Increase Notice - Building C.pdf', 
          size: '0.9 MB',
          qrVerified: true,
          stampValid: true,
          signatureValid: false,
          metadataComplete: true
        },
      ]
    },
    {
      id: 'NJ-2024-003',
      client: 'Dubai Properties REIT',
      type: 'Property Transfers',
      uploadedCount: 75,
      completedAt: '2024-01-15T16:45:00',
      status: 'verified',
      documents: []
    }
  ];

  const currentJob = completedJobs.find(job => job.id === selectedJob);

  const handleVerifyDocument = (docId: string) => {
    setVerificationResults(prev => ({ ...prev, [docId]: 'verified' }));
  };

  const handleRejectDocument = (docId: string) => {
    setVerificationResults(prev => ({ ...prev, [docId]: 'failed' }));
  };

  const getDocumentVerificationStatus = (docId: string) => {
    return verificationResults[docId] || 'pending';
  };

  const getVerificationIcon = (verified: boolean) => {
    return verified ? (
      <svg className="h-4 w-4 text-mantis-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    ) : (
      <svg className="h-4 w-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    );
  };

  const getOverallVerificationScore = () => {
    if (!currentJob) return 0;
    const totalChecks = currentJob.documents.length * 4; // 4 checks per document
    let passedChecks = 0;
    
    currentJob.documents.forEach(doc => {
      if (doc.qrVerified) passedChecks++;
      if (doc.stampValid) passedChecks++;
      if (doc.signatureValid) passedChecks++;
      if (doc.metadataComplete) passedChecks++;
    });
    
    return Math.round((passedChecks / totalChecks) * 100);
  };

  return (
    <div className="min-h-screen bg-praxeti-100">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <Link href="/notary" className="text-nuit-600 hover:text-nuit-800">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
              <h1 className="text-3xl font-bold text-midnight-900">Verification & Finalization</h1>
            </div>
            <p className="text-midnight-600">Verify completed notarizations and finalize job delivery</p>
          </div>
          
          {currentJob && currentJob.status === 'pending-verification' && (
            <button className="btn btn-primary">
              Finalize & Deliver
              <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Jobs Selection Panel */}
          <div className="lg:col-span-1">
            <div className="card card-padded bg-white sticky top-24">
              <h2 className="text-lg font-semibold text-midnight-900 mb-4">Recent Uploads</h2>
              <div className="space-y-3">
                {completedJobs.map((job) => (
                  <motion.div
                    key={job.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedJob(job.id)}
                    className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                      selectedJob === job.id
                        ? 'border-nuit-500 bg-nuit-50'
                        : 'border-gray-200 hover:border-nuit-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-midnight-900">{job.id}</span>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        job.status === 'verified' 
                          ? 'bg-mantis-100 text-mantis-700'
                          : 'bg-orange-100 text-orange-700'
                      }`}>
                        {job.status === 'verified' ? 'VERIFIED' : 'PENDING'}
                      </div>
                    </div>
                    <h3 className="font-medium text-midnight-900 mb-1">{job.client}</h3>
                    <p className="text-sm text-midnight-600 mb-2">{job.type}</p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-midnight-600">{job.uploadedCount} documents</span>
                      <span className="text-midnight-600">
                        {new Date(job.completedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Verification Panel */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {!selectedJob ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="card card-padded bg-white text-center py-16"
                >
                  <div className="mb-4">
                    <svg className="h-16 w-16 text-gray-300 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-midnight-900 mb-2">Select a Job to Verify</h3>
                  <p className="text-midnight-600">Choose a completed job from the left panel to begin verification.</p>
                </motion.div>
              ) : currentJob && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  {/* Job Overview */}
                  <div className="card card-padded bg-white">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h2 className="text-xl font-semibold text-midnight-900">{currentJob.client}</h2>
                        <p className="text-midnight-600">{currentJob.type} - {currentJob.uploadedCount} documents</p>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-nuit-700">{getOverallVerificationScore()}%</div>
                        <div className="text-sm text-midnight-600">Verification Score</div>
                      </div>
                    </div>

                    {/* Verification Summary */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      <div className="text-center p-4 bg-mantis-50 rounded-lg">
                        <div className="text-2xl font-bold text-mantis-600">
                          {currentJob.documents.filter(d => d.qrVerified).length}
                        </div>
                        <div className="text-sm text-mantis-700">QR Verified</div>
                      </div>
                      <div className="text-center p-4 bg-nuit-50 rounded-lg">
                        <div className="text-2xl font-bold text-nuit-700">
                          {currentJob.documents.filter(d => d.stampValid).length}
                        </div>
                        <div className="text-sm text-nuit-700">Valid Stamps</div>
                      </div>
                      <div className="text-center p-4 bg-spring-50 rounded-lg">
                        <div className="text-2xl font-bold text-spring-700">
                          {currentJob.documents.filter(d => d.signatureValid).length}
                        </div>
                        <div className="text-sm text-spring-700">Valid Signatures</div>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-gray-600">
                          {currentJob.documents.filter(d => d.metadataComplete).length}
                        </div>
                        <div className="text-sm text-gray-600">Complete Metadata</div>
                      </div>
                    </div>

                    {/* Auto-Verification Status */}
                    <div className="bg-nuit-50 border border-nuit-200 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <div className="p-2 bg-nuit-100 rounded-lg">
                          <svg className="h-5 w-5 text-nuit-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="font-medium text-nuit-800 mb-1">Auto-Verification Complete</h3>
                          <p className="text-sm text-nuit-700">
                            AI verification has checked all {currentJob.uploadedCount} documents for QR codes, stamps, signatures, and metadata. 
                            {currentJob.documents.filter(d => !d.qrVerified || !d.stampValid || !d.signatureValid || !d.metadataComplete).length > 0 
                              ? ` ${currentJob.documents.filter(d => !d.qrVerified || !d.stampValid || !d.signatureValid || !d.metadataComplete).length} documents require manual review.`
                              : ' All documents passed automated verification checks.'
                            }
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Document Verification List */}
                  {currentJob.documents.length > 0 && (
                    <div className="card card-padded bg-white">
                      <h3 className="text-lg font-semibold text-midnight-900 mb-4">Document Verification Details</h3>
                      <div className="space-y-4">
                        {currentJob.documents.map((doc, index) => {
                          const hasIssues = !doc.qrVerified || !doc.stampValid || !doc.signatureValid || !doc.metadataComplete;
                          const verificationStatus = getDocumentVerificationStatus(doc.id);
                          
                          return (
                            <motion.div
                              key={doc.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className={`border rounded-lg p-4 ${hasIssues ? 'border-orange-200 bg-orange-50' : 'border-gray-200'}`}
                            >
                              <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center space-x-3">
                                  <div className="p-2 bg-gray-100 rounded-lg">
                                    <svg className="h-5 w-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                  </div>
                                  <div>
                                    <h4 className="font-medium text-midnight-900">{doc.name}</h4>
                                    <div className="flex items-center space-x-4 mt-1">
                                      <span className="text-sm text-midnight-600">{doc.size}</span>
                                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                        verificationStatus === 'verified'
                                          ? 'bg-mantis-100 text-mantis-700'
                                          : verificationStatus === 'failed'
                                          ? 'bg-red-100 text-red-700'
                                          : 'bg-gray-100 text-gray-700'
                                      }`}>
                                        {verificationStatus.toUpperCase()}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                
                                {verificationStatus === 'pending' && (
                                  <div className="flex items-center space-x-2">
                                    <button
                                      onClick={() => handleVerifyDocument(doc.id)}
                                      className="btn btn-sm bg-mantis-600 text-white hover:bg-mantis-700"
                                    >
                                      ✓ Verify
                                    </button>
                                    <button
                                      onClick={() => handleRejectDocument(doc.id)}
                                      className="btn btn-sm bg-red-600 text-white hover:bg-red-700"
                                    >
                                      ✗ Reject
                                    </button>
                                  </div>
                                )}
                              </div>

                              {/* Verification Checklist */}
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="flex items-center space-x-2">
                                  {getVerificationIcon(doc.qrVerified)}
                                  <span className={`text-sm ${doc.qrVerified ? 'text-mantis-700' : 'text-red-700'}`}>
                                    QR Code
                                  </span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  {getVerificationIcon(doc.stampValid)}
                                  <span className={`text-sm ${doc.stampValid ? 'text-mantis-700' : 'text-red-700'}`}>
                                    Notary Stamp
                                  </span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  {getVerificationIcon(doc.signatureValid)}
                                  <span className={`text-sm ${doc.signatureValid ? 'text-mantis-700' : 'text-red-700'}`}>
                                    Digital Signature
                                  </span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  {getVerificationIcon(doc.metadataComplete)}
                                  <span className={`text-sm ${doc.metadataComplete ? 'text-mantis-700' : 'text-red-700'}`}>
                                    Metadata
                                  </span>
                                </div>
                              </div>

                              {hasIssues && verificationStatus === 'pending' && (
                                <div className="mt-3 p-3 bg-orange-100 rounded-lg">
                                  <p className="text-sm text-orange-800 font-medium mb-1">Issues Detected:</p>
                                  <ul className="text-sm text-orange-700 space-y-1">
                                    {!doc.qrVerified && <li>• QR code verification failed or missing</li>}
                                    {!doc.stampValid && <li>• Notary stamp invalid or not detected</li>}
                                    {!doc.signatureValid && <li>• Digital signature validation failed</li>}
                                    {!doc.metadataComplete && <li>• Document metadata incomplete</li>}
                                  </ul>
                                </div>
                              )}
                            </motion.div>
                          );
                        })}
                      </div>

                      {/* Batch Actions */}
                      <div className="mt-6 pt-6 border-t border-gray-200">
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-midnight-600">
                            {Object.values(verificationResults).filter(status => status === 'verified').length} of {currentJob.documents.length} documents manually verified
                          </div>
                          <div className="flex items-center space-x-3">
                            <button className="btn btn-ghost">
                              Request Corrections
                            </button>
                            <button className="btn btn-primary">
                              Complete Verification
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}