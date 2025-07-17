'use client';

import { motion } from 'framer-motion';

interface Issue {
  type: 'warning' | 'error';
  text: string;
  fixLabel?: string;
  onFix?: () => void;
}

interface AiAssistantProps {
  issues: Issue[];
}

export default function AiAssistant({ issues }: AiAssistantProps) {
  return (
    <div className="w-80 bg-white rounded-xl border border-gray-200 shadow-lg sticky top-24 max-h-[calc(100vh-6rem)] overflow-y-auto">
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-brand-600 rounded-full flex items-center justify-center">
            <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-midnight-900">AI Assistant</h3>
            <p className="text-sm text-midnight-600">Document analysis results</p>
          </div>
        </div>

        <div className="space-y-4">
          {issues.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-mantis-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="h-8 w-8 text-mantis-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h4 className="text-midnight-900 font-medium mb-2">Document looks good!</h4>
              <p className="text-sm text-midnight-600">No issues detected by our AI analysis.</p>
            </div>
          ) : (
            issues.map((issue, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-lg border-l-4 ${
                  issue.type === 'error' 
                    ? 'bg-red-50 border-red-400' 
                    : 'bg-amber-50 border-amber-400'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className={`mt-0.5 ${
                    issue.type === 'error' ? 'text-red-600' : 'text-amber-600'
                  }`}>
                    {issue.type === 'error' ? (
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${
                      issue.type === 'error' ? 'text-red-800' : 'text-amber-800'
                    }`}>
                      {issue.text}
                    </p>
                    {issue.fixLabel && (
                      <button
                        onClick={() => {
                          console.log('TODO: AI fix:', issue.fixLabel);
                          issue.onFix?.();
                        }}
                        className={`mt-2 px-3 py-1 text-xs rounded-full font-medium transition-colors ${
                          issue.type === 'error'
                            ? 'bg-red-600 text-white hover:bg-red-700'
                            : 'bg-amber-600 text-white hover:bg-amber-700'
                        }`}
                      >
                        {issue.fixLabel}
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}