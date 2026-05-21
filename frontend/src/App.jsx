import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import ProtectedRoute from "./pages/ProtectedRoute"; 
import AdminProtectedRoute from "./pages/AdminProtectedRoute"; 

// Lazy load components
import LandingPage from "./pages/landing/landingpage";
import Login from "./pages/login/login";
import Signup from "./pages/signup/signup";
import Home from "./pages/home/home";
import About from "./pages/about/about";
import Contact from "./pages/contact/contact";
import Profile from "./pages/profiles/profile";
import VisitProfile from "./pages/profiles/visitprofile";
import Inbox from "./pages/message/inbox";
import Message from "./pages/message/message";
import SearchProfile from "./pages/search/searchprofile";
import Forgotpass from "./pages/forgotpass/forgotpass";
import Notifications from "./pages/notifications/notifications";
import Terms from "./pages/terms/terms";
import Homeadmin from "./pages/ADMIN/homeadmin/homeadmin";
import Tags from "./pages/ADMIN/tags/tags";
import DisplayProfile from "./pages/ADMIN/displayprofile/displayprofile";
import DisplayPosts from "./pages/ADMIN/displayposts/displayposts";
import DisplayReports from "./pages/ADMIN/displayreports/displayreports";
import DisplayAuctions from "./pages/ADMIN/displayauctions/displayauctions";
import VerifyProfile from "./pages/ADMIN/verifyprofile/verifyprofile";
import Loginadmin from "./pages/ADMIN/loginadmin/loginadmin";
import MakeAuction from "./pages/makepost/makeauction";
import PortfolioPostsPage from "./pages/search/PortfolioPostsPage";
import TagPostsPage from "./pages/search/TagsPostsPage";
import ArtworkPostPage from "./pages/search/ArtWorkPostPage";
import LocationPostsPage from "./pages/search/LocationPostsPage";
import AuctionWins from "./pages/auctionwins/auctionwins";
import ChatBot from "./pages/chatbot/chatbot";
import IlluraAccount from "./pages/ADMIN/illuraaccount/illuraaccount";
import MakePost from "./pages/makepost/makepost";
import MakeArt from "./pages/makepost/makeart";

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#0A0A0B]">
    <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

const ThemeHandler = () => {
  const location = useLocation();

  useEffect(() => {
    const adminPaths = [
      '/loginadmin', '/illuraaccount', '/homeadmin', '/tags', 
      '/displayprofile', '/displayposts', '/displayreports', 
      '/displayauctions', '/verifyprofile'
    ];

    const isAdminPath = adminPaths.some(path => location.pathname === path || location.pathname.startsWith(path + '/'));

    const applyTheme = () => {
      if (isAdminPath) {
        document.documentElement.classList.remove('dark');
        return;
      }
      
      let theme = localStorage.getItem('theme');
      
      // If no theme is set, explicitly default to light mode
      if (!theme) {
        theme = 'light';
        localStorage.setItem('theme', 'light');
      }

      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };

    applyTheme();

    // Listen for storage changes (for cross-tab and cross-component sync)
    window.addEventListener('storage', applyTheme);
    return () => window.removeEventListener('storage', applyTheme);
  }, [location]);

  return null;
};

function App() {
  return (
    <Router>
      <ThemeHandler />
      <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgotpass" element={<Forgotpass />} />
          <Route path="/about" element={<About />} />
          <Route path="/terms" element={<Terms/>} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/makepost" element={<MakePost/>} />
          <Route path="/makeart" element={<MakeArt/>} />
         

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
           path="/makeauction"
          element={
              <ProtectedRoute>
                <MakeAuction onClose={() => window.history.back()} />
              </ProtectedRoute>
            }
          />
        {/* Search Routes */}
  <Route
    path="/searchprofile"
    element={
      <ProtectedRoute>
        <SearchProfile /> 
      </ProtectedRoute>
    }
  />
  <Route
    path="/search/portfolio"
    element={
      <ProtectedRoute>
        <PortfolioPostsPage />
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
  <Route
    path="/artwork/:postId"
    element={
      <ProtectedRoute>
        <ArtworkPostPage />
      </ProtectedRoute>
    }
  />
  <Route
    path="/location/:locationId"
    element={
      <ProtectedRoute>
        <LocationPostsPage />
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

          <Route path="/illuraaccount" element={
            <AdminProtectedRoute>
              <IlluraAccount />
            </AdminProtectedRoute>
          } />
          
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
           <Route path="/displayreports" element={
            <AdminProtectedRoute adminOnly={true}>
              <DisplayReports />
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
