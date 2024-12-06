// Import React and essential hooks for state and references
import React, { useState, useRef } from 'react';
// Import Axios for making HTTP requests
import axios from 'axios';
// Import CSS file for styling this component
import '../styles/RegisterPage.css';
// Import Google Maps API components and hooks for integrating maps functionality
import { StandaloneSearchBox, useLoadScript } from '@react-google-maps/api';

// Define required libraries for Google Maps API
const libraries = ['places'];

function RegisterPage() {
    // Ref to access and control the StandaloneSearchBox component
    const searchBoxRef = useRef(null);

    // State to manage form inputs
    const [formData, setFormData] = useState({
        name: '', // User's name
        password: '', // User's password
        cuisine: '', // User's preferred cuisine
        address: '', // User's address
    });

    // Load the Google Maps API script with the API key and required libraries
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY, // API key must be set in environment variables
        libraries, // Libraries array defined above
    });

    /**
     * Callback function triggered when the StandaloneSearchBox component loads.
     * @param {Object} ref - Reference to the loaded search box
     */
    const onLoad = (ref) => {
        searchBoxRef.current = ref; // Assign the loaded search box reference to the ref
    };

    /**
     * Callback function triggered when the user selects a place from the search box suggestions.
     */
    const onPlacesChanged = () => {
        // Retrieve the places selected by the user
        const places = searchBoxRef.current.getPlaces();
        if (places.length > 0) {
            const address = places[0].formatted_address; // Get the formatted address of the first place
            console.log('Address:', formData.address); // Log the current address to the console
            setFormData({ ...formData, address }); // Update the form data with the selected address
        }
    };

    /**
     * Handles changes in the input fields of the form.
     * @param {Object} e - Event object from the input field
     */
    const handleChange = (e) => {
        const { name, value } = e.target; // Extract name and value from the input field
        setFormData({ ...formData, [name]: value }); // Update the corresponding field in the form data
    };

    /**
     * Handles form submission, sending the data to the backend API.
     * @param {Object} e - Form submission event
     */
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent the default form submission (page reload)

        try {
            // Send a POST request to the backend with the form data
            const response = await axios.post('http://localhost:5000/api/users', formData);
            console.log('Response from server:', response.data); // Log the server's response
            alert('Preferences submitted successfully!'); // Notify the user of successful submission

            // Reset the form to its initial state
            setFormData({
                name: '',
                password: '',
                cuisine: '',
                address: '', // Clear the address field
            });
        } catch (error) {
            // Handle errors and display appropriate messages
            if (error.response && error.response.data && error.response.data.error) {
                alert(error.response.data.error); // Show server-side validation error
            } else {
                console.error('Error submitting form:', error); // Log unexpected errors
                alert('An unexpected error occurred. Please try again.');
            }
        }
    };

    // Display an error message if the Google Maps script fails to load
    if (loadError) return <div>Error loading maps</div>;

    // Display a loading message while the Google Maps script is loading
    if (!isLoaded) return <div>Loading Maps...</div>;

    return (
        <main className="account-page"> {/* Main container for the registration page */}
            <h2>Register Your Account</h2> {/* Page title */}
            <form className="preferences-form" onSubmit={handleSubmit}> {/* Form element with submission handler */}
                <label>
                    Username:
                    <input
                        type="text" // Input type for username
                        name="name" // Field name to match the state object key
                        value={formData.name} // Bind state to input value
                        onChange={handleChange} // Update state on input change
                        required // Make input mandatory
                        placeholder="Enter your name" // Placeholder text
                    />
                </label>

                <label>
                    Password:
                    <input
                        type="text" // Input type for password
                        name="password" // Field name to match the state object key
                        value={formData.password} // Bind state to input value
                        onChange={handleChange} // Update state on input change
                        required // Make input mandatory
                        placeholder="Enter your password" // Placeholder text
                    />
                </label>

                <label>
                    Cuisine Preference:
                    <input
                        type="text" // Input type for cuisine preference
                        name="cuisine" // Field name to match the state object key
                        value={formData.cuisine} // Bind state to input value
                        onChange={handleChange} // Update state on input change
                        required // Make input mandatory
                        placeholder="Enter your preferred cuisine" // Placeholder text
                    />
                </label>

                <label>
                    Address:
                    {/* Google Maps StandaloneSearchBox for address input */}
                    <StandaloneSearchBox onLoad={onLoad} onPlacesChanged={onPlacesChanged}>
                        <input
                            type="text" // Input type for address
                            placeholder="Enter your address" // Placeholder text
                            value={formData.address} // Bind state to input value
                            onChange={(e) =>
                                setFormData({ ...formData, address: e.target.value })
                            } // Allow manual address entry
                            required // Make input mandatory
                        />
                    </StandaloneSearchBox>
                </label>

                <button type="submit">Submit</button> {/* Submit button */}
            </form>
        </main>
    );
}

export default RegisterPage; // Export component for use in other parts of the application
