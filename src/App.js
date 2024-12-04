// src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import AccountPage from './pages/AccountPage';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
// Remove or comment out authentication imports
// import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Router>
      <div>
        <Header />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage/>} />
          <Route path="/home" element={<HomePage/>} />
          {/* Authentication Routes */}
          <Route path="/login" element={<LoginPage/>} />
          <Route path="/register" element={<RegisterPage/>} />
          {/* Add the Account page route */}
          <Route path="/account" element={<AccountPage/>} />
          {/* Fallback Route */}
          <Route path="*" element={<LandingPage />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;