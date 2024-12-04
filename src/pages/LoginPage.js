import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/LoginPage.css';

function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/login', {
                username,
                password,
            });
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('userAddress', response.data.address);
            navigate('/home');
        } catch (error) {
            console.error(error);
            alert('Login failed. Please check your credentials.');
        }
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <h2 className="login-title">Welcome Back to DineSmart!</h2>
                <form onSubmit={handleLogin} className="login-form">
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
                    <button type="submit" className="login-btn">Login</button>
                </form>
                <div className="signup-prompt">
                    <p>Don't have an account? <a href="/register">Sign up</a></p>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;