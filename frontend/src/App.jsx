import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/login/login";
import Home from "./components/home/home";
import Signup from "./components/signup/signup";
import Forgotpass from "./components/forgotpass/forgotpass";
import Homeadmin from "./components/homeadmin/homeadmin";
import Loginadmin from "./components/loginadmin/loginadmin";
import Tags from "./components/tags/tags";
import Profiles from "./components/profiles/profiles";
import ProfileDisplay from "./components/profiles/profiledisplay";
import LandingPage from "./components/landing/landingpage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage/>} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgotpass" element={<Forgotpass />} />
        <Route path="/profiles" element={<Profiles />} />

        <Route path="/homeadmin" element={<Homeadmin />} />
        <Route path="/loginadmin" element={<Loginadmin />} />
        <Route path="/tags"  element={<Tags />} />
        <Route path="/profiledisplay"  element={<ProfileDisplay />} />
      </Routes>
    </Router>
  );
}

export default App;