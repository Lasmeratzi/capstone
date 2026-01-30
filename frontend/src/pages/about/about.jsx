import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../navbar/navbar";

const About = () => {
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({
    averageRating: 0,
    totalReviews: 0,
    ratingBreakdown: []
  });
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);

  useEffect(() => {
    fetchReviewsAndStats();
  }, []);

  const fetchReviewsAndStats = async () => {
    try {
      setLoadingReviews(true);
      const [reviewsResponse, statsResponse] = await Promise.all([
        axios.get('http://localhost:5000/api/reviews/all'),
        axios.get('http://localhost:5000/api/reviews/stats')
      ]);

      if (reviewsResponse.data.success) {
        setReviews(reviewsResponse.data.reviews);
      }

      if (statsResponse.data.success) {
        setStats({
          averageRating: statsResponse.data.averageRating,
          totalReviews: statsResponse.data.totalReviews,
          ratingBreakdown: statsResponse.data.ratingBreakdown || []
        });
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoadingReviews(false);
    }
  };

  const renderStars = (rating) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <span 
            key={star} 
            className={`text-lg ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  const getBarPercentage = (rating) => {
    const ratingData = stats.ratingBreakdown.find(r => r.rating === rating);
    const count = ratingData ? ratingData.count : 0;
    return stats.totalReviews > 0 
      ? Math.round((count / stats.totalReviews) * 100) 
      : 0;
  };

  const displayedReviews = showAllReviews ? reviews : reviews.slice(0, 6);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white text-gray-900">
      <Navbar />

      {/* Hero Section */}
      <div className="relative h-72 md:h-80 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 overflow-hidden">
        {/* Abstract background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full"></div>
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-white rounded-full"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white rounded-full"></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center px-4 text-center">
          <div className="flex items-center justify-center space-x-4 mb-6">
            <span className="text-4xl md:text-5xl font-bold text-white">Welcome to</span>
            <img 
              src="/illura.png" 
              alt="Illura Logo" 
              className="h-16 w-16 md:h-20 md:w-20 drop-shadow-lg"
            />
            <span className="text-4xl md:text-5xl font-bold text-white custom-font">
              Illura
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-semibold text-white/90 mb-4">
            Where Art Meets Opportunity
          </h1>
          <p className="text-lg text-white/80 max-w-2xl">
            Empowering Filipino artists to showcase talent, connect with clients, 
            and build sustainable creative careers
          </p>
        </div>
        
        {/* Wave separator */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg className="w-full h-12 text-white" viewBox="0 0 1440 120" fill="currentColor">
            <path d="M0,64L80,74.7C160,85,320,107,480,112C640,117,800,107,960,96C1120,85,1280,75,1360,69.3L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"></path>
          </svg>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* Introduction Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10 mb-12 border border-gray-200">
          <div className="flex flex-col md:flex-row items-start md:items-center mb-8">
            <div className="bg-gradient-to-r from-blue-100 to-purple-100 p-4 rounded-2xl mb-6 md:mb-0 md:mr-8">
              <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">About <span className="custom-font">Illura</span></h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                <span className="font-semibold custom-font">Illura</span> is a comprehensive digital ecosystem designed specifically for Filipino artists 
                to showcase their creative work, connect with clients, and grow their artistic careers. 
                We provide intuitive tools for portfolio management, community engagement, and professional 
                networking within a supportive, culturally-relevant platform.
              </p>
            </div>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
            <div className="text-center p-6 bg-blue-50 rounded-2xl border border-blue-100">
              <div className="text-3xl font-bold text-blue-700 mb-2">100%</div>
              <div className="font-medium text-gray-900">Dedicated to Filipino Artists</div>
              <p className="text-sm text-gray-600 mt-2">Built for the local creative community</p>
            </div>
            
            <div className="text-center p-6 bg-purple-50 rounded-2xl border border-purple-100">
              <div className="text-3xl font-bold text-purple-700 mb-2">360°</div>
              <div className="font-medium text-gray-900">Complete Artist Support</div>
              <p className="text-sm text-gray-600 mt-2">From portfolio to payment processing</p>
            </div>
            
            <div className="text-center p-6 bg-pink-50 rounded-2xl border border-pink-100">
              <div className="text-3xl font-bold text-pink-700 mb-2">24/7</div>
              <div className="font-medium text-gray-900">Community Engagement</div>
              <p className="text-sm text-gray-600 mt-2">Always connected, always collaborating</p>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Platform Features</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Everything artists need to succeed in the digital creative economy
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group bg-white rounded-2xl shadow-lg p-7 border border-gray-200 hover:border-blue-300 transition-all duration-300 hover:shadow-xl">
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Professional Portfolio Management</h3>
              <p className="text-gray-600 mb-4">
                Create stunning digital portfolios with customizable galleries, organized collections, 
                and detailed artwork descriptions that showcase your unique style and skills.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">Image Galleries</span>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">Custom Categories</span>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">Artist Bio</span>
              </div>
            </div>
            
            {/* Feature 2 */}
            <div className="group bg-white rounded-2xl shadow-lg p-7 border border-gray-200 hover:border-purple-300 transition-all duration-300 hover:shadow-xl">
              <div className="bg-gradient-to-r from-purple-50 to-purple-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Community Engagement</h3>
              <p className="text-gray-600 mb-4">
                Connect with fellow artists and art enthusiasts through comments, likes, direct messaging, 
                and collaborative projects. Build your network and gain valuable feedback.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">Social Interaction</span>
                <span className="px-3 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">Direct Messaging</span>
                <span className="px-3 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">Artist Networks</span>
              </div>
            </div>
            
            {/* Feature 3 */}
            <div className="group bg-white rounded-2xl shadow-lg p-7 border border-gray-200 hover:border-green-300 transition-all duration-300 hover:shadow-xl">
              <div className="bg-gradient-to-r from-green-50 to-green-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Commission & Auction System</h3>
              <p className="text-gray-600 mb-4">
                Monetize your art through customizable commission requests and timed auctions with 
                secure GCash integration designed specifically for Filipino artists and clients.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full">Art Auctions</span>
                <span className="px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full">Commission Requests</span>
                <span className="px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full">GCash Payments</span>
              </div>
            </div>
            
            {/* Feature 4 */}
            <div className="group bg-white rounded-2xl shadow-lg p-7 border border-gray-200 hover:border-yellow-300 transition-all duration-300 hover:shadow-xl">
              <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Advanced Search & Discovery</h3>
              <p className="text-gray-600 mb-4">
                Find artists based on style, medium, and location. 
                Clients can easily discover the perfect artist for their creative projects.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">Style Filters</span>
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">Location-based</span>
              </div>
            </div>
          </div>
        </div>

        {/* Target Audience */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 md:p-10 mb-16 border border-blue-100">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Who Uses <span className="custom-font">Illura</span>?</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              A diverse community united by creativity and collaboration
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Professional Artists",
                description: "Showcase portfolios, find clients, and monetize creative work",
                color: "blue"
              },
              {
                title: "Aspiring Creators",
                description: "Build portfolios, learn from established artists, and grow skills",
                color: "purple"
              },
              {
                title: "Art Clients & Collectors",
                description: "Discover talented artists, commission work, and build collections",
                color: "pink"
              },
              {
                title: "Art Enthusiasts",
                description: "Explore local talent, engage with artists, and support creativity",
                color: "green"
              },
              {
                title: "Cultural Institutions",
                description: "Promote artists, organize exhibitions, and support local arts",
                color: "yellow"
              },
              {
                title: "Art Educators",
                description: "Connect students with opportunities and industry professionals",
                color: "indigo"
              }
            ].map((user, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
                <div className={`bg-${user.color}-100 w-12 h-12 rounded-xl flex items-center justify-center mb-4`}>
                  <svg className={`w-6 h-6 text-${user.color}-600`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{user.title}</h3>
                <p className="text-gray-600 text-sm">{user.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Community Reviews Section - ADDED HERE */}
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10 mb-16 border border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Community Reviews</h2>
              <p className="text-lg text-gray-600">
                What Filipino artists say about their Illura experience
              </p>
            </div>
            
            {stats.totalReviews > 0 && (
              <div className="mt-4 md:mt-0 bg-gradient-to-r from-blue-50 to-purple-50 px-6 py-4 rounded-2xl border border-blue-100">
                <div className="flex items-center">
                  <div className="text-center mr-6">
                    <div className="text-3xl font-bold text-gray-900">{stats.averageRating}</div>
                    <div className="flex justify-center mt-1">
                      {renderStars(Math.round(parseFloat(stats.averageRating)))}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Average Rating</div>
                    <div className="text-lg font-semibold text-gray-900">{stats.totalReviews} reviews</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Rating Breakdown */}
          {stats.totalReviews > 0 && (
            <div className="mb-10">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Rating Distribution</h3>
              <div className="space-y-3 max-w-md">
                {[5, 4, 3, 2, 1].map((rating) => {
                  const ratingData = stats.ratingBreakdown.find(r => r.rating === rating);
                  const count = ratingData ? ratingData.count : 0;
                  const percentage = getBarPercentage(rating);
                  
                  return (
                    <div key={rating} className="flex items-center">
                      <span className="w-12 font-medium text-gray-700">{rating} ★</span>
                      <div className="flex-1 ml-4">
                        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                      <span className="w-20 text-right text-gray-600 text-sm">
                        {count} ({percentage}%)
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Reviews Grid */}
          <div className="mb-8">
            {loadingReviews ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading community reviews...</p>
              </div>
            ) : reviews.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No reviews yet</h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  Be the first to share your Illura experience! Your feedback helps us improve the platform for all Filipino artists.
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {displayedReviews.map((review) => (
                    <div key={review.review_id} className="border border-gray-200 rounded-2xl p-6 hover:shadow-md transition">
                      <div className="flex items-start mb-4">
                        {review.profile_picture ? (
                          <img 
                            src={`http://localhost:5000/uploads/${review.profile_picture}`} 
                            alt={review.username}
                            className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-sm">
                            {review.username?.charAt(0).toUpperCase() || 'U'}
                          </div>
                        )}
                        <div className="ml-4">
                          <h4 className="font-semibold text-gray-900">
                            {review.username || review.username}
                          </h4>
                          <div className="flex items-center mt-1">
                            {renderStars(review.rating)}
                            <span className="text-sm text-gray-500 ml-2">
                              {new Date(review.created_at).toLocaleDateString('en-PH', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {review.review_text && (
                        <p className="text-gray-700 text-sm leading-relaxed">
                          "{review.review_text}"
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                {reviews.length > 6 && (
                  <div className="text-center mt-8">
                    <button
                      onClick={() => setShowAllReviews(!showAllReviews)}
                      className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition"
                    >
                      {showAllReviews ? 'Show Less' : `View All ${reviews.length} Reviews`}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Call to Action */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-100">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Share Your Experience</h3>
                <p className="text-gray-600">
                  Help other Filipino artists discover the platform and contribute to our growing community.
                </p>
              </div>
              <div className="mt-4 md:mt-0">
                <button
                  onClick={() => {
                    // This will trigger the ReviewModal from home.jsx
                    // You'll need to implement navigation or state lifting
                    alert('Go to Home page to leave a review! Reviews can be submitted from the sidebar on the home page.');
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:shadow-lg transition"
                >
                  Leave a Review
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Vision & Mission */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-10 text-white">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl mb-8">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold mb-6">Our Vision</h2>
            <p className="text-xl leading-relaxed mb-8">
              To create a thriving, sustainable ecosystem where Filipino artists can flourish, 
              connect meaningfully with audiences, and build lasting creative careers that 
              contribute to our rich cultural heritage.
            </p>
            <div className="border-t border-white/20 pt-8">
              <p className="text-lg italic">
                "Empowering every artist's journey, from inspiration to recognition"
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;