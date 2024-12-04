import React, { useState, useRef } from 'react';
import axios from 'axios';
import '../styles/RegisterPage.css';
import { StandaloneSearchBox, useLoadScript } from '@react-google-maps/api';

const libraries = ['places'];

function RegisterPage() {
    const searchBoxRef = useRef(null);
    const [formData, setFormData] = useState({
        name: '',
        password: '',
        cuisine: '',
        address: '',
    });

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
            const address = places[0].formatted_address;
            console.log('Address:', formData.address);
            setFormData({ ...formData, address });
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Send a POST request to backend
            const response = await axios.post('http://localhost:5000/api/users', formData);
            console.log('Response from server:', response.data);
            alert('Preferences submitted successfully!');

            // Reset form
            setFormData({
                name: '',
                password: '',
                cuisine: '',
                address: '',  // Reset the address field
            });
        } catch (error) {
            if (error.response && error.response.data && error.response.data.error) {
                alert(error.response.data.error);
            } else {
                console.error('Error submitting form:', error);
                alert('An unexpected error occurred. Please try again.');
            }
        }
    };

    if (loadError) return <div>Error loading maps</div>;
    if (!isLoaded) return <div>Loading Maps...</div>;

    return (
        <main className="account-page">
            <h2>Register Your Account</h2>
            <form className="preferences-form" onSubmit={handleSubmit}>
                <label>
                    Username:
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="Enter your name"
                    />
                </label>

                <label>
                    Password:
                    <input
                        type="text"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        placeholder="Enter your password"
                    />
                </label>

                <label>
                    Cuisine Preference:
                    <input
                        type="text"
                        name="cuisine"
                        value={formData.cuisine}
                        onChange={handleChange}
                        required
                        placeholder="Enter your preferred cuisine"
                    />
                </label>

                <label>
                    Address:
                    <StandaloneSearchBox onLoad={onLoad} onPlacesChanged={onPlacesChanged}>
                        <input
                            type="text"
                            placeholder="Enter your address"
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            required
                        />
                    </StandaloneSearchBox>
                </label>

                <button type="submit">Submit</button>
            </form>
        </main>
    );
}

export default RegisterPage;
