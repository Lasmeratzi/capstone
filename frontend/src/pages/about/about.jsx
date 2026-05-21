import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../navbar/navbar";
import Footer from "../footer/footer";

const About = () => {
  const navigate = useNavigate();
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
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`text-base ${star <= rating ? 'text-yellow-400' : 'text-gray-200'}`}
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-white dark:bg-[#0A0A0B] text-gray-900 dark:text-gray-400 transition-colors duration-300"
    >
      <Navbar />

      {/* Seamless Hero Section */}
      <div className="relative overflow-hidden flex items-center">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/images/bg0002.webp')" }}
        >
          {/* Horizontal Gradient (Left to Right) for text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 via-30% to-transparent dark:from-[#0A0A0B] dark:via-[#0A0A0B]/80"></div>

          {/* Vertical Gradient (Bottom Up) for seamless transition to content */}
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent dark:from-[#0A0A0B]"></div>

          {/* Artist Credit */}
          <div className="absolute bottom-4 right-6 text-[10px] md:text-xs text-gray-400 dark:text-gray-500 font-medium tracking-wide bg-white/10 dark:bg-black/20 backdrop-blur-sm px-2 py-1 rounded-md border border-white/20 dark:border-gray-800 select-none transition-colors">
            Art by <span className="text-gray-600 dark:text-gray-400">Ralf Martinez</span>
          </div>
        </div>

        <div className="relative w-full px-6 py-20 md:py-32 text-left">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-gray-400 mb-6 leading-tight">
              Empowering the{" "}
              <br className="hidden md:block" />
              <span className="bg-gradient-to-r from-[#5E66FF] to-[#A855F7] bg-clip-text text-transparent">
                Filipino Creative
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-500 dark:text-gray-400 max-w-2xl leading-relaxed">
              Illura is more than just a portfolio—it's a home for local artists
              to grow, connect, and transform their passion into a career.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full px-6 py-16 md:py-24">
        {/* About Card */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-400 mb-6">
              What is <span className="custom-font text-[#5E66FF]">Illura</span>?
            </h2>
            <div className="space-y-6 text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
              <p>
                Founded on the belief that talent should never be limited by lack of
                opportunity, Illura provides Filipino artists with a comprehensive
                digital ecosystem.
              </p>
              <p>
                We bridge the gap between creative expression and professional success,
                offering intuitive tools for portfolio management, secure commission
                handling, and community-driven collaboration.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-6 mt-10">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-gray-400">100%</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold mt-1">Local</div>
              </div>
              <div className="text-center border-x border-gray-100 dark:border-gray-800">
                <div className="text-2xl font-bold text-gray-900 dark:text-gray-400">Secure</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold mt-1">Payments</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-gray-400">Active</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold mt-1">Community</div>
              </div>
            </div>
          </div>

          <div className="relative max-w-md mx-auto lg:ml-auto">
            {/* Decorative Offset Block */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl -z-10 transition-colors"></div>
            <div className="absolute -top-6 -left-6 w-24 h-24 bg-purple-50 dark:bg-purple-900/20 rounded-full blur-2xl opacity-60 dark:opacity-40 -z-10 transition-colors"></div>

            {/* The Image Card */}
            <div className="relative bg-white dark:bg-gray-800 p-2 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 transform hover:rotate-1 transition-all duration-500">
              <div className="relative rounded-xl overflow-hidden aspect-[4/5] sm:aspect-square lg:aspect-[4/5]">
                <img
                  src="/images/bcatmsp.webp"
                  alt="The Illura Vision"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>

                {/* Artist Credit */}
                <div className="absolute bottom-3 right-3 text-[10px] text-gray-400 dark:text-gray-500 font-medium tracking-wide bg-white/10 dark:bg-black/20 backdrop-blur-sm px-2 py-1 rounded-md border border-white/20 dark:border-gray-800 select-none transition-colors">
                  Art by <span className="text-white dark:text-gray-400">Ralf Martinez</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-32">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-400 mb-4">Built for Success</h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
              A suite of professional tools designed to help you manage your artistic business with ease.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Portfolio Management",
                desc: "High-resolution galleries and categorized collections to showcase your best work.",
                icon: (
                  <svg className="w-6 h-6 text-[#5E66FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                )
              },
              {
                title: "Social Networking",
                desc: "Connect with followers, fellow artists, and potential clients through a seamless interface.",
                icon: (
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                )
              },
              {
                title: "Secure Commissions",
                desc: "Manage requests and handle payments securely with our integrated GCash system.",
                icon: (
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                )
              }
            ].map((f, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 p-8 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-xl hover:border-indigo-100 dark:hover:border-indigo-900 transition-all duration-300">
                <div className="w-12 h-12 bg-gray-50 dark:bg-gray-900 rounded-2xl flex items-center justify-center mb-6">
                  {f.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-400 mb-3">{f.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 leading-relaxed text-sm">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Reviews Section */}
        <div className="bg-white dark:bg-gray-800/50 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 shadow-sm p-8 md:p-16 mb-16 transition-colors">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-8">
            <div className="max-w-xl">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-400 mb-4">Community Voice</h2>
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                Hear from the artists and collectors who make Illura a thriving space.
              </p>
            </div>

            {stats.totalReviews > 0 && (
              <div className="flex items-center gap-6 px-8 py-5 bg-gray-50 dark:bg-[#111112] rounded-3xl transition-colors">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900 dark:text-gray-400">{stats.averageRating}</div>
                  {renderStars(Math.round(parseFloat(stats.averageRating)))}
                </div>
                <div className="w-px h-10 bg-gray-200 dark:bg-gray-700"></div>
                <div>
                  <div className="text-sm font-semibold text-gray-900 dark:text-gray-400">{stats.totalReviews} Reviews</div>
                  <div className="text-xs text-gray-400 dark:text-gray-500">Total verified reviews</div>
                </div>
              </div>
            )}
          </div>

          {/* Infinite Moving Marquee for Reviews */}
          <div className="relative -mx-6 overflow-hidden py-10">
            {/* Left and Right Gradient Fades */}
            <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white dark:from-[#0A0A0B] to-transparent z-10"></div>
            <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-white dark:from-[#0A0A0B] to-transparent z-10"></div>

            {loadingReviews ? (
              <div className="flex gap-8 px-6 animate-pulse">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="min-w-[300px] h-48 bg-gray-50 dark:bg-gray-800 rounded-3xl"></div>
                ))}
              </div>
            ) : (
              <div className="flex">
                <motion.div
                  className="flex gap-8 px-6"
                  animate={{ x: [0, "-50%"] }}
                  transition={{
                    duration: 40,
                    repeat: Infinity,
                    ease: "linear",
                    repeatType: "loop"
                  }}
                  style={{ width: "max-content" }}
                >
                  {/* We duplicate the reviews array to create a seamless loop */}
                  {[...reviews, ...reviews].map((review, index) => (
                    <motion.div
                      key={`${review.review_id}-${index}`}
                      whileHover={{ scale: 1.02, backgroundColor: "rgba(255, 255, 255, 0.05)", borderColor: "#5E66FF" }}
                      className="min-w-[320px] max-w-[320px] p-8 rounded-3xl border border-gray-50 dark:border-gray-700 bg-gray-50/40 dark:bg-gray-800/40 shadow-sm transition-all duration-300"
                    >
                      <div className="flex items-center gap-3 mb-5">
                        {review.profile_picture ? (
                          <img
                            src={`http://localhost:5000/uploads/${review.profile_picture}`}
                            alt={review.username}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-[#5E66FF] font-bold">
                            {review.username?.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <div className="text-sm font-bold text-gray-900 dark:text-gray-400">{review.username}</div>
                          <div className="flex gap-0.5">{renderStars(review.rating)}</div>
                        </div>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 text-sm italic leading-relaxed line-clamp-3 transition-colors">
                        "{review.review_text}"
                      </p>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            )}
          </div>

          {reviews.length > 6 && (
            <div className="text-center">
              <button
                onClick={() => setShowAllReviews(!showAllReviews)}
                className="text-sm font-bold text-[#5E66FF] hover:text-[#4D5BFF] transition-colors"
              >
                {showAllReviews ? "Show Less" : `View all ${reviews.length} reviews`}
              </button>
            </div>
          )}
        </div>

        {/* Vision Section */}
        <div className="relative bg-[#00040d] rounded-[3rem] p-10 md:p-20 overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#5E66FF]/20 blur-[120px] rounded-full"></div>
          <div className="relative z-10 max-w-2xl text-center mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">Our Vision</h2>
            <p className="text-xl text-gray-400 leading-relaxed font-light mb-10">
              To create a world where every Filipino artist has the digital space
              they deserve to flourish, innovate, and lead the future of creativity.
            </p>
            <div className="w-12 h-1 bg-gradient-to-r from-[#5E66FF] to-transparent mx-auto rounded-full"></div>
          </div>
        </div>
      </div>

      <Footer />
    </motion.div>
  );
};

export default About;