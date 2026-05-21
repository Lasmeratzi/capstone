import React from "react";
import { motion } from "framer-motion";
import Navbar from "../navbar/navbar";
import Footer from "../footer/footer";

const Terms = () => {
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
          style={{ backgroundImage: "url('/images/bg0003.compressed.webp')" }}
        >
          {/* Horizontal Gradient (Left to Right) for text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 via-30% to-transparent dark:from-[#0A0A0B] dark:via-[#0A0A0B]/80"></div>

          {/* Vertical Gradient (Bottom Up) for seamless transition to content */}
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent dark:from-[#0A0A0B]"></div>

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
              Terms of{" "}
              <br className="hidden md:block" />
              <span className="bg-gradient-to-r from-[#5E66FF] to-[#A855F7] bg-clip-text text-transparent">
                Service
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-500 dark:text-gray-400 max-w-2xl leading-relaxed">
              Understanding our platform policies ensures a safe and supportive environment for all creators.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main Content with Sticky Sidebar */}
      <div className="w-full px-6 py-16 md:py-24">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-16">

          {/* Sticky Sidebar Navigation */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-4">
              <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-6">Contents</h3>
              <nav className="flex flex-col space-y-1">
                {[
                  { name: "Platform Agreement", id: "agreement" },
                  { name: "User Responsibilities", id: "responsibilities" },
                  { name: "Intellectual Property", id: "ip" },
                  { name: "Payments & Commissions", id: "payments" }
                ].map((item, i) => (
                  <button
                    key={i}
                    onClick={() => document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' })}
                    className="text-left py-2 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-[#5E66FF] transition-colors flex items-center gap-3 group cursor-pointer"
                  >
                    <span className="w-6 h-px bg-gray-200 dark:bg-gray-800 group-hover:bg-[#5E66FF] transition-colors"></span>
                    {item.name}
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* Policy Sections */}
          <div className="space-y-24">
            {/* Section 1: Introduction */}
            <section id="agreement">
              <div className="max-w-3xl">
                <div className="flex items-center gap-4 mb-8">
                  <span className="text-[10px] font-bold text-[#5E66FF] uppercase tracking-widest">Section 01</span>
                  <div className="h-px flex-1 bg-gray-100 dark:bg-gray-800"></div>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-400 mb-8">Platform Agreement</h2>
                <div className="prose prose-indigo prose-lg text-gray-600 dark:text-gray-400 leading-relaxed space-y-6 transition-colors">
                  <p>
                    By accessing or using <span className="font-semibold text-gray-900 dark:text-gray-400">Illura</span>, you agree to be bound by these Terms of Service.
                    These terms govern your relationship with our platform and provide a framework for
                    your creative journey.
                  </p>
                  <p>
                    We reserve the right to update these terms as our platform evolves. Continued use
                    of Illura constitutes acceptance of any changes made to maintain community safety.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 2: User Responsibilities */}
            <section id="responsibilities">
              <div className="max-w-3xl">
                <div className="flex items-center gap-4 mb-8">
                  <span className="text-[10px] font-bold text-purple-600 uppercase tracking-widest">Section 02</span>
                  <div className="h-px flex-1 bg-gray-100 dark:bg-gray-800"></div>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-400 mb-8">User Responsibilities</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  {[
                    {
                      title: "Eligibility",
                      desc: "Users must be at least 13 years old. Users under 18 require parental supervision."
                    },
                    {
                      title: "Account Security",
                      desc: "You are responsible for maintaining the confidentiality of your account details."
                    },
                    {
                      title: "Accurate Information",
                      desc: "Artists and clients must provide truthful information regarding identity and work."
                    },
                    {
                      title: "Prohibited Conduct",
                      desc: "Harassment, plagiarism, and illegal content result in permanent suspension."
                    }
                  ].map((item, i) => (
                    <div key={i} className="group">
                      <h3 className="font-bold text-gray-900 dark:text-gray-400 mb-3 group-hover:text-[#5E66FF] transition-colors">{item.title}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Section 3: Intellectual Property */}
            <section id="ip">
              <div className="max-w-3xl">
                <div className="flex items-center gap-4 mb-8">
                  <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">Section 03</span>
                  <div className="h-px flex-1 bg-gray-100 dark:bg-gray-800"></div>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-400 mb-8">Intellectual Property</h2>
                <div className="bg-gray-50/50 dark:bg-gray-800/50 rounded-3xl p-8 border border-gray-100 dark:border-gray-700 transition-colors">
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    Artists retain full ownership of their work. By posting on Illura, you grant us a non-exclusive
                    license to display your artwork for platform promotion purposes. We will always credit the
                    artist and will never sell your work to third parties without your explicit consent.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 4: Payments */}
            <section id="payments">
              <div className="max-w-3xl">
                <div className="flex items-center gap-4 mb-8">
                  <span className="text-[10px] font-bold text-green-600 uppercase tracking-widest">Section 04</span>
                  <div className="h-px flex-1 bg-gray-100 dark:bg-gray-800"></div>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-400 mb-8">Payments & Commissions</h2>
                <div className="space-y-6">
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    All financial transactions on Illura are handled through secure third-party providers.
                    While we facilitate the connection between artists and clients, Illura is not a party
                    to individual commission contracts.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm transition-colors">
                      <h4 className="font-bold text-gray-900 dark:text-gray-400 mb-2">GCash Integration</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-500">Secure transactions via GCash for local artists.</p>
                    </div>
                    <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm transition-colors">
                      <h4 className="font-bold text-gray-900 dark:text-gray-400 mb-2">Refund Policy</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-500">Subject to individual artist terms and agreements.</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>

      <Footer />
    </motion.div>
  );
};

export default Terms;