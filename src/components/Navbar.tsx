'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export default function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedMode, setSelectedMode] = useState('Individual');

  const handleModeChange = (mode: string) => {
    setSelectedMode(mode);
    setIsDropdownOpen(false);
  };

  return (
    <nav className="gradient-brand border-b border-brand-200 sticky top-0 z-50 shadow-lg"
    >
      <div className="max-w-full mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-16">
          
          {/* Left Section: Logo, Name, and Mode Selector */}
          <div className="flex items-center space-x-12">
            {/* Logo and Company Name (grouped together) */}
            <Link href="/" className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="32" height="32" rx="6" fill="#F6F7ED"/>
                    <circle cx="16" cy="16" r="10" fill="#00804C"/>
                    <circle cx="16" cy="16" r="6" fill="#F6F7ED"/>
                    <circle cx="16" cy="16" r="2" fill="#00804C"/>
                  </svg>
                </motion.div>
              </div>
              <h1 className="text-xl font-semibold text-white">Notary AI</h1>
            </Link>
            
            {/* Mode Dropdown (separated with more space) */}
            <div className="relative">
              <motion.button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-2 px-3 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors duration-200 text-sm font-medium text-white backdrop-blur-sm"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span>{selectedMode}</span>
                <motion.svg 
                  className="h-4 w-4"
                  animate={{ rotate: isDropdownOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </motion.svg>
              </motion.button>

              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10"
                  >
                    <button
                      onClick={() => handleModeChange('Individual')}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-praxeti-100 transition-colors duration-150 ${
                        selectedMode === 'Individual' 
                          ? 'text-brand-600 bg-brand-50 font-medium' 
                          : 'text-midnight-900'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span>Individual</span>
                      </div>
                    </button>
                    <button
                      onClick={() => handleModeChange('Corporate')}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-praxeti-100 transition-colors duration-150 ${
                        selectedMode === 'Corporate' 
                          ? 'text-brand-600 bg-brand-50 font-medium' 
                          : 'text-midnight-900'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        <span>Corporate</span>
                      </div>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Center Section: Search Bar */}
          <div className="flex-1 max-w-md mx-16">
            <div className="relative">
              <input
                type="text"
                placeholder="Ask anything..."
                className="w-full pl-10 pr-4 py-2 border border-white/30 rounded-full focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 bg-white/20 backdrop-blur-sm transition-all duration-300 text-white placeholder-white/70"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Right Section: User Profile */}
          <div className="flex items-center space-x-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative p-2 text-white/80 hover:text-white transition-colors duration-200"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zm-1.5-8.5A7.5 7.5 0 0 0 6 2.5a7.5 7.5 0 0 0 7.5 7.5 7.5 7.5 0 0 0 7.5-7.5 7.5 7.5 0 0 0-7.5 7.5z" />
              </svg>
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-mantis-600 rounded-full"></span>
            </motion.button>
            
            <div className="flex items-center space-x-3">
              <motion.div 
                className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <span className="text-white text-sm font-medium">F</span>
              </motion.div>
              <div className="text-sm">
                <div className="font-medium text-white">Farhad</div>
                <div className="text-white/80">Law Firm</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
} 