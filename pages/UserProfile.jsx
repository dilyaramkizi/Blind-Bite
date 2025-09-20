import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../reducers/authReducer';
import { toast } from 'react-toastify';

const UserProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  // Display preferences or a button to mark preferences
  const preferences =user?.preferences;

  useEffect(() => {

  console.log(user); // Add this line to check the user object

    if (!user || user.role !== 'client') {
      navigate('/');
    }
  }, [user, navigate]);

  const handleLogout = () => {
    dispatch(logout());

    // Show a success toast for logout
    toast.success('You have logged out successfully!');
    // Using setTimeout to ensure the navigation happens after the logout state update
    setTimeout(() => {
      navigate('/');
    }, 1);
  };

  return (
    <div className="container-fluid min-vh-100 bg-light">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
        <div className="container">
          <span className="navbar-brand fs-4 fw-semibold d-flex align-items-center gap-2">
            {user?.avatar && (
              <img
                src={user.avatar || 'default-avatar-path.jpg'}  // Ensure the full URL is used
                alt="avatar"
                className="rounded-circle"
                style={{ width: '40px', height: '40px', objectFit: 'cover' }}
              />
            )}
            {user && user.name}
          </span>
          <div className="d-flex">
            <button
              onClick={handleLogout}
              className="btn btn-outline-light"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>
  
      {/* Main Content */}
      <div className="container py-5">
        <div className="row g-4">
          {/* Action Buttons */}
          <div className="col-md-6">
            <div className="d-grid gap-4">
              <button
                onClick={() => navigate('/make-order')}
                className="btn btn-primary btn-lg shadow-sm"
              >
                🛒 Make an Order
              </button>
              <button
                onClick={() => navigate('/history')}
                className="btn btn-outline-secondary btn-lg shadow-sm"
              >
                📜 View Order History
              </button>
            </div>
          </div>
  
          {/* Preferences Section */}
          <div className="col-md-6">
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <h4 className="card-title mb-4 text-primary fw-bold">Dietary Preferences</h4>
  
                {preferences ? (
                  <>
                    <dl className="row mb-4">
                      <dt className="col-sm-6">Price Range:</dt>
                      <dd className="col-sm-6 text-muted">
                        {preferences.price || "Not set"}
                      </dd>

                      <dt className="col-sm-6">Calorie Range:</dt>
                      <dd className="col-sm-6 text-muted">
                        {preferences.calories || "Not set"}
                      </dd>
  
                      <dt className="col-sm-6">Spice Level:</dt>
                      <dd className="col-sm-6 text-muted">
                        {preferences.spice_level || "Not set"}
                      </dd>
  
                      <dt className="col-sm-6">Vegetarian:</dt>
                      <dd className="col-sm-6 text-muted">
                        {preferences.vegetarian ? "Yes" : "No"}
                      </dd>
  
                      <dt className="col-sm-6">Gluten Free:</dt>
                      <dd className="col-sm-6 text-muted">
                        {preferences.gluten_free ? "Yes" : "No"}
                      </dd>
                    </dl>
                    <button
                      onClick={() => navigate('/preferences')}
                      className="btn btn-outline-primary w-100"
                    >
                      Edit Preferences
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => navigate('/preferences')}
                    className="btn btn-success btn-lg w-100"
                  >
                    Set Dietary Preferences
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  
};

export default UserProfile;
