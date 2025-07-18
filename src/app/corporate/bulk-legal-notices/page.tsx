'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';

interface LegalNotice {
  id: string;
  tenantName: string;
  flatNumber: string;
  noticeType: string;
  status: 'pending' | 'valid' | 'needs_fix' | 'generated';
  issues?: string[];
}

interface ProgressStep {
  id: number;
  title: string;
  description: string;
  status: 'completed' | 'current' | 'pending';
}

export default function BulkLegalNoticesPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadMethod, setUploadMethod] = useState<'zip' | 'excel' | null>(null);
  const [notices, setNotices] = useState<LegalNotice[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedNotary, setSelectedNotary] = useState<string>('');
  const [deliveryMethod, setDeliveryMethod] = useState<string[]>([]);
  // const fileInputRef = useRef<HTMLInputElement>(null); // Commented out - unused
  const router = useRouter();

  const steps: ProgressStep[] = [
    { id: 1, title: 'Upload Method', description: 'Choose upload type', status: currentStep > 1 ? 'completed' : 'current' },
    { id: 2, title: 'Documents', description: 'Upload or generate', status: currentStep > 2 ? 'completed' : currentStep === 2 ? 'current' : 'pending' },
    { id: 3, title: 'AI Validation', description: 'Review & fix issues', status: currentStep > 3 ? 'completed' : currentStep === 3 ? 'current' : 'pending' },
    { id: 4, title: 'Assign Notary', description: 'Select notarization', status: currentStep > 4 ? 'completed' : currentStep === 4 ? 'current' : 'pending' },
    { id: 5, title: 'Payment', description: 'Review & pay', status: currentStep > 5 ? 'completed' : currentStep === 5 ? 'current' : 'pending' },
    { id: 6, title: 'Delivery', description: 'Choose delivery', status: currentStep > 6 ? 'completed' : currentStep === 6 ? 'current' : 'pending' },
    { id: 7, title: 'Complete', description: 'Track & report', status: currentStep === 7 ? 'completed' : 'pending' }
  ];

  // Mock data for Excel generation
  const generateMockNotices = () => {
    setIsGenerating(true);
    
    setTimeout(() => {
      const mockNotices: LegalNotice[] = Array.from({ length: 350 }, (_, i) => ({
        id: `notice-${i + 1}`,
        tenantName: `Tenant ${i + 1}`,
        flatNumber: `Flat ${Math.floor(Math.random() * 500) + 100}`,
        noticeType: 'Notice to Vacate - Overdue Rent',
        status: Math.random() > 0.97 ? 'needs_fix' : 'valid',
        issues: Math.random() > 0.97 ? ['Missing signature line', 'Invalid date format'] : undefined
      }));
      
      setNotices(mockNotices);
      setIsGenerating(false);
      setCurrentStep(3);
    }, 3000);
  };

  // handleZipUpload function removed - was unused

  const validNotices = notices.filter(n => n.status === 'valid').length;
  const issueNotices = notices.filter(n => n.status === 'needs_fix').length;
  const totalCost = validNotices * 50; // AED 50 per notice

  const notaryOptions = [
    { id: 'notary-1', name: 'Ahmed Al-Mansouri', specialization: 'Commercial Law', rating: 4.9, price: 50 },
    { id: 'notary-2', name: 'Sarah Johnson', specialization: 'Property Law', rating: 4.8, price: 55 },
    { id: 'notary-3', name: 'Mohammed Hassan', specialization: 'Tenant Relations', rating: 4.7, price: 45 }
  ];

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-praxeti-100">
      <Navbar />

      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-6">
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
              <h1 className="text-3xl font-semibold text-midnight-900">Bulk Legal Notices</h1>
              <p className="text-midnight-600 mt-1">Generate and notarize 350 legal notices for tenant management</p>
            </div>
            
            {notices.length > 0 && (
              <div className="text-right">
                <div className="text-sm text-midnight-600">Progress</div>
                <div className="text-lg font-semibold text-mantis-600">
                  Step {currentStep} of {steps.length}
                </div>
              </div>
            )}
          </div>
          
          {/* Progress Steps */}
          <div className="mt-8">
            <div className="flex items-center justify-between relative">
              <div className="absolute top-5 left-0 w-full h-0.5 bg-gray-200" />
              <div 
                className="absolute top-5 left-0 h-0.5 bg-mantis-600 transition-all duration-700" 
                style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
              />
              
              {steps.map((step) => (
                <div key={step.id} className="relative flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center text-sm font-semibold z-10 transition-all duration-300 ${
                    step.status === 'completed' 
                      ? 'bg-mantis-600 border-mantis-600 text-white' 
                      : step.status === 'current'
                        ? 'bg-white border-mantis-600 text-mantis-600'
                        : 'bg-white border-gray-300 text-gray-400'
                  }`}>
                    {step.status === 'completed' ? (
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      step.id
                    )}
                  </div>
                  <div className="mt-2 text-center">
                    <div className={`text-sm font-medium ${
                      step.status !== 'pending' ? 'text-midnight-900' : 'text-gray-400'
                    }`}>
                      {step.title}
                    </div>
                    <div className="text-xs text-gray-500 hidden md:block">{step.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-8">
        <AnimatePresence mode="wait">
          {/* Step 1: Choose Upload Method */}
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-semibold text-midnight-900 mb-4">How would you like to upload your documents?</h2>
                  <p className="text-lg text-midnight-600">Choose the method that works best for your workflow</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* ZIP Upload Option */}
                  <motion.div
                    className={`card p-8 cursor-pointer transition-all duration-300 ${
                      uploadMethod === 'zip' ? 'ring-2 ring-brand-500 bg-brand-50' : 'hover:shadow-lg'
                    }`}
                    onClick={() => setUploadMethod('zip')}
                    whileHover={{ scale: 1.02, y: -4 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="text-center">
                      <div className="w-16 h-16 bg-nuit-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-semibold text-midnight-900 mb-3">Upload ZIP File</h3>
                      <p className="text-midnight-600 mb-6">
                        Upload a ZIP file containing 350 pre-made PDF legal notices
                      </p>
                      <div className="space-y-2 text-sm text-midnight-500">
                        <div className="flex items-center justify-center">
                          <svg className="h-4 w-4 text-mantis-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Fastest option for ready documents
                        </div>
                        <div className="flex items-center justify-center">
                          <svg className="h-4 w-4 text-mantis-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Supports PDF format
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Excel Template Option */}
                  <motion.div
                    className={`card p-8 cursor-pointer transition-all duration-300 ${
                      uploadMethod === 'excel' ? 'ring-2 ring-brand-500 bg-brand-50' : 'hover:shadow-lg'
                    }`}
                    onClick={() => setUploadMethod('excel')}
                    whileHover={{ scale: 1.02, y: -4 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="text-center">
                      <div className="w-16 h-16 bg-mantis-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-semibold text-midnight-900 mb-3">Excel Template + AI Generator</h3>
                      <p className="text-midnight-600 mb-6">
                        Use our Excel template to auto-generate personalized legal notices with AI
                      </p>
                      <div className="space-y-2 text-sm text-midnight-500">
                        <div className="flex items-center justify-center">
                          <svg className="h-4 w-4 text-mantis-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          AI-powered document generation
                        </div>
                        <div className="flex items-center justify-center">
                          <svg className="h-4 w-4 text-mantis-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Personalized for each tenant
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {uploadMethod && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mt-8"
                  >
                    <button
                      onClick={() => setCurrentStep(2)}
                      className="px-8 py-3 bg-mantis-600 text-white rounded-lg hover:bg-mantis-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      Continue with {uploadMethod === 'zip' ? 'ZIP Upload' : 'Excel Template'}
                    </button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}

          {/* Step 2: Document Upload/Generation */}
          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <div className="max-w-4xl mx-auto">
                {uploadMethod === 'zip' ? (
                  // ZIP Upload Interface
                  <div className="text-center">
                    <h2 className="text-3xl font-semibold text-midnight-900 mb-4">Upload ZIP File</h2>
                    <p className="text-lg text-midnight-600 mb-8">Upload your ZIP file containing legal notice PDFs</p>
                    
                    <div className="card p-12 border-2 border-dashed border-nuit-400 bg-nuit-50">
                      <div className="text-center">
                        <div className="w-20 h-20 bg-nuit-600 rounded-full flex items-center justify-center mx-auto mb-6">
                          <svg className="h-10 w-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-midnight-900 mb-2">Drop ZIP file here or click to browse</h3>
                        <p className="text-midnight-600 mb-6">Maximum file size: 500MB</p>
                        <button
                          onClick={() => {
                            // Mock ZIP upload - simulate the handleZipUpload function directly
                            const mockNotices: LegalNotice[] = Array.from({ length: 12 }, (_, i) => ({
                              id: `uploaded-${i + 1}`,
                              tenantName: `Mr. Ahmed ${i + 1}`,
                              flatNumber: `Unit ${i + 1}0${Math.floor(Math.random() * 9) + 1}`,
                              noticeType: ['Eviction Notice', 'Rent Reminder', 'Lease Violation'][Math.floor(Math.random() * 3)],
                              status: Math.random() > 0.7 ? 'needs_fix' as const : 'valid' as const,
                              issues: Math.random() > 0.7 ? ['Missing signature', 'Date format incorrect'] : undefined
                            }));
                            setNotices(mockNotices);
                            setCurrentStep(3);
                          }}
                          className="px-8 py-3 bg-nuit-600 text-white rounded-lg hover:bg-nuit-700 transition-all duration-200 font-medium"
                        >
                          Select ZIP File (Mock)
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  // Excel Template Interface
                  <div>
                    <div className="text-center mb-8">
                      <h2 className="text-3xl font-semibold text-midnight-900 mb-4">Generate Legal Notices from Template</h2>
                      <p className="text-lg text-midnight-600">Our AI will create personalized legal notices for each tenant</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                      {/* Template Download */}
                      <div className="card p-6">
                        <h3 className="text-lg font-semibold text-midnight-900 mb-4">Step 1: Download Template</h3>
                        <p className="text-midnight-600 mb-6">Download our Excel template and fill in tenant information</p>
                        <button className="w-full px-6 py-3 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-all duration-200 font-medium">
                          <div className="flex items-center justify-center space-x-2">
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <span>Download Template</span>
                          </div>
                        </button>
                      </div>

                      {/* Template Preview */}
                      <div className="card p-6">
                        <h3 className="text-lg font-semibold text-midnight-900 mb-4">Template Preview</h3>
                        <div className="bg-praxeti-300 rounded-lg p-4 text-xs font-mono">
                          <div className="grid grid-cols-4 gap-2 border-b border-gray-400 pb-2 mb-2 font-semibold">
                            <div>Tenant Name</div>
                            <div>Flat Number</div>
                            <div>Notice Type</div>
                            <div>Amount Due</div>
                          </div>
                          <div className="grid grid-cols-4 gap-2 text-midnight-600">
                            <div>Ali Ahmed</div>
                            <div>Flat 302</div>
                            <div>Overdue Rent</div>
                            <div>AED 5,000</div>
                          </div>
                          <div className="grid grid-cols-4 gap-2 text-midnight-600">
                            <div>Sara Hassan</div>
                            <div>Flat 405</div>
                            <div>Overdue Rent</div>
                            <div>AED 4,200</div>
                          </div>
                          <div className="text-center mt-2 text-midnight-500">... (350 rows total)</div>
                        </div>
                      </div>
                    </div>

                    <div className="card p-8 text-center">
                      <h3 className="text-xl font-semibold text-midnight-900 mb-4">Step 2: Generate Documents</h3>
                      <p className="text-midnight-600 mb-6">Click below to simulate AI document generation from template data</p>
                      
                      {isGenerating ? (
                        <div className="text-center">
                          <motion.div
                            className="w-16 h-16 bg-mantis-600 rounded-full flex items-center justify-center mx-auto mb-4"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                          >
                            <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                          </motion.div>
                          <h4 className="text-lg font-semibold text-midnight-900 mb-2">Generating Legal Notices...</h4>
                          <p className="text-midnight-600">AI is creating personalized documents for 350 tenants</p>
                        </div>
                      ) : (
                        <button
                          onClick={generateMockNotices}
                          className="px-8 py-4 bg-mantis-600 text-white rounded-lg hover:bg-mantis-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                        >
                          <div className="flex items-center space-x-2">
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                            <span>Generate 350 Legal Notices with AI</span>
                          </div>
                        </button>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex justify-between mt-8">
                  <button
                    onClick={prevStep}
                    className="px-6 py-3 bg-praxeti-400 text-midnight-700 rounded-lg hover:bg-praxeti-500 transition-all duration-200 font-medium"
                  >
                    ← Back
                  </button>
                  {notices.length === 0 && !isGenerating && (
                    <div className="text-midnight-500">Upload or generate documents to continue</div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 3: AI Validation */}
          {currentStep === 3 && notices.length > 0 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <div className="max-w-6xl mx-auto">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-semibold text-midnight-900 mb-4">AI Validation Results</h2>
                  <p className="text-lg text-midnight-600">Review document validation and fix any issues</p>
                </div>

                {/* Validation Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="card p-6 text-center">
                    <div className="w-16 h-16 bg-mantis-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="h-8 w-8 text-mantis-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-mantis-600">{validNotices}</h3>
                    <p className="text-midnight-600">Valid Documents</p>
                  </div>
                  
                  <div className="card p-6 text-center">
                    <div className="w-16 h-16 bg-spring-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="h-8 w-8 text-spring-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-spring-600">{issueNotices}</h3>
                    <p className="text-midnight-600">Need Fixes</p>
                  </div>
                  
                  <div className="card p-6 text-center">
                    <div className="w-16 h-16 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="h-8 w-8 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-brand-600">AED {totalCost.toLocaleString()}</h3>
                    <p className="text-midnight-600">Estimated Cost</p>
                  </div>
                </div>

                {/* Issues to Fix */}
                {issueNotices > 0 && (
                  <div className="card p-6 mb-8">
                    <h3 className="text-lg font-semibold text-midnight-900 mb-4">Documents Requiring Attention</h3>
                    <div className="space-y-3">
                      {notices.filter(n => n.status === 'needs_fix').slice(0, 5).map((notice) => (
                        <div key={notice.id} className="flex items-center justify-between p-4 bg-spring-50 rounded-lg border border-spring-200">
                          <div>
                            <div className="font-medium text-midnight-900">{notice.tenantName} - {notice.flatNumber}</div>
                            <div className="text-sm text-midnight-600">{notice.issues?.join(', ')}</div>
                          </div>
                          <button className="px-4 py-2 bg-spring-600 text-white rounded-lg hover:bg-spring-700 transition-colors">
                            Auto-Fix
                          </button>
                        </div>
                      ))}
                      {issueNotices > 5 && (
                        <div className="text-center text-midnight-500">
                          ... and {issueNotices - 5} more issues
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex justify-between">
                  <button
                    onClick={prevStep}
                    className="px-6 py-3 bg-praxeti-400 text-midnight-700 rounded-lg hover:bg-praxeti-500 transition-all duration-200 font-medium"
                  >
                    ← Back
                  </button>
                  <div className="flex space-x-4">
                    <button className="px-6 py-3 bg-spring-600 text-white rounded-lg hover:bg-spring-700 transition-all duration-200 font-medium">
                      Skip Issues ({issueNotices})
                    </button>
                    <button
                      onClick={nextStep}
                      className="px-8 py-3 bg-mantis-600 text-white rounded-lg hover:bg-mantis-700 transition-all duration-200 font-medium"
                    >
                      Continue with {validNotices} Valid Documents →
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 4: Assign Notary */}
          {currentStep === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-semibold text-midnight-900 mb-4">Assign Notary</h2>
                  <p className="text-lg text-midnight-600">Choose a notary for bulk validation and signature</p>
                </div>

                <div className="space-y-6">
                  {notaryOptions.map((notary) => (
                    <motion.div
                      key={notary.id}
                      className={`card p-6 cursor-pointer transition-all duration-300 ${
                        selectedNotary === notary.id ? 'ring-2 ring-mantis-500 bg-mantis-50' : 'hover:shadow-lg'
                      }`}
                      onClick={() => setSelectedNotary(notary.id)}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-16 h-16 bg-midnight-100 rounded-full flex items-center justify-center">
                            <span className="text-xl font-semibold text-midnight-700">
                              {notary.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-midnight-900">{notary.name}</h3>
                            <p className="text-midnight-600">{notary.specialization}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <svg
                                    key={i}
                                    className={`h-4 w-4 ${i < Math.floor(notary.rating) ? 'text-spring-500' : 'text-gray-300'}`}
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                  </svg>
                                ))}
                              </div>
                              <span className="text-sm text-midnight-500">{notary.rating}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-midnight-900">AED {notary.price}</div>
                          <div className="text-sm text-midnight-600">per document</div>
                          <div className="text-sm text-mantis-600 font-medium mt-1">
                            Total: AED {(notary.price * validNotices).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="flex justify-between mt-8">
                  <button
                    onClick={prevStep}
                    className="px-6 py-3 bg-praxeti-400 text-midnight-700 rounded-lg hover:bg-praxeti-500 transition-all duration-200 font-medium"
                  >
                    ← Back
                  </button>
                  {selectedNotary && (
                    <button
                      onClick={nextStep}
                      className="px-8 py-3 bg-mantis-600 text-white rounded-lg hover:bg-mantis-700 transition-all duration-200 font-medium"
                    >
                      Continue to Payment →
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 5: Payment */}
          {currentStep === 5 && (
            <motion.div
              key="step5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-semibold text-midnight-900 mb-4">Payment Summary</h2>
                  <p className="text-lg text-midnight-600">Review your bulk notarization order</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Order Summary */}
                  <div className="card p-6">
                    <h3 className="text-lg font-semibold text-midnight-900 mb-4">Order Summary</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-midnight-600">Valid documents</span>
                        <span className="font-medium">{validNotices}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-midnight-600">Price per document</span>
                        <span className="font-medium">AED {selectedNotary ? notaryOptions.find(n => n.id === selectedNotary)?.price : 50}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-midnight-600">Bulk discount (10%)</span>
                        <span className="font-medium text-mantis-600">-AED {Math.round(totalCost * 0.1)}</span>
                      </div>
                      <div className="border-t border-gray-200 pt-3">
                        <div className="flex justify-between text-lg font-semibold">
                          <span>Total</span>
                          <span className="text-mantis-600">AED {Math.round(totalCost * 0.9).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div className="card p-6">
                    <h3 className="text-lg font-semibold text-midnight-900 mb-4">Payment Method</h3>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
                        <input type="radio" name="payment" defaultChecked className="text-mantis-600" />
                        <div className="flex-1">
                          <div className="font-medium text-midnight-900">Corporate Account</div>
                          <div className="text-sm text-midnight-600">Monthly invoice billing</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
                        <input type="radio" name="payment" className="text-mantis-600" />
                        <div className="flex-1">
                          <div className="font-medium text-midnight-900">Credit Card</div>
                          <div className="text-sm text-midnight-600">Immediate payment</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
                        <input type="radio" name="payment" className="text-mantis-600" />
                        <div className="flex-1">
                          <div className="font-medium text-midnight-900">Wallet Balance</div>
                          <div className="text-sm text-midnight-600">AED 25,000 available</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between mt-8">
                  <button
                    onClick={prevStep}
                    className="px-6 py-3 bg-praxeti-400 text-midnight-700 rounded-lg hover:bg-praxeti-500 transition-all duration-200 font-medium"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={nextStep}
                    className="px-8 py-3 bg-mantis-600 text-white rounded-lg hover:bg-mantis-700 transition-all duration-200 font-medium"
                  >
                    Confirm Payment →
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 6: Delivery Options */}
          {currentStep === 6 && (
            <motion.div
              key="step6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-semibold text-midnight-900 mb-4">Delivery Options</h2>
                  <p className="text-lg text-midnight-600">Choose how you want to receive your notarized documents</p>
                </div>

                <div className="space-y-4">
                  {[
                    {
                      id: 'download',
                      title: 'Digital Download',
                      description: 'Download notarized PDFs with QR verification',
                      icon: (
                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      ),
                      cost: 'Free'
                    },
                    {
                      id: 'courier',
                      title: 'Courier Delivery',
                      description: 'Printed and stamped hard copies delivered to your office',
                      icon: (
                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2v0a2 2 0 01-2-2v-1" />
                        </svg>
                      ),
                      cost: 'AED 500'
                    },
                    {
                      id: 'email',
                      title: 'Auto-Email Distribution',
                      description: 'Automatically email each notice to the respective tenant',
                      icon: (
                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      ),
                      cost: 'AED 350'
                    }
                  ].map((option) => (
                    <motion.div
                      key={option.id}
                      className={`card p-6 cursor-pointer transition-all duration-300 ${
                        deliveryMethod.includes(option.id) ? 'ring-2 ring-mantis-500 bg-mantis-50' : 'hover:shadow-lg'
                      }`}
                      onClick={() => {
                        if (deliveryMethod.includes(option.id)) {
                          setDeliveryMethod(deliveryMethod.filter(m => m !== option.id));
                        } else {
                          setDeliveryMethod([...deliveryMethod, option.id]);
                        }
                      }}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                            deliveryMethod.includes(option.id) ? 'bg-mantis-600 text-white' : 'bg-midnight-100 text-midnight-600'
                          }`}>
                            {option.icon}
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-midnight-900">{option.title}</h3>
                            <p className="text-midnight-600">{option.description}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-semibold text-midnight-900">{option.cost}</div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="flex justify-between mt-8">
                  <button
                    onClick={prevStep}
                    className="px-6 py-3 bg-praxeti-400 text-midnight-700 rounded-lg hover:bg-praxeti-500 transition-all duration-200 font-medium"
                  >
                    ← Back
                  </button>
                  {deliveryMethod.length > 0 && (
                    <button
                      onClick={nextStep}
                      className="px-8 py-3 bg-mantis-600 text-white rounded-lg hover:bg-mantis-700 transition-all duration-200 font-medium"
                    >
                      Complete Order →
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 7: Completion */}
          {currentStep === 7 && (
            <motion.div
              key="step7"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <div className="max-w-4xl mx-auto text-center">
                <div className="w-20 h-20 bg-mantis-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="h-10 w-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-3xl font-semibold text-midnight-900 mb-4">Order Complete!</h2>
                <p className="text-lg text-midnight-600 mb-8">
                  Your bulk legal notice order has been submitted. You&apos;ll receive updates on the progress.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="card p-6">
                    <h3 className="font-semibold text-midnight-900 mb-2">Order ID</h3>
                    <p className="text-midnight-600">BLN-2025-001</p>
                  </div>
                  <div className="card p-6">
                    <h3 className="font-semibold text-midnight-900 mb-2">Documents</h3>
                    <p className="text-midnight-600">{validNotices} notices</p>
                  </div>
                  <div className="card p-6">
                    <h3 className="font-semibold text-midnight-900 mb-2">Estimated Completion</h3>
                    <p className="text-midnight-600">3-5 business days</p>
                  </div>
                </div>

                <div className="flex justify-center space-x-4">
                  <button
                    onClick={() => router.push('/corporate')}
                    className="px-8 py-3 bg-mantis-600 text-white rounded-lg hover:bg-mantis-700 transition-all duration-200 font-medium"
                  >
                    Return to Dashboard
                  </button>
                  <button className="px-8 py-3 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-all duration-200 font-medium">
                    Download Report
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}