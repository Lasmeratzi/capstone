import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./pages/ProtectedRoute"; 
import AdminProtectedRoute from "./pages/AdminProtectedRoute"; 
import Login from "./pages/login/login";
import Home from "./pages/home/home";
import Notifications from "./pages/notifications/notifications";
import Profile from "./pages/profiles/profile";
import AuctionWins from "./pages/auctionwins/auctionwins";
import VisitProfile from "./pages/profiles/visitprofile"; 
import SearchProfile from "./pages/search/searchprofile"; 
import Signup from "./pages/signup/signup";
import Forgotpass from "./pages/forgotpass/forgotpass";
import Homeadmin from "./pages/ADMIN/homeadmin/homeadmin";
import Loginadmin from "./pages/ADMIN/loginadmin/loginadmin";
import Tags from "./pages/ADMIN/tags/tags";
import DisplayProfile from "./pages/ADMIN/displayprofile/displayprofile";
import DisplayPosts from "./pages/ADMIN/displayposts/displayposts";
import DisplayAuctions from "./pages/ADMIN/displayauctions/displayauctions"; 
import VerifyProfile from "./pages/ADMIN/verifyprofile/verifyprofile";
import LandingPage from "./pages/landing/landingpage";
import MakePost from "./pages/makepost/makepost";
import MakeArt from "./pages/makepost/makeart";
import MakeAuction from "./pages/makepost/makeauction";
import ChatBot from "./pages/chatbot/chatbot";
import Terms from "./pages/terms/terms";
import About from "./pages/about/about";
import Inbox from "./pages/message/inbox";
import Message from "./pages/message/message";
import TagPostsPage from "./pages/search/TagsPostsPage";

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
        <Route path="/makepost" element={<MakePost/>} />
        <Route path="/makeart" element={<MakeArt/>} />
        <Route path="/makeauction" element={<MakeAuction/>} />

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
          path="/notifications"
          element={
            <ProtectedRoute>
              <Notifications />
            </ProtectedRoute>
          }
        />
        <Route
          path="/auctionwins"
          element={
            <ProtectedRoute>
              <AuctionWins />
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
              <SearchProfile /> 
            </ProtectedRoute>
          }
        />
        <Route
          path="/tags/:tagName"
          element={
            <ProtectedRoute>
              <TagPostsPage />
            </ProtectedRoute>
          }
        />

        {/* ✅ Messaging Routes */}
        <Route
          path="/inbox"
          element={
            <ProtectedRoute>
              <Inbox />
            </ProtectedRoute>
          }
        />
        <Route
          path="/messages/:otherUserId"
          element={
            <ProtectedRoute>
              <Message />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route path="/loginadmin" element={<Loginadmin />} />
        
        {/* Admin Protected Routes */}
        <Route path="/homeadmin" element={
          <AdminProtectedRoute adminOnly={true}>
            <Homeadmin />
          </AdminProtectedRoute>
        } />
        <Route path="/tags" element={
          <AdminProtectedRoute adminOnly={true}>
            <Tags />
          </AdminProtectedRoute>
        } />
        <Route path="/displayprofile" element={
          <AdminProtectedRoute adminOnly={true}>
            <DisplayProfile />
          </AdminProtectedRoute>
        } />
        <Route path="/displayposts" element={
          <AdminProtectedRoute adminOnly={true}>
            <DisplayPosts />
          </AdminProtectedRoute>
        } />
        <Route path="/displayauctions" element={
          <AdminProtectedRoute adminOnly={true}>
            <DisplayAuctions />
          </AdminProtectedRoute>
        } />
        <Route path="/verifyprofile" element={
          <AdminProtectedRoute adminOnly={true}>
            <VerifyProfile />
          </AdminProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;
