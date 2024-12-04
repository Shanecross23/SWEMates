// src/pages/AccountPage.js

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/AccountPage.css';  // Import the CSS file

function AccountPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [address, setAddress] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/register', {
                username,
                password,
                address,
            });
            alert('Registration successful! Please log in.');
            navigate('/login');
        } catch (error) {
            console.error(error);
            alert('Registration failed. Please try again.');
        }
    };

    return (
        <div className="account-page">
            <div className="account-container">
                <h2 className="account-title">Create Your DineSmart Account</h2>
                <form onSubmit={handleRegister} className="account-form">
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        className="input-field"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="input-field"
                    />
                    <input
                        type="text"
                        placeholder="Address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        required
                        className="input-field"
                    />
                    <button type="submit" className="account-btn">Register</button>
                </form>
            </div>
        </div>
    );
}

export default AccountPage;