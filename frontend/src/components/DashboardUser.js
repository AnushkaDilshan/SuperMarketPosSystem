import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/UserDashboard.module.css';



const DashboardUser = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    console.log('Logged out');
    navigate('/');
  };

  const goToSettings = () => navigate('/shop');
  const goToPayment = () => navigate('/payment');
  const goToReturnPayment = () => navigate('/retunpayment');

  return (
    <div className={styles['dashboard-container']}>
  <div className={styles['dashboard-card']}>
    <h2>User Dashboard</h2>
    <div className={styles['dashboard-buttons']}>
      <button onClick={goToSettings}>Settings</button>
      <button onClick={goToPayment}>Payment</button>
      <button onClick={goToReturnPayment}>Return</button>
      <button onClick={handleLogout} className={styles['logout-btn']}>Logout</button>
    </div>
  </div>
</div>

  );
};

export default DashboardUser;
