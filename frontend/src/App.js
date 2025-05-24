import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Signup from './components/Signup';
import Login from './components/Login';
import DashboardUser from './components/DashboardUser';
import DashboardAdmin from './components/DashboardAdmin';
import RoleBasedRoute from './components/RoleBasedRoute';
import StockManager from './view/StockManager';
import Payment from './view/Payment';
import ShopDetails from './view/ShopDetails';
import ReturnPayment from './view/Return';
import ChangeMongoCreds from './components/ChangeMongoCreds'


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/stock" element={<StockManager />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/shop" element={<ShopDetails />} />
        <Route path="/retunpayment" element={<ReturnPayment />} />
        <Route path="/mongo" element={<ChangeMongoCreds />} />
        {/* User Dashboard */}
        <Route
          path="/user-dashboard"
          element={
            <RoleBasedRoute role="user">
              <DashboardUser />
            </RoleBasedRoute>
          }
        />

        {/* Admin Dashboard */}
        <Route
          path="/admin-dashboard"
          element={
            <RoleBasedRoute role="admin">
              <DashboardAdmin />
            </RoleBasedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
