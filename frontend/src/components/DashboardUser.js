import React from 'react';
import { useNavigate } from 'react-router-dom';

const DashboardUser = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    console.log('test1');
    navigate('/');

  };

  const goToAddStock = () => {
    navigate('/stock');
  };

  const goToSettings = () => {
    navigate('/shop');
  };

  const goToPayment = () => {
    navigate('/payment');
  };
    const goToReturnPayment = () => {
    navigate('/retunpayment');
  };

  return (
    <div>
      <h2>User Dashboard</h2>
      <button onClick={goToAddStock}>Stock</button>
      <button onClick={goToSettings}>Settings</button>
      <button onClick={goToPayment}>Payment</button>
         <button onClick={goToReturnPayment}>Return</button>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default DashboardUser;
