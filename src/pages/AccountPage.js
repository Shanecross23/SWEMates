// src/pages/AccountPage.js

// Import React and essential hooks for component state management
import React, { useState } from 'react';
// Import Axios for making HTTP requests
import axios from 'axios';
// Import useNavigate hook for programmatic navigation
import { useNavigate } from 'react-router-dom';
// Import CSS file for styling this component
import '../styles/AccountPage.css';

function AccountPage() {
    // State variables to manage form input values
    const [username, setUsername] = useState(''); // Stores the entered username
    const [password, setPassword] = useState(''); // Stores the entered password
    const [address, setAddress] = useState(''); // Stores the entered address

    // Hook to navigate programmatically to different routes
    const navigate = useNavigate();

    /**
     * Handles the form submission for user registration.
     * @param {Event} e - Form submission event
     */
    const handleRegister = async (e) => {
        e.preventDefault(); // Prevent default form submission behavior (page reload)
        try {
            // Send a POST request to the backend API for user registration
            await axios.post('http://localhost:5000/api/register', {
                username, // Pass the entered username
                password, // Pass the entered password
                address,  // Pass the entered address
            });
            // Show a success message to the user
            alert('Registration successful! Please log in.');
            // Navigate the user to the login page
            navigate('/login');
        } catch (error) {
            // Log the error to the console for debugging
            console.error(error);
            // Show an error message to the user
            alert('Registration failed. Please try again.');
        }
    };

    return (
        <div className="account-page"> {/* Main container for the account page */}
            <div className="account-container"> {/* Inner container for the registration form */}
                <h2 className="account-title">Create Your DineSmart Account</h2> {/* Page title */}
                <form onSubmit={handleRegister} className="account-form"> {/* Form element with submission handler */}
                    <input
                        type="text" // Input type for username
                        placeholder="Username" // Placeholder text
                        value={username} // Bind state to input value
                        onChange={(e) => setUsername(e.target.value)} // Update username state on input change
                        required // Make input mandatory
                        className="input-field" // Apply CSS class for styling
                    />
                    <input
                        type="password" // Input type for password
                        placeholder="Password" // Placeholder text
                        value={password} // Bind state to input value
                        onChange={(e) => setPassword(e.target.value)} // Update password state on input change
                        required // Make input mandatory
                        className="input-field" // Apply CSS class for styling
                    />
                    <input
                        type="text" // Input type for address
                        placeholder="Address" // Placeholder text
                        value={address} // Bind state to input value
                        onChange={(e) => setAddress(e.target.value)} // Update address state on input change
                        required // Make input mandatory
                        className="input-field" // Apply CSS class for styling
                    />
                    <button type="submit" className="account-btn">Register</button> {/* Submit button */}
                </form>
            </div>
        </div>
    );
}

export default AccountPage; // Export component for use in other parts of the application
