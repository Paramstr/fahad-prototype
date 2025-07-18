'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

export default function NotaryLedger() {
  const [activeTab, setActiveTab] = useState<'transactions' | 'summary' | 'reports'>('transactions');
  const [selectedPeriod, setSelectedPeriod] = useState('this-month');

  const transactions = [
    {
      id: 'TXN-2024-015',
      jobId: 'NJ-2024-001',
      client: 'Al Madar Property Management',
      type: 'Legal Notices',
      documentCount: 350,
      fee: 2100,
      platformFee: 315,
      netEarnings: 1785,
      status: 'completed',
      completedAt: '2024-01-16T14:30:00',
      paidAt: '2024-01-16T14:35:00'
    },
    {
      id: 'TXN-2024-014',
      jobId: 'NJ-2024-002',
      client: 'Emirates Real Estate LLC',
      type: 'Tenancy Agreements',
      documentCount: 125,
      fee: 750,
      platformFee: 112.5,
      netEarnings: 637.5,
      status: 'completed',
      completedAt: '2024-01-15T16:45:00',
      paidAt: '2024-01-15T16:50:00'
    },
    {
      id: 'TXN-2024-013',
      jobId: 'NJ-2024-003',
      client: 'Dubai Properties REIT',
      type: 'Property Transfers',
      documentCount: 75,
      fee: 1125,
      platformFee: 168.75,
      netEarnings: 956.25,
      status: 'pending',
      completedAt: '2024-01-14T11:20:00',
      paidAt: null
    }
  ];

  const monthlyStats = {
    totalEarnings: 3378.75,
    platformFees: 596.25,
    netEarnings: 2782.50,
    totalJobs: 12,
    totalDocuments: 1247,
    averageJobValue: 281.56,
    completionRate: 98.5
  };

  const yearlyStats = {
    totalEarnings: 45250,
    platformFees: 6787.5,
    netEarnings: 38462.50,
    totalJobs: 156,
    totalDocuments: 14563,
    averageJobValue: 290.06,
    completionRate: 97.8
  };

  const currentStats = selectedPeriod === 'this-year' ? yearlyStats : monthlyStats;

  const formatCurrency = (amount: number) => {
    return `AED ${amount.toLocaleString('en-AE', { minimumFractionDigits: 2 })}`;
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Pending';
    return new Date(dateString).toLocaleDateString('en-AE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
              <h1 className="text-3xl font-bold text-midnight-900">Notary Ledger</h1>
            </div>
            <p className="text-midnight-600">Track your earnings, completed jobs, and payment history</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="form-input w-auto"
            >
              <option value="this-month">This Month</option>
              <option value="last-month">Last Month</option>
              <option value="this-year">This Year</option>
              <option value="last-year">Last Year</option>
            </select>
            <button className="btn btn-secondary">
              <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export Report
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            whileHover={{ y: -2 }}
            className="card card-padded bg-gradient-to-br from-mantis-50 to-mantis-100 border-l-4 border-l-mantis-500"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-mantis-700">Net Earnings</p>
                <p className="text-2xl font-bold text-mantis-800">{formatCurrency(currentStats.netEarnings)}</p>
                <p className="text-xs text-mantis-600 mt-1">
                  {selectedPeriod === 'this-year' ? '12 months' : '30 days'}
                </p>
              </div>
              <div className="p-3 bg-mantis-200 rounded-lg">
                <svg className="h-6 w-6 text-mantis-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -2 }}
            className="card card-padded bg-gradient-to-br from-nuit-50 to-nuit-100 border-l-4 border-l-nuit-600"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-nuit-700">Total Jobs</p>
                <p className="text-2xl font-bold text-nuit-800">{currentStats.totalJobs}</p>
                <p className="text-xs text-nuit-600 mt-1">
                  Avg: {formatCurrency(currentStats.averageJobValue)} per job
                </p>
              </div>
              <div className="p-3 bg-nuit-200 rounded-lg">
                <svg className="h-6 w-6 text-nuit-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -2 }}
            className="card card-padded bg-gradient-to-br from-spring-50 to-spring-100 border-l-4 border-l-spring-500"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-spring-700">Documents Notarized</p>
                <p className="text-2xl font-bold text-spring-800">{currentStats.totalDocuments.toLocaleString()}</p>
                <p className="text-xs text-spring-600 mt-1">
                  {Math.round(currentStats.totalDocuments / currentStats.totalJobs)} docs per job
                </p>
              </div>
              <div className="p-3 bg-spring-200 rounded-lg">
                <svg className="h-6 w-6 text-spring-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -2 }}
            className="card card-padded bg-gradient-to-br from-gray-50 to-gray-100 border-l-4 border-l-gray-400"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">Completion Rate</p>
                <p className="text-2xl font-bold text-gray-800">{currentStats.completionRate}%</p>
                <p className="text-xs text-gray-600 mt-1">
                  Platform fees: {formatCurrency(currentStats.platformFees)}
                </p>
              </div>
              <div className="p-3 bg-gray-200 rounded-lg">
                <svg className="h-6 w-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H9a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Tab Navigation */}
        <div className="card card-padded bg-white">
          <div className="flex border-b border-gray-200 mb-6">
            {[
              { id: 'transactions', label: 'Transaction History', icon: '💰' },
              { id: 'summary', label: 'Earnings Summary', icon: '📊' },
              { id: 'reports', label: 'Tax Reports', icon: '📋' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'transactions' | 'summary' | 'reports')}
                className={`flex items-center space-x-2 px-6 py-3 font-medium text-sm transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'text-nuit-700 border-b-2 border-nuit-600'
                    : 'text-midnight-600 hover:text-midnight-900'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'transactions' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-semibold text-midnight-900">Job Details</th>
                        <th className="text-left py-3 px-4 font-semibold text-midnight-900">Client</th>
                        <th className="text-left py-3 px-4 font-semibold text-midnight-900">Documents</th>
                        <th className="text-left py-3 px-4 font-semibold text-midnight-900">Fee Breakdown</th>
                        <th className="text-left py-3 px-4 font-semibold text-midnight-900">Status</th>
                        <th className="text-left py-3 px-4 font-semibold text-midnight-900">Completed</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map((transaction, index) => (
                        <motion.tr
                          key={transaction.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                        >
                          <td className="py-4 px-4">
                            <div>
                              <div className="font-medium text-midnight-900">{transaction.jobId}</div>
                              <div className="text-sm text-midnight-600">{transaction.type}</div>
                              <div className="text-xs text-midnight-500">{transaction.id}</div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="font-medium text-midnight-900">{transaction.client}</div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="font-medium text-midnight-900">{transaction.documentCount}</div>
                            <div className="text-sm text-midnight-600">documents</div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="space-y-1">
                              <div className="text-sm">
                                <span className="text-midnight-600">Gross: </span>
                                <span className="font-medium text-midnight-900">{formatCurrency(transaction.fee)}</span>
                              </div>
                              <div className="text-sm">
                                <span className="text-midnight-600">Platform: </span>
                                <span className="text-red-600">-{formatCurrency(transaction.platformFee)}</span>
                              </div>
                              <div className="text-sm font-medium">
                                <span className="text-midnight-600">Net: </span>
                                <span className="text-mantis-700">{formatCurrency(transaction.netEarnings)}</span>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                              transaction.status === 'completed'
                                ? 'bg-mantis-100 text-mantis-700'
                                : 'bg-orange-100 text-orange-700'
                            }`}>
                              {transaction.status.toUpperCase()}
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="text-sm text-midnight-600">
                              {formatDate(transaction.completedAt)}
                            </div>
                            {transaction.paidAt && (
                              <div className="text-xs text-mantis-600">
                                Paid: {formatDate(transaction.paidAt)}
                              </div>
                            )}
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {activeTab === 'summary' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-8"
              >
                <div>
                  <h3 className="text-lg font-semibold text-midnight-900 mb-4">Earnings Breakdown</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-mantis-50 rounded-lg">
                      <span className="text-mantis-700 font-medium">Gross Earnings</span>
                      <span className="text-mantis-800 font-bold">{formatCurrency(currentStats.totalEarnings)}</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                      <span className="text-red-700 font-medium">Platform Fees (15%)</span>
                      <span className="text-red-800 font-bold">-{formatCurrency(currentStats.platformFees)}</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-nuit-50 rounded-lg border-2 border-nuit-200">
                      <span className="text-nuit-700 font-medium">Net Earnings</span>
                      <span className="text-nuit-800 font-bold text-xl">{formatCurrency(currentStats.netEarnings)}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-midnight-900 mb-4">Performance Metrics</h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-midnight-700">Jobs Completed</span>
                        <span className="font-bold text-midnight-900">{currentStats.totalJobs}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-nuit-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-midnight-700">Completion Rate</span>
                        <span className="font-bold text-midnight-900">{currentStats.completionRate}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-mantis-600 h-2 rounded-full" style={{ width: `${currentStats.completionRate}%` }}></div>
                      </div>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-midnight-700">Average Job Value</span>
                        <span className="font-bold text-midnight-900">{formatCurrency(currentStats.averageJobValue)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'reports' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center py-16"
              >
                <div className="w-16 h-16 bg-spring-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="h-8 w-8 text-spring-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-midnight-900 mb-2">Tax Reports Coming Soon</h3>
                <p className="text-midnight-600 max-w-md mx-auto mb-6">
                  We&apos;re preparing comprehensive tax reports for your notary earnings. This feature will be available soon.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center justify-center space-x-2 text-sm text-midnight-600">
                    <svg className="h-4 w-4 text-mantis-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Annual income statements</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2 text-sm text-midnight-600">
                    <svg className="h-4 w-4 text-mantis-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Quarterly tax summaries</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2 text-sm text-midnight-600">
                    <svg className="h-4 w-4 text-mantis-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Expense tracking</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}