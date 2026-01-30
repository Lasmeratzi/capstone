import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
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

  const steps = [
    { number: 1, title: "Personal Info" },
    { number: 2, title: "Account Details" },
    { number: 3, title: "Profile Setup" },
    { number: 4, title: "Review & Submit" }
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
    
    // Check for common weak passwords
    const commonPasswords = [
      'password', 'password123', '123456', '12345678', '123456789',
      'qwerty', 'abc123', 'letmein', 'monkey', 'football'
    ];
    
    if (commonPasswords.includes(password.toLowerCase())) {
      return "Password is too common. Please choose a more unique password.";
    }
    
    // Check for repeated characters
    if (/(.)\1{3,}/.test(password)) {
      return "Password contains too many repeated characters.";
    }
    
    // Check for sequential characters
    if (/(123|234|345|456|567|678|789|abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz)/i.test(password)) {
      return "Password contains sequential characters that are easy to guess.";
    }
    
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
      else if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = "Invalid email format";
      
      if (!formData.username.trim()) newErrors.username = "Username is required";
      
      if (!formData.password) {
        newErrors.password = "Password is required";
      } else {
        const passwordError = validatePassword(formData.password);
        if (passwordError) {
          newErrors.password = passwordError;
        } else if (!Object.values(passwordValidation).every(v => v)) {
          newErrors.password = "Password does not meet all requirements";
        }
      }
    }
    
    if (step === 3 && pfp && !pfp.type.startsWith("image/")) {
      newErrors.pfp = "Please upload a valid image file";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!termsAccepted) {
      alert("You must agree to the Terms and Conditions to sign up.");
      return;
    }

    if (!validateStep(currentStep)) return;

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
        alert("Sign-up successful! Please log in to continue.");
        navigate("/login");
      }
    } catch (error) {
      // Handle backend validation errors
      if (error.response?.status === 400 && error.response?.data?.errors) {
        const backendErrors = error.response.data.errors;
        alert(`Password validation failed:\n${backendErrors.join('\n')}`);
      } else {
        const message =
          error.response?.status === 400
            ? "Validation failed. Please check your inputs."
            : error.response?.status === 500
            ? "Server error. Please try again later."
            : "Failed to sign up. Please try again.";
        alert(message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
    
    // Validate password in real-time
    if (id === "password") {
      validatePassword(value);
    }
    
    // Clear error when user starts typing
    if (errors[id]) {
      setErrors(prev => ({ ...prev, [id]: "" }));
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setPfp(selectedFile);
    if (errors.pfp) {
      setErrors(prev => ({ ...prev, pfp: "" }));
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Personal Information</h2>
              <p className="text-gray-600 mt-2">Let's start with your basic details</p>
            </div>
            
            <div className="space-y-5">
              <div>
                <label htmlFor="fullname" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="fullname"
                  value={formData.fullname}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${errors.fullname ? "border-red-500" : "border-gray-300"}`}
                  placeholder="John Doe"
                  required
                />
                {errors.fullname && <p className="mt-2 text-sm text-red-600 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.fullname}
                </p>}
              </div>
              
              <div>
                <label htmlFor="birthdate" className="block text-sm font-medium text-gray-700 mb-2">
                  Birthdate <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  id="birthdate"
                  value={formData.birthdate}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${errors.birthdate ? "border-red-500" : "border-gray-300"}`}
                  required
                />
                {errors.birthdate && <p className="mt-2 text-sm text-red-600 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.birthdate}
                </p>}
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Account Details</h2>
              <p className="text-gray-600 mt-2">Set up your login credentials</p>
            </div>
            
            <div className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${errors.email ? "border-red-500" : "border-gray-300"}`}
                  placeholder="your@email.com"
                  required
                />
                {errors.email && <p className="mt-2 text-sm text-red-600 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.email}
                </p>}
              </div>
              
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                  Username <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="username"
                  value={formData.username}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${errors.username ? "border-red-500" : "border-gray-300"}`}
                  placeholder="johndoe123"
                  required
                />
                {errors.username && <p className="mt-2 text-sm text-red-600 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.username}
                </p>}
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${errors.password ? "border-red-500" : "border-gray-300"}`}
                    placeholder="Create a secure password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.59 6.59m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    )}
                  </button>
                </div>
                
                {errors.password && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.password}
                  </p>
                )}
                
                {/* Password Requirements Checklist */}
                {formData.password && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-700 mb-3">Password Requirements:</p>
                    <div className="space-y-2">
                      {[
                        { key: 'length', label: 'At least 8 characters', met: passwordValidation.length },
                        { key: 'uppercase', label: 'One uppercase letter (A-Z)', met: passwordValidation.uppercase },
                        { key: 'lowercase', label: 'One lowercase letter (a-z)', met: passwordValidation.lowercase },
                        { key: 'number', label: 'One number (0-9)', met: passwordValidation.number },
                        { key: 'special', label: 'One special character (!@#$ etc.)', met: passwordValidation.special },
                      ].map(req => (
                        <div key={req.key} className="flex items-center">
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center mr-3 ${req.met ? 'bg-green-500' : 'bg-gray-300'}`}>
                            {req.met ? (
                              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                              </svg>
                            ) : null}
                          </div>
                          <span className={`text-sm ${req.met ? 'text-green-600 font-medium' : 'text-gray-500'}`}>
                            {req.label}
                          </span>
                        </div>
                      ))}
                    </div>
                    
                    {/* Strength Indicator */}
                    {formData.password.length > 0 && (
                      <div className="mt-4">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-gray-600">Password Strength:</span>
                          <span className={`font-medium ${
                            Object.values(passwordValidation).filter(v => v).length >= 4 ? 'text-green-600' :
                            Object.values(passwordValidation).filter(v => v).length >= 3 ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                            {Object.values(passwordValidation).filter(v => v).length >= 4 ? 'Strong' :
                             Object.values(passwordValidation).filter(v => v).length >= 3 ? 'Medium' : 'Weak'}
                          </span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-300 ${
                              Object.values(passwordValidation).filter(v => v).length >= 4 ? 'bg-green-500' :
                              Object.values(passwordValidation).filter(v => v).length >= 3 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${(Object.values(passwordValidation).filter(v => v).length / 5) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Profile Setup</h2>
              <p className="text-gray-600 mt-2">Customize your profile (optional)</p>
            </div>
            
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Profile Picture
                </label>
                <div className="flex items-center space-x-6">
                  <div className={`w-24 h-24 rounded-full border-2 ${errors.pfp ? 'border-red-500' : 'border-gray-300'} flex items-center justify-center overflow-hidden bg-gray-50`}>
                    {pfp ? (
                      <img 
                        src={URL.createObjectURL(pfp)} 
                        alt="Preview" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center p-4">
                        <svg className="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span className="text-xs text-gray-500">No image</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <label className="cursor-pointer">
                      <div className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition text-center">
                        {pfp ? "Change Picture" : "Upload Picture"}
                      </div>
                      <input
                        type="file"
                        id="pfp"
                        onChange={handleFileChange}
                        className="hidden"
                        accept="image/*"
                      />
                    </label>
                    {errors.pfp && <p className="mt-2 text-sm text-red-600">{errors.pfp}</p>}
                    <p className="mt-2 text-xs text-gray-500">
                      Recommended: Square image, JPG or PNG, max 2MB
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Review & Submit</h2>
              <p className="text-gray-600 mt-2">Confirm your information before creating your account</p>
            </div>
            
            <div className="space-y-4">
              {/* Personal Info Card */}
              <div className="bg-white border border-gray-200 rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Personal Information</h3>
                  <button 
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Edit
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Full Name</p>
                    <p className="font-medium">{formData.fullname}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Birthdate</p>
                    <p className="font-medium">{formData.birthdate || "Not provided"}</p>
                  </div>
                </div>
              </div>
              
              {/* Account Details Card */}
              <div className="bg-white border border-gray-200 rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Account Details</h3>
                  <button 
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Edit
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{formData.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Username</p>
                    <p className="font-medium">{formData.username}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-gray-500">Password</p>
                    <p className="font-medium text-gray-400">••••••••••</p>
                  </div>
                </div>
              </div>
              
              {/* Profile Card */}
              <div className="bg-white border border-gray-200 rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Profile</h3>
                  <button 
                    type="button"
                    onClick={() => setCurrentStep(3)}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Edit
                  </button>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden">
                    {pfp ? (
                      <img 
                        src={URL.createObjectURL(pfp)} 
                        alt="Preview" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Profile Picture</p>
                    <p className="font-medium">{pfp ? pfp.name : "Not provided"}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Terms & Conditions */}
            <div className="pt-4 border-t border-gray-200">
              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="terms"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="mt-1 w-5 h-5 border-2 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                />
                <label htmlFor="terms" className="ml-3 text-sm text-gray-700">
                  I agree to the{" "}
                  <button
                    type="button"
                    onClick={() => setShowTermsModal(true)}
                    className="text-blue-600 hover:text-blue-800 font-medium underline"
                  >
                    Terms and Conditions
                  </button>{" "}
                  and{" "}
                  <button
                    type="button"
                    onClick={() => setShowPrivacyModal(true)}
                    className="text-blue-600 hover:text-blue-800 font-medium underline"
                  >
                    Privacy Policy
                  </button>
                </label>
              </div>
              {!termsAccepted && currentStep === 4 && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  You must agree to the terms to create your account
                </p>
              )}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center p-4"
      style={{ 
        backgroundImage: "url('src/assets/images/kdaBG.jpeg')",
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}>
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl w-full max-w-4xl overflow-hidden">
        {/* Progress Steps */}
        <div className="px-8 pt-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Create Account</h1>
            <div className="text-sm text-gray-500">
              Step {currentStep} of {steps.length}
            </div>
          </div>
          
          {/* Step Indicators */}
          <div className="flex justify-between mb-10 relative">
            <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200 -z-10"></div>
            {steps.map((step, index) => (
              <div key={step.number} className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 transition-all duration-300 ${
                  currentStep > step.number 
                    ? 'bg-blue-600 text-white' 
                    : currentStep === step.number 
                    ? 'bg-white border-2 border-blue-600 text-blue-600 shadow-md' 
                    : 'bg-white border-2 border-gray-300 text-gray-400'
                }`}>
                  {currentStep > step.number ? (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <span className="text-sm font-medium">{step.number}</span>
                  )}
                </div>
                <span className={`text-xs font-medium ${
                  currentStep >= step.number ? 'text-gray-900' : 'text-gray-400'
                }`}>
                  {step.title}
                </span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Form Content */}
        <div className="px-8 pb-8">
          {renderStep()}
        </div>
        
        {/* Navigation Buttons */}
        <div className="px-8 py-6 border-t border-gray-100 bg-gray-50/50">
          <div className="flex justify-between">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={prevStep}
                className="px-6 py-3 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-medium rounded-lg transition flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
                Back
              </button>
            ) : (
              <div></div>
            )}
            
            {currentStep < steps.length ? (
              <button
                type="button"
                onClick={nextStep}
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition flex items-center"
              >
                Continue
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ) : (
              <button
                type="submit"
                onClick={handleSignUp}
                disabled={loading || !termsAccepted}
                className={`px-8 py-3 rounded-lg font-medium transition flex items-center ${
                  loading || !termsAccepted
                    ? 'bg-blue-400 cursor-not-allowed text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Account...
                  </>
                ) : (
                  <>
                    Create Account
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
        
        {/* Footer */}
        <div className="px-8 py-4 border-t border-gray-100">
          <div className="flex flex-col items-center space-y-4">
            <Link 
              to="/login" 
              className="text-blue-600 hover:text-blue-800 font-medium text-sm transition"
            >
              Already have an account? Log in here
            </Link>
            <div className="text-xs text-gray-500 text-center">
              © 2025 Illura. All rights reserved.
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <TermsModal 
        isOpen={showTermsModal}
        onClose={() => setShowTermsModal(false)}
        onAccept={() => setTermsAccepted(true)}
      />
      
      <PrivacyModal 
        isOpen={showPrivacyModal}
        onClose={() => setShowPrivacyModal(false)}
      />
    </div>
  );
};

export default SignUp;