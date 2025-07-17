'use client';

import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import ProgressBar from '@/components/ProgressBar';

interface UploadedFile {
  file: File;
  name: string;
  size: string;
  type: string;
  preview?: string;
}

export default function NotarizePage() {
  const [currentStep, setCurrentStep] = useState(1);
  const router = useRouter();
  // New: workflow services state
  interface Service {
    id: string;
    name: string;
    cost: number;
    duration: string;
    isOnline: boolean;
    requiresNotary: boolean;
    isDefault: boolean;
  }

  const defaultServices: Service[] = [
    { id: 's1', name: 'Translation', cost: 40, duration: '2-3 days', isOnline: true, requiresNotary: false, isDefault: true },
    { id: 's2', name: 'Ministry of Justice Notarization', cost: 25, duration: '1 day', isOnline: false, requiresNotary: true, isDefault: true },
    { id: 's3', name: 'Ministry of Foreign Affairs', cost: 35, duration: '2 days', isOnline: false, requiresNotary: false, isDefault: true },
    { id: 's4', name: 'Embassy Legalization', cost: 60, duration: '3-5 days', isOnline: false, requiresNotary: false, isDefault: true },
    { id: 's5', name: 'Delivery / Download', cost: 10, duration: '1 day', isOnline: true, requiresNotary: false, isDefault: true },
  ];

  const [services, setServices] = useState<Service[]>(defaultServices);
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [documentType, setDocumentType] = useState<string>('');
  const [userRequest, setUserRequest] = useState<string>('');
  // Enhanced common requests with icons and descriptions
  const commonRequests = [
    {
      id: 'translation',
      title: 'Translation and notarization',
      description: 'Translate your document and get it notarized',
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
        </svg>
      )
    },
    {
      id: 'apostille',
      title: 'Apostille certification',
      description: 'Get official apostille stamp for international use',
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      )
    },
    {
      id: 'embassy',
      title: 'Embassy attestation',
      description: 'Verify document authenticity at embassy level',
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      )
    },
    {
      id: 'verification',
      title: 'Document verification',
      description: 'Confirm document validity and authenticity',
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      )
    }
  ];
  const [selectedRequests, setSelectedRequests] = useState<string[]>([]);

  const toggleRequest = (reqId: string) => {
    setSelectedRequests((prev) =>
      prev.includes(reqId) ? prev.filter((r) => r !== reqId) : [...prev, reqId]
    );
  };

  // When user confirms step-3, add selected request services then continue
  const handleConfirmRequests = () => {
    // Map selected requests into service items (simple placeholder values)
    const selectedRequestObjects = commonRequests.filter(req => selectedRequests.includes(req.id));
    const newServices: Service[] = selectedRequestObjects.map((req) => ({
      id: `${Date.now()}-${req.id}`,
      name: req.title,
      cost: 0,
      duration: 'Varies',
      isOnline: true,
      requiresNotary: req.title.toLowerCase().includes('notarization'),
      isDefault: false,
    }));
    if (newServices.length) {
      setServices((prev) => [...prev, ...newServices]);
    }
    nextStep();
  };
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Steps updated to 4
  const steps = [
    { id: 1, title: 'Upload', description: 'Upload your document' },
    { id: 2, title: 'Analysis', description: 'AI document review' },
    { id: 3, title: 'Request', description: 'Describe your needs' },
    { id: 4, title: 'Payment', description: 'Confirm & Pay' }
  ];

  const documentTypes = [
    'Birth Certificate',
    'Power of Attorney',
    'Contract',
    'Court Order',
    'Academic Certificate',
    'Marriage Certificate',
    'Other'
  ];

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileUpload = useCallback((file: File) => {
    const uploadedFile: UploadedFile = {
      file,
      name: file.name,
      size: formatFileSize(file.size),
      type: file.type,
    };

    // Create preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        uploadedFile.preview = e.target?.result as string;
        setUploadedFile(uploadedFile);
      };
      reader.readAsDataURL(file);
    } else {
      setUploadedFile(uploadedFile);
    }

    // Simulate AI analysis
    setTimeout(() => {
      setIsAnalyzing(true);
      setTimeout(() => {
        setIsAnalyzing(false);
        setDocumentType('Birth Certificate'); // Mock AI detection
        setCurrentStep(2);
      }, 2000);
    }, 500);
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
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  }, [handleFileUpload]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  }, [handleFileUpload]);

  // Navigation helpers modified
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

  const handlePaymentComplete = () => {
    // Create activity item from current document data
    const newActivity = {
      id: Date.now(),
      filename: uploadedFile?.name || 'document.pdf',
      type: documentType || 'Unknown Document',
      status: 'Payment Processed',
      progress: 5,
      eta: 'Starting process...',
      dateCreated: new Date().toISOString(),
      services: services.map(s => ({
        name: s.name,
        cost: s.cost,
        duration: s.duration,
        status: 'Pending'
      })),
      totalCost: services.reduce((sum, s) => sum + s.cost, 0),
      userRequest: userRequest
    };

    // Get existing activities from localStorage
    const existingActivities = JSON.parse(localStorage.getItem('notaryActivities') || '[]');
    
    // Add new activity to the beginning of the array
    const updatedActivities = [newActivity, ...existingActivities];
    
    // Save to localStorage
    localStorage.setItem('notaryActivities', JSON.stringify(updatedActivities));
    
    // Redirect to homepage
    router.push('/');
  };



  return (
    <div className="min-h-screen bg-praxeti-200 ">
      {/* Navigation Header */}
      <Navbar/>

      {/* Progress Header */}
      <header className="max-w-full border-b border-gray-200 mx-auto px-6 sm:px-8 lg:px-12 py-6 flex flex-col md:flex-row md:items-start gap-6">
        {/* --- Left zone (fixed width) --- */}
        <div className="shrink-0 space-y-2">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-medium text-brand-600 hover:text-brand-700"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
          <h1 className="text-2xl font-semibold text-midnight-900">
            Notarize a Document
          </h1>
        </div>

        {/* --- Center zone (flex‑1) --- */}
        <div className="flex justify-center w-full -translate-x-20">
          <ProgressBar
            currentStep={currentStep}
            steps={steps}
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-12 py-12">
        <AnimatePresence mode="wait">
          {/* Step 1: Upload Document */}
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-center mb-12">
                <h2 className="text-3xl font-semibold text-midnight-900 mb-4">Upload your document</h2>
                <p className="text-lg text-midnight-600">We&apos;ll read it and guide you through the process</p>
              </div>

              <div className="max-w-2xl mx-auto">
                <div
                  className={`relative border-2 border-dashed rounded-xl p-16 transition-all duration-300 ${
                    isDragOver 
                      ? 'border-brand-500 bg-brand-50' 
                      : uploadedFile 
                        ? 'border-brand-500 bg-brand-50' 
                        : 'border-gray-300 bg-praxeti-300'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  {!uploadedFile && !isAnalyzing && (
                    <div className="text-center">
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="mx-auto w-16 h-16 bg-brand-600 rounded-full flex items-center justify-center mb-6"
                      >
                        <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                      </motion.div>
                      <h3 className="text-xl font-semibold text-midnight-900 mb-2">Drop your document here</h3>
                      <p className="text-midnight-600 mb-6">Or click to browse files</p>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="px-8 py-4 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                      >
                        Choose File
                      </button>
                      <p className="text-sm text-gray-500 mt-4">Supports PDF, image, or Word files</p>
                    </div>
                  )}

                  {isAnalyzing && (
                    <div className="text-center">
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="mx-auto w-16 h-16 bg-brand-600 rounded-full flex items-center justify-center mb-6"
                      >
                        <motion.svg 
                          className="h-8 w-8 text-white"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </motion.svg>
                      </motion.div>
                      <h3 className="text-xl font-semibold text-midnight-900 mb-2">Analyzing document...</h3>
                      <p className="text-midnight-600">Our AI is reading your file</p>
                    </div>
                  )}

                  {uploadedFile && !isAnalyzing && (
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-center"
                    >
                      <div className="mx-auto w-16 h-16 bg-brand-600 rounded-full flex items-center justify-center mb-6">
                        <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-semibold text-midnight-900 mb-2">File uploaded successfully!</h3>
                      <div className="bg-white rounded-lg p-4 max-w-md mx-auto border border-gray-200">
                        <p className="font-medium text-midnight-900">{uploadedFile.name}</p>
                        <p className="text-sm text-gray-500">{uploadedFile.size}</p>
                      </div>
                    </motion.div>
                  )}

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 2: AI Analysis */}
          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-center mb-12">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="mx-auto w-16 h-16 bg-brand-600 rounded-full flex items-center justify-center mb-6"
                >
                  <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </motion.div>
                <h2 className="text-3xl font-semibold text-midnight-900 mb-4">We&apos;ve read your file</h2>
                <p className="text-lg text-midnight-600">Here&apos;s what we found</p>
              </div>

              <div className="max-w-2xl mx-auto ">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white rounded-xl border border-gray-200 p-8 mb-8 card"
                >
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="p-3 bg-brand-600 rounded-lg">
                      <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-midnight-900">Document Analysis</h3>
                      <p className="text-midnight-600">AI-powered document recognition</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-praxeti-300 rounded-lg">
                      <span className="text-midnight-900 font-medium">Document Type:</span>
                      <span className="px-3 py-1 bg-brand-600 text-white rounded-full text-sm font-medium">
                        {documentType}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-praxeti-300 rounded-lg">
                      <span className="text-midnight-900 font-medium">Confidence Level:</span>
                      <span className="text-brand-600 font-medium">95%</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-praxeti-300 rounded-lg">
                      <span className="text-midnight-900 font-medium">Language:</span>
                      <span className="text-midnight-900">English</span>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="bg-white rounded-xl border border-gray-200 p-6 card"
                >
                  <h4 className="font-medium text-midnight-900 mb-3">Is this correct?</h4>
                  <div className="space-y-2">
                    <select
                      value={documentType}
                      onChange={(e) => setDocumentType(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-midnight-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                    >
                      {documentTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="flex justify-center mt-8"
                >
                  <motion.button
                    onClick={nextStep}
                    className="px-8 py-3 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-all duration-200 font-medium flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span>Continue</span>
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </motion.button>
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* Step 3: User Request */}
          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-center mb-12">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="mx-auto w-16 h-16 bg-brand-600 rounded-full flex items-center justify-center mb-6"
                >
                  <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </motion.div>
                <h2 className="text-3xl font-semibold text-midnight-900 mb-4">What do you want to do with this document?</h2>
                <p className="text-lg text-midnight-600">Describe your specific needs and we&apos;ll create the perfect path</p>
              </div>

              <div className="max-w-2xl mx-auto">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="card p-8"
                >
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-midnight-900 mb-3">
                      Your Request
                    </label>
                    <textarea
                      value={userRequest}
                      onChange={(e) => setUserRequest(e.target.value)}
                      placeholder="e.g., Translate to English, certify from Ministry of Justice and Embassy, then apostille for use in USA..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-midnight-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 resize-none"
                      rows={6}
                    />
                  </div>

                  <div className="mb-6">
                    <h4 className="font-medium text-midnight-900 mb-4">Common requests for {documentType}:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {commonRequests.map((req) => (
                        <motion.div
                          key={req.id}
                          className={`cursor-pointer rounded-lg border-2 p-4 transition-all duration-200 hover:shadow-md ${
                            selectedRequests.includes(req.id)
                              ? 'border-brand-500 bg-brand-50 shadow-md'
                              : 'border-gray-200 bg-white hover:border-gray-300'
                          }`}
                          onClick={() => toggleRequest(req.id)}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="flex items-start space-x-3">
                            <div className={`p-2 rounded-lg ${
                              selectedRequests.includes(req.id)
                                ? 'bg-brand-600 text-white'
                                : 'bg-praxeti-400 text-midnight-600'
                            }`}>
                              {req.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h5 className="font-medium text-midnight-900 text-sm leading-tight">
                                {req.title}
                              </h5>
                              <p className="text-xs text-midnight-600 mt-1 leading-relaxed">
                                {req.description}
                              </p>
                            </div>
                            <div className={`flex-shrink-0 w-4 h-4 rounded border-2 ${
                              selectedRequests.includes(req.id)
                                ? 'bg-brand-600 border-brand-600'
                                : 'border-gray-300'
                            }`}>
                              {selectedRequests.includes(req.id) && (
                                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <button
                      onClick={prevStep}
                      className="px-6 py-3 bg-praxeti-400 text-midnight-700 rounded-lg hover:bg-praxeti-500 transition-all duration-200 font-medium flex items-center space-x-2 shadow-sm hover:shadow-md"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                      <span>Back</span>
                    </button>
                    <button
                      onClick={handleConfirmRequests}
                      className="px-8 py-3 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-all duration-200 font-medium flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                      disabled={!userRequest.trim()}
                    >
                      <span>Confirm & Continue</span>
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* Step 4: Payment */}
          {currentStep === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-center mb-12">
                <h2 className="text-3xl font-semibold text-midnight-900 mb-4">Confirm & Pay</h2>
                <p className="text-lg text-midnight-600">Review your services and complete payment to start</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Document Overview */}
                <div className="card p-6 flex flex-col gap-4">
                  <h4 className="font-semibold text-midnight-900">Document Overview</h4>
                  {uploadedFile?.preview ? (
                    <img
                      src={uploadedFile.preview}
                      alt={uploadedFile.name}
                      className="w-24 h-24 object-cover rounded-lg shadow"
                    />
                  ) : (
                    <div className="w-24 h-24 bg-praxeti-400 rounded-lg flex items-center justify-center text-midnight-600 shadow">
                      <svg
                        className="h-10 w-10"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                  )}
                  
                  <div className="text-sm text-midnight-600 space-y-1">
                    <p>
                      <span className="font-medium text-midnight-900">Name:</span> {uploadedFile?.name}
                    </p>
                    <p>
                      <span className="font-medium text-midnight-900">Size:</span> {uploadedFile?.size}
                    </p>
                    <p>
                      <span className="font-medium text-midnight-900">Detected Type:</span> {documentType}
                    </p>
                  </div>
                </div>
                {/* Order Review */}
                <div className="card p-6 flex-1">
                  <h4 className="font-semibold text-midnight-900 mb-4">Selected Services</h4>
                  <ul className="space-y-3">
                    {services.map(s => (
                      <li key={s.id} className="flex justify-between text-sm text-midnight-600">
                        <span>{s.name}</span>
                        <span>€{s.cost}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="border-t border-gray-200 mt-4 pt-4 flex justify-between font-semibold text-midnight-900">
                    <span>Total</span>
                    <span>€{services.reduce((sum, s) => sum + s.cost, 0)}</span>
                  </div>
                </div>

                {/* Payment Details */}
                <div className="w-full md:max-w-sm card p-6 flex flex-col gap-4">
                  <h4 className="font-semibold text-midnight-900">Payment Method</h4>
                  <div className="flex items-center gap-4">
                    <img src="/Payment/visa.svg" alt="Visa" className="h-8" />
                    <img src="/Payment/mastercard.svg" alt="Mastercard" className="h-8" />
                  </div>

                  {/* Mock input fields */}
                  <input
                    type="text"
                    placeholder="Cardholder Name"
                    className="form-input"
                  />
                  <input
                    type="text"
                    placeholder="Card Number"
                    className="form-input"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="MM/YY"
                      className="form-input"
                    />
                    <input
                      type="text"
                      placeholder="CVV"
                      className="form-input"
                    />
                  </div>
                  <p className="text-sm text-midnight-600">Mocked payment component for prototype</p>
                  <motion.button
                    onClick={handlePaymentComplete}
                    className="mt-auto px-8 py-3 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center space-x-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    <span>Pay & Start Processing</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
} 