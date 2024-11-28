// src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import HomePage from './pages/HomePage';
// Remove or comment out authentication imports
// import LoginPage from './pages/LoginPage';
// import RegisterPage from './pages/RegisterPage';
// import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Router>
      <div>
        <Header />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/home" element={<HomePage />} />
          {/* Remove or comment out authentication routes */}
          {/* <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} /> */}
          {/* Fallback Route */}
          <Route path="*" element={<LandingPage />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;