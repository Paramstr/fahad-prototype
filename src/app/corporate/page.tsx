'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

interface BulkDocument {
  id: number;
  filename: string;
  type: string;
  status: 'Analyzing' | 'Processing' | 'Completed' | 'Error';
  progress: number;
  size: string;
  uploadedAt: string;
  analysisResult?: {
    documentType: string;
    confidence: number;
    language: string;
    quality: 'good' | 'fair' | 'poor';
    estimatedCost: number;
  };
  services?: string[];
  totalCost?: number;
}

export default function CorporatePage() {
  const [isUploading, setIsUploading] = useState(false);
  const [documents, setDocuments] = useState<BulkDocument[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<BulkDocument | null>(null);
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    // Mock document data
    const mockDocuments: BulkDocument[] = [
      {
        id: 1,
        filename: 'contract_001.pdf',
        type: 'Commercial Contract',
        status: 'Completed',
        progress: 100,
        size: '2.3 MB',
        uploadedAt: '2025-01-17T10:30:00Z',
        analysisResult: {
          documentType: 'Commercial Contract',
          confidence: 98,
          language: 'English',
          quality: 'good',
          estimatedCost: 185
        },
        services: ['Translation', 'MoJ Notarization', 'MoFA Attestation'],
        totalCost: 185
      },
      {
        id: 2,
        filename: 'birth_cert_batch_01.pdf',
        type: 'Birth Certificate',
        status: 'Processing',
        progress: 65,
        size: '1.8 MB',
        uploadedAt: '2025-01-17T11:15:00Z',
        analysisResult: {
          documentType: 'Birth Certificate',
          confidence: 95,
          language: 'Arabic',
          quality: 'good',
          estimatedCost: 160
        },
        services: ['MoJ Notarization', 'MoFA Attestation', 'Embassy Legalization'],
        totalCost: 160
      },
      {
        id: 3,
        filename: 'educational_docs.pdf',
        type: 'Educational Certificate',
        status: 'Analyzing',
        progress: 25,
        size: '3.1 MB',
        uploadedAt: '2025-01-17T11:45:00Z'
      },
      {
        id: 4,
        filename: 'power_of_attorney_v2.pdf',
        type: 'Power of Attorney',
        status: 'Completed',
        progress: 100,
        size: '1.5 MB',
        uploadedAt: '2025-01-17T09:20:00Z',
        analysisResult: {
          documentType: 'Power of Attorney',
          confidence: 92,
          language: 'English',
          quality: 'fair',
          estimatedCost: 145
        },
        services: ['Translation', 'MoJ Notarization'],
        totalCost: 145
      }
    ];
    setDocuments(mockDocuments);
  }, []);

  const simulateBulkUpload = () => {
    setIsUploading(true);
    
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

    const newDocs: BulkDocument[] = Array.from({ length: 20 }, (_, i) => {
      const validityRandom = Math.random();
      let status: 'Analyzing' | 'Processing' | 'Completed' | 'Error';
      let progress: number;
      
      // 70% completed, 20% processing, 8% analyzing, 2% error
      if (validityRandom < 0.7) {
        status = 'Completed';
        progress = 100;
      } else if (validityRandom < 0.9) {
        status = 'Processing';
        progress = 45 + Math.floor(Math.random() * 40);
      } else if (validityRandom < 0.98) {
        status = 'Analyzing';
        progress = 10 + Math.floor(Math.random() * 30);
      } else {
        status = 'Error';
        progress = 0;
      }

      return {
        id: Date.now() + i,
        filename: `${companyNames[i]}_${documentTypes[i]}.pdf`.replace(/\s+/g, '_').toLowerCase(),
        type: documentTypes[i],
        status,
        progress,
        size: `${(1.2 + Math.random() * 4).toFixed(1)} MB`,
        uploadedAt: new Date(Date.now() - Math.random() * 86400000).toISOString(), // Random time in last 24h
        analysisResult: status !== 'Analyzing' ? {
          documentType: documentTypes[i],
          confidence: 75 + Math.floor(Math.random() * 25),
          language: Math.random() > 0.3 ? 'English' : 'Arabic',
          quality: Math.random() > 0.2 ? 'good' as const : Math.random() > 0.5 ? 'fair' as const : 'poor' as const,
          estimatedCost: 80 + Math.floor(Math.random() * 150)
        } : undefined,
        services: status === 'Completed' ? 
          Math.random() > 0.5 ? ['Translation', 'MoJ Notarization', 'MoFA Attestation'] : ['MoJ Notarization', 'Embassy Legalization']
          : undefined,
        totalCost: status === 'Completed' ? 120 + Math.floor(Math.random() * 180) : undefined
      };
    });

    setDocuments(prev => [...newDocs, ...prev]);

    // Simulate real-time updates for processing documents
    const processingDocs = newDocs.filter(doc => doc.status === 'Processing' || doc.status === 'Analyzing');
    
    processingDocs.forEach((doc, index) => {
      setTimeout(() => {
        setDocuments(prev => prev.map(d => 
          d.id === doc.id 
            ? { 
                ...d, 
                progress: Math.min(d.progress + 20 + Math.floor(Math.random() * 30), 100),
                status: d.progress >= 80 ? 'Completed' as const : 'Processing' as const,
                analysisResult: d.progress >= 50 && !d.analysisResult ? {
                  documentType: d.type,
                  confidence: 75 + Math.floor(Math.random() * 25),
                  language: Math.random() > 0.3 ? 'English' : 'Arabic',
                  quality: 'good' as const,
                  estimatedCost: 80 + Math.floor(Math.random() * 150)
                } : d.analysisResult,
                totalCost: d.progress >= 80 ? 120 + Math.floor(Math.random() * 180) : d.totalCost
              }
            : d
        ));
      }, 2000 + index * 500);
    });

    setTimeout(() => {
      setIsUploading(false);
    }, 1500);
  };

  const filteredDocuments = documents.filter(doc => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Processing') return doc.status === 'Analyzing' || doc.status === 'Processing';
    if (activeFilter === 'Completed') return doc.status === 'Completed';
    if (activeFilter === 'Error') return doc.status === 'Error';
    return true;
  });

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'text-mantis-600 bg-mantis-100';
      case 'Processing': return 'text-spring-600 bg-spring-100';
      case 'Analyzing': return 'text-nuit-600 bg-nuit-100';
      case 'Error': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const totalDocuments = documents.length;
  const completedDocuments = documents.filter(doc => doc.status === 'Completed').length;
  const processingDocuments = documents.filter(doc => doc.status === 'Processing' || doc.status === 'Analyzing').length;
  const totalValue = documents.reduce((sum, doc) => sum + (doc.totalCost || doc.analysisResult?.estimatedCost || 0), 0);

  return (
    <div className="min-h-screen bg-praxeti-100">
      <Navbar />

      {/* Corporate Dashboard Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-6 sm:py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0">
            <div>
              <h1 className="text-2xl sm:text-3xl font-semibold text-midnight-900">Corporate Dashboard</h1>
              <p className="text-base sm:text-lg text-midnight-600 mt-1">Bulk document processing and management</p>
            </div>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 lg:flex lg:items-center gap-4 sm:gap-6 lg:gap-8">
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-midnight-900">{totalDocuments}</div>
                <div className="text-xs sm:text-sm text-midnight-600">Total Documents</div>
              </div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-mantis-600">{completedDocuments}</div>
                <div className="text-xs sm:text-sm text-midnight-600">Completed</div>
              </div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-spring-600">{processingDocuments}</div>
                <div className="text-xs sm:text-sm text-midnight-600">Processing</div>
              </div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-brand-600">AED {totalValue.toLocaleString()}</div>
                <div className="text-xs sm:text-sm text-midnight-600">Total Value</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-6 sm:py-8">
        {/* Corporate Services Section */}
        <motion.div 
          className="mb-6 sm:mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-xl sm:text-2xl font-semibold text-midnight-900 mb-4 sm:mb-6">Corporate Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            
            {/* Bulk Attestation Card - Enhanced Mesh Gradient Design (Teal Theme) */}
            <Link href="/corporate/bulk-attest">
              <motion.div 
                className="group relative overflow-hidden rounded-2xl cursor-pointer"
                whileHover={{ scale: 1.02, y: -12 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                {/* Base Dark Foundation */}
                <div className="absolute inset-0 bg-midnight-900"></div>
                
                {/* Mesh-like Gradient Layer 1 - Teal Primary Flow */}
                <div className="absolute inset-0 opacity-80">
                  <div className="absolute inset-0 bg-gradient-to-br from-teal-800 via-midnight-800 to-teal-900" style={{ background: 'linear-gradient(135deg, #047857 0%, #001f3f 50%, #065f46 100%)' }}></div>
                  <div className="absolute inset-0 bg-gradient-to-tr from-teal-600/60 via-transparent to-teal-600/40" style={{ background: 'linear-gradient(45deg, rgba(4, 120, 87, 0.6) 0%, transparent 50%, rgba(4, 120, 87, 0.4) 100%)' }}></div>
                </div>
                
                {/* Mesh-like Gradient Layer 2 - Radial Depth */}
                <div className="absolute inset-0 opacity-70">
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-radial from-teal-500/40 via-transparent to-transparent" style={{background: 'radial-gradient(circle at 30% 20%, rgba(4, 120, 87, 0.4) 0%, transparent 50%)'}}></div>
                  <div className="absolute top-0 right-0 w-full h-full bg-gradient-radial from-teal-500/30 via-transparent to-transparent" style={{background: 'radial-gradient(circle at 70% 30%, rgba(6, 95, 70, 0.3) 0%, transparent 60%)'}}></div>
                  <div className="absolute bottom-0 left-0 w-full h-full bg-gradient-radial from-teal-700/35 via-transparent to-transparent" style={{background: 'radial-gradient(circle at 20% 80%, rgba(4, 120, 87, 0.35) 0%, transparent 45%)'}}></div>
                  {/* Subtle accent highlight (spring) */}
                  <div className="absolute inset-0 w-full h-full" style={{background:'radial-gradient(circle at 50% 50%, rgba(219,230,76,0.22) 0%, transparent 65%)'}}></div>
                </div>
                
                {/* Mesh-like Gradient Layer 3 - Organic Flow */}
                <div className="absolute inset-0 opacity-60">
                  <div className="absolute inset-0 bg-gradient-conic from-teal-600/30 via-midnight-700/20 to-teal-800/40" style={{background: 'conic-gradient(from 45deg at 60% 40%, rgba(4, 120, 87, 0.3) 0deg, rgba(0, 31, 63, 0.2) 120deg, rgba(6, 95, 70, 0.4) 240deg, rgba(4, 120, 87, 0.3) 360deg)'}}></div>
                </div>
                
                {/* Advanced Hover Effects - Mesh Enhancement */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-40 transition-opacity duration-700">
                  <div className="absolute inset-0 bg-gradient-radial from-teal-400/25 via-transparent to-transparent" style={{background: 'radial-gradient(circle at 50% 50%, rgba(4, 120, 87, 0.25) 0%, transparent 70%)'}}></div>
                  <div className="absolute inset-0 bg-gradient-to-br from-spring-400/15 via-transparent to-teal-500/20"></div>
                </div>
                
                {/* Sophisticated Glow Effects */}
                <div className="absolute inset-0 bg-gradient-to-r from-teal-400/0 via-teal-400/20 to-teal-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-600"></div>
                
                {/* Content Container with Enhanced Styling */}
                <div className="relative z-10 p-4 sm:p-6 lg:p-8 border border-teal-400/30 rounded-2xl backdrop-blur-md bg-gradient-to-br from-white/5 via-white/2 to-transparent text-center">
                  <div className="flex items-start justify-between mb-4 sm:mb-6">
                    <motion.div 
                      className="mx-auto p-3 sm:p-4 bg-gradient-to-br from-white/20 via-white/15 to-white/10 backdrop-blur-sm rounded-xl shadow-lg border border-white/20"
                      whileHover={{ scale: 1.1, rotate: -3 }}
                      transition={{ duration: 0.3 }}
                    >
                      <svg className="h-8 w-8 sm:h-10 sm:w-10 text-spring-400 drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </motion.div>
                    <motion.div 
                      className="opacity-0 group-hover:opacity-100 transition-all duration-400 flex items-center space-x-1 text-xs text-spring-300 bg-white/15 backdrop-blur-sm px-3 py-1 rounded-full border border-white/20 absolute bottom-4 right-4 sm:bottom-6 sm:right-6"
                      initial={{ x: 0 }}
                      whileHover={{ x: 0 }}
                    >
                      <span className="font-medium">Start now</span>
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </motion.div>
                  </div>
                  
                  <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4 leading-tight drop-shadow-lg">
                    Bulk Document Attestation
                  </h3>
                  <p className="text-praxeti-300 text-sm sm:text-base mb-4 leading-relaxed">
                    Upload multiple documents for batch attestation processing with AI-powered analysis
                  </p>
                </div>
                
                {/* Enhanced Shadow and Border */}
                <div className="absolute inset-0 rounded-2xl shadow-xl group-hover:shadow-2xl transition-shadow duration-500"></div>
                <div className="absolute inset-0 rounded-2xl ring-1 ring-white/10 group-hover:ring-white/20 transition-all duration-500"></div>
              </motion.div>
            </Link>

            {/* Bulk Legal Notices Card - Enhanced Mesh Gradient Design (Nuit Blue Theme) */}
            <Link href="/corporate/bulk-legal-notices">
              <motion.div 
                className="group relative overflow-hidden rounded-2xl cursor-pointer"
                whileHover={{ scale: 1.02, y: -12 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                {/* Base Dark Foundation */}
                <div className="absolute inset-0 bg-midnight-900"></div>
                
                {/* Mesh-like Gradient Layer 1 - Primary Flow */}
                <div className="absolute inset-0 opacity-80">
                  <div className="absolute inset-0 bg-gradient-to-br from-nuit-800 via-midnight-800 to-nuit-900"></div>
                  <div className="absolute inset-0 bg-gradient-to-tr from-nuit-600/60 via-transparent to-midnight-700/40"></div>
                </div>
                
                {/* Mesh-like Gradient Layer 2 - Radial Depth */}
                <div className="absolute inset-0 opacity-70">
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-radial from-nuit-500/40 via-transparent to-transparent" style={{background: 'radial-gradient(circle at 25% 25%, rgba(30, 72, 143, 0.4) 0%, transparent 55%)'}}></div>
                  <div className="absolute top-0 right-0 w-full h-full bg-gradient-radial from-nuit-400/35 via-transparent to-transparent" style={{background: 'radial-gradient(circle at 75% 20%, rgba(30, 72, 143, 0.35) 0%, transparent 65%)'}}></div>
                  <div className="absolute bottom-0 center w-full h-full bg-gradient-radial from-midnight-700/30 via-transparent to-transparent" style={{background: 'radial-gradient(circle at 50% 85%, rgba(0, 31, 63, 0.3) 0%, transparent 50%)'}}></div>
                  {/* Subtle accent highlight (spring) */}
                  <div className="absolute inset-0 w-full h-full" style={{background:'radial-gradient(circle at 60% 60%, rgba(219,230,76,0.18) 0%, transparent 70%)'}}></div>
                </div>
                
                {/* Mesh-like Gradient Layer 3 - Organic Flow */}
                <div className="absolute inset-0 opacity-60">
                  <div className="absolute inset-0 bg-gradient-conic from-nuit-600/30 via-midnight-700/20 to-nuit-800/40" style={{background: 'conic-gradient(from 135deg at 40% 60%, rgba(30, 72, 143, 0.3) 0deg, rgba(0, 31, 63, 0.2) 120deg, rgba(26, 61, 122, 0.4) 240deg, rgba(30, 72, 143, 0.3) 360deg)'}}></div>
                </div>
                
                {/* Mesh-like Gradient Layer 4 - Subtle Variations */}
                <div className="absolute inset-0 opacity-50">
                  <div className="absolute inset-0 bg-gradient-to-l from-transparent via-nuit-500/20 to-transparent"></div>
                  <div className="absolute inset-0 bg-gradient-to-b from-nuit-600/20 via-transparent to-midnight-900/60"></div>
                  <div className="absolute inset-0 bg-gradient-to-tr from-midnight-900/30 via-nuit-500/15 to-transparent"></div>
                </div>
                
                {/* Advanced Hover Effects - Mesh Enhancement */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                  <div className="absolute inset-0 bg-gradient-radial from-spring-400/20 via-transparent to-transparent" style={{background: 'radial-gradient(circle at 50% 50%, rgba(219, 230, 76, 0.2) 0%, transparent 70%)'}}></div>
                  <div className="absolute inset-0 bg-gradient-to-bl from-nuit-400/20 via-transparent to-spring-400/10"></div>
                </div>
                
                {/* Sophisticated Glow Effects */}
                <div className="absolute inset-0 bg-gradient-to-r from-nuit-400/0 via-spring-400/20 to-nuit-400/0 opacity-0 group-hover:opacity-10 transition-opacity duration-600"></div>
                
                {/* Content Container with Enhanced Styling */}
                <div className="relative z-10 p-4 sm:p-6 lg:p-8 border border-nuit-400/30 rounded-2xl backdrop-blur-md bg-gradient-to-br from-white/5 via-white/2 to-transparent text-center">
                  <div className="flex items-start justify-between mb-4 sm:mb-6">
                    <motion.div 
                      className="mx-auto p-3 sm:p-4 bg-gradient-to-br from-white/20 via-white/15 to-white/10 backdrop-blur-sm rounded-xl shadow-lg border border-white/20"
                      whileHover={{ scale: 1.1, rotate: -3 }}
                      transition={{ duration: 0.3 }}
                    >
                      <svg className="h-8 w-8 sm:h-10 sm:w-10 text-spring-400 drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </motion.div>
                    <motion.div 
                      className="opacity-0 group-hover:opacity-100 transition-all duration-400 flex items-center space-x-1 text-xs text-spring-300 bg-white/15 backdrop-blur-sm px-3 py-1 rounded-full border border-white/20 absolute bottom-4 right-4 sm:bottom-6 sm:right-6"
                      initial={{ x: 0 }}
                      whileHover={{ x: 0 }}
                    >
                      <span className="font-medium">Start now</span>
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </motion.div>
                  </div>
                  
                  <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4 leading-tight drop-shadow-lg">
                    Bulk Legal Notices
                  </h3>
                  <p className="text-praxeti-300 text-sm sm:text-base mb-4 leading-relaxed">
                    Generate and notarize bulk legal notices with AI-powered document creation
                  </p>
                </div>
                
                {/* Enhanced Shadow and Border */}
                <div className="absolute inset-0 rounded-2xl shadow-xl group-hover:shadow-2xl transition-shadow duration-500"></div>
                <div className="absolute inset-0 rounded-2xl ring-1 ring-white/10 group-hover:ring-white/20 transition-all duration-500"></div>
              </motion.div>
            </Link>

          </div>
        </motion.div>

        {/* Document Management Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
            <h2 className="text-lg sm:text-xl font-semibold text-midnight-900">Recent Activity</h2>
            
            <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
              {/* Demo Button */}
              <button
                onClick={simulateBulkUpload}
                disabled={isUploading}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 w-full sm:w-auto ${
                  isUploading 
                    ? 'bg-gray-400 text-white cursor-not-allowed' 
                    : 'bg-nuit-600 text-white hover:bg-nuit-700'
                }`}
              >
                {isUploading ? 'Adding...' : 'Demo: Add 20 Documents'}
              </button>
              
              {/* Filter buttons */}
              <div className="flex flex-wrap gap-2">
                {['All', 'Processing', 'Completed', 'Error'].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      activeFilter === filter
                        ? 'bg-brand-600 text-white shadow-sm'
                        : 'bg-praxeti-300 text-midnight-900 hover:bg-praxeti-400'
                    }`}
                  >
                    {filter} ({filter === 'All' ? documents.length : 
                      filter === 'Processing' ? processingDocuments :
                      filter === 'Completed' ? completedDocuments :
                      documents.filter(doc => doc.status === 'Error').length})
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Document Table - Compact Design */}
          <div className="card overflow-hidden">
            <div className="space-y-2">
              <AnimatePresence>
                {filteredDocuments.map((doc) => (
                  <motion.div
                    key={doc.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2 }}
                    className="p-4 hover:bg-praxeti-200 transition-colors duration-150 cursor-pointer border-b border-gray-100 last:border-b-0"
                    onClick={() => setSelectedDocument(doc)}
                  >
                    {/* Desktop Layout */}
                    <div className="hidden sm:flex items-center justify-between">
                      {/* Document Info */}
                      <div className="flex items-center space-x-4 flex-1 min-w-0">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 bg-brand-100 rounded-lg flex items-center justify-center">
                            <svg className="h-5 w-5 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <div className="truncate">
                              <div className="text-sm font-medium text-midnight-900 truncate">{doc.filename}</div>
                              <div className="text-xs text-midnight-600">{doc.type} • {doc.size} • {formatDate(doc.uploadedAt)}</div>
                            </div>
                          </div>
                          {/* Progress Bar */}
                          <div className="mt-2 flex items-center space-x-3">
                            <div className="flex-1 bg-gray-200 rounded-full h-1.5 max-w-32">
                              <motion.div 
                                className="bg-brand-600 h-1.5 rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${doc.progress}%` }}
                                transition={{ duration: 0.5 }}
                              />
                            </div>
                            <span className="text-xs text-midnight-600 min-w-[3rem] flex-shrink-0">{doc.progress}%</span>
                          </div>
                        </div>
                      </div>

                      {/* Status & Cost */}
                      <div className="flex items-center space-x-4 flex-shrink-0">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(doc.status)}`}>
                          {doc.status}
                        </span>
                        <div className="text-right min-w-[4rem]">
                          <div className="text-sm font-medium text-midnight-900">
                            {doc.totalCost ? `AED ${doc.totalCost}` : doc.analysisResult?.estimatedCost ? `~${doc.analysisResult.estimatedCost}` : '-'}
                          </div>
                        </div>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedDocument(doc);
                          }}
                          className="text-brand-600 hover:text-brand-900 p-1"
                        >
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {/* Mobile Layout */}
                    <div className="sm:hidden space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="h-8 w-8 bg-brand-100 rounded-lg flex items-center justify-center">
                            <svg className="h-4 w-4 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-sm font-medium text-midnight-900 truncate">{doc.filename}</div>
                            <div className="text-xs text-midnight-600">{doc.type} • {doc.size}</div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(doc.status)}`}>
                            {doc.status}
                          </span>
                          <div className="text-right">
                            <div className="text-sm font-medium text-midnight-900">
                              {doc.totalCost ? `AED ${doc.totalCost}` : doc.analysisResult?.estimatedCost ? `~${doc.analysisResult.estimatedCost}` : '-'}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Mobile Progress Bar */}
                      <div className="flex items-center space-x-3">
                        <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                          <motion.div 
                            className="bg-brand-600 h-1.5 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${doc.progress}%` }}
                            transition={{ duration: 0.5 }}
                          />
                        </div>
                        <span className="text-xs text-midnight-600 min-w-[3rem] flex-shrink-0">{doc.progress}%</span>
                      </div>
                      
                      <div className="text-xs text-midnight-600">{formatDate(doc.uploadedAt)}</div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Document Detail Modal */}
      <AnimatePresence>
        {selectedDocument && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black"
              onClick={() => setSelectedDocument(null)}
            />
            
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-4xl max-h-[80vh] overflow-hidden rounded-2xl shadow-2xl mx-4 sm:mx-0"
            >
              <div className="bg-white" onClick={(e) => e.stopPropagation()}>
                {/* Modal Header */}
                <div className="bg-gradient-to-r from-brand-600 to-brand-700 p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 min-w-0">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                        <svg className="h-5 w-5 sm:h-6 sm:w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div className="min-w-0">
                        <h2 className="text-lg sm:text-xl font-semibold text-white truncate">{selectedDocument.filename}</h2>
                        <p className="text-brand-100 text-sm truncate">{selectedDocument.type}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedDocument(null)}
                      className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors flex-shrink-0"
                    >
                      <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-2 text-sm">
                      <span className="text-white font-medium">{selectedDocument.status}</span>
                      <span className="text-brand-100">{selectedDocument.progress}%</span>
                    </div>
                    <div className="w-full bg-white bg-opacity-20 rounded-full h-2">
                      <motion.div 
                        className="h-full bg-white rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${selectedDocument.progress}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                </div>

                {/* Modal Content */}
                <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 max-h-[60vh] overflow-y-auto">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    {/* Document Preview */}
                    <div className="space-y-4">
                      <h3 className="text-base sm:text-lg font-semibold text-midnight-900">Document Preview</h3>
                      <div className="bg-praxeti-300 rounded-lg p-6 sm:p-8 text-center min-h-[250px] sm:min-h-[300px] flex items-center justify-center">
                        <div className="text-center">
                          <svg className="h-16 w-16 sm:h-20 sm:w-20 text-midnight-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <p className="text-midnight-600">Document preview</p>
                          <p className="text-sm text-midnight-500 mt-1">{selectedDocument.size}</p>
                        </div>
                      </div>
                    </div>

                    {/* Document Details */}
                    <div className="space-y-4">
                      <h3 className="text-base sm:text-lg font-semibold text-midnight-900">Analysis Results</h3>
                      
                      {selectedDocument.analysisResult ? (
                        <div className="space-y-4">
                          <div className="bg-praxeti-300 rounded-lg p-4">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="font-medium text-midnight-900">Document Type:</span>
                                <p className="text-midnight-600">{selectedDocument.analysisResult.documentType}</p>
                              </div>
                              <div>
                                <span className="font-medium text-midnight-900">Confidence:</span>
                                <p className="text-midnight-600">{selectedDocument.analysisResult.confidence}%</p>
                              </div>
                              <div>
                                <span className="font-medium text-midnight-900">Language:</span>
                                <p className="text-midnight-600">{selectedDocument.analysisResult.language}</p>
                              </div>
                              <div>
                                <span className="font-medium text-midnight-900">Quality:</span>
                                <p className={`capitalize ${
                                  selectedDocument.analysisResult.quality === 'good' ? 'text-mantis-600' : 
                                  selectedDocument.analysisResult.quality === 'fair' ? 'text-spring-600' : 
                                  'text-red-600'
                                }`}>{selectedDocument.analysisResult.quality}</p>
                              </div>
                            </div>
                          </div>

                          {selectedDocument.services && (
                            <div>
                              <h4 className="font-medium text-midnight-900 mb-2">Recommended Services:</h4>
                              <div className="space-y-2">
                                {selectedDocument.services.map((service, index) => (
                                  <div key={index} className="flex items-center justify-between p-3 bg-brand-50 rounded-lg">
                                    <span className="text-midnight-900">{service}</span>
                                    <span className="text-brand-600 font-medium">✓</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          <div className="bg-gradient-to-br from-brand-50 to-mantis-50 rounded-lg p-4 border border-brand-200">
                            <div className="flex justify-between items-center">
                              <span className="font-medium text-midnight-900">Estimated Cost:</span>
                              <span className="text-xl font-bold text-brand-600">
                                AED {selectedDocument.totalCost || selectedDocument.analysisResult.estimatedCost}
                              </span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <motion.svg 
                            className="h-8 w-8 text-nuit-600 mx-auto mb-2"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </motion.svg>
                          <p className="text-midnight-600">Analysis in progress...</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* File Metadata */}
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-midnight-900 mb-4">File Information</h3>
                    <div className="bg-praxeti-300 rounded-lg p-4">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-midnight-900">File Size:</span>
                          <p className="text-midnight-600">{selectedDocument.size}</p>
                        </div>
                        <div>
                          <span className="font-medium text-midnight-900">Uploaded:</span>
                          <p className="text-midnight-600">{formatDate(selectedDocument.uploadedAt)}</p>
                        </div>
                        <div>
                          <span className="font-medium text-midnight-900">Status:</span>
                          <p className={`${getStatusColor(selectedDocument.status).split(' ')[0]}`}>
                            {selectedDocument.status}
                          </p>
                        </div>
                        <div>
                          <span className="font-medium text-midnight-900">Progress:</span>
                          <p className="text-midnight-600">{selectedDocument.progress}%</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}