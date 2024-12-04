import React, { useState } from 'react';
import axios from 'axios';
import '../styles/AccountPage.css';

function AccountPage() {
    const [formData, setFormData] = useState({
        name: '',
        password: '',
        cuisine: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Form Data:', formData);

        try {
            // Send a POST request to backend
            const response = await axios.post('http://localhost:5000/api/users', formData);
            console.log('Response from server:', response.data);
            alert('Preferences submitted successfully!');

            //reset form
            setFormData({
                name: '',
                address: '',
                cuisine: '',
            });
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('There was an error submitting your preferences.');
        }
    };


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
                        value={formData.address}
                        onChange={handleChange}
                        required
                        placeholder="Enter your address"
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

                <button type="submit">Submit</button>
            </form>
        </main>
    );
}

export default AccountPage;