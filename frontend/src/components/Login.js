import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import { jwtDecode } from 'jwt-decode';
import styles from '../styles/Login.module.css';
import { useUser } from '../context/UserContext';

const Login = () => {
  const { setUser } = useUser();
  const [form, setForm] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await authService.login(form);
     
      const token = res.data.token;
      localStorage.setItem('token', token);
      const user = jwtDecode(token);
      setUser(user.id);
      console.log(user.id);
      

      // Redirect based on role
      if (user.role === 'admin') {
        navigate('/admin-dashboard');
      } else {
        navigate('/user-dashboard');
      }

    } catch (err) {
      setMessage(err.response?.data?.message || 'Login failed');
    }
  };

  const goToSignup = () => {
    navigate('/signup');
  };
  const goTochangecreditials = () => {
    navigate('/mongo');
  };

  return (
    <div className={styles['login-container']}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input name="email" placeholder="Email" onChange={handleChange} required /><br />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} required /><br />
        <button type="submit">Login</button>
      </form>

      <button
        type="button"
        className={styles['signup-button']}
        onClick={goToSignup}
        style={{ marginTop: '15px', width: '100%', padding: '10px', borderRadius: '6px', border: 'none', backgroundColor: '#28a745', color: 'white', cursor: 'pointer', fontSize: '15px' }}
      >
        Signup
      </button>
      
      <button
        type="button"
        className={styles['signup-button']}
        onClick={goTochangecreditials}
        style={{ marginTop: '15px', width: '100%', padding: '10px', borderRadius: '6px', border: 'none', backgroundColor: '#28a745', color: 'white', cursor: 'pointer', fontSize: '15px' }}
      >
        Mongo
      </button>

      <p>{message}</p>
    </div>
  );
};

export default Login;
