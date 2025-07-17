'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Navbar from '../components/Navbar';

interface ActivityService {
  name: string;
  cost: number;
  duration: string;
  status: 'Pending' | 'In Progress' | 'Completed';
}

interface Activity {
  id: number;
  filename: string;
  type: string;
  status: string;
  progress: number;
  eta: string;
  dateCreated: string;
  services: ActivityService[];
  totalCost: number;
  userRequest: string;
}

export default function NotaryAIHome() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);

  // Load activities from localStorage on component mount
  useEffect(() => {
    const savedActivities = localStorage.getItem('notaryActivities');
    if (savedActivities) {
      setActivities(JSON.parse(savedActivities));
    } else {
      // Default sample activities if none exist
      const defaultActivities = [
        {
          id: 1,
          filename: 'document.pdf',
          type: 'Birth Certificate',
          status: 'MoFA step',
          progress: 75,
          eta: 'ETA 24 hr',
          dateCreated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          services: [
            { name: 'Translation', cost: 40, duration: '2-3 days', status: 'Completed' as const },
            { name: 'Ministry of Justice Notarization', cost: 25, duration: '1 day', status: 'Completed' as const },
            { name: 'Ministry of Foreign Affairs', cost: 35, duration: '2 days', status: 'In Progress' as const },
            { name: 'Embassy Legalization', cost: 60, duration: '3-5 days', status: 'Pending' as const }
          ],
          totalCost: 160,
          userRequest: 'Translate birth certificate and get it notarized for use in Canada'
        },
        {
          id: 2,
          filename: 'poa.docx',
          type: 'Power of Attorney',
          status: 'Translation',
          progress: 35,
          eta: 'ETA 3 days',
          dateCreated: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          services: [
            { name: 'Translation', cost: 40, duration: '2-3 days', status: 'In Progress' as const },
            { name: 'Ministry of Justice Notarization', cost: 25, duration: '1 day', status: 'Pending' as const }
          ],
          totalCost: 65,
          userRequest: 'Translate power of attorney document to English'
        },
        {
          id: 3,
          filename: 'contract.pdf',
          type: 'Contract',
          status: 'Uploading',
          progress: 15,
          eta: 'Processing',
          dateCreated: new Date().toISOString(),
          services: [
            { name: 'Document verification', cost: 30, duration: '1 day', status: 'In Progress' as const }
          ],
          totalCost: 30,
          userRequest: 'Verify contract authenticity'
        }
      ];
      setActivities(defaultActivities);
      localStorage.setItem('notaryActivities', JSON.stringify(defaultActivities));
    }
  }, []);

  const filteredActivities = activities.filter(activity => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'In Progress') return activity.progress < 100;
    if (activeFilter === 'Completed') return activity.progress === 100;
    return true;
  });

  return (
    <div className="min-h-screen bg-praxeti-100">
      {/* Background SVG Patterns - Legal-themed subtle textures */}
      <svg className="absolute inset-0 w-full h-full opacity-3 pointer-events-none" style={{zIndex: 1}}>
        <defs>
          <pattern id="legal-grid" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#00804C" strokeWidth="1"/>
            <path d="M 15 0 L 15 60 M 30 0 L 30 60 M 45 0 L 45 60" fill="none" stroke="#00804C" strokeWidth="0.5" opacity="0.3"/>
          </pattern>
          
          <pattern id="document-lines" x="0" y="0" width="100" height="20" patternUnits="userSpaceOnUse">
            <line x1="0" y1="10" x2="100" y2="10" stroke="#1E488F" strokeWidth="0.5" opacity="0.4"/>
            <line x1="0" y1="15" x2="80" y2="15" stroke="#1E488F" strokeWidth="0.3" opacity="0.3"/>
          </pattern>
          
          <pattern id="seal-pattern" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
            <circle cx="40" cy="40" r="15" fill="none" stroke="#00804C" strokeWidth="1" opacity="0.2"/>
            <circle cx="40" cy="40" r="8" fill="none" stroke="#00804C" strokeWidth="0.5" opacity="0.15"/>
          </pattern>
          
          <pattern id="document-texture" x="0" y="0" width="120" height="80" patternUnits="userSpaceOnUse">
            <rect width="120" height="80" fill="none"/>
            <line x1="10" y1="20" x2="110" y2="20" stroke="#001F3F" strokeWidth="0.3" opacity="0.3"/>
            <line x1="10" y1="30" x2="95" y2="30" stroke="#001F3F" strokeWidth="0.2" opacity="0.2"/>
            <line x1="10" y1="40" x2="105" y2="40" stroke="#001F3F" strokeWidth="0.3" opacity="0.3"/>
            <line x1="10" y1="50" x2="90" y2="50" stroke="#001F3F" strokeWidth="0.2" opacity="0.2"/>
            <line x1="10" y1="60" x2="100" y2="60" stroke="#001F3F" strokeWidth="0.3" opacity="0.3"/>
            <circle cx="25" cy="25" r="2" fill="#001F3F" opacity="0.1"/>
            <circle cx="95" cy="45" r="1.5" fill="#001F3F" opacity="0.08"/>
          </pattern>
          
          <pattern id="legal-watermark" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse">
            <rect width="200" height="200" fill="none"/>
            <g transform="translate(100,100) rotate(45)" opacity="0.05">
              <rect x="-40" y="-10" width="80" height="20" fill="none" stroke="#00804C" strokeWidth="1"/>
              <text x="0" y="5" textAnchor="middle" fontSize="12" fill="#00804C" fontFamily="serif">NOTARY</text>
            </g>
            <circle cx="50" cy="50" r="30" fill="none" stroke="#00804C" strokeWidth="0.5" opacity="0.08"/>
            <circle cx="150" cy="150" r="25" fill="none" stroke="#00804C" strokeWidth="0.3" opacity="0.05"/>
          </pattern>
          
          <pattern id="geometric-overlay" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <rect width="40" height="40" fill="none"/>
            <path d="M 0 20 L 20 0 L 40 20 L 20 40 Z" fill="none" stroke="#001F3F" strokeWidth="0.2" opacity="0.1"/>
            <circle cx="20" cy="20" r="8" fill="none" stroke="#1E488F" strokeWidth="0.1" opacity="0.08"/>
          </pattern>
          
          <pattern id="communication-pattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
            <rect width="60" height="60" fill="none"/>
            <circle cx="30" cy="30" r="20" fill="none" stroke="#00804C" strokeWidth="0.5" opacity="0.15"/>
            <circle cx="30" cy="30" r="12" fill="none" stroke="#00804C" strokeWidth="0.3" opacity="0.1"/>
            <circle cx="30" cy="30" r="6" fill="none" stroke="#00804C" strokeWidth="0.2" opacity="0.08"/>
            <path d="M 15 30 L 25 25 L 25 35 Z" fill="#00804C" opacity="0.08"/>
            <path d="M 45 30 L 35 25 L 35 35 Z" fill="#00804C" opacity="0.08"/>
          </pattern>
          
          <pattern id="video-mesh" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
            <rect width="30" height="30" fill="none"/>
            <rect x="5" y="5" width="20" height="20" fill="none" stroke="#1E488F" strokeWidth="0.3" opacity="0.1"/>
            <rect x="8" y="8" width="14" height="14" fill="none" stroke="#1E488F" strokeWidth="0.2" opacity="0.08"/>
            <circle cx="15" cy="15" r="3" fill="#1E488F" opacity="0.05"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#legal-grid)"/>
      </svg>

      {/* Navigation Header */}
      <Navbar/>

      {/* Main Content Container */}
      <main className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-8 relative z-10">
        {/* Welcome Section - Personalized greeting */}
        <motion.div 
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <h1 className="text-4xl font-medium text-midnight-900 mb-2">Welcome, Farhad.</h1>
          <p className="text-lg text-midnight-600">How can we help today?</p>
        </motion.div>

        {/* Primary Action Cards - Main CTA buttons */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          {/* Notarize Document Card - Enhanced Mesh Gradient Design */}
          <Link href="/notarize">
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
                <div className="absolute inset-0 bg-gradient-to-br from-brand-800 via-midnight-800 to-brand-900"></div>
                <div className="absolute inset-0 bg-gradient-to-tr from-brand-600/60 via-transparent to-mantis-600/40"></div>
              </div>
              
              {/* Mesh-like Gradient Layer 2 - Radial Depth */}
              <div className="absolute inset-0 opacity-70">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-radial from-brand-500/40 via-transparent to-transparent" style={{background: 'radial-gradient(circle at 30% 20%, rgba(0, 128, 76, 0.4) 0%, transparent 50%)'}}></div>
                <div className="absolute top-0 right-0 w-full h-full bg-gradient-radial from-mantis-500/30 via-transparent to-transparent" style={{background: 'radial-gradient(circle at 70% 30%, rgba(116, 195, 101, 0.3) 0%, transparent 60%)'}}></div>
                <div className="absolute bottom-0 left-0 w-full h-full bg-gradient-radial from-brand-700/35 via-transparent to-transparent" style={{background: 'radial-gradient(circle at 20% 80%, rgba(0, 107, 63, 0.35) 0%, transparent 45%)'}}></div>
                {/* Subtle accent highlight (spring) */}
                <div className="absolute inset-0 w-full h-full" style={{background:'radial-gradient(circle at 50% 50%, rgba(219,230,76,0.22) 0%, transparent 65%)'}}></div>
              </div>
              
              {/* Mesh-like Gradient Layer 3 - Organic Flow */}
              <div className="absolute inset-0 opacity-60">
                <div className="absolute inset-0 bg-gradient-conic from-brand-600/30 via-midnight-700/20 to-brand-800/40" style={{background: 'conic-gradient(from 45deg at 60% 40%, rgba(0, 128, 76, 0.3) 0deg, rgba(0, 31, 63, 0.2) 120deg, rgba(0, 90, 53, 0.4) 240deg, rgba(0, 128, 76, 0.3) 360deg)'}}></div>
              </div>
              
              {/* Mesh-like Gradient Layer 4 - Subtle Variations */}
              <div className="absolute inset-0 opacity-50">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-brand-500/20 to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-midnight-900/60 via-transparent to-brand-600/20"></div>
                <div className="absolute inset-0 bg-gradient-to-bl from-transparent via-mantis-500/15 to-midnight-900/30"></div>
              </div>
              
              {/* Enhanced Pattern Overlays */}
              <div className="absolute inset-0 opacity-12">
                <svg className="w-full h-full">
                  <rect width="100%" height="100%" fill="url(#document-texture)"/>
                </svg>
              </div>
              <div className="absolute inset-0 opacity-6">
                <svg className="w-full h-full">
                  <rect width="100%" height="100%" fill="url(#legal-watermark)"/>
                </svg>
              </div>
              
              {/* Advanced Hover Effects - Mesh Enhancement */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-40 transition-opacity duration-700">
                <div className="absolute inset-0 bg-gradient-radial from-mantis-400/25 via-transparent to-transparent" style={{background: 'radial-gradient(circle at 50% 50%, rgba(116, 195, 101, 0.25) 0%, transparent 70%)'}}></div>
                <div className="absolute inset-0 bg-gradient-to-br from-spring-400/15 via-transparent to-brand-500/20"></div>
              </div>
              
              {/* Sophisticated Glow Effects */}
              <div className="absolute inset-0 bg-gradient-to-r from-brand-400/0 via-mantis-400/20 to-brand-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-600"></div>
              
              {/* Inner Shadow for Depth */}
              <div className="absolute inset-0 shadow-inner"></div>
              
              {/* Content Container with Enhanced Styling */}
              <div className="relative z-10 p-10 border border-brand-400/30 rounded-2xl backdrop-blur-md bg-gradient-to-br from-white/5 via-white/2 to-transparent">
                <div className="flex items-start justify-between mb-8">
                  <motion.div 
                    className="p-4 bg-gradient-to-br from-white/20 via-white/15 to-white/10 backdrop-blur-sm rounded-xl shadow-lg border border-white/20"
                    whileHover={{ scale: 1.1, rotate: -3 }}
                    transition={{ duration: 0.3 }}
                  >
                    <svg className="h-10 w-10 text-spring-400 drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </motion.div>
                  <motion.div 
                    className="opacity-0 group-hover:opacity-100 transition-all duration-400 flex items-center space-x-3 text-sm text-spring-300 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20"
                    initial={{ x: 20 }}
                    whileHover={{ x: 0 }}
                  >
                    <span className="font-medium">Start now</span>
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </motion.div>
                </div>
                
                <h3 className="text-3xl font-bold text-white mb-6 leading-tight drop-shadow-lg">
                  Notarize a Document
                </h3>
                <p className="text-praxeti-300 text-xl mb-6 leading-relaxed">
                  Upload any file, we build the path
                </p>
                
                <motion.div 
                  className="flex items-center space-x-2 text-sm text-spring-300/80 group-hover:text-spring-200 transition-colors duration-400"
                  initial={{ opacity: 0, y: 10 }}
                  whileHover={{ opacity: 1, y: 0 }}
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span className="font-medium">Get started with document notarization</span>
                </motion.div>
              </div>
              
              {/* Enhanced Shadow and Border */}
              <div className="absolute inset-0 rounded-2xl shadow-xl group-hover:shadow-2xl transition-shadow duration-500"></div>
              <div className="absolute inset-0 rounded-2xl ring-1 ring-white/10 group-hover:ring-white/20 transition-all duration-500"></div>
            </motion.div>
          </Link>

          {/* Speak to Notary Card - Enhanced Mesh Gradient Design */}
          <Link href="/speak-to-notary">
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
            
            {/* Enhanced Pattern Overlays */}
            <div className="absolute inset-0 opacity-15">
              <svg className="w-full h-full">
                <rect width="100%" height="100%" fill="url(#communication-pattern)"/>
              </svg>
            </div>
            <div className="absolute inset-0 opacity-8">
              <svg className="w-full h-full">
                <rect width="100%" height="100%" fill="url(#video-mesh)"/>
              </svg>
            </div>
            
            {/* Advanced Hover Effects - Mesh Enhancement */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
              <div className="absolute inset-0 bg-gradient-radial from-spring-400/20 via-transparent to-transparent" style={{background: 'radial-gradient(circle at 50% 50%, rgba(219, 230, 76, 0.2) 0%, transparent 70%)'}}></div>
              <div className="absolute inset-0 bg-gradient-to-bl from-nuit-400/20 via-transparent to-spring-400/10"></div>
            </div>
            
            {/* Sophisticated Glow Effects */}
            <div className="absolute inset-0 bg-gradient-to-r from-nuit-400/0 via-spring-400/20 to-nuit-400/0 opacity-0 group-hover:opacity-10 transition-opacity duration-600"></div>
            
            {/* Inner Shadow for Depth */}
            <div className="absolute inset-0 shadow-inner"></div>
            
            {/* Content Container with Enhanced Styling */}
            <div className="relative z-10 p-10 border border-nuit-400/30 rounded-2xl backdrop-blur-md bg-gradient-to-br from-white/5 via-white/2 to-transparent">
              <div className="flex items-start justify-between mb-8">
                <motion.div 
                  className="p-4 bg-gradient-to-br from-white/20 via-white/15 to-white/10 backdrop-blur-sm rounded-xl shadow-lg border border-white/20"
                  whileHover={{ scale: 1.1, rotate: -3 }}
                  transition={{ duration: 0.3 }}
                >
                  <svg className="h-10 w-10 text-spring-400 drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </motion.div>
                <motion.div 
                  className="opacity-0 group-hover:opacity-100 transition-all duration-400 flex items-center space-x-3 text-sm text-spring-300 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20"
                  initial={{ x: 20 }}
                  whileHover={{ x: 0 }}
                >
                  <span className="font-medium">Connect now</span>
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </motion.div>
              </div>
              
              <h3 className="text-3xl font-bold text-white mb-6 leading-tight drop-shadow-lg">
                Speak to Notary
              </h3>
              <p className="text-praxeti-300 text-xl mb-6 leading-relaxed">
                Get instant help & guidance
              </p>
              
              <motion.div 
                className="flex items-center space-x-2 text-sm text-spring-300/80 group-hover:text-spring-200 transition-colors duration-400"
                initial={{ opacity: 0, y: 10 }}
                whileHover={{ opacity: 1, y: 0 }}
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span className="font-medium">Connect with certified notaries</span>
              </motion.div>
            </div>
            
            {/* Enhanced Shadow and Border */}
            <div className="absolute inset-0 rounded-2xl shadow-xl group-hover:shadow-2xl transition-shadow duration-500"></div>
            <div className="absolute inset-0 rounded-2xl ring-1 ring-white/10 group-hover:ring-white/20 transition-all duration-500"></div>
            </motion.div>
          </Link>
        </motion.div>

        {/* Activity Section */}
        <motion.section 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-midnight-900">Your Activity</h2>
            <div className="flex items-center space-x-2">
              <span className="px-2 py-1 bg-brand-600 text-white text-sm rounded-full">
                {activities.length}
              </span>
            </div>
          </div>

          {/* Filter buttons */}
          <div className="flex space-x-2 mb-6">
            {['All', 'In Progress', 'Completed'].map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeFilter === filter
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'bg-praxeti-300 text-midnight-900 hover:bg-praxeti-400'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Activity Rows */}
          <div className="space-y-4">
            <AnimatePresence>
              {filteredActivities.map((activity) => (
                <motion.div
                  key={activity.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="card p-6 transition-all duration-200 relative overflow-hidden cursor-pointer hover:shadow-lg"
                  onClick={() => setSelectedActivity(activity)}
                >
                  {/* Progress bar background */}
                  <div 
                    className="absolute top-0 left-0 h-1 bg-brand-600 transition-all duration-1000"
                    style={{ width: `${activity.progress}%` }}
                  />
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-brand-100 rounded-lg flex items-center justify-center">
                        <svg className="h-6 w-6 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-medium text-midnight-900 text-lg">{activity.filename}</h3>
                        <p className="text-sm text-midnight-600">{activity.type}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-6">
                      <div className="text-center">
                        <p className="text-sm font-medium text-midnight-900">{activity.status}</p>
                        <p className="text-xs text-midnight-600">{activity.eta}</p>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-brand-600 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${activity.progress}%` }}
                          />
                        </div>
                        <span className="px-3 py-1 bg-brand-100 text-brand-600 text-sm font-medium rounded-full min-w-[3rem] text-center">
                          {activity.progress}%
                        </span>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-sm font-medium text-midnight-900">€{activity.totalCost}</p>
                        <p className="text-xs text-midnight-600">{activity.services.length} services</p>
                      </div>
                      
                      <svg className="h-5 w-5 text-midnight-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.section>
      </main>

      {/* Detailed Activity Popup - Modern Floating Design */}
      <AnimatePresence>
        {selectedActivity && (
          <>
            {/* Subtle backdrop with brand colors */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-white bg-opacity-5 backdrop-blur-sm"
              onClick={() => setSelectedActivity(null)}
            />
            
            {/* Floating card with brand-aligned design */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ 
                duration: 0.3,
                type: "spring",
                stiffness: 300,
                damping: 25
              }}
              className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-2xl max-h-[80vh] overflow-hidden rounded-2xl"
              style={{
                boxShadow: '0 20px 25px -5px rgba(0, 31, 63, 0.2), 0 8px 10px -6px rgba(0, 31, 63, 0.15)'
              }}
            >
              <div className="bg-praxeti-200 rounded-2xl overflow-hidden border border-gray-200" onClick={(e) => e.stopPropagation()}>
                {/* Compact Header with Brand Colors */}
                <div className="bg-gradient-to-r from-brand-600 to-brand-700 p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                        <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold text-white">{selectedActivity.filename}</h2>
                        <p className="text-brand-100 text-sm">{selectedActivity.type}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedActivity(null)}
                      className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
                    >
                      <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  
                  {/* Compact Progress Bar */}
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-1 text-sm">
                      <span className="text-white font-medium">{selectedActivity.status}</span>
                      <span className="text-brand-100">{selectedActivity.progress}% • {selectedActivity.eta}</span>
                    </div>
                    <div className="w-full bg-white bg-opacity-20 rounded-full h-2">
                      <motion.div 
                        className="h-full bg-white rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${selectedActivity.progress}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                </div>

                {/* Condensed Content Section */}
                <div className="p-6 space-y-6 max-h-[55vh] overflow-y-auto bg-white">
                  {/* Cost Summary - Condensed */}
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="flex justify-between items-center bg-gradient-to-br from-brand-50 via-brand-100 to-mantis-50 rounded-xl p-4 border border-brand-200"
                  >
                    <div>
                      <h3 className="text-sm font-semibold text-midnight-900 uppercase tracking-wide">Total Investment</h3>
                      <p className="text-xs text-midnight-600">{selectedActivity.services.length} services included</p>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-brand-600">€{selectedActivity.totalCost}</span>
                      <p className="text-xs text-brand-700 font-medium">All fees included</p>
                    </div>
                  </motion.div>
                  {/* User Request */}
                  <div>
                    <h3 className="text-base font-semibold text-midnight-900 mb-2">Request Details</h3>
                    <div className="bg-praxeti-300 rounded-lg p-4">
                      <p className="text-midnight-900 text-sm leading-relaxed">{selectedActivity.userRequest}</p>
                    </div>
                  </div>

                  {/* Services Timeline - Enhanced Visual Design */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <h3 className="text-lg font-bold text-midnight-900 mb-5 flex items-center">
                      <svg className="h-5 w-5 mr-2 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Services Timeline
                    </h3>
                    <div className="space-y-4">
                      {selectedActivity.services.map((service, index) => (
                        <motion.div 
                          key={index} 
                          className="relative flex items-start space-x-4 group"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 + index * 0.1 }}
                        >
                          {/* Connecting Line */}
                          {index < selectedActivity.services.length - 1 && (
                            <div className="absolute left-5 top-10 w-0.5 h-16 bg-gradient-to-b from-gray-300 to-transparent"></div>
                          )}
                          
                          {/* Status Icon */}
                          <div className={`relative z-10 w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform ${
                            service.status === 'Completed' ? 'bg-gradient-to-br from-mantis-500 to-mantis-600 shadow-mantis-500/30' : 
                            service.status === 'In Progress' ? 'bg-gradient-to-br from-spring-500 to-spring-600 shadow-spring-500/30' : 
                            'bg-gradient-to-br from-gray-300 to-gray-400'
                          } shadow-lg`}>
                            {service.status === 'Completed' ? (
                              <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            ) : service.status === 'In Progress' ? (
                              <svg className="h-5 w-5 text-white animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                              </svg>
                            ) : (
                              <svg className="h-5 w-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            )}
                          </div>
                          
                          {/* Service Details Card */}
                          <div className="flex-1 bg-white rounded-2xl p-5 border border-gray-300 shadow-sm transition-shadow">
                            <div className="flex items-start justify-between mb-2">
                              <h4 className="font-semibold text-midnight-900">{service.name}</h4>
                              <span className="font-bold text-brand-600">€{service.cost}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <p className="text-sm text-midnight-600">
                                <svg className="inline h-4 w-4 mr-1 text-midnight-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                {service.duration}
                              </p>
                              <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                                service.status === 'Completed' ? 'bg-mantis-100 text-mantis-700' :
                                service.status === 'In Progress' ? 'bg-spring-100 text-spring-700' :
                                'bg-gray-100 text-gray-700'
                              }`}>
                                {service.status}
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
