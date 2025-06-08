import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./pages/ProtectedRoute"; // Import ProtectedRoute
import Login from "./pages/login/login";
import Home from "./pages/home/home";
import Profile from "./pages/profiles/profile";
import VisitProfile from "./pages/profiles/visitprofile"; // Import VisitProfile
import SearchProfile from "./pages/search/searchprofile"; // Import SearchProfiles
import Signup from "./pages/signup/signup";
import Forgotpass from "./pages/forgotpass/forgotpass";
import Homeadmin from "./pages/ADMIN/homeadmin/homeadmin";
import Loginadmin from "./pages/ADMIN/loginadmin/loginadmin";
import Tags from "./pages/ADMIN/tags/tags";
import DisplayProfile from "./pages/ADMIN/displayprofile/displayprofile";
import LandingPage from "./pages/landing/landingpage";
import MakePost from "./pages/makepost/makepost";
import MakeArt from "./pages/makepost/makeart";
import MakeAuction from "./pages/makepost/makeauction";
import ChatBot from "./pages/chatbot/chatbot";
import Terms from "./pages/terms/terms";
import DisplayPosts from "./pages/ADMIN/displayposts/displayposts";
import About from "./pages/about/about";


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