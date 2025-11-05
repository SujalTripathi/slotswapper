import React from 'react';
import { Link, useNavigate, useLocation, NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar navbar-expand-lg navbar-dark" style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
      <div className="container-fluid">
        <Link to="/" className="navbar-brand fw-bold">
          <i className="material-icons align-middle me-2" style={{fontSize: '28px'}}>swap_horiz</i>
          SlotSwapper
        </Link>
        
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          {user?.isAuthenticated && (
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) => isActive ? "nav-link active fw-bold" : "nav-link"}
                >
                  <i className="material-icons align-middle me-1" style={{fontSize: '20px'}}>dashboard</i>
                  Dashboard
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  to="/marketplace"
                  className={({ isActive }) => isActive ? "nav-link active fw-bold" : "nav-link"}
                >
                  <i className="material-icons align-middle me-1" style={{fontSize: '20px'}}>store</i>
                  Marketplace
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  to="/swap-requests"
                  className={({ isActive }) => isActive ? "nav-link active fw-bold" : "nav-link"}
                >
                  <i className="material-icons align-middle me-1" style={{fontSize: '20px'}}>swap_calls</i>
                  Swap Requests
                </NavLink>
              </li>
              <li className="nav-item ms-3">
                <button
                  onClick={handleLogout}
                  className="btn btn-danger btn-sm"
                >
                  <i className="material-icons align-middle me-1" style={{fontSize: '18px'}}>logout</i>
                  Logout
                </button>
              </li>
            </ul>
          )}
          
          {!user?.isAuthenticated && (
            <ul className="navbar-nav ms-auto">
              <li className="nav-item me-2">
                <Link to="/login" className="btn btn-light btn-sm">
                  Login
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/signup" className="btn btn-success btn-sm">
                  Sign Up
                </Link>
              </li>
            </ul>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;