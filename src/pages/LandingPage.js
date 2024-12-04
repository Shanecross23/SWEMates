// src/pages/LandingPage.js

import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { StandaloneSearchBox, useLoadScript } from '@react-google-maps/api';
import '../styles/LandingPage.css';


const libraries = ['places'];

function LandingPage() {
  const [address, setAddress] = useState('');
  const navigate = useNavigate();
  const searchBoxRef = useRef(null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const onLoad = (ref) => {
    searchBoxRef.current = ref;
  };

  const onPlacesChanged = () => {
    const places = searchBoxRef.current.getPlaces();
    if (places.length > 0) {
      setAddress(places[0].formatted_address);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (address.trim()) {
      // Save the address to local storage
      localStorage.setItem('userAddress', address);
      // Redirect to the HomePage
      navigate('/home');
    } else {
      alert('Please enter a valid address.');
    }
    };
    const handleSignIn = (e) => {
        e.preventDefault();
        navigate('/login');
    };

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading Maps...</div>;

  return (
    <div className="landing-page">
      <h1>Welcome to DineSmart</h1>
      <h3 className="subheading">Enter Your Address</h3>
      <form onSubmit={handleSubmit}>
        <StandaloneSearchBox
          onLoad={onLoad}
          onPlacesChanged={onPlacesChanged}
        >
          <input
            type="text"
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </StandaloneSearchBox>
        <button type="submit">Get Started</button>
        
          </form>
       <form onSubmit={handleSignIn}>
       <button type="submit">Sign In</button>
       </form >
    </div>
  );
}

export default LandingPage;