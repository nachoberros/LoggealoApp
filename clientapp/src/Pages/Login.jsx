import React, { useState } from 'react';
import './Login.css'; 
import api from '../Api/axios'

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('api/auth/login', { email, password });
      const data = res.data;
      localStorage.setItem('token', data.token);
      localStorage.setItem('currentUser', JSON.stringify(data.user));

      window.location.href = '/driverlog';
    } catch (err) {
      alert('Login failed: ' + err.message);
    }
  };

  return (
    <form className="login-container" onSubmit={handleLogin}>
      <h2>Loggealo</h2>
      <input
        type="text"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;