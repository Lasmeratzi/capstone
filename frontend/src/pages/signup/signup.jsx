import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

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

  const steps = [
    "Personal Information",
    "Account Details",
    "Profile Setup",
    "Review & Submit"
  ];

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
      if (!formData.password) newErrors.password = "Password is required";
      else if (formData.password.length < 8) newErrors.password = "Password must be at least 8 characters";
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
      const message =
        error.response?.status === 400
          ? "Validation failed. Please check your inputs."
          : error.response?.status === 500
          ? "Server error. Please try again later."
          : "Failed to sign up. Please try again.";
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
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
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">Personal Information</h2>
            <div>
              <label htmlFor="fullname" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="fullname"
                value={formData.fullname}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.fullname ? "border-red-500" : "border-gray-300"}`}
                placeholder="John Doe"
                required
              />
              {errors.fullname && <p className="mt-1 text-sm text-red-500">{errors.fullname}</p>}
            </div>
            
            <div>
              <label htmlFor="birthdate" className="block text-sm font-medium text-gray-700 mb-1">
                Birthdate <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="birthdate"
                value={formData.birthdate}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.birthdate ? "border-red-500" : "border-gray-300"}`}
                required
              />
              {errors.birthdate && <p className="mt-1 text-sm text-red-500">{errors.birthdate}</p>}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">Account Details</h2>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.email ? "border-red-500" : "border-gray-300"}`}
                placeholder="your@email.com"
                required
              />
              {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
            </div>
            
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Username <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="username"
                value={formData.username}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.username ? "border-red-500" : "border-gray-300"}`}
                placeholder="johndoe123"
                required
              />
              {errors.username && <p className="mt-1 text-sm text-red-500">{errors.username}</p>}
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.password ? "border-red-500" : "border-gray-300"}`}
                placeholder="••••••••"
                required
              />
              {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
              <p className="mt-1 text-xs text-gray-500">Password must be at least 8 characters</p>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">Profile Setup</h2>
            <div>
              <label htmlFor="pfp" className="block text-sm font-medium text-gray-700 mb-1">
                Profile Picture
              </label>
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                  {pfp ? (
                    <img 
                      src={URL.createObjectURL(pfp)} 
                      alt="Preview" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  )}
                </div>
                <div>
                  <label className="cursor-pointer">
                    <span className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg text-sm font-medium transition">
                      {pfp ? "Change" : "Upload"}
                    </span>
                    <input
                      type="file"
                      id="pfp"
                      onChange={handleFileChange}
                      className="hidden"
                      accept="image/*"
                    />
                  </label>
                  {errors.pfp && <p className="mt-1 text-sm text-red-500">{errors.pfp}</p>}
                </div>
              </div>
              <p className="mt-1 text-xs text-gray-500">Optional. JPG, PNG up to 2MB</p>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800">Review Your Information</h2>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-800 mb-3">Personal Information</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Full Name</p>
                  <p className="font-medium">{formData.fullname}</p>
                </div>
                <div>
                  <p className="text-gray-500">Birthdate</p>
                  <p className="font-medium">{formData.birthdate || "Not provided"}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-800 mb-3">Account Details</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Email</p>
                  <p className="font-medium">{formData.email}</p>
                </div>
                <div>
                  <p className="text-gray-500">Username</p>
                  <p className="font-medium">{formData.username}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-800 mb-3">Profile</h3>
              <div className="text-sm">
                <p className="text-gray-500">Profile Picture</p>
                <p className="font-medium">{pfp ? pfp.name : "Not provided"}</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <input
                type="checkbox"
                id="terms"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="mt-1 w-4 h-4 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              />
              <label htmlFor="terms" className="ml-2 text-sm text-gray-700">
                I agree to the <a href="#" className="text-blue-600 hover:underline">Terms and Conditions</a> and <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
              </label>
            </div>
            {!termsAccepted && currentStep === 4 && (
              <p className="text-sm text-red-500">You must agree to the terms to continue</p>
            )}
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
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md overflow-hidden">
        {/* Progress bar */}
        <div className="bg-gray-100 h-2">
          <div 
            className="bg-blue-600 h-full transition-all duration-300" 
            style={{ width: `${(currentStep / steps.length) * 100}%` }}
          ></div>
        </div>
        <div className="text-center pb-6">
        </div>
        
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-800 text-center">Create Your Account</h1>
          <div className="flex justify-between mt-4">
            {steps.map((step, index) => (
              <div 
                key={index} 
                className={`text-sm font-medium ${currentStep > index + 1 ? "text-blue-600" : currentStep === index + 1 ? "text-gray-800" : "text-gray-400"}`}
              >
                {index + 1}. {step}
              </div>
            ))}
          </div>
        </div>
        
        {/* Form content */}
        <div className="p-6">
          {renderStep()}
        </div>
        
        {/* Navigation buttons */}
        <div className="p-6 border-t border-gray-200 flex justify-center">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={prevStep}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition"
            >
              Back
            </button>
          ) : (
            <div></div> 
          )}
          
          {currentStep < steps.length ? (
            <button
              type="button"
              onClick={nextStep}
              className="px-6 py-2 bg-blue-600 rounded-lg text-white font-medium hover:bg-blue-700 transition"
            >
              Continue
            </button>
          ) : (
            <button
              type="submit"
              onClick={handleSignUp}
              disabled={loading || !termsAccepted}
              className={`px-6 py-2 rounded-lg text-white font-medium transition ${loading || !termsAccepted ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : "Complete Sign Up"}
            </button>
          )}
        </div>
        <div className="flex justify-center">
        <Link to="/login" className="text-blue-600 hover:underline text-sm py-5">
          Go back to Log In
        </Link>
      </div>
      <div className="text-center text-xs text-gray-500 pb-4">
          © 2025 Illura. All rights reserved.
      </div>	
      </div>
    </div>
  );
};

export default SignUp;