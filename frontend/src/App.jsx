import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute"; // Import ProtectedRoute
import Login from "./components/login/login";
import Home from "./components/home/home";
import Profile from "./components/profiles/profile";
import VisitProfile from "./components/profiles/visitprofile"; // Import VisitProfile
import SearchProfile from "./components/search/searchprofile"; // Import SearchProfiles
import Signup from "./components/signup/signup";
import Forgotpass from "./components/forgotpass/forgotpass";
import Homeadmin from "./components/ADMIN/homeadmin/homeadmin";
import Loginadmin from "./components/ADMIN/loginadmin/loginadmin";
import Tags from "./components/ADMIN/tags/tags";
import DisplayProfile from "./components/ADMIN/displayprofile/displayprofile";
import LandingPage from "./components/landing/landingpage";
import MakePost from "./components/makepost/makepost";
import MakeArt from "./components/makepost/makeart";
import MakeAuction from "./components/makepost/makeauction";
import ChatBot from "./components/chatbot/chatbot";
import Terms from "./components/terms/terms";
import DisplayPosts from "./components/ADMIN/displayposts/displayposts";
import About from "./components/about/about";


function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgotpass" element={<Forgotpass />} />
        <Route path="/about" element={<About />} />
        <Route path="/terms" element={<Terms/>} />
        {/* Protected Routes */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chatbot"
          element={
            <ProtectedRoute>
              <ChatBot />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/visitprofile/:id"
          element={
            <ProtectedRoute>
              <VisitProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/searchprofile"
          element={
            <ProtectedRoute>
              <SearchProfile /> {/* Match the corrected import and component name */}
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route path="/homeadmin" element={<Homeadmin />} />
        <Route path="/loginadmin" element={<Loginadmin />} />
        <Route path="/tags" element={<Tags />} />
        <Route path="/displayprofile" element={<DisplayProfile />} />
        <Route path="/makepost" element={<MakePost />} />
        <Route path="/makeart" element={<MakeArt />} />
        <Route path="/makeauction" element={<MakeAuction />} />
        <Route path="/displayposts" element={<DisplayPosts />} />
      </Routes>
    </Router>
  );
}

export default App;