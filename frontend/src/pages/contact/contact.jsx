import React, { useState } from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faMessage, faPalette, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import Navbar from "../navbar/navbar";
import Footer from "../footer/footer";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "General Inquiry",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setFormData({ name: "", email: "", subject: "General Inquiry", message: "" });
    }, 1500);
  };

  const contactMethods = [
    {
      icon: faMessage,
      title: "General Inquiries",
      desc: "Questions about using the platform or our community.",
      email: "hello@illura.art",
      color: "text-blue-500"
    },
    {
      icon: faPalette,
      title: "Artist Support",
      desc: "Need help with your portfolio or commission settings?",
      email: "support@illura.art",
      color: "text-purple-500"
    },
    {
      icon: faPaperPlane,
      title: "Partnerships",
      desc: "Local organizations and galleries looking to collaborate.",
      email: "collab@illura.art",
      color: "text-emerald-500"
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-white dark:bg-[#0A0A0B] text-gray-900 dark:text-gray-400 transition-colors duration-300"
    >
      <Navbar />

      {/* Hero Section */}
      <div className="relative overflow-hidden flex items-center">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/images/bg0004.compressed.webp')" }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 via-30% to-transparent dark:from-[#0A0A0B] dark:via-[#0A0A0B]/80"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent dark:from-[#0A0A0B]"></div>

          <div className="absolute bottom-4 right-6 text-[10px] md:text-xs text-gray-400 dark:text-gray-500 font-medium tracking-wide bg-white/10 dark:bg-black/20 backdrop-blur-sm px-2 py-1 rounded-md border border-white/20 dark:border-gray-800 select-none">
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
              Let's Start a{" "}
              <br className="hidden md:block" />
              <span className="bg-gradient-to-r from-[#5E66FF] to-[#A855F7] bg-clip-text text-transparent">
                Conversation
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-500 dark:text-gray-400 max-w-2xl leading-relaxed">
              Whether you're an artist seeking a home or a collector looking for
              your next masterpiece, we're here to help you navigate the Illura community.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full px-6 py-16 md:py-24 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-24">
          {contactMethods.map((method, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-8 bg-gray-50 dark:bg-gray-800/40 rounded-[2rem] border border-gray-100 dark:border-gray-800 hover:border-[#5E66FF] transition-all group"
            >
              <div className={`w-12 h-12 rounded-2xl bg-white dark:bg-gray-800 shadow-sm flex items-center justify-center mb-6 ${method.color}`}>
                <FontAwesomeIcon icon={method.icon} className="text-xl" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-200 mb-3">{method.title}</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-6">
                {method.desc}
              </p>
              <a href={`mailto:${method.email}`} className="text-[#5E66FF] font-bold text-sm hover:underline flex items-center gap-2">
                {method.email}
              </a>
            </motion.div>
          ))}
        </div>

        {/* Contact Form Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-200 mb-4">Send us a message</h2>
              <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                Fill out the form and our team will get back to you within 24-48 hours.
                For faster support, check our FAQ section.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-[#5E66FF]">
                  <FontAwesomeIcon icon={faEnvelope} />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Email Us</p>
                  <p className="text-gray-900 dark:text-gray-300 font-medium">hello@illura.art</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800/20 p-8 md:p-12 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-2xl shadow-gray-200/50 dark:shadow-none">
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">
                  <FontAwesomeIcon icon={faPaperPlane} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Message Sent!</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-8">Thank you for reaching out. We'll be in touch soon.</p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="text-[#5E66FF] font-bold hover:underline"
                >
                  Send another message
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-gray-700 dark:text-gray-400 ml-1">Your Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-900/50 border border-transparent focus:border-[#5E66FF] focus:ring-4 focus:ring-[#5E66FF]/5 rounded-2xl focus:outline-none dark:text-white transition-all"
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-gray-700 dark:text-gray-400 ml-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-900/50 border border-transparent focus:border-[#5E66FF] focus:ring-4 focus:ring-[#5E66FF]/5 rounded-2xl focus:outline-none dark:text-white transition-all"
                      placeholder="name@example.com"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-gray-700 dark:text-gray-400 ml-1">Subject</label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-900/50 border border-transparent focus:border-[#5E66FF] focus:ring-4 focus:ring-[#5E66FF]/5 rounded-2xl focus:outline-none dark:text-white transition-all appearance-none"
                  >
                    <option>General Inquiry</option>
                    <option>Artist Verification</option>
                    <option>Technical Support</option>
                    <option>Business Collaboration</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-gray-700 dark:text-gray-400 ml-1">Message</label>
                  <textarea
                    required
                    rows="5"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-900/50 border border-transparent focus:border-[#5E66FF] focus:ring-4 focus:ring-[#5E66FF]/5 rounded-2xl focus:outline-none dark:text-white transition-all resize-none"
                    placeholder="Tell us how we can help..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-[#5E66FF] text-white font-bold rounded-2xl shadow-xl shadow-indigo-200 dark:shadow-none hover:bg-[#4D5BFF] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faPaperPlane} className="text-sm" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </motion.div>
  );
};

export default Contact;
