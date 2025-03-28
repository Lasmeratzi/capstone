import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/login/login";
import Home from "./components/home/home";

function App() {
  return (
    <Router>
      <Routes>
        {/* Route for Login Page */}
        <Route path="/" element={<Login />} />
        {/* Route for Home Page */}
        <Route path="/home" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;