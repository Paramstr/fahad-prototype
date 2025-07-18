'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

export default function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [selectedMode, setSelectedMode] = useState('Individual');
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const pathname = usePathname();

  // Update selected mode based on current route
  useEffect(() => {
    if (pathname?.startsWith('/corporate')) {
      setSelectedMode('Corporate');
    } else if (pathname?.startsWith('/notary')) {
      setSelectedMode('Notary');
    } else {
      setSelectedMode('Individual');
    }
  }, [pathname]);

  const handleModeChange = (mode: string) => {
    setSelectedMode(mode);
    setIsDropdownOpen(false);
    
    // Navigate to appropriate homepage based on mode
    if (mode === 'Corporate') {
      router.push('/corporate');
    } else if (mode === 'Notary') {
      router.push('/notary');
    } else {
      router.push('/');
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/speak-to-notary?query=${encodeURIComponent(searchQuery)}`);
    } else {
      router.push('/speak-to-notary');
    }
  };

  return (
    <nav className={`${selectedMode === 'Corporate' ? 'gradient-brand-corporate' : selectedMode === 'Notary' ? 'gradient-notary' : 'gradient-brand'} border-b border-brand-200 sticky top-0 z-50 shadow-lg`}
    >
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-12">
        {/* Desktop Layout - grid cols 3 */}
        <div className="hidden md:grid grid-cols-3 items-center h-16">
          
          {/* Left Section: Logo, Name, and Mode Dropdown */}
          <div className="flex items-center space-x-6">
            {/* Logo and Company Name */}
            <Link href={selectedMode === 'Corporate' ? '/corporate' : selectedMode === 'Notary' ? '/notary' : '/'} className="flex items-center space-x-4">
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

            {/* Mode Dropdown */}
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
                    <button
                      onClick={() => handleModeChange('Notary')}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-praxeti-100 transition-colors duration-150 ${
                        selectedMode === 'Notary' 
                          ? 'text-brand-600 bg-brand-50 font-medium' 
                          : 'text-midnight-900'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        <span>Notary</span>
                      </div>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Center Section: AI Search Bar */}
          <div className="flex justify-center">
            <div className="w-full max-w-md">
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Ask our AI about legal documents..."
                  className="w-full pl-12 pr-16 py-2 border border-white/30 rounded-full focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 bg-white/20 backdrop-blur-sm transition-all duration-300 text-white placeholder-white/70"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <div className="flex items-center space-x-1">
                    <svg className="h-4 w-4 text-spring-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    <span className="text-xs text-spring-400 font-medium">AI</span>
                  </div>
                </div>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    type="submit"
                    className="p-1 rounded-full bg-white/20 hover:bg-white/30 transition-colors duration-200"
                  >
                    <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Right Section: Navigation Links and User Profile */}
          <div className="flex items-center justify-end space-x-6">
            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-6">
              <Link href="/pricing" className="text-white/80 hover:text-white transition-colors duration-200 text-sm font-medium">
                Pricing
              </Link>
              <Link href="/about" className="text-white/80 hover:text-white transition-colors duration-200 text-sm font-medium">
                About
              </Link>
            </div>

            {/* Notification Button */}
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
            
            {/* User Profile */}
            <div className="flex items-center space-x-3">
              <motion.div 
                className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <span className="text-white text-sm font-medium">F</span>
              </motion.div>
              <div className="text-sm">
                <div className="font-medium text-white">Fahad</div>
                <div className="text-white/80">Law Firm</div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Layout - always visible on mobile */}
        <div className="md:hidden flex items-center justify-between h-16">
          {/* Left: Logo and Title */}
          <div className="flex items-center space-x-3">
            <Link href={selectedMode === 'Corporate' ? '/corporate' : selectedMode === 'Notary' ? '/notary' : '/'} className="flex items-center space-x-3">
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="32" height="32" rx="6" fill="#F6F7ED"/>
                  <circle cx="16" cy="16" r="10" fill="#00804C"/>
                  <circle cx="16" cy="16" r="6" fill="#F6F7ED"/>
                  <circle cx="16" cy="16" r="2" fill="#00804C"/>
                </svg>
              </motion.div>
              <h1 className="text-lg font-semibold text-white">Notary AI</h1>
            </Link>
          </div>

          {/* Center: Mode Dropdown */}
          <div className="flex items-center space-x-3">
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
                    className="absolute top-full right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20"
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
                    <button
                      onClick={() => handleModeChange('Notary')}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-praxeti-100 transition-colors duration-150 ${
                        selectedMode === 'Notary' 
                          ? 'text-brand-600 bg-brand-50 font-medium' 
                          : 'text-midnight-900'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        <span>Notary</span>
                      </div>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Right: Search Icon and Hamburger Menu */}
          <div className="flex items-center space-x-2">
            {/* Search Icon */}
            <motion.button
              onClick={() => setIsSearchExpanded(!isSearchExpanded)}
              className="p-2 text-white/80 hover:text-white transition-colors duration-200 rounded-lg hover:bg-white/20"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </motion.button>

            {/* Hamburger Menu Button */}
            <motion.button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-white/80 hover:text-white transition-colors duration-200 rounded-lg hover:bg-white/20"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <AnimatePresence mode="wait">
                {isMobileMenuOpen ? (
                  <motion.svg
                    key="close"
                    initial={{ opacity: 0, rotate: -90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: 90 }}
                    transition={{ duration: 0.2 }}
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </motion.svg>
                ) : (
                  <motion.svg
                    key="menu"
                    initial={{ opacity: 0, rotate: 90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: -90 }}
                    transition={{ duration: 0.2 }}
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </motion.svg>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>

        {/* Mobile Search Bar - Expandable */}
        <AnimatePresence>
          {isSearchExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden border-t border-white/20 pt-4 pb-4"
            >
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Ask our AI about legal documents..."
                  className="w-full pl-12 pr-12 py-3 border border-white/30 rounded-full focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 bg-white/20 backdrop-blur-sm transition-all duration-300 text-white placeholder-white/70"
                  autoFocus
                />
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <div className="flex items-center space-x-1">
                    <svg className="h-4 w-4 text-spring-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    <span className="text-xs text-spring-400 font-medium">AI</span>
                  </div>
                </div>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    type="submit"
                    className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors duration-200"
                  >
                    <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Menu Drawer */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden border-t border-white/20 pt-4 pb-4 space-y-4"
            >
              {/* Navigation Links */}
              <div className="space-y-2">
                <Link 
                  href="/pricing" 
                  className="block px-4 py-2 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition-colors duration-200 text-sm font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Pricing
                </Link>
                <Link 
                  href="/about" 
                  className="block px-4 py-2 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition-colors duration-200 text-sm font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  About
                </Link>
              </div>

              {/* User Profile Section */}
              <div className="border-t border-white/20 pt-4">
                <div className="flex items-center space-x-3 px-4 py-2">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <span className="text-white text-sm font-medium">F</span>
                  </div>
                  <div className="text-sm">
                    <div className="font-medium text-white">Fahad</div>
                    <div className="text-white/80">Law Firm</div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
} 