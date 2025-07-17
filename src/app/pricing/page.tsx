'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

export default function PricingPage() {
  const services = [
    {
      category: 'Document Notarization',
      description: 'Certified UAE notary services for legal documents',
      icon: (
        <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
      ),
      services: [
        { name: 'Document Verification', price: 'AED 30', duration: '1 day' },
        { name: 'Power of Attorney', price: 'AED 45', duration: '1-2 days' },
        { name: 'Contract Notarization', price: 'AED 40', duration: '1 day' },
        { name: 'Affidavit Certification', price: 'AED 35', duration: '1 day' }
      ]
    },
    {
      category: 'Document Attestation',
      description: 'Multi-level attestation for international document use',
      icon: (
        <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      services: [
        { name: 'Ministry of Justice', price: 'AED 25', duration: '1-2 days' },
        { name: 'Ministry of Foreign Affairs', price: 'AED 35', duration: '2-3 days' },
        { name: 'Embassy Legalization', price: 'AED 60', duration: '3-5 days' },
        { name: 'Full Attestation Package', price: 'AED 110', duration: '5-7 days' }
      ]
    },
    {
      category: 'Translation Services',
      description: 'Professional legal document translation',
      icon: (
        <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
        </svg>
      ),
      services: [
        { name: 'Arabic to English', price: 'AED 120', duration: '2-3 days' },
        { name: 'English to Arabic', price: 'AED 120', duration: '2-3 days' },
        { name: 'Certified Translation', price: 'AED 150', duration: '3-4 days' },
        { name: 'Urgent Translation (24h)', price: 'AED 200', duration: '1 day' }
      ]
    },
    {
      category: 'Additional Services',
      description: 'Complementary services for document processing',
      icon: (
        <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      services: [
        { name: 'Document Scanning', price: 'AED 10', duration: 'Same day' },
        { name: 'Courier Service', price: 'AED 50', duration: '1-2 days' },
        { name: 'Document Tracking', price: 'Free', duration: 'Real-time' },
        { name: 'AI Document Analysis', price: 'Free', duration: 'Instant' }
      ]
    }
  ];

  const plans = [
    {
      name: 'Individual',
      price: 'Per Service',
      description: 'Perfect for individuals needing occasional document services',
      features: [
        'Pay per service',
        'Standard processing times',
        'AI document analysis',
        'Basic customer support',
        'Document tracking',
        'Mobile-friendly interface'
      ],
      gradient: 'from-brand-500 to-brand-600',
      popular: false
    },
    {
      name: 'Business',
      price: 'AED 299/month',
      description: 'Ideal for small businesses with regular document needs',
      features: [
        '10 free services per month',
        'Priority processing',
        'Dedicated account manager',
        'Bulk upload capabilities',
        'Advanced analytics',
        'API access',
        'Priority support'
      ],
      gradient: 'from-mantis-500 to-mantis-600',
      popular: true
    },
    {
      name: 'Enterprise',
      price: 'Custom Pricing',
      description: 'Tailored solutions for large organizations',
      features: [
        'Unlimited services',
        'SLA guarantees',
        'White-label solutions',
        'Custom integrations',
        'Dedicated infrastructure',
        'Training & onboarding',
        '24/7 premium support'
      ],
      gradient: 'from-nuit-500 to-nuit-600',
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-praxeti-100">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-50 to-mantis-50"></div>
        
        <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl font-bold text-midnight-900 mb-6">
              Transparent <span className="text-brand-600">Legal Pricing</span>
            </h1>
            <p className="text-xl text-midnight-600 mb-8 max-w-3xl mx-auto">
              Professional document services with clear, upfront pricing. No hidden fees, no surprises.
            </p>
            <div className="flex items-center justify-center space-x-4 text-sm text-midnight-500">
              <div className="flex items-center space-x-2">
                <svg className="h-4 w-4 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Licensed UAE Notaries</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="h-4 w-4 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Government Approved</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="h-4 w-4 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Secure & Confidential</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-midnight-900 mb-4">Choose Your Plan</h2>
            <p className="text-xl text-midnight-600">Flexible pricing options to suit your needs</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`relative rounded-2xl p-8 ${
                  plan.popular 
                    ? 'ring-2 ring-brand-500 shadow-2xl scale-105' 
                    : 'shadow-lg hover:shadow-xl transition-shadow duration-300'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-brand-600 text-white px-6 py-2 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className={`bg-gradient-to-r ${plan.gradient} rounded-2xl p-6 text-white mb-6`}>
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="text-3xl font-bold mb-2">{plan.price}</div>
                  <p className="text-white/90">{plan.description}</p>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start space-x-3">
                      <svg className="h-5 w-5 text-brand-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-midnight-600">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link href="/" className="block">
                  <button className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-200 ${
                    plan.popular
                      ? 'bg-brand-600 text-white hover:bg-brand-700'
                      : 'bg-praxeti-300 text-midnight-900 hover:bg-praxeti-400'
                  }`}>
                    Get Started
                  </button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Pricing */}
      <section className="py-20 bg-praxeti-100">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-midnight-900 mb-4">Service Pricing</h2>
            <p className="text-xl text-midnight-600">Individual service rates for pay-per-use model</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {services.map((category, index) => (
              <motion.div
                key={category.category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 bg-brand-100 rounded-xl flex items-center justify-center text-brand-600">
                    {category.icon}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-midnight-900">{category.category}</h3>
                    <p className="text-midnight-600">{category.description}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {category.services.map((service, serviceIndex) => (
                    <div key={serviceIndex} className="flex items-center justify-between p-4 bg-praxeti-100 rounded-lg">
                      <div>
                        <h4 className="font-medium text-midnight-900">{service.name}</h4>
                        <p className="text-sm text-midnight-600">{service.duration}</p>
                      </div>
                      <span className="text-lg font-bold text-brand-600">{service.price}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-midnight-900 mb-4">Pricing FAQ</h2>
            <p className="text-xl text-midnight-600">Common questions about our pricing structure</p>
          </motion.div>

          <div className="space-y-6">
            {[
              {
                question: "Are there any hidden fees?",
                answer: "No, all our prices are transparent and include all necessary processing fees. The only additional costs might be courier services if you choose door-to-door delivery."
              },
              {
                question: "How do I pay for services?",
                answer: "We accept all major credit cards, debit cards, and bank transfers. Payment is processed securely through our platform before service begins."
              },
              {
                question: "What happens if my document is rejected?",
                answer: "If a document is rejected due to quality issues or missing information, we'll work with you to resolve the issue at no additional cost for the correction."
              },
              {
                question: "Can I get a refund if I'm not satisfied?",
                answer: "We offer a satisfaction guarantee. If you're not happy with our service, we'll work to make it right or provide a refund within 30 days."
              },
              {
                question: "Do you offer discounts for bulk orders?",
                answer: "Yes, businesses processing multiple documents can benefit from our Business plan or contact us for custom enterprise pricing with volume discounts."
              }
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-praxeti-100 rounded-xl p-6"
              >
                <h3 className="text-lg font-semibold text-midnight-900 mb-3">{faq.question}</h3>
                <p className="text-midnight-600">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-brand-600 to-mantis-600">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-4">Ready to Get Started?</h2>
            <p className="text-xl text-white/90 mb-8">
              Join thousands of satisfied customers who trust us with their legal documents.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/" className="bg-white text-brand-600 px-8 py-3 rounded-lg font-medium hover:bg-praxeti-100 transition-colors duration-200">
                Start Processing Documents
              </Link>
              <Link href="/about" className="bg-white/20 text-white px-8 py-3 rounded-lg font-medium hover:bg-white/30 transition-colors duration-200">
                Learn More About Us
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}