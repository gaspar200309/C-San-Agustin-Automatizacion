import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './LoginUser.css';
import { FaRegEyeSlash } from "react-icons/fa";
import { IoEyeOutline } from "react-icons/io5";
import { loginUser } from '../../api/api';
import { saveToken, saveUser } from './authFunctions';


export default function LoginUser() {
  const [credentials, setCredentials] = useState({
    email: '',
    password_hash: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      
      const result = await loginUser(credentials);
      console.log('Login result:', result); 
      
      if (result.data.access_token) {
        saveToken(result.data.access_token);
        /* saveUser({ username: result.data.username }); */
        navigate('/home');
        window.location.reload();
      } else {
        console.log('Login failed: No token received');
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Inicia sesión</h2>
        <form onSubmit={handleSubmit}>
          <label>Correo electrónico</label>
          <input
            type="text"
            name="email"
            value={credentials.username}
            onChange={handleChange}
            required
          />
          <label>Contraseña</label>
          <div className="password-container">
            <input
              type={showPassword ? "text" : "password"}
              name="password_hash"
              value={credentials.password}
              onChange={handleChange}
              required
            />
            <button type="button" onClick={toggleShowPassword} className="toggle-password">
              {showPassword ? <IoEyeOutline /> : <FaRegEyeSlash />}
            </button>
          </div>
          <Link to="/reset">¿Olvidaste la contraseña?</Link>
          <button className="button-primary" type="submit">Ingresar</button>
        </form>
      </div>
    </div>
  );
}
