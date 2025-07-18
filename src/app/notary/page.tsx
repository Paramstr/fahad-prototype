'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

export default function NotaryDashboard() {
  // const [activeTab, setActiveTab] = useState('pending'); // Commented out - unused

  const pendingJobs = [
    {
      id: 'NJ-2025-001',
      client: 'Al Madar Property Management',
      type: 'Legal Notices',
      count: 350,
      priority: 'high',
      submittedAt: '2025-01-17T09:30:00',
      deadline: '2025-01-20T17:00:00'
    },
    {
      id: 'NJ-2025-002',
      client: 'Emirates Real Estate LLC',
      type: 'Tenancy Agreements',
      count: 125,
      priority: 'medium',
      submittedAt: '2025-01-17T14:20:00',
      deadline: '2025-01-22T12:00:00'
    },
    {
      id: 'NJ-2025-003',
      client: 'Dubai Commercial Bank',
      type: 'Power of Attorney',
      count: 85,
      priority: 'high',
      submittedAt: '2025-01-18T08:15:00',
      deadline: '2025-01-21T16:00:00'
    }
  ];

  const stats = {
    totalPending: 475,
    todayCompleted: 89,
    weeklyEarnings: 12500,
    monthlyJobs: 145
  };

  return (
    <div className="min-h-screen bg-praxeti-100">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <motion.div 
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-medium text-midnight-900 mb-2">Good morning, Notary.</h1>
              <p className="text-lg text-midnight-600">Ready to process today&apos;s notarizations?</p>
            </div>
            <motion.div 
              className="flex items-center space-x-3 bg-white rounded-xl p-4 shadow-sm border border-gray-200"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="relative">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute -top-1 -right-1 h-3 w-3 bg-mantis-500 rounded-full"
                />
                <div className="p-2 bg-nuit-100 rounded-lg">
                  <svg className="h-5 w-5 text-nuit-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zm-1.5-8.5A7.5 7.5 0 0 0 6 2.5a7.5 7.5 0 0 0 7.5 7.5 7.5 7.5 0 0 0 7.5-7.5 7.5 7.5 0 0 0-7.5 7.5z" />
                  </svg>
                </div>
              </div>
              <div className="text-sm">
                <div className="font-medium text-midnight-900">2 Urgent Jobs</div>
                <div className="text-midnight-600">Need immediate review</div>
              </div>
            </motion.div>
          </div>

          {/* Stats Cards - Compact and High Contrast */}
          <motion.div 
            className="grid gap-4 mb-16" 
            style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {/* Pending Documents Card */}
            <motion.div 
              className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md hover:border-mantis-300 transition-all duration-200"
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-mantis-100 rounded-lg flex items-center justify-center">
                  <svg className="h-5 w-5 text-mantis-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-midnight-900">{stats.totalPending}</div>
                  <p className="text-xs text-midnight-700 font-medium">Pending Documents</p>
                </div>
              </div>
            </motion.div>

            {/* Today Completed Card */}
            <motion.div 
              className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md hover:border-spring-300 transition-all duration-200"
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-spring-100 rounded-lg flex items-center justify-center">
                  <svg className="h-5 w-5 text-spring-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-midnight-900">{stats.todayCompleted}</div>
                  <p className="text-xs text-midnight-700 font-medium">Today Completed</p>
                </div>
              </div>
            </motion.div>

            {/* Weekly Earnings Card */}
            <motion.div 
              className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md hover:border-nuit-300 transition-all duration-200"
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-nuit-100 rounded-lg flex items-center justify-center">
                  <svg className="h-5 w-5 text-nuit-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-midnight-900">AED {stats.weeklyEarnings.toLocaleString()}</div>
                  <p className="text-xs text-midnight-700 font-medium">Weekly Earnings</p>
                </div>
              </div>
            </motion.div>

            {/* Monthly Jobs Card */}
            <motion.div 
              className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md hover:border-brand-300 transition-all duration-200"
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-brand-100 rounded-lg flex items-center justify-center">
                  <svg className="h-5 w-5 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H9a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-midnight-900">{stats.monthlyJobs}</div>
                  <p className="text-xs text-midnight-700 font-medium">Monthly Jobs</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Primary Action CTAs */}
        <motion.div 
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <h2 className="text-2xl font-medium text-midnight-900 mb-8">What would you like to do?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href="/notary/review" aria-label="Start document review">
              <motion.div
                className="group relative overflow-hidden rounded-xl cursor-pointer"
                whileHover={{ scale: 1.02, y: -8 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                {/* Base Dark Foundation */}
                <div className="absolute inset-0 bg-midnight-900"></div>
                
                {/* Mesh-like Gradient Layer 1 - Mantis Primary Flow */}
                <div className="absolute inset-0 opacity-80">
                  <div className="absolute inset-0 bg-gradient-to-br from-mantis-800 via-midnight-800 to-mantis-900"></div>
                  <div className="absolute inset-0 bg-gradient-to-tr from-mantis-600/60 via-transparent to-mantis-600/40"></div>
                </div>
                
                {/* Mesh-like Gradient Layer 2 - Radial Depth */}
                <div className="absolute inset-0 opacity-70">
                  <div className="absolute top-0 left-0 w-full h-full" style={{background: 'radial-gradient(circle at 30% 20%, rgba(116, 195, 101, 0.4) 0%, transparent 50%)'}}></div>
                  <div className="absolute inset-0 w-full h-full" style={{background:'radial-gradient(circle at 50% 50%, rgba(219,230,76,0.22) 0%, transparent 65%)'}}></div>
                </div>
                
                {/* Content Container with Enhanced Styling */}
                <div className="relative z-10 p-6 border border-mantis-400/30 rounded-xl backdrop-blur-md bg-gradient-to-br from-white/5 via-white/2 to-transparent">
                  <div className="flex items-center justify-between mb-4">
                    <motion.div 
                      className="p-3 bg-gradient-to-br from-white/20 via-white/15 to-white/10 backdrop-blur-sm rounded-xl shadow-lg border border-white/20"
                      whileHover={{ scale: 1.1, rotate: -3 }}
                      transition={{ duration: 0.3 }}
                    >
                      <svg className="h-6 w-6 text-spring-400 drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                      </svg>
                    </motion.div>
                    <motion.div 
                      className="opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center space-x-1 text-xs text-spring-300 bg-white/15 backdrop-blur-sm px-2 py-1 rounded-full border border-white/20"
                      initial={{ x: 10 }}
                      whileHover={{ x: 0 }}
                    >
                      <span className="font-medium">Start</span>
                      <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </motion.div>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2 drop-shadow-lg">Review Documents</h3>
                  <p className="text-praxeti-300 text-sm leading-relaxed">AI pre-screening & batch approval</p>
                </div>
                
                {/* Enhanced Shadow and Border */}
                <div className="absolute inset-0 rounded-xl shadow-lg group-hover:shadow-xl transition-shadow duration-300"></div>
                <div className="absolute inset-0 rounded-xl ring-1 ring-white/10 group-hover:ring-white/20 transition-all duration-300"></div>
              </motion.div>
            </Link>

            <Link href="/notary/workflow" aria-label="External workflow">
              <motion.div
                className="group relative overflow-hidden rounded-xl cursor-pointer"
                whileHover={{ scale: 1.02, y: -8 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                {/* Base Dark Foundation */}
                <div className="absolute inset-0 bg-midnight-900"></div>
                
                {/* Mesh-like Gradient Layer 1 - Nuit Primary Flow */}
                <div className="absolute inset-0 opacity-80">
                  <div className="absolute inset-0 bg-gradient-to-br from-nuit-800 via-midnight-800 to-nuit-900"></div>
                  <div className="absolute inset-0 bg-gradient-to-tr from-nuit-600/60 via-transparent to-midnight-700/40"></div>
                </div>
                
                {/* Mesh-like Gradient Layer 2 - Radial Depth */}
                <div className="absolute inset-0 opacity-70">
                  <div className="absolute top-0 left-0 w-full h-full" style={{background: 'radial-gradient(circle at 25% 25%, rgba(30, 72, 143, 0.4) 0%, transparent 55%)'}}></div>
                  <div className="absolute inset-0 w-full h-full" style={{background:'radial-gradient(circle at 60% 60%, rgba(219,230,76,0.18) 0%, transparent 70%)'}}></div>
                </div>
                
                {/* Content Container with Enhanced Styling */}
                <div className="relative z-10 p-6 border border-nuit-400/30 rounded-xl backdrop-blur-md bg-gradient-to-br from-white/5 via-white/2 to-transparent">
                  <div className="flex items-center justify-between mb-4">
                    <motion.div 
                      className="p-3 bg-gradient-to-br from-white/20 via-white/15 to-white/10 backdrop-blur-sm rounded-xl shadow-lg border border-white/20"
                      whileHover={{ scale: 1.1, rotate: -3 }}
                      transition={{ duration: 0.3 }}
                    >
                      <svg className="h-6 w-6 text-spring-400 drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                      </svg>
                    </motion.div>
                    <motion.div 
                      className="opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center space-x-1 text-xs text-spring-300 bg-white/15 backdrop-blur-sm px-2 py-1 rounded-full border border-white/20"
                      initial={{ x: 10 }}
                      whileHover={{ x: 0 }}
                    >
                      <span className="font-medium">Process</span>
                      <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </motion.div>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2 drop-shadow-lg">External Workflow</h3>
                  <p className="text-praxeti-300 text-sm leading-relaxed">Download & upload to MOJ system</p>
                </div>
                
                {/* Enhanced Shadow and Border */}
                <div className="absolute inset-0 rounded-xl shadow-lg group-hover:shadow-xl transition-shadow duration-300"></div>
                <div className="absolute inset-0 rounded-xl ring-1 ring-white/10 group-hover:ring-white/20 transition-all duration-300"></div>
              </motion.div>
            </Link>

            <Link href="/notary/ledger" aria-label="View ledger">
              <motion.div
                className="group relative overflow-hidden rounded-xl cursor-pointer"
                whileHover={{ scale: 1.02, y: -8 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                {/* Base Dark Foundation */}
                <div className="absolute inset-0 bg-midnight-900"></div>
                
                {/* Mesh-like Gradient Layer 1 - Brand Primary Flow */}
                <div className="absolute inset-0 opacity-80">
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-800 via-midnight-800 to-brand-900"></div>
                  <div className="absolute inset-0 bg-gradient-to-tr from-brand-600/60 via-transparent to-brand-700/40"></div>
                </div>
                
                {/* Mesh-like Gradient Layer 2 - Radial Depth */}
                <div className="absolute inset-0 opacity-70">
                  <div className="absolute top-0 left-0 w-full h-full" style={{background: 'radial-gradient(circle at 25% 25%, rgba(0, 128, 76, 0.4) 0%, transparent 55%)'}}></div>
                  <div className="absolute inset-0 w-full h-full" style={{background:'radial-gradient(circle at 50% 50%, rgba(219,230,76,0.22) 0%, transparent 65%)'}}></div>
                </div>
                
                {/* Content Container with Enhanced Styling */}
                <div className="relative z-10 p-6 border border-brand-400/30 rounded-xl backdrop-blur-md bg-gradient-to-br from-white/5 via-white/2 to-transparent">
                  <div className="flex items-center justify-between mb-4">
                    <motion.div 
                      className="p-3 bg-gradient-to-br from-white/20 via-white/15 to-white/10 backdrop-blur-sm rounded-xl shadow-lg border border-white/20"
                      whileHover={{ scale: 1.1, rotate: -3 }}
                      transition={{ duration: 0.3 }}
                    >
                      <svg className="h-6 w-6 text-spring-400 drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </motion.div>
                    <motion.div 
                      className="opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center space-x-1 text-xs text-spring-300 bg-white/15 backdrop-blur-sm px-2 py-1 rounded-full border border-white/20"
                      initial={{ x: 10 }}
                      whileHover={{ x: 0 }}
                    >
                      <span className="font-medium">View</span>
                      <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </motion.div>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2 drop-shadow-lg">Ledger & History</h3>
                  <p className="text-praxeti-300 text-sm leading-relaxed">Earnings tracking & reports</p>
                </div>
                
                {/* Enhanced Shadow and Border */}
                <div className="absolute inset-0 rounded-xl shadow-lg group-hover:shadow-xl transition-shadow duration-300"></div>
                <div className="absolute inset-0 rounded-xl ring-1 ring-white/10 group-hover:ring-white/20 transition-all duration-300"></div>
              </motion.div>
            </Link>
          </div>
        </motion.div>

        {/* Priority Jobs - Corporate Style */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-midnight-900">Priority Jobs</h2>
              <p className="text-sm text-midnight-600">High-priority requests requiring immediate attention</p>
            </div>
            <Link href="/notary/review">
              <button className="btn btn-primary btn-sm">
                View All Jobs
              </button>
            </Link>
          </div>

          {/* Jobs Table - Corporate Style */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <div className="space-y-0">
              <AnimatePresence>
                {pendingJobs.slice(0, 3).map((job, index) => (
                  <motion.div
                    key={job.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    className="flex items-center justify-between p-4 hover:bg-praxeti-100 transition-colors duration-150 cursor-pointer border-b border-gray-100 last:border-b-0"
                  >
                    {/* Job Info */}
                    <div className="flex items-center space-x-4 flex-1 min-w-0">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 bg-brand-100 rounded-lg flex items-center justify-center">
                          <svg className="h-5 w-5 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3">
                          <div className="truncate">
                            <div className="text-sm font-medium text-midnight-900 truncate">{job.client}</div>
                            <div className="text-xs text-midnight-600">{job.count} {job.type} • {job.id}</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Priority Badge & Due Date */}
                    <div className="flex items-center space-x-4 flex-shrink-0">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        job.priority === 'high' 
                          ? 'bg-red-100 text-red-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {job.priority === 'high' ? 'URGENT' : 'PRIORITY'}
                      </span>
                      <div className="text-right min-w-[4rem]">
                        <div className="text-xs text-midnight-600">Due in</div>
                        <div className="text-sm font-medium text-midnight-900">
                          {Math.ceil((new Date(job.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days
                        </div>
                      </div>
                      <Link href={`/notary/review`}>
                        <button className="btn btn-primary btn-sm">
                          Review
                        </button>
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}