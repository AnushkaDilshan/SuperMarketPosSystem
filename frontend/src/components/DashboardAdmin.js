import React from 'react';
import { useNavigate } from 'react-router-dom';

const DashboardUser = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    console.log('test2');
    navigate('/');
  };
   const goToAddStock = () => {
    navigate('/stock');
  };

  return (
    <div>
      <h2>Admin Dashboard</h2>
        <button onClick={goToAddStock}>Stock</button>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default DashboardUser;
