import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullname: "",
    username: "",
    password: "",
    email: "",
    bio: "",
    birthdate: "",
  });
  const [pfp, setPfp] = useState(null); // For profile picture upload
  const [termsAccepted, setTermsAccepted] = useState(false); // State for Terms and Conditions acceptance
  const [loading, setLoading] = useState(false); // Loading indicator

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!termsAccepted) {
      alert("You must agree to the Terms and Conditions to sign up.");
      return;
    }

    setLoading(true); // Start loading indicator

    try {
      const data = new FormData();

      // Append text fields to FormData
      for (const key in formData) {
        data.append(key, formData[key]);
      }

      // Append profile picture to FormData
      if (pfp) {
        const selectedFile = pfp;
        if (!selectedFile.type.startsWith("image/")) {
          alert("Please upload a valid image file.");
          setLoading(false);
          return;
        }
        data.append("pfp", selectedFile);
      }

      // Send data to the backend
      const response = await axios.post("http://localhost:5000/api/signup", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
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
      setLoading(false); // Stop loading indicator
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile.type.startsWith("image/")) {
      alert("Please upload a valid image file.");
      return;
    }
    setPfp(selectedFile);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        className="bg-white p-6 rounded-lg shadow-lg w-2/5 grid grid-cols-2 gap-6"
        onSubmit={handleSignUp}
      >
        <h1 className="text-2xl font-bold text-gray-800 col-span-2 text-center">Sign Up</h1>

        {/* Full Name */}
        <div>
          <label htmlFor="fullname" className="block text-sm text-gray-700">Full Name</label>
          <input
            type="text"
            id="fullname"
            value={formData.fullname}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none"
            placeholder="Enter your full name"
            required
          />
        </div>

        {/* Username */}
        <div>
          <label htmlFor="username" className="block text-sm text-gray-700">Username</label>
          <input
            type="text"
            id="username"
            value={formData.username}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none"
            placeholder="Enter your username"
            required
          />
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="block text-sm text-gray-700">Password</label>
          <input
            type="password"
            id="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none"
            placeholder="Enter your password"
            required
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm text-gray-700">Email</label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none"
            placeholder="Enter your email"
            required
          />
        </div>

        {/* Birthdate */}
        <div>
          <label htmlFor="birthdate" className="block text-sm text-gray-700">Birthdate</label>
          <input
            type="date"
            id="birthdate"
            value={formData.birthdate}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none"
            required
          />
        </div>

        {/* Bio */}
        <div className="col-span-2">
          <label htmlFor="bio" className="block text-sm text-gray-700">Bio</label>
          <textarea
            id="bio"
            value={formData.bio}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none"
            placeholder="Write about yourself"
          ></textarea>
        </div>

        {/* Profile Picture */}
        <div className="col-span-2">
          <label htmlFor="pfp" className="block text-sm text-gray-700">Profile Picture</label>
          <input
            type="file"
            id="pfp"
            onChange={handleFileChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none"
            accept="image/*"
          />
        </div>

        {/* Terms and Conditions */}
        <div className="col-span-2 flex items-center">
          <input
            type="checkbox"
            id="terms"
            checked={termsAccepted}
            onChange={(e) => setTermsAccepted(e.target.checked)}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring focus:ring-blue-300"
          />
          <label htmlFor="terms" className="ml-2 text-sm text-gray-700">
            I agree to the Terms and Conditions
          </label>
        </div>

        {/* Submit Button */}
        <div className="col-span-2">
          <button
            type="submit"
            className="w-full px-4 py-2 text-white rounded-lg hover:opacity-80"
            style={{ backgroundColor: "#00040d" }}
            disabled={loading}
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SignUp;