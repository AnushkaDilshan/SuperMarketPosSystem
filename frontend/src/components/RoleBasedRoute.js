// src/components/RoleBasedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';


const RoleBasedRoute = ({ children, role }) => {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/" />;

  try {
    const decoded = jwtDecode(token);
    return decoded.role === role ? children : <Navigate to="/" />;
  } catch (err) {
    return <Navigate to="/" />;
  }
};

export default RoleBasedRoute;
