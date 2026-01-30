import React, { useState } from "react";

const PrivacyModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Container */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 z-10">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Privacy Policy</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500 transition p-2 hover:bg-gray-100 rounded-lg"
                aria-label="Close"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p className="text-gray-600 mt-2 text-sm">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          {/* Content */}
          <div className="px-6 py-4 overflow-y-auto max-h-[60vh]">
            <div className="space-y-8">
              {/* Introduction */}
              <section className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                <h3 className="font-bold text-blue-900 mb-2">Welcome to Illura</h3>
                <p className="text-blue-800 text-sm">
                  Your privacy is important to us. This Privacy Policy explains how Illura collects, 
                  uses, discloses, and safeguards your information when you use our platform.
                </p>
              </section>

              {/* Information Collection */}
              <section>
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <span className="bg-blue-100 text-blue-800 w-8 h-8 rounded-full flex items-center justify-center mr-3">1</span>
                  Information We Collect
                </h3>
                <div className="space-y-4">
                  <div className="border-l-4 border-blue-500 pl-4 py-2">
                    <h4 className="font-semibold text-gray-900">Personal Information</h4>
                    <ul className="list-disc pl-5 text-gray-600 text-sm space-y-1 mt-1">
                      <li><strong>Account Information:</strong> Name, email, username, birthdate</li>
                      <li><strong>Profile Information:</strong> Bio, profile picture, location</li>
                      <li><strong>Contact Information:</strong> Email address, social media links</li>
                      <li><strong>Payment Information:</strong> GCash number (encrypted and secure)</li>
                    </ul>
                  </div>
                  
                  <div className="border-l-4 border-blue-500 pl-4 py-2">
                    <h4 className="font-semibold text-gray-900">Content Information</h4>
                    <ul className="list-disc pl-5 text-gray-600 text-sm space-y-1 mt-1">
                      <li><strong>Artwork:</strong> Uploaded images, descriptions, tags</li>
                      <li><strong>Portfolio Content:</strong> Commission info, pricing, samples</li>
                      <li><strong>User Interactions:</strong> Comments, likes, messages</li>
                      <li><strong>Preferences:</strong> Settings, notification preferences</li>
                    </ul>
                  </div>
                  
                  
                </div>
              </section>

              {/* How We Use Information */}
              <section>
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <span className="bg-blue-100 text-blue-800 w-8 h-8 rounded-full flex items-center justify-center mr-3">2</span>
                  How We Use Your Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Platform Operation</h4>
                    <ul className="text-gray-600 text-sm space-y-1">
                      <li>• Create and manage your account</li>
                      
                      <li>• Process transactions securely</li>
                      <li>• Maintain platform security</li>
                    </ul>
                  </div>
                  
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">User Experience</h4>
                    <ul className="text-gray-600 text-sm space-y-1">
                      <li>• Show relevant content and artists</li>
                      <li>• Enable social interactions</li>
                      <li>• Send important notifications</li>
                      <li>• Improve platform features</li>
                    </ul>
                  </div>
                  
                  
                  
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Legal & Security</h4>
                    <ul className="text-gray-600 text-sm space-y-1">
                      <li>• Comply with legal obligations</li>
                      <li>• Prevent fraud and abuse</li>
                      <li>• Enforce platform policies</li>
                      <li>• Protect user rights and safety</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Data Sharing & Protection */}
              <section>
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <span className="bg-blue-100 text-blue-800 w-8 h-8 rounded-full flex items-center justify-center mr-3">3</span>
                  Data Sharing & Protection
                </h3>
                <div className="space-y-4">
                  <div className="border-l-4 border-green-500 pl-4 py-2 bg-green-50">
                    <h4 className="font-semibold text-gray-900">What We Share</h4>
                    <p className="text-gray-600 text-sm mt-1">
                      <strong>Public Profile:</strong> Your username, portfolio, and public interactions are visible to other users.
                      <br />
                      <strong>Service Providers:</strong> We share with trusted partners for hosting, payment processing, and analytics.
                      <br />
                      <strong>Legal Requirements:</strong> We may disclose information if required by law or to protect our rights.
                    </p>
                  </div>
                  
                  <div className="border-l-4 border-green-500 pl-4 py-2 bg-green-50">
                    <h4 className="font-semibold text-gray-900">What We Protect</h4>
                    <ul className="list-disc pl-5 text-gray-600 text-sm space-y-1 mt-1">
                      <li>Never sell your personal data to third parties</li>
                      <li>Payment information is encrypted and secure</li>
                      <li>Personal messages remain private</li>
                      <li>Sensitive data is anonymized for analytics</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Your Rights & Choices */}
              <section>
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <span className="bg-blue-100 text-blue-800 w-8 h-8 rounded-full flex items-center justify-center mr-3">4</span>
                  Your Rights & Choices
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-purple-50 border border-purple-100 rounded-xl p-4">
                    <h4 className="font-semibold text-purple-900 mb-2">Access & Control</h4>
                    <ul className="text-purple-800 text-sm space-y-2">
                      <li className="flex items-start">
                        <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>View and update your profile information</span>
                      </li>
                      
                      <li className="flex items-start">
                        <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Control email and notification preferences</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="bg-purple-50 border border-purple-100 rounded-xl p-4">
                    <h4 className="font-semibold text-purple-900 mb-2">Data Management</h4>
                    <ul className="text-purple-800 text-sm space-y-2">
                      <li className="flex items-start">
                        <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Delete your account and associated data</span>
                      </li>
                      <li className="flex items-start">
                        <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Request data correction or removal</span>
                      </li>
                      <li className="flex items-start">
                        <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Opt-out of promotional communications</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Security & Contact */}
              <section className="space-y-4">
                <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Data Security</h4>
                  <p className="text-gray-600 text-sm">
                    We implement industry-standard security measures including encryption, 
                    secure servers, regular security audits, and access controls to protect 
                    your information. However, no online platform can guarantee absolute security.
                  </p>
                </div>
                
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Policy Updates</h4>
                  <p className="text-gray-600 text-sm">
                    We may update this Privacy Policy periodically. Significant changes will be 
                    notified via email or platform announcement. Continued use after changes 
                    constitutes acceptance of the updated policy.
                  </p>
                </div>
                
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Contact Us</h4>
                  <p className="text-gray-600 text-sm">
                    For privacy-related questions, data requests, or concerns, contact our 
                    Privacy Team at: <span className="text-blue-600 font-medium">privacy@illura.com</span>
                  </p>
                </div>
              </section>
            </div>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-600">
                By using Illura, you acknowledge you have read and understood this Privacy Policy.
              </p>
              <button
                onClick={onClose}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition"
              >
                I Understand
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyModal;