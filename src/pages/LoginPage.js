import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';
import '../App.css';

function LoginPage({ setIsLoggedIn }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError('');

    if (!validateForm()) return;
    setIsLoading(true);
    try {
      const { data } = await axios.post(`${process.env.REACT_APP_SERVER_URL}/api/auth/login`, { email, password });
      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.role);
      setIsLoading(false);
      if (data.role === 'admin') navigate('/admin');
      else navigate('/technician');
    } catch (err) {
      setError('Invalid email or password.');
      setIsLoading(false);
    }
  };

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || !emailRegex.test(email)) {
      setError('Please enter a valid email.');
      return false;
    }

    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return false;
    }

    return true;
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login</h2>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="input-field"
          onKeyDown={handleKeyPress}
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="input-field"
          onKeyDown={handleKeyPress}
        />
        {error && <div className="error-message">{error}</div>}
        <button onClick={handleLogin} className="login-button">
          {isLoading ? (
            <div className="loader"></div>
          ) : (
            'Login'
          )}</button>
      </div>
    </div>
  );
}

export default LoginPage;
