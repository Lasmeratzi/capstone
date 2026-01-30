import React from "react";
import Navbar from "../navbar/navbar";

const Terms = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 text-gray-900">
      <Navbar />

      {/* Header with background image */}
      <div className="relative h-72 md:h-80 bg-gradient-to-r from-blue-600 to-purple-700 flex items-center justify-center">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Terms of Service</h1>
          <p className="text-lg md:text-xl text-blue-100 max-w-3xl mx-auto">
            Understanding our platform policies and services for a better experience
          </p>
          <div className="mt-6 flex justify-center space-x-4">
            <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm text-white">
              Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
          </div>
        </div>
        {/* Wave decoration */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg className="w-full h-12 text-gray-50" viewBox="0 0 1440 120" fill="currentColor">
            <path d="M0,64L80,74.7C160,85,320,107,480,112C640,117,800,107,960,96C1120,85,1280,75,1360,69.3L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"></path>
          </svg>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Introduction */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-10 border border-gray-200">
          <div className="flex items-center mb-6">
            <div className="bg-blue-100 p-3 rounded-xl mr-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Welcome to Illura</h2>
              <p className="text-gray-600 mt-1">Our commitment to creating a safe and creative community</p>
            </div>
          </div>
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-6">
            <p className="text-gray-700 leading-relaxed">
              By accessing or using Illura, you agree to be bound by these Terms of Service. 
              Please read them carefully as they govern your use of our platform. If you do 
              not agree with any part of these terms, you may not access our services.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Terms Section */}
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
              <div className="flex items-center mb-8">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white w-12 h-12 rounded-xl flex items-center justify-center font-bold text-xl mr-4">
                  1
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Terms of Use</h2>
                  <p className="text-gray-600">Rules and guidelines for platform usage</p>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="border-l-4 border-blue-500 pl-5 py-2 bg-blue-50/50">
                  <h3 className="font-bold text-gray-900 text-lg mb-2">Acceptance of Terms</h3>
                  <p className="text-gray-600">
                    By creating an account or accessing Illura, you accept these terms in full. 
                    If you disagree, you must immediately cease using our platform.
                  </p>
                </div>
                
                <div className="border-l-4 border-blue-500 pl-5 py-2 bg-blue-50/50">
                  <h3 className="font-bold text-gray-900 text-lg mb-2">Eligibility Requirements</h3>
                  <p className="text-gray-600 mb-2">To use Illura, you must:</p>
                  <ul className="list-disc pl-5 text-gray-600 space-y-1">
                    <li>Be at least 13 years of age</li>
                    <li>Have parental consent if under 18 years old</li>
                    <li>Not be prohibited from receiving our services under applicable laws</li>
                  </ul>
                </div>
                
                <div className="border-l-4 border-blue-500 pl-5 py-2 bg-blue-50/50">
                  <h3 className="font-bold text-gray-900 text-lg mb-2">Account Responsibilities</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <div className="bg-green-100 p-2 rounded-lg mr-3">
                          <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                          </svg>
                        </div>
                        <span className="font-medium text-gray-900">Security</span>
                      </div>
                      <p className="text-sm text-gray-600">Keep your credentials secure and confidential</p>
                    </div>
                    
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <div className="bg-blue-100 p-2 rounded-lg mr-3">
                          <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <span className="font-medium text-gray-900">Accuracy</span>
                      </div>
                      <p className="text-sm text-gray-600">Provide truthful and complete information</p>
                    </div>
                  </div>
                </div>
                
                <div className="border-l-4 border-blue-500 pl-5 py-2 bg-blue-50/50">
                  <h3 className="font-bold text-gray-900 text-lg mb-2">User Conduct Guidelines</h3>
                  <div className="space-y-3 mt-3">
                    <div className="flex items-start">
                      <svg className="w-5 h-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                      </svg>
                      <div>
                        <span className="font-medium text-gray-900">Prohibited Content</span>
                        <p className="text-gray-600 text-sm">Harmful, illegal, or offensive material is strictly forbidden</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <svg className="w-5 h-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      <div>
                        <span className="font-medium text-gray-900">Respect Rights</span>
                        <p className="text-gray-600 text-sm">Do not infringe on intellectual property or privacy rights</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Services Section */}
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
              <div className="flex items-center mb-8">
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white w-12 h-12 rounded-xl flex items-center justify-center font-bold text-xl mr-4">
                  2
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Platform Services</h2>
                  <p className="text-gray-600">Features and capabilities we offer</p>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="group hover:bg-gray-50 transition-all duration-300 border border-gray-200 rounded-xl p-5">
                  <div className="flex items-start mb-3">
                    <div className="bg-gradient-to-r from-blue-100 to-blue-50 p-3 rounded-lg mr-4">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">Portfolio Management</h3>
                      <p className="text-gray-600 text-sm mt-1">
                        Create professional artist profiles, organize artwork galleries, and showcase 
                        your creative portfolio to potential clients and collaborators.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="group hover:bg-gray-50 transition-all duration-300 border border-gray-200 rounded-xl p-5">
                  <div className="flex items-start mb-3">
                    <div className="bg-gradient-to-r from-green-100 to-green-50 p-3 rounded-lg mr-4">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">Client Engagement</h3>
                      <p className="text-gray-600 text-sm mt-1">
                        Connect with art enthusiasts, receive commission requests, build professional 
                        relationships, and grow your artistic network through direct messaging and reviews.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="group hover:bg-gray-50 transition-all duration-300 border border-gray-200 rounded-xl p-5">
                  <div className="flex items-start mb-3">
                    <div className="bg-gradient-to-r from-yellow-100 to-yellow-50 p-3 rounded-lg mr-4">
                      <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">Interactive Features</h3>
                      <p className="text-gray-600 text-sm mt-1">
                        Engage with the community through likes, comments, direct messaging, and social 
                        sharing. Participate in discussions and build your artistic reputation.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="group hover:bg-gray-50 transition-all duration-300 border border-gray-200 rounded-xl p-5">
                  <div className="flex items-start mb-3">
                    <div className="bg-gradient-to-r from-purple-100 to-purple-50 p-3 rounded-lg mr-4">
                      <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">Auction & Commission System</h3>
                      <p className="text-gray-600 text-sm mt-1 mb-2">
                        Monetize your artwork through timed auctions and commission requests with secure 
                        GCash payment integration designed for Filipino artists.
                      </p>
                      <div className="flex flex-wrap gap-2 mt-3">
                        <span className="px-3 py-1 bg-purple-100 text-purple-800 text-xs rounded-full font-medium">
                          Art Auctions
                        </span>
                        <span className="px-3 py-1 bg-purple-100 text-purple-800 text-xs rounded-full font-medium">
                          Commission Management
                        </span>
                        <span className="px-3 py-1 bg-purple-100 text-purple-800 text-xs rounded-full font-medium">
                          GCash Integration
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Additional Information */}
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-2xl p-6">
              <div className="flex items-start">
                <div className="bg-blue-600 text-white p-3 rounded-lg mr-4">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg mb-2">Platform Information</h3>
                  <p className="text-gray-700">
                    Illura is continuously evolving. Currently optimized for stable internet connections 
                    and available in select regions, with expansion plans underway. Our support team 
                    provides assistance through tutorials and dedicated help channels.
                  </p>
                  <div className="mt-4 flex items-center text-sm text-gray-600">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Regular updates and feature enhancements</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-12 bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full mb-6">
              <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Your Agreement Matters</h3>
            <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
              By continuing to use Illura, you acknowledge that you have read, understood, 
              and agree to be bound by these Terms of Service. We're committed to providing 
              a safe, creative space for artists and art enthusiasts alike.
            </p>
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                For questions about these terms, please contact us at{" "}
                <a href="mailto:legal@illura.com" className="text-blue-600 hover:text-blue-800 font-medium">
                  legal@illura.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;