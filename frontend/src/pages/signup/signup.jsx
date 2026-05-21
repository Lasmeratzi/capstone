import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun, faMoon, faCheck, faChevronLeft, faChevronRight, faUser, faLock, faEnvelope, faCamera, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import TermsModal from "../../components/modals/TermsModal";
import PrivacyModal from "../../components/modals/PrivacyModal";

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullname: "",
    username: "",
    password: "",
    email: "",
    birthdate: "",
  });
  const [pfp, setPfp] = useState(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  });
  
  // Modal states
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const steps = [
    { number: 1, title: "Identity", desc: "Basic details" },
    { number: 2, title: "Security", desc: "Access & Login" },
    { number: 3, title: "Presence", desc: "Profile setup" },
    { number: 4, title: "Confirm", desc: "Final review" }
  ];

  const validatePassword = (password) => {
    const validation = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
    };
    setPasswordValidation(validation);
    
    const commonPasswords = ['password', 'password123', '123456', 'qwerty'];
    if (commonPasswords.includes(password.toLowerCase())) return "Password is too common.";
    if (/(.)\1{3,}/.test(password)) return "Too many repeated characters.";
    return null;
  };

  const validateStep = (step) => {
    const newErrors = {};
    if (step === 1) {
      if (!formData.fullname.trim()) newErrors.fullname = "Full name is required";
      if (!formData.birthdate) newErrors.birthdate = "Birthdate is required";
    }
    if (step === 2) {
      if (!formData.email.trim()) newErrors.email = "Email is required";
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email format";
      if (!formData.username.trim()) newErrors.username = "Username is required";
      if (!formData.password) newErrors.password = "Password is required";
      else {
        const passError = validatePassword(formData.password);
        if (passError) newErrors.password = passError;
        else if (!Object.values(passwordValidation).every(v => v)) newErrors.password = "Password must meet all requirements";
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) setCurrentStep(prev => prev + 1);
  };

  const prevStep = () => setCurrentStep(prev => prev - 1);

  const handleSignUp = async (e) => {
    if (e) e.preventDefault();
    if (!validateStep(currentStep)) return;
    if (!termsAccepted) {
      alert("Please accept the Terms and Conditions.");
      return;
    }

    setLoading(true);
    try {
      const data = new FormData();
      for (const key in formData) {
        data.append(key, formData[key]);
      }
      if (pfp) data.append("pfp", pfp);

      const response = await axios.post("http://localhost:5000/api/signup", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 201) {
        navigate("/login");
      }
    } catch (error) {
      alert("Failed to sign up. Please check your details.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
    if (id === "password") validatePassword(value);
    if (errors[id]) setErrors(prev => ({ ...prev, [id]: "" }));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setPfp(selectedFile);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Personal Identity</h2>
              <p className="text-gray-500 mt-1">Tell us who you are.</p>
            </div>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-400">Full Name</label>
                <div className="relative">
                  <FontAwesomeIcon icon={faUser} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 text-sm" />
                  <input
                    type="text"
                    id="fullname"
                    value={formData.fullname}
                    onChange={handleChange}
                    className={`w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-white/[0.03] border ${errors.fullname ? "border-red-500" : "border-gray-200 dark:border-white/10"} rounded-xl focus:ring-2 focus:ring-[#5E66FF] focus:outline-none dark:text-white transition-all`}
                    placeholder="Enter your full name"
                  />
                </div>
                {errors.fullname && <p className="text-xs text-red-500">{errors.fullname}</p>}
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-400">Birthdate</label>
                <input
                  type="date"
                  id="birthdate"
                  value={formData.birthdate}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-gray-50 dark:bg-white/[0.03] border ${errors.birthdate ? "border-red-500" : "border-gray-200 dark:border-white/10"} rounded-xl focus:ring-2 focus:ring-[#5E66FF] focus:outline-none dark:text-white transition-all`}
                />
                {errors.birthdate && <p className="text-xs text-red-500">{errors.birthdate}</p>}
              </div>
            </div>
          </motion.div>
        );
      case 2:
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Security & Login</h2>
              <p className="text-gray-500 mt-1">Keep your account safe.</p>
            </div>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-400">Email Address</label>
                <div className="relative">
                  <FontAwesomeIcon icon={faEnvelope} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 text-sm" />
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-[#5E66FF] focus:outline-none dark:text-white transition-all"
                    placeholder="name@example.com"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-400">Username</label>
                <input
                  type="text"
                  id="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-[#5E66FF] focus:outline-none dark:text-white transition-all"
                  placeholder="Choose a unique username"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-400">Password</label>
                <div className="relative">
                  <FontAwesomeIcon icon={faLock} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 text-sm" />
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-11 pr-12 py-3 bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-[#5E66FF] focus:outline-none dark:text-white transition-all"
                    placeholder="Create a strong password"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer">
                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                  </button>
                </div>
                
                {/* Real-time Password Validation Checklist */}
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-2 p-4 bg-gray-50 dark:bg-white/[0.02] rounded-xl border border-gray-100 dark:border-white/5">
                  <div className={`flex items-center gap-2 text-xs font-medium transition-colors ${passwordValidation.length ? 'text-green-600 dark:text-green-400' : 'text-gray-400 dark:text-gray-600'}`}>
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center border ${passwordValidation.length ? 'bg-green-100 border-green-500' : 'border-gray-300 dark:border-gray-700'}`}>
                      {passwordValidation.length && <FontAwesomeIcon icon={faCheck} className="text-[8px]" />}
                    </div>
                    <span>At least 8 characters</span>
                  </div>
                  <div className={`flex items-center gap-2 text-xs font-medium transition-colors ${passwordValidation.uppercase ? 'text-green-600 dark:text-green-400' : 'text-gray-400 dark:text-gray-600'}`}>
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center border ${passwordValidation.uppercase ? 'bg-green-100 border-green-500' : 'border-gray-300 dark:border-gray-700'}`}>
                      {passwordValidation.uppercase && <FontAwesomeIcon icon={faCheck} className="text-[8px]" />}
                    </div>
                    <span>Uppercase letter (A-Z)</span>
                  </div>
                  <div className={`flex items-center gap-2 text-xs font-medium transition-colors ${passwordValidation.number ? 'text-green-600 dark:text-green-400' : 'text-gray-400 dark:text-gray-600'}`}>
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center border ${passwordValidation.number ? 'bg-green-100 border-green-500' : 'border-gray-300 dark:border-gray-700'}`}>
                      {passwordValidation.number && <FontAwesomeIcon icon={faCheck} className="text-[8px]" />}
                    </div>
                    <span>At least one number</span>
                  </div>
                  <div className={`flex items-center gap-2 text-xs font-medium transition-colors ${passwordValidation.special ? 'text-green-600 dark:text-green-400' : 'text-gray-400 dark:text-gray-600'}`}>
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center border ${passwordValidation.special ? 'bg-green-100 border-green-500' : 'border-gray-300 dark:border-gray-700'}`}>
                      {passwordValidation.special && <FontAwesomeIcon icon={faCheck} className="text-[8px]" />}
                    </div>
                    <span>Special character (!@#)</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        );
      case 3:
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Profile Presence</h2>
              <p className="text-gray-500 mt-1">Add a face to your creative profile.</p>
            </div>
            <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-200 dark:border-white/10 rounded-2xl bg-gray-50 dark:bg-white/[0.02]">
              <div className="relative group">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 flex items-center justify-center border-4 border-white dark:border-[#111112] shadow-xl">
                  {pfp ? (
                    <img src={URL.createObjectURL(pfp)} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <FontAwesomeIcon icon={faUser} className="text-4xl text-gray-400" />
                  )}
                </div>
                <label className="absolute bottom-0 right-0 w-10 h-10 bg-[#5E66FF] text-white rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:scale-110 transition-all">
                  <FontAwesomeIcon icon={faCamera} className="text-sm" />
                  <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                </label>
              </div>
              <p className="mt-4 text-sm text-gray-500">Square images work best. Max 5MB.</p>
            </div>
          </motion.div>
        );
      case 4:
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Final Review</h2>
              <p className="text-gray-500 mt-1">Verify your information before joining.</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 dark:bg-white/[0.03] rounded-xl border border-gray-100 dark:border-white/10">
                <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Full Name</p>
                <p className="font-medium dark:text-white">{formData.fullname}</p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-white/[0.03] rounded-xl border border-gray-100 dark:border-white/10">
                <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Username</p>
                <p className="font-medium dark:text-white">@{formData.username}</p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-white/[0.03] rounded-xl border border-gray-100 dark:border-white/10 col-span-2">
                <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Email</p>
                <p className="font-medium dark:text-white">{formData.email}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-indigo-50/50 dark:bg-indigo-900/20 rounded-xl border border-indigo-100 dark:border-indigo-900/50">
              <input
                type="checkbox"
                id="terms"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="mt-1 w-4 h-4 text-[#5E66FF] rounded border-gray-300 focus:ring-[#5E66FF]"
              />
              <label htmlFor="terms" className="text-sm text-gray-600 dark:text-gray-400">
                I agree to the <button type="button" onClick={() => setShowTermsModal(true)} className="text-[#5E66FF] font-semibold hover:underline">Terms of Service</button> and <button type="button" onClick={() => setShowPrivacyModal(true)} className="text-[#5E66FF] font-semibold hover:underline">Privacy Policy</button>.
              </label>
            </div>
          </motion.div>
        );
      default: return null;
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-screen flex bg-white dark:bg-[#0A0A0B] transition-colors duration-300 relative overflow-hidden">
      {/* Theme Toggle */}
      <div className="absolute top-6 right-6 z-50">
        <button onClick={() => setDarkMode(!darkMode)} className="w-12 h-12 flex items-center justify-center rounded-full bg-white/90 dark:bg-[#111112]/90 backdrop-blur-lg border border-gray-200 dark:border-gray-800 shadow-xl cursor-pointer hover:scale-110 hover:text-[#5E66FF] transition-all text-gray-600 dark:text-gray-400">
          <FontAwesomeIcon icon={darkMode ? faSun : faMoon} className="text-xl" />
        </button>
      </div>

      {/* Left Branding Panel (No background version) */}
      <div className="hidden lg:flex lg:w-[40%] flex-col justify-between p-12 bg-gray-50 dark:bg-[#0A0A0B] border-r border-gray-200 dark:border-white/5 transition-colors">
        <div className="flex items-center space-x-4">
          <img src="/illura.png" alt="Logo" className="w-12 h-12" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white custom-font">Illura</h1>
        </div>

        <div className="space-y-6">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white leading-tight">Start your creative<br/>journey with us.</h2>
          <p className="text-lg text-gray-500 dark:text-gray-400">Connect with fellow artists, showcase your portfolio, and grow your career in a dedicated local community.</p>
          <div className="pt-8 flex flex-col space-y-4">
            {steps.map((s) => (
              <div key={s.number} className="flex items-center space-x-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold transition-all ${currentStep >= s.number ? 'bg-[#5E66FF] text-white shadow-lg shadow-indigo-200 dark:shadow-none' : 'bg-gray-200 dark:bg-gray-800 text-gray-400'}`}>
                  {currentStep > s.number ? <FontAwesomeIcon icon={faCheck} className="text-sm" /> : s.number}
                </div>
                <div>
                  <p className={`text-sm font-bold ${currentStep >= s.number ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}>{s.title}</p>
                  <p className="text-xs text-gray-500">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-gray-400">© 2026 Illura platform. All rights reserved.</p>
      </div>

      {/* Right Form Panel */}
      <div className="w-full lg:w-[60%] flex flex-col relative overflow-y-auto">
        <div className="flex-1 flex items-center justify-center p-8 md:p-16">
          <div className="w-full max-w-[480px]">
            <div className="mb-10 lg:hidden flex items-center justify-center gap-3">
              <img src="/illura.png" alt="Logo" className="w-10 h-10" />
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white custom-font">Illura</h1>
            </div>

            <form onSubmit={(e) => e.preventDefault()} className="space-y-8">
              {renderStep()}

              <div className="flex items-center justify-between pt-6 border-t border-gray-100 dark:border-white/10">
                {currentStep > 1 ? (
                  <button type="button" onClick={prevStep} className="px-6 py-3 text-gray-600 dark:text-gray-400 font-bold hover:text-gray-900 dark:hover:text-white transition-all flex items-center gap-2 cursor-pointer">
                    <FontAwesomeIcon icon={faChevronLeft} /> Back
                  </button>
                ) : (
                  <div />
                )}

                {currentStep < steps.length ? (
                  <button type="button" onClick={nextStep} className="px-8 py-3 bg-[#5E66FF] text-white font-bold rounded-xl hover:bg-[#4D5BFF] transition-all shadow-lg shadow-indigo-100 dark:shadow-none flex items-center gap-2 cursor-pointer">
                    Next <FontAwesomeIcon icon={faChevronRight} />
                  </button>
                ) : (
                  <button type="button" onClick={handleSignUp} disabled={loading || !termsAccepted} className={`px-10 py-3 bg-[#5E66FF] text-white font-bold rounded-xl hover:bg-[#4D5BFF] transition-all shadow-lg shadow-indigo-200 dark:shadow-none flex items-center gap-2 ${(loading || !termsAccepted) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
                    {loading ? "Creating..." : "Complete Sign Up"}
                  </button>
                )}
              </div>
            </form>

            <p className="mt-12 text-center text-sm text-gray-500">
              Already have an account? <Link to="/login" className="text-[#5E66FF] font-bold hover:underline">Log in</Link>
            </p>
          </div>
        </div>
      </div>

      <TermsModal isOpen={showTermsModal} onClose={() => setShowTermsModal(false)} onAccept={() => setTermsAccepted(true)} />
      <PrivacyModal isOpen={showPrivacyModal} onClose={() => setShowPrivacyModal(false)} />
    </motion.div>
  );
};

export default SignUp;