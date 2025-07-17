'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Navbar from '../../components/Navbar';

type FlowStep = 'consultation-type' | 'ai-chat' | 'fee-confirmation' | 'schedule-meeting' | 'booking-confirmation' | 'video-session';
type ConsultationType = 'ai-chat' | 'full-meeting';

interface ConsultationData {
  type: ConsultationType;
  duration: string;
  cost: string;
  selectedDate?: string;
  selectedTime?: string;
  topic?: string;
  notaryName?: string;
  paymentMethod?: string;
}

const consultationOptions = {
  'ai-chat': {
    title: 'AI Legal Assistant',
    description: 'Get instant answers to legal questions',
    duration: 'Answers instantly',
    cost: 'Free',
    features: ['Instant AI responses', 'UAE legal expertise', 'Document guidance', 'Available 24/7']
  },
  'full-meeting': {
    title: 'Schedule a Full Meeting',
    description: 'Comprehensive consultation session',
    duration: '60 minutes',
    cost: '€120',
    features: ['Detailed consultation', 'Document preparation', 'Legal strategy', 'Follow-up support']
  }
};

const Stepper = ({ currentStep, steps }: { currentStep: number; steps: string[] }) => (
  <div className="flex items-center justify-center mb-12">
    <div className="flex items-center space-x-4">
      {steps.map((step, index) => (
        <div key={index} className="flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
            index < currentStep ? 'bg-mantis-600 text-white' :
            index === currentStep ? 'bg-brand-600 text-white' :
            'bg-gray-200 text-gray-500'
          }`}>
            {index < currentStep ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              index + 1
            )}
          </div>
          <span className={`ml-2 text-sm font-medium ${
            index <= currentStep ? 'text-midnight-900' : 'text-gray-400'
          }`}>
            {step}
          </span>
          {index < steps.length - 1 && (
            <div className={`w-8 h-0.5 mx-4 ${
              index < currentStep ? 'bg-mantis-600' : 'bg-gray-200'
            }`} />
          )}
        </div>
      ))}
    </div>
  </div>
);

export default function SpeakToNotaryPage() {
  const [currentStep, setCurrentStep] = useState<FlowStep>('consultation-type');
  const [consultationData, setConsultationData] = useState<ConsultationData>({
    type: 'ai-chat',
    duration: 'Answers instantly',
    cost: 'Free'
  });

  const steps = ['Select Type', 'Payment', 'Schedule', 'Confirmation', 'Session'];
  const stepIndex = {
    'consultation-type': 0,
    'ai-chat': 0, // AI chat doesn't need stepper progression
    'fee-confirmation': 1,
    'schedule-meeting': 2,
    'booking-confirmation': 3,
    'video-session': 4
  };

  const selectConsultationType = (type: ConsultationType) => {
    const option = consultationOptions[type];
    setConsultationData({
      ...consultationData,
      type,
      duration: option.duration,
      cost: option.cost
    });
    
    // Route to AI chat for ai-chat type, otherwise go to fee confirmation
    if (type === 'ai-chat') {
      setCurrentStep('ai-chat');
    } else {
      setCurrentStep('fee-confirmation');
    }
  };

  const confirmPayment = () => {
    setCurrentStep('schedule-meeting');
  };

  const scheduleAppointment = (date: string, time: string, topic: string) => {
    setConsultationData({
      ...consultationData,
      selectedDate: date,
      selectedTime: time,
      topic,
      notaryName: 'Dr. Sarah Johnson',
      paymentMethod: 'Card ending in 4242'
    });
    setCurrentStep('booking-confirmation');
  };

  const startVideoSession = () => {
    setCurrentStep('video-session');
  };

  return (
    <div className="min-h-screen bg-praxeti-100">
      {/* Background Pattern */}
      <svg className="absolute inset-0 w-full h-full opacity-3 pointer-events-none" style={{zIndex: 1}}>
        <defs>
          <pattern id="legal-grid" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#00804C" strokeWidth="1"/>
            <path d="M 15 0 L 15 60 M 30 0 L 30 60 M 45 0 L 45 60" fill="none" stroke="#00804C" strokeWidth="0.5" opacity="0.3"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#legal-grid)"/>
      </svg>

      <Navbar />

      <main className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 py-8 relative z-10">
        <AnimatePresence mode="wait">
          {currentStep === 'consultation-type' && (
            <ConsultationTypeStep
              onSelect={selectConsultationType}
              currentStep={stepIndex[currentStep]}
              steps={steps}
            />
          )}
          {currentStep === 'ai-chat' && (
            <AIChatStep
              onBack={() => setCurrentStep('consultation-type')}
            />
          )}
          {currentStep === 'fee-confirmation' && (
            <FeeConfirmationStep
              data={consultationData}
              onConfirm={confirmPayment}
              onBack={() => setCurrentStep('consultation-type')}
              currentStep={stepIndex[currentStep]}
              steps={steps}
            />
          )}
          {currentStep === 'schedule-meeting' && (
            <ScheduleMeetingStep
              data={consultationData}
              onSchedule={scheduleAppointment}
              onBack={() => setCurrentStep('fee-confirmation')}
              currentStep={stepIndex[currentStep]}
              steps={steps}
            />
          )}
          {currentStep === 'booking-confirmation' && (
            <BookingConfirmationStep
              data={consultationData}
              onStartSession={startVideoSession}
              onBack={() => setCurrentStep('schedule-meeting')}
              currentStep={stepIndex[currentStep]}
              steps={steps}
            />
          )}
          {currentStep === 'video-session' && (
            <VideoSessionStep
              data={consultationData}
              currentStep={stepIndex[currentStep]}
              steps={steps}
            />
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

// A1: Consultation Type Selection
const ConsultationTypeStep = ({ onSelect, currentStep, steps }: {
  onSelect: (type: ConsultationType) => void;
  currentStep: number;
  steps: string[];
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3 }}
  >
    <Stepper currentStep={currentStep} steps={steps} />
    
    <div className="text-center mb-12">
      <h1 className="text-4xl font-bold text-midnight-900 mb-4">How can a notary help you today?</h1>
      <p className="text-xl text-midnight-600">Choose the type of consultation that best fits your needs</p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
      {Object.entries(consultationOptions).map(([key, option]) => (
        <motion.div
          key={key}
          className="bg-white rounded-2xl p-8 border border-gray-200 cursor-pointer shadow-md hover:border-brand-600 transition-all duration-300 hover:shadow-lg"
          whileHover={{ scale: 1.02, y: -8 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelect(key as ConsultationType)}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="w-12 h-12 bg-brand-100 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {key === 'ai-chat' ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                )}
              </svg>
            </div>
            <span className="text-2xl font-bold text-brand-600">
              {key === 'ai-chat' ? 'Free' : `€${option.cost}`}
            </span>
          </div>
          
          <h3 className="text-xl font-bold text-midnight-900 mb-2">{option.title}</h3>
          <p className="text-midnight-600 mb-4">{option.description}</p>
          <p className="text-sm text-midnight-500 mb-6">{option.duration}</p>
          
          <ul className="space-y-2 mb-6">
            {option.features.map((feature, index) => (
              <li key={index} className="flex items-center text-sm text-midnight-700">
                <svg className="w-4 h-4 text-mantis-600 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {feature}
              </li>
            ))}
          </ul>

          <button className="w-full bg-brand-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-brand-700 transition-colors">
            {key === 'ai-chat' ? 'Start Chat' : 'Select This Option'}
          </button>
        </motion.div>
      ))}
    </div>

    <div className="text-center mt-12">
      <Link href="/" className="text-brand-600 hover:text-brand-700 font-medium">
        ← Back to Dashboard
      </Link>
    </div>
  </motion.div>
);

// A2: Fee Confirmation
const FeeConfirmationStep = ({ data, onConfirm, onBack, currentStep, steps }: {
  data: ConsultationData;
  onConfirm: () => void;
  onBack: () => void;
  currentStep: number;
  steps: string[];
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3 }}
  >
    <Stepper currentStep={currentStep} steps={steps} />
    
    <div className="text-center mb-12">
      <h1 className="text-4xl font-bold text-midnight-900 mb-4">Confirm Your Payment</h1>
      <p className="text-xl text-midnight-600">Review your consultation details and payment information</p>
    </div>

    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl p-8 border border-gray-200 mb-8">
        <h2 className="text-xl font-bold text-midnight-900 mb-6">Order Summary</h2>
        
        <div className="flex justify-between items-center py-4 border-b border-gray-200">
          <div>
            <h3 className="font-medium text-midnight-900">{consultationOptions[data.type].title}</h3>
            <p className="text-sm text-midnight-600">{data.duration}</p>
          </div>
          <span className="text-lg font-bold text-midnight-900">€{data.cost}</span>
        </div>
        
        <div className="flex justify-between items-center py-4 text-lg font-bold text-midnight-900">
          <span>Total</span>
          <span>€{data.cost}</span>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-8 border border-gray-200 mb-8">
        <h2 className="text-xl font-bold text-midnight-900 mb-6">Payment Method</h2>
        
        <div className="space-y-4">
          <div className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-brand-600 transition-colors">
            <input type="radio" name="payment" defaultChecked className="mr-3 text-brand-600" />
            <div className="flex-1">
              <div className="flex items-center">
                <span className="font-medium text-midnight-900">Card ending in 4242</span>
                <span className="ml-2 text-sm text-midnight-600">Expires 12/25</span>
              </div>
            </div>
            <div className="text-brand-600">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M1 4v16h22V4H1zm20 14H3V8h18v10z"/>
              </svg>
            </div>
          </div>
          
          <div className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-brand-600 transition-colors">
            <input type="radio" name="payment" className="mr-3 text-brand-600" />
            <div className="flex-1">
              <span className="font-medium text-midnight-900">Apple Pay</span>
            </div>
            <div className="text-midnight-600">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="flex space-x-4">
        <button
          onClick={onBack}
          className="flex-1 bg-gray-200 text-midnight-900 py-3 px-6 rounded-lg font-medium hover:bg-gray-300 transition-colors"
        >
          Back
        </button>
        <button
          onClick={onConfirm}
          className="flex-1 bg-brand-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-brand-700 transition-colors"
        >
          Pay and Proceed
        </button>
      </div>
    </div>
  </motion.div>
);

// A3: Schedule Meeting
const ScheduleMeetingStep = ({ data, onSchedule, onBack, currentStep, steps }: {
  data: ConsultationData;
  onSchedule: (date: string, time: string, topic: string) => void;
  onBack: () => void;
  currentStep: number;
  steps: string[];
}) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [topic, setTopic] = useState('');

  const availableTimes = [
    '09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00'
  ];

  const handleSchedule = () => {
    if (selectedDate && selectedTime) {
      onSchedule(selectedDate, selectedTime, topic);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Stepper currentStep={currentStep} steps={steps} />
      
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-midnight-900 mb-4">Schedule Your Meeting</h1>
        <p className="text-xl text-midnight-600">Choose a convenient time for your consultation</p>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl p-8 border border-gray-200">
            <h2 className="text-xl font-bold text-midnight-900 mb-6">Select Date</h2>
            
            <div className="grid grid-cols-7 gap-2 mb-4">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-center py-2 text-sm font-medium text-midnight-600">
                  {day}
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                <button
                  key={day}
                  onClick={() => setSelectedDate(`2024-01-${day.toString().padStart(2, '0')}`)}
                  className={`p-2 text-sm rounded-lg transition-colors ${
                    selectedDate === `2024-01-${day.toString().padStart(2, '0')}`
                      ? 'bg-brand-600 text-white'
                      : 'hover:bg-brand-100 text-midnight-700'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 border border-gray-200">
            <h2 className="text-xl font-bold text-midnight-900 mb-6">Select Time</h2>
            
            <div className="grid grid-cols-2 gap-3 mb-6">
              {availableTimes.map(time => (
                <button
                  key={time}
                  onClick={() => setSelectedTime(time)}
                  className={`p-3 text-sm rounded-lg font-medium transition-colors ${
                    selectedTime === time
                      ? 'bg-brand-600 text-white'
                      : 'bg-gray-100 hover:bg-brand-100 text-midnight-700'
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>

            <div>
              <label className="block text-sm font-medium text-midnight-900 mb-2">
                Meeting Topic (Optional)
              </label>
              <textarea
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-600 focus:border-transparent"
                placeholder="Brief description of what you'd like to discuss..."
                rows={3}
              />
            </div>
          </div>
        </div>

        <div className="flex space-x-4 mt-8">
          <button
            onClick={onBack}
            className="flex-1 bg-gray-200 text-midnight-900 py-3 px-6 rounded-lg font-medium hover:bg-gray-300 transition-colors"
          >
            Back
          </button>
          <button
            onClick={handleSchedule}
            disabled={!selectedDate || !selectedTime}
            className="flex-1 bg-brand-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-brand-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Confirm Schedule
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// A4: Booking Confirmation
const BookingConfirmationStep = ({ data, onStartSession, onBack, currentStep, steps }: {
  data: ConsultationData;
  onStartSession: () => void;
  onBack: () => void;
  currentStep: number;
  steps: string[];
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3 }}
  >
    <Stepper currentStep={currentStep} steps={steps} />
    
    <div className="text-center mb-12">
      <div className="w-16 h-16 bg-mantis-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg className="w-8 h-8 text-mantis-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h1 className="text-4xl font-bold text-midnight-900 mb-4">You're booked!</h1>
      <p className="text-xl text-midnight-600">Your consultation has been scheduled successfully</p>
    </div>

    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl p-8 border border-gray-200 mb-8">
        <h2 className="text-xl font-bold text-midnight-900 mb-6">Meeting Details</h2>
        
        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="text-midnight-600">Consultation Type</span>
            <span className="font-medium text-midnight-900">{consultationOptions[data.type].title}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-midnight-600">Date</span>
            <span className="font-medium text-midnight-900">{data.selectedDate}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-midnight-600">Time</span>
            <span className="font-medium text-midnight-900">{data.selectedTime}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-midnight-600">Duration</span>
            <span className="font-medium text-midnight-900">{data.duration}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-midnight-600">Notary</span>
            <span className="font-medium text-midnight-900">{data.notaryName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-midnight-600">Total Cost</span>
            <span className="font-medium text-midnight-900">€{data.cost}</span>
          </div>
        </div>
      </div>

      <div className="bg-brand-50 rounded-2xl p-6 mb-8">
        <h3 className="font-bold text-midnight-900 mb-4">Important Notes</h3>
        <ul className="space-y-2 text-sm text-midnight-700">
          <li>• The video link will be active 10 minutes before your appointment</li>
          <li>• Please ensure you have a stable internet connection</li>
          <li>• Have your ID and any relevant documents ready</li>
          <li>• You'll receive a confirmation email with the meeting link</li>
        </ul>
      </div>

      <div className="flex space-x-4">
        <button
          onClick={onBack}
          className="flex-1 bg-gray-200 text-midnight-900 py-3 px-6 rounded-lg font-medium hover:bg-gray-300 transition-colors"
        >
          Back
        </button>
        <button
          onClick={onStartSession}
          className="flex-1 bg-brand-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-brand-700 transition-colors"
        >
          Join Meeting (Mock)
        </button>
      </div>
    </div>
  </motion.div>
);

// A5: Video Session
const VideoSessionStep = ({ data, currentStep, steps }: {
  data: ConsultationData;
  currentStep: number;
  steps: string[];
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3 }}
  >
    <Stepper currentStep={currentStep} steps={steps} />
    
    <div className="text-center mb-8">
      <h1 className="text-4xl font-bold text-midnight-900 mb-4">Live Video Session</h1>
      <p className="text-xl text-midnight-600">You're connected with {data.notaryName}</p>
    </div>

    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <div className="bg-midnight-900 rounded-2xl aspect-video flex items-center justify-center relative">
            <div className="text-center text-white">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">WebRTC Video Window</h3>
              <p className="text-white text-opacity-80">Live video connection with notary</p>
            </div>
            
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-4">
              <button className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-700 transition-colors">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <button className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                </svg>
              </button>
              <button className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-200">
          <h3 className="text-lg font-bold text-midnight-900 mb-4">Session Info</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-midnight-600">Time Remaining</span>
              <span className="font-medium text-brand-600">42:15</span>
            </div>
            <div className="flex justify-between">
              <span className="text-midnight-600">Session Type</span>
              <span className="font-medium text-midnight-900">{consultationOptions[data.type].title}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-midnight-600">Notary</span>
              <span className="font-medium text-midnight-900">{data.notaryName}</span>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <h4 className="font-bold text-midnight-900 mb-3">Quick Actions</h4>
            <div className="space-y-2">
              <button className="w-full bg-brand-100 text-brand-700 py-2 px-4 rounded-lg text-sm font-medium hover:bg-brand-200 transition-colors">
                Share Screen
              </button>
              <button className="w-full bg-brand-100 text-brand-700 py-2 px-4 rounded-lg text-sm font-medium hover:bg-brand-200 transition-colors">
                Upload Document
              </button>
              <button className="w-full bg-brand-100 text-brand-700 py-2 px-4 rounded-lg text-sm font-medium hover:bg-brand-200 transition-colors">
                Open Chat
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center mt-8">
        <Link href="/" className="text-brand-600 hover:text-brand-700 font-medium">
          ← End Session and Return to Dashboard
        </Link>
      </div>
    </div>
  </motion.div>
);

// AI Chat Step - Interactive chat interface for instant legal assistance
const AIChatStep = ({ onBack }: { onBack: () => void }) => {
  const [selectedQuestion, setSelectedQuestion] = useState<string>('');
  const [customMessage, setCustomMessage] = useState<string>('');
  const [chatMessages, setChatMessages] = useState<Array<{ type: 'user' | 'ai'; message: string; timestamp: Date }>>([]);

  // UAE Legal Document FAQ Templates
  const faqTemplates = [
    {
      category: 'Document Attestation',
      questions: [
        'What documents do I need to attest for UAE use?',
        'How long does the attestation process take?',
        'What is the difference between attestation and apostille?',
        'Do I need to translate documents before attestation?'
      ]
    },
    {
      category: 'Power of Attorney',
      questions: [
        'How do I create a Power of Attorney for UAE?',
        'What are the requirements for POA attestation?',
        'Can I revoke a Power of Attorney in UAE?',
        'What types of Power of Attorney are recognized in UAE?'
      ]
    },
    {
      category: 'Marriage & Divorce',
      questions: [
        'How to register a marriage certificate in UAE?',
        'What documents are needed for UAE marriage registration?',
        'How to obtain a divorce certificate attestation?',
        'Can I get married in UAE with foreign documents?'
      ]
    },
    {
      category: 'Business Documents',
      questions: [
        'What commercial documents need attestation in UAE?',
        'How to attest company registration documents?',
        'What is required for business license attestation?',
        'How to authenticate contracts for UAE business?'
      ]
    },
    {
      category: 'Education Documents',
      questions: [
        'How to attest educational certificates for UAE?',
        'What is the process for degree attestation?',
        'Do I need to attest transcripts separately?',
        'How long is educational attestation valid?'
      ]
    }
  ];

  const handleSendMessage = (message: string) => {
    if (!message.trim()) return;
    
    const newMessage = {
      type: 'user' as const,
      message: message.trim(),
      timestamp: new Date()
    };
    
    setChatMessages(prev => [...prev, newMessage]);
    
    // Get AI response
    generateAIResponse(message.trim()).then(aiResponseText => {
      const aiResponse = {
        type: 'ai' as const,
        message: aiResponseText,
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, aiResponse]);
    }).catch(error => {
      console.error('Failed to get AI response:', error);
      const errorResponse = {
        type: 'ai' as const,
        message: 'I apologize, but I am temporarily unavailable. Please try again later.',
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, errorResponse]);
    });
    
    setCustomMessage('');
    setSelectedQuestion('');
  };

  const generateAIResponse = async (question: string): Promise<string> => {
    try {
      const response = await fetch('/api/gpt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'chat',
          message: question,
          conversationHistory: chatMessages.map(msg => ({
            role: msg.type === 'user' ? 'user' : 'assistant',
            content: msg.message
          }))
        })
      });

      if (!response.ok) {
        throw new Error(`Chat API failed: ${response.status}`);
      }

      const data = await response.json();
      return data.response || 'I apologize, but I could not process your request at this time. Please try again.';
    } catch (error) {
      console.error('AI Chat error:', error);
      return 'I apologize, but I am temporarily unavailable. Please try again later or contact support for assistance.';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="max-w-6xl mx-auto"
    >
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-midnight-900 mb-4">AI Legal Assistant</h1>
        <p className="text-xl text-midnight-600">Get instant answers to your UAE legal document questions</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chat Interface */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 flex flex-col h-[600px]">
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-brand-600 to-brand-700 p-6 rounded-t-2xl">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">AI Legal Assistant</h3>
                <p className="text-brand-100 text-sm">Specialized in UAE legal documents</p>
              </div>
              <div className="ml-auto">
                <div className="w-3 h-3 bg-mantis-400 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4">
            {chatMessages.length === 0 ? (
              <div className="text-center text-midnight-500 py-8">
                <svg className="w-12 h-12 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <p>Start by selecting a question from the FAQ or type your own question</p>
              </div>
            ) : (
              chatMessages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                      msg.type === 'user'
                        ? 'bg-brand-600 text-white'
                        : 'bg-gray-200 text-midnight-900'
                    }`}
                  >
                    <p className={`text-sm ${msg.type === 'user' ? 'text-white' : 'text-midnight-900'}`}>{msg.message}</p>
                    <p className={`text-xs mt-1 ${
                      msg.type === 'user' ? 'text-white opacity-75' : 'text-midnight-600'
                    }`}>
                      {msg.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Message Input */}
          <div className="p-6 border-t border-gray-200">
            <div className="flex space-x-3">
              <input
                type="text"
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(customMessage)}
                placeholder="Type your legal question..."
                className="flex-1 px-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm transition-all duration-300 focus:bg-brand-50 focus:border-brand-600 focus:ring-4 focus:ring-brand-600/30 focus:outline-none"
              />
              <button
                onClick={() => handleSendMessage(customMessage)}
                className="shrink-0 px-5 py-3 bg-brand-600 text-white rounded-xl transition-all duration-300 hover:bg-brand-700 focus:ring-4 focus:ring-brand-600/30 hover:-translate-y-0.5 hover:shadow-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* FAQ Sidebar */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-midnight-900 mb-6">Common Questions</h3>
          
          <div className="space-y-6">
            {faqTemplates.map((category, categoryIndex) => (
              <div key={categoryIndex}>
                <h4 className="font-semibold text-midnight-900 mb-3 text-sm uppercase tracking-wide">
                  {category.category}
                </h4>
                <div className="space-y-2">
                  {category.questions.map((question, questionIndex) => (
                    <button
                      key={questionIndex}
                      onClick={() => handleSendMessage(question)}
                      className="w-full text-left p-3 text-sm text-midnight-700 hover:bg-brand-50 hover:text-brand-700 rounded-lg transition-colors border border-transparent hover:border-brand-200"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="flex justify-between items-center mt-8">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-brand-600 hover:text-brand-700 font-medium"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Back to Options</span>
        </button>
        
        <div className="flex items-center space-x-4">
          <span className="text-sm text-midnight-600">Need human assistance?</span>
          <button
            onClick={() => {
              // Navigate back and select human consultation
              onBack();
              // This would trigger selection of full-meeting option
            }}
            className="bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-700 transition-colors"
          >
            Book Human Consultation
          </button>
        </div>
      </div>
    </motion.div>
  );
};