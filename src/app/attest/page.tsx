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
  content?: string;
}


export default function AttestPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [documentType, setDocumentType] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState('Uploading...');
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [destinationCountry, setDestinationCountry] = useState<'UAE' | 'GCC' | 'Worldwide'>('UAE');
  const [needsTranslation, setNeedsTranslation] = useState(false);
  const [needsCourier, setNeedsCourier] = useState(false);
  const [courierAddress, setCourierAddress] = useState('');
  const [attestPath, setAttestPath] = useState<string[]>(['MoJ']);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const analyzeDocument = async (fileName: string, fileType: string, content?: string) => {
    try {
      console.log('Analyzing document:', { fileName, fileType, contentLength: content?.length || 0 });
      
      if (!content) {
        throw new Error('No file content provided');
      }

      // Progress step 1: Uploading
      setAnalysisProgress('Uploading...');
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Progress step 2: Analyzing
      setAnalysisProgress('Analyzing document...');
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Use consolidated GPT API for document analysis
      const response = await fetch('/api/gpt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'document-analysis',
          fileName,
          fileType,
          fileBase64: content
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('API Error:', errorData);
        throw new Error(`Analysis failed: ${response.status} - ${errorData.error || 'Unknown error'}`);
      }

      // Progress step 3: Processing results
      setAnalysisProgress('Processing results...');
      const data = await response.json();
      const analysis = data.analysis;
      
      // Update state with AI analysis results
      setDocumentType(analysis.documentType || 'Unknown Document');
      setAnalysisResults(analysis);
      
      // Log analysis for debugging
      console.log('AI Analysis Results:', analysis);
      
      // Progress step 4: Complete
      setAnalysisProgress('Complete!');
      await new Promise(resolve => setTimeout(resolve, 800));
      
      return analysis;
    } catch (error) {
      console.error('Document analysis error:', error);
      throw error;
    }
  };

  const steps = [
    { id: 1, title: 'Upload', description: 'Upload your document' },
    { id: 2, title: 'Analysis', description: 'AI document review' },
    { id: 3, title: 'Request', description: 'Configure service path' },
    { id: 4, title: 'Payment', description: 'Confirm & Pay' }
  ];

  const documentTypes = [
    'Birth Certificate',
    'Educational Certificate',
    'Marriage Certificate',
    'Power of Attorney',
    'Commercial Documents',
    'Court Order',
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

    // Read all files as base64 for vision API
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64Result = e.target?.result as string;
      uploadedFile.content = base64Result; // Store base64 for AI analysis
      
      // For images, also use as preview
      if (file.type.startsWith('image/')) {
        uploadedFile.preview = base64Result;
      }
      
      setUploadedFile(uploadedFile);
      
      // Start AI analysis AFTER file is loaded
      setIsAnalyzing(true);
      
      // Analyze document with AI
      analyzeDocument(file.name, file.type, base64Result).then(() => {
        setCurrentStep(2);
      }).catch((error) => {
        console.error('Document analysis failed:', error);
        setDocumentType('Unknown Document');
        setAnalysisProgress('Analysis failed');
        setTimeout(() => {
          setCurrentStep(2);
        }, 1000);
      }).finally(() => {
        setIsAnalyzing(false);
      });
    };
    reader.readAsDataURL(file);
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

  const handleDestinationChange = (destination: 'UAE' | 'GCC' | 'Worldwide') => {
    setDestinationCountry(destination);
    switch (destination) {
      case 'UAE':
        setAttestPath(['MoJ']);
        break;
      case 'GCC':
        setAttestPath(['MoJ', 'MoFA']);
        break;
      case 'Worldwide':
        setAttestPath(['MoJ', 'MoFA', 'Embassy']);
        break;
    }
  };

  const calculateTotalCost = () => {
    let total = 0;
    
    if (needsTranslation) total += 120;
    
    attestPath.forEach(step => {
      switch (step) {
        case 'MoJ':
          total += 25;
          break;
        case 'MoFA':
          total += 35;
          break;
        case 'Embassy':
          total += 60; // TBD in requirements, using placeholder
          break;
      }
    });
    
    if (needsCourier) total += 50;
    
    return total;
  };

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
    const newActivity = {
      id: Date.now(),
      filename: uploadedFile?.name || 'document.pdf',
      type: documentType || 'Unknown Document',
      status: 'Payment Processed',
      progress: 5,
      eta: 'Starting process...',
      dateCreated: new Date().toISOString(),
      services: [
        ...(needsTranslation ? [{ name: 'Translation', cost: 120, duration: '2-3 days', status: 'Pending' }] : []),
        ...attestPath.map(step => ({
          name: step === 'MoJ' ? 'Ministry of Justice' : step === 'MoFA' ? 'Ministry of Foreign Affairs' : 'Embassy Legalisation',
          cost: step === 'MoJ' ? 25 : step === 'MoFA' ? 35 : 60,
          duration: step === 'MoJ' ? '1-2 days' : step === 'MoFA' ? '2-3 days' : '3-5 days',
          status: 'Pending'
        })),
        ...(needsCourier ? [{ name: 'Courier Service', cost: 50, duration: '1-2 days', status: 'Pending' }] : [])
      ],
      totalCost: calculateTotalCost(),
      userRequest: `Attest document for ${destinationCountry} use${needsTranslation ? ' with translation' : ''}${needsCourier ? ' and courier delivery' : ''}`,
      documentType: 'attestation' as const
    };

    const existingActivities = JSON.parse(localStorage.getItem('notaryActivities') || '[]');
    const updatedActivities = [newActivity, ...existingActivities];
    localStorage.setItem('notaryActivities', JSON.stringify(updatedActivities));
    
    router.push('/?toast=Your attestation has begun. Track progress below.');
  };

  return (
    <div className="min-h-screen bg-praxeti-200">
      <Navbar />

      <header className="max-w-full border-b border-gray-200 mx-auto px-6 sm:px-8 lg:px-12 py-6 flex flex-col md:flex-row md:items-start gap-6">
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
            Attest a Document
          </h1>
        </div>

        <div className="flex justify-center w-full -translate-x-20">
          <ProgressBar currentStep={currentStep} steps={steps} />
        </div>
      </header>

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
                <p className="text-lg text-midnight-600">We&apos;ll analyze it and guide you through the attestation process</p>
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
                      <p className="text-sm text-gray-500 mt-4">
                        Supported formats: PDF, JPG, JPEG, PNG, GIF, WEBP
                      </p>
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
                      <h3 className="text-xl font-semibold text-midnight-900 mb-2">{analysisProgress}</h3>
                      <p className="text-midnight-600">
                        {analysisProgress === 'Uploading...' && 'Preparing your document...'}
                        {analysisProgress === 'Analyzing document...' && 'Our AI is reading your file'}
                        {analysisProgress === 'Processing results...' && 'Generating recommendations...'}
                        {analysisProgress === 'Complete!' && 'Analysis complete!'}
                        {analysisProgress === 'Analysis failed' && 'Please try again'}
                      </p>
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
                    accept=".pdf,.jpg,.jpeg,.png,.gif,.webp,image/*"
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
                <h2 className="text-3xl font-semibold text-midnight-900 mb-4">Document Analysis Complete</h2>
                <p className="text-lg text-midnight-600">Here&apos;s what our AI found</p>
              </div>

              <div className="max-w-2xl mx-auto">
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
                      <span className="text-midnight-900 font-medium">Language:</span>
                      <span className="text-midnight-900">{analysisResults?.language || 'English'}</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-praxeti-300 rounded-lg">
                      <span className="text-midnight-900 font-medium">Confidence Level:</span>
                      <span className="text-brand-600 font-medium">{analysisResults?.confidence || 85}%</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-praxeti-300 rounded-lg">
                      <span className="text-midnight-900 font-medium">Quality:</span>
                      <span className={`capitalize font-medium ${
                        analysisResults?.quality === 'good' ? 'text-green-600' : 
                        analysisResults?.quality === 'fair' ? 'text-yellow-600' : 
                        'text-red-600'
                      }`}>
                        {analysisResults?.quality || 'Fair'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-praxeti-300 rounded-lg">
                      <span className="text-midnight-900 font-medium">Estimated Time:</span>
                      <span className="text-midnight-900">{analysisResults?.estimatedTime || '5-7 business days'}</span>
                    </div>
                  </div>

                  {/* AI Assistant Recommendations */}
                  <div className="mt-6 space-y-4">
                    <h4 className="font-medium text-midnight-900">AI Assistant Recommendations:</h4>
                    
                    {/* Translation Recommendation */}
                    {analysisResults?.needsArabicTranslation && (
                      <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                        <div className="flex items-start space-x-3">
                          <svg className="h-5 w-5 text-amber-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                          </svg>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-amber-800">Arabic translation required</p>
                            <p className="text-xs text-amber-600 mt-1">Your document needs Arabic translation for UAE attestation</p>
                            <button 
                              onClick={() => setNeedsTranslation(true)}
                              className="mt-2 text-xs px-3 py-1 bg-amber-600 text-white rounded-full hover:bg-amber-700"
                            >
                              Add Translation - AED 120
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* General Recommendations */}
                    {analysisResults?.recommendations && analysisResults.recommendations.length > 0 && (
                      <div className="space-y-3">
                        {analysisResults.recommendations.map((rec: string, index: number) => (
                          <div key={index} className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <div className="flex items-start space-x-3">
                              <svg className="h-5 w-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <div className="flex-1">
                                <p className="text-sm font-medium text-blue-800">{rec}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Notarization Steps */}
                    {analysisResults?.notarizationSteps && analysisResults.notarizationSteps.length > 0 && (
                      <div className="mt-4">
                        <h5 className="font-medium text-midnight-900 mb-2">Notarization Steps:</h5>
                        <div className="space-y-2">
                          {analysisResults.notarizationSteps.map((step: string, index: number) => (
                            <div key={index} className="p-3 bg-green-50 border border-green-200 rounded-lg">
                              <div className="flex items-start space-x-3">
                                <span className="inline-flex items-center justify-center w-5 h-5 bg-green-600 text-white text-xs rounded-full mt-0.5">
                                  {index + 1}
                                </span>
                                <p className="text-sm text-green-800">{step}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                      <div className="flex items-start space-x-3">
                        <svg className="h-5 w-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-blue-800">Scan quality assessment</p>
                          <p className="text-xs text-blue-600 mt-1">Document quality is acceptable for attestation</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="bg-white rounded-xl border border-gray-200 p-6 card"
                >
                  <h4 className="font-medium text-midnight-900 mb-3">Confirm document type:</h4>
                  <select
                    value={documentType}
                    onChange={(e) => setDocumentType(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-midnight-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                  >
                    {documentTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </motion.div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="flex justify-center mt-8"
                >
                  <button
                    onClick={nextStep}
                    className="px-8 py-3 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-all duration-200 font-medium flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    <span>Continue</span>
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* Step 3: Request Configuration */}
          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-center mb-12">
                <h2 className="text-3xl font-semibold text-midnight-900 mb-4">Configure Attestation Path</h2>
                <p className="text-lg text-midnight-600">Choose your destination and service options</p>
              </div>

              <div className="max-w-2xl mx-auto space-y-6">
                {/* Section A: Destination Country */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 card">
                  <h3 className="text-lg font-semibold text-midnight-900 mb-4">Destination Country</h3>
                  <div className="space-y-3">
                    {[
                      { key: 'UAE', label: 'UAE Only', path: ['MoJ'] },
                      { key: 'GCC', label: 'GCC Countries', path: ['MoJ', 'MoFA'] },
                      { key: 'Worldwide', label: 'Worldwide', path: ['MoJ', 'MoFA', 'Embassy'] }
                    ].map(option => (
                      <label key={option.key} className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="radio"
                          name="destination"
                          value={option.key}
                          checked={destinationCountry === option.key}
                          onChange={(e) => handleDestinationChange(e.target.value as 'UAE' | 'GCC' | 'Worldwide')}
                          className="w-4 h-4 text-brand-600 border-gray-300 focus:ring-brand-500"
                        />
                        <span className="text-midnight-900">{option.label}</span>
                        <span className="text-sm text-gray-500">
                          ({option.path.join(' → ')})
                        </span>
                      </label>
                    ))}
                  </div>
                  
                  {/* Show current attestation path */}
                  <div className="mt-4 p-4 bg-praxeti-300 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-midnight-900">Attestation Path:</span>
                      <div className="flex items-center space-x-2">
                        {attestPath.map((step, index) => (
                          <div key={step} className="flex items-center space-x-2">
                            <span className="px-2 py-1 bg-brand-600 text-white text-xs rounded-full">
                              {step}
                            </span>
                            {index < attestPath.length - 1 && (
                              <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                    {destinationCountry === 'Worldwide' && (
                      <p className="text-xs text-amber-600 mt-2">
                        Note: Embassy fee is TBD and will be confirmed before processing
                      </p>
                    )}
                  </div>
                </div>

                {/* Section B: Additional Services */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 card">
                  <h3 className="text-lg font-semibold text-midnight-900 mb-4">Additional Services</h3>
                  
                  <div className="space-y-4">
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={needsTranslation}
                        onChange={(e) => setNeedsTranslation(e.target.checked)}
                        className="w-4 h-4 text-brand-600 border-gray-300 focus:ring-brand-500"
                      />
                      <span className="text-midnight-900">Arabic Translation</span>
                      <span className="text-sm text-gray-500">(AED 120)</span>
                    </label>

                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={needsCourier}
                        onChange={(e) => setNeedsCourier(e.target.checked)}
                        className="w-4 h-4 text-brand-600 border-gray-300 focus:ring-brand-500"
                      />
                      <span className="text-midnight-900">Courier hard copy to me</span>
                      <span className="text-sm text-gray-500">(AED 50)</span>
                    </label>

                    {needsCourier && (
                      <div className="ml-7 mt-3">
                        <textarea
                          value={courierAddress}
                          onChange={(e) => setCourierAddress(e.target.value)}
                          placeholder="Enter your delivery address..."
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-midnight-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 resize-none"
                          rows={3}
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Navigation */}
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
                    onClick={nextStep}
                    className="px-8 py-3 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-all duration-200 font-medium flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    <span>Continue to Payment</span>
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
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
                <p className="text-lg text-midnight-600">Review your attestation services and complete payment</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Document Overview */}
                <div className="card p-6">
                  <h4 className="font-semibold text-midnight-900 mb-4">Document Overview</h4>
                  {uploadedFile?.preview ? (
                    <img
                      src={uploadedFile.preview}
                      alt={uploadedFile.name}
                      className="w-24 h-24 object-cover rounded-lg shadow mb-4"
                    />
                  ) : (
                    <div className="w-24 h-24 bg-praxeti-400 rounded-lg flex items-center justify-center text-midnight-600 shadow mb-4">
                      <svg className="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                  )}
                  
                  <div className="text-sm text-midnight-600 space-y-1">
                    <p><span className="font-medium text-midnight-900">Name:</span> {uploadedFile?.name}</p>
                    <p><span className="font-medium text-midnight-900">Size:</span> {uploadedFile?.size}</p>
                    <p><span className="font-medium text-midnight-900">Type:</span> {documentType}</p>
                    <p><span className="font-medium text-midnight-900">Destination:</span> {destinationCountry}</p>
                  </div>
                </div>

                {/* Service Invoice */}
                <div className="card p-6">
                  <h4 className="font-semibold text-midnight-900 mb-4">Service Invoice</h4>
                  <div className="space-y-3">
                    {needsTranslation && (
                      <div className="flex justify-between text-sm">
                        <span>Arabic Translation</span>
                        <span>AED 120</span>
                      </div>
                    )}
                    {attestPath.map(step => (
                      <div key={step} className="flex justify-between text-sm">
                        <span>
                          {step === 'MoJ' ? 'Ministry of Justice' : 
                           step === 'MoFA' ? 'Ministry of Foreign Affairs' : 
                           'Embassy Legalisation'}
                        </span>
                        <span>
                          AED {step === 'MoJ' ? '25' : step === 'MoFA' ? '35' : 'TBD'}
                        </span>
                      </div>
                    ))}
                    {needsCourier && (
                      <div className="flex justify-between text-sm">
                        <span>Courier Service</span>
                        <span>AED 50</span>
                      </div>
                    )}
                  </div>
                  <div className="border-t border-gray-200 mt-4 pt-4 flex justify-between font-semibold text-midnight-900">
                    <span>Total</span>
                    <span>AED {calculateTotalCost()}</span>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="card p-6">
                  <h4 className="font-semibold text-midnight-900 mb-4">Payment Method</h4>
                  <div className="flex items-center gap-4 mb-4">
                    <img src="/Payment/visa.svg" alt="Visa" className="h-8" />
                    <img src="/Payment/mastercard.svg" alt="Mastercard" className="h-8" />
                  </div>

                  <div className="space-y-4">
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
                    <button
                      onClick={handlePaymentComplete}
                      className="w-full px-8 py-3 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center space-x-2"
                    >
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                      <span>Pay & Start Attestation</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}