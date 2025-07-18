'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

export default function NotaryReview() {
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [documentReviews, setDocumentReviews] = useState<Record<string, 'approved' | 'needs-correction' | 'pending'>>({});

  const jobs = [
    {
      id: 'NJ-2024-001',
      client: 'Al Madar Property Management',
      type: 'Legal Notices',
      count: 350,
      priority: 'high',
      aiFlags: 47,
      documents: [
        { id: 'doc-1', name: 'Eviction Notice - Unit 205A.pdf', issues: ['Missing tenant signature date', 'Unclear property address'] },
        { id: 'doc-2', name: 'Eviction Notice - Unit 309B.pdf', issues: [] },
        { id: 'doc-3', name: 'Rent Increase Notice - Building C.pdf', issues: ['Invalid effective date format'] },
      ]
    },
    {
      id: 'NJ-2024-002',
      client: 'Emirates Real Estate LLC',
      type: 'Tenancy Agreements',
      count: 125,
      priority: 'medium',
      aiFlags: 12,
      documents: [
        { id: 'doc-4', name: 'Tenancy Agreement - Villa 45.pdf', issues: [] },
        { id: 'doc-5', name: 'Tenancy Agreement - Apt 1203.pdf', issues: ['Missing landlord contact details'] },
      ]
    }
  ];

  const currentJob = jobs.find(job => job.id === selectedJob);

  const handleDocumentAction = (docId: string, action: 'approved' | 'needs-correction') => {
    setDocumentReviews(prev => ({ ...prev, [docId]: action }));
  };

  const getDocumentStatus = (docId: string) => {
    return documentReviews[docId] || 'pending';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-mantis-100 text-mantis-700';
      case 'needs-correction': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
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
              <h1 className="text-3xl font-bold text-midnight-900">Document Review</h1>
            </div>
            <p className="text-midnight-600">AI pre-screening and batch document approval</p>
          </div>
          
          {selectedJob && (
            <Link href={`/notary/workflow/${selectedJob}`}>
              <button className="btn btn-primary">
                Proceed to Workflow
                <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Job Selection Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-midnight-900 mb-4">Available Jobs</h2>
              <div className="space-y-3">
                {jobs.map((job) => (
                  <motion.div
                    key={job.id}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => setSelectedJob(job.id)}
                    className={`p-5 rounded-xl border-2 cursor-pointer transition-all duration-200 transform hover:scale-102 ${
                      selectedJob === job.id
                        ? 'border-brand-500 bg-brand-600 text-white shadow-lg'
                        : 'border-gray-200 hover:border-brand-400 hover:bg-brand-50 hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className={`text-sm font-semibold ${
                        selectedJob === job.id ? 'text-white' : 'text-midnight-900'
                      }`}>{job.id}</span>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                        selectedJob === job.id 
                          ? job.priority === 'high' 
                            ? 'bg-white/20 text-white' 
                            : 'bg-white/20 text-white'
                          : job.priority === 'high' 
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {job.priority.toUpperCase()}
                      </div>
                    </div>
                    <h3 className={`font-bold text-lg mb-2 ${
                      selectedJob === job.id ? 'text-white' : 'text-midnight-900'
                    }`}>{job.client}</h3>
                    <p className={`text-sm mb-3 ${
                      selectedJob === job.id ? 'text-white/80' : 'text-midnight-600'
                    }`}>{job.type}</p>
                    <div className="flex items-center justify-between text-sm">
                      <span className={`font-semibold ${
                        selectedJob === job.id ? 'text-white' : 'text-midnight-700'
                      }`}>{job.count} documents</span>
                      <div className={`flex items-center space-x-1 ${
                        selectedJob === job.id ? 'text-white' : 'text-orange-700'
                      }`}>
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                        <span className="font-semibold">{job.aiFlags} AI flags</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {!selectedJob ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-white border border-gray-200 rounded-xl shadow-sm text-center py-20"
                >
                  <div className="mb-6">
                    <div className="w-16 h-16 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="h-8 w-8 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-midnight-900 mb-2">Select a Job to Begin Review</h3>
                  <p className="text-midnight-600 max-w-md mx-auto">Choose one of the jobs from the left panel to start the AI-assisted document review process.</p>
                </motion.div>
              ) : currentJob && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  {/* Job Header with Stats */}
                  <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h2 className="text-2xl font-bold text-midnight-900">{currentJob.client}</h2>
                        <p className="text-midnight-600 text-lg">{currentJob.type} - {currentJob.count} documents</p>
                      </div>
                    </div>
                    
                    {/* Stats Row */}
                    <div className="grid grid-cols-3 gap-6">
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-3xl font-bold text-midnight-900 mb-1">{currentJob.aiFlags}</div>
                        <div className="text-sm font-medium text-midnight-600">AI Flags</div>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-3xl font-bold text-mantis-600 mb-1">
                          {Object.values(documentReviews).filter(status => status === 'approved').length}
                        </div>
                        <div className="text-sm font-medium text-midnight-600">Approved</div>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-3xl font-bold text-red-600 mb-1">
                          {Object.values(documentReviews).filter(status => status === 'needs-correction').length}
                        </div>
                        <div className="text-sm font-medium text-midnight-600">Needs Correction</div>
                      </div>
                    </div>
                  </div>

                  {/* AI Summary */}
                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg className="h-6 w-6 text-yellow-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-yellow-800 mb-2">AI Pre-Screening Summary</h3>
                        <p className="text-yellow-800 leading-relaxed">
                          Our AI has identified <strong>{currentJob.aiFlags} potential issues</strong> across {currentJob.count} documents. 
                          Most common issues: missing signatures ({Math.floor(currentJob.aiFlags * 0.4)}), date formatting ({Math.floor(currentJob.aiFlags * 0.3)}), 
                          and address inconsistencies ({Math.floor(currentJob.aiFlags * 0.3)}).
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Document Review Queue */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                  <h3 className="text-lg font-semibold text-midnight-900">Document Review Queue</h3>
                  <p className="text-sm text-midnight-600 mt-1">Review each document and approve or request corrections</p>
                </div>
                
                <div className="divide-y divide-gray-200">
                  {currentJob.documents.map((doc, index) => (
                    <motion.div
                      key={doc.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-6 hover:bg-gray-50 transition-colors duration-150"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-brand-100 rounded-lg flex items-center justify-center">
                            <svg className="h-6 w-6 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                          <div>
                            <h4 className="font-semibold text-midnight-900 text-lg">{doc.name}</h4>
                            <div className="flex items-center space-x-3 mt-1">
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(getDocumentStatus(doc.id))}`}>
                                {getDocumentStatus(doc.id).toUpperCase().replace('-', ' ')}
                              </span>
                              {doc.issues.length > 0 && (
                                <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
                                  {doc.issues.length} issues found
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <button className="px-4 py-2 text-sm font-medium text-brand-600 bg-brand-50 hover:bg-brand-100 rounded-lg transition-colors duration-200">
                            <svg className="h-4 w-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            Preview
                          </button>
                          
                          {getDocumentStatus(doc.id) === 'pending' && (
                            <>
                              <button
                                onClick={() => handleDocumentAction(doc.id, 'approved')}
                                className="px-4 py-2 text-sm font-medium bg-mantis-600 text-white hover:bg-mantis-700 rounded-lg transition-colors duration-200"
                              >
                                ✓ Approve
                              </button>
                              <button
                                onClick={() => handleDocumentAction(doc.id, 'needs-correction')}
                                className="px-4 py-2 text-sm font-medium bg-red-600 text-white hover:bg-red-700 rounded-lg transition-colors duration-200"
                              >
                                ⚠ Needs Correction
                              </button>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Issues List */}
                      {doc.issues.length > 0 && (
                        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                          <h5 className="font-medium text-orange-800 mb-3 flex items-center">
                            <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                            AI Detected Issues
                          </h5>
                          <ul className="space-y-2">
                            {doc.issues.map((issue, idx) => (
                              <li key={idx} className="text-sm text-orange-700 flex items-start space-x-2">
                                <svg className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 8 8">
                                  <circle cx="4" cy="4" r="3"/>
                                </svg>
                                <span>{issue}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Correction Feedback */}
                      {getDocumentStatus(doc.id) === 'needs-correction' && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="mt-4 p-4 bg-gray-50 rounded-lg"
                        >
                          <label className="block text-sm font-medium text-midnight-900 mb-2">
                            Feedback for Client
                          </label>
                          <textarea
                            placeholder="Provide detailed feedback for client corrections..."
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 resize-none"
                            rows={3}
                          />
                          <button className="mt-3 px-4 py-2 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-700 transition-colors duration-200">
                            Send Feedback
                          </button>
                        </motion.div>
                      )}
                    </motion.div>
                  ))}
                </div>

                {/* Bottom Actions */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-midnight-600">
                      <strong>{Object.values(documentReviews).filter(status => status === 'approved').length}</strong> of <strong>{currentJob.documents.length}</strong> documents approved
                    </div>
                    <div className="flex items-center space-x-3">
                      <button className="px-4 py-2 text-sm font-medium text-midnight-600 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors duration-200">
                        Approve All Clean
                      </button>
                      <Link href={`/notary/workflow/${currentJob.id}`}>
                        <button className="px-6 py-2 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-700 transition-colors duration-200">
                          Ready for External Processing
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
                </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}