import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../reducers/authReducer';

function AdminPanel() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  
  return (
    <div className="p-6 space-y-8">
      <nav className="client-profile-navbar">
        <div className="client-profile-left-link">
          {user && <span className="client-profile-user-name">Hello, {user.name}!</span>}
        </div>
        <div className="client-profile-right-link">
          <button onClick={() => {
            dispatch(logout());
            navigate('/');
          }} 
          className="client-profile-button">
            Logout
          </button>
        </div>
      </nav>
      <div className="client-profile-button-container">
        <button onClick={() => navigate('/manage-order')} className="client-profile-button">Manage Orders</button>
        <button onClick={() => navigate('/manage-users')} className="client-profile-button">Manage Users</button>
      </div>
    </div>
  );
}

export default AdminPanel;
