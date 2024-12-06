// src/pages/LandingPage.js

// Import React and essential hooks for component state and references
import React, { useState, useRef } from 'react';
// Import useNavigate hook for programmatic navigation between routes
import { useNavigate } from 'react-router-dom';
// Import Google Maps API components and hooks for search box functionality
import { StandaloneSearchBox, useLoadScript } from '@react-google-maps/api';
// Import CSS file for styling this page
import '../styles/LandingPage.css';

// Define required libraries for Google Maps API
const libraries = ['places'];

function LandingPage() {
  // State to store the user-entered or selected address
  const [address, setAddress] = useState('');

  // Hook for navigation to other routes
  const navigate = useNavigate();

  // Ref to control and access the StandaloneSearchBox
  const searchBoxRef = useRef(null);

  // Load Google Maps script with the API key and required libraries
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY, // API key from environment variables
    libraries, // Required libraries array
  });

  /**
   * Callback function triggered when the StandaloneSearchBox is loaded.
   * @param {Object} ref - Reference to the loaded search box
   */
  const onLoad = (ref) => {
    searchBoxRef.current = ref; // Assign the loaded search box to the ref
  };

  /**
   * Callback function triggered when the user selects a place from the search box.
   */
  const onPlacesChanged = () => {
    // Retrieve the selected place(s) from the search box
    const places = searchBoxRef.current.getPlaces();
    if (places.length > 0) {
      setAddress(places[0].formatted_address); // Update the address state with the formatted address
    }
  };

  /**
   * Handles the form submission for entering the address.
   * @param {Object} e - Form submission event
   */
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission behavior (page reload)
    if (address.trim()) { // Check if a valid address is entered
      // Save the address to local storage for later use
      localStorage.setItem('userAddress', address);
      // Navigate to the HomePage
      navigate('/home');
    } else {
      // Show an alert if no valid address is provided
      alert('Please enter a valid address.');
    }
  };

  /**
   * Handles the form submission for signing in.
   * @param {Object} e - Form submission event
   */
  const handleSignIn = (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    navigate('/login'); // Navigate to the Login page
  };

  // Display an error message if the Google Maps script fails to load
  if (loadError) return <div>Error loading maps</div>;

  // Display a loading message while the Google Maps script is being loaded
  if (!isLoaded) return <div>Loading Maps...</div>;

  return (
    <div className="landing-page"> {/* Main container for the landing page */}
      <h1>Welcome to DineSmart</h1> {/* Page title */}
      <h3 className="subheading">Enter Your Address</h3> {/* Subheading for address input */}
      <form onSubmit={handleSubmit}> {/* Form for entering the address */}
        {/* Google Maps StandaloneSearchBox for address input */}
        <StandaloneSearchBox
          onLoad={onLoad} // Attach the onLoad handler
          onPlacesChanged={onPlacesChanged} // Attach the onPlacesChanged handler
        >
          <input
            type="text" // Input type for address
            placeholder="Address" // Placeholder text for the input field
            value={address} // Bind state to input value
            onChange={(e) => setAddress(e.target.value)} // Allow manual address entry
            required // Make input mandatory
          />
        </StandaloneSearchBox>
        <button type="submit">Get Started</button> {/* Submit button for the form */}
      </form>
      
      <form onSubmit={handleSignIn}> {/* Form for signing in */}
        <button type="submit">Sign In</button> {/* Submit button for signing in */}
      </form>
    </div>
  );
}

export default LandingPage; // Export component for use in other parts of the application
