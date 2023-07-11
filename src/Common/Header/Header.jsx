import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.scss';

function Header({ userType }) {
  const navigate = useNavigate();
  const logOutUser = (e) => {
    e.preventDefault();
    if (userType === 'user') {
        localStorage.removeItem('token');
        navigate('/login');
      } else if (userType === 'doctor') {
        localStorage.removeItem('doctortoken');
        navigate('/doctor/login');
      } else if (userType === 'admin') {
        localStorage.removeItem('admintoken');
        navigate('/admin/login');
      }
    
  };

  const [isNavOpen, setIsNavOpen] = useState(false);

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  const getNavigationLinks = () => {
    if (userType === 'user') {
      return (
        <ul className="navbar-nav ml-auto">
          <li className="nav-item">
            <Link to="/home" className="nav-link">
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/profile" className="nav-link">
              Profile
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/bookconsult" className="nav-link">
              Book Consult
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/aboutus" className="nav-link">
              About Us
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/contactus" className="nav-link">
              Contact Us
            </Link>
          </li>
        </ul>
      );
    } else if (userType === 'doctor') {
      return (
        <ul className="navbar-nav ml-auto">
          <li className="nav-item">
            <Link to="/doctor/home" className="nav-link">
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/doctor/profile" className="nav-link">
              Profile
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/doctor/view-schedule" className="nav-link">
              View Schedule
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/doctor/aboutus" className="nav-link">
              About Us
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/doctor/contactus" className="nav-link">
              Contact Us
            </Link>
          </li>
        </ul>
      );
    }else if (userType === 'admin') {
      return (
        <ul className="navbar-nav ml-auto">
          <li className="nav-item">
            <Link to="/admin/dashboard" className="nav-link">
              Dashboard
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/admin/users" className="nav-link">
              Users
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/admin/doctors" className="nav-link">
              Doctors
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/admin/specialization" className="nav-link">
              Specialization
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/admin/bookings" className="nav-link">
              Bookings
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/admin/revenue" className="nav-link">
              Revenue
            </Link>
          </li>
        </ul>
      );
    }
  };

  return (
    <header className="headerall">
      <nav className="navbar navbar-expand-lg">
        <div className="container">
          {/* Hamburger Icon */}
          <button className="navbar-toggler" type="button" onClick={toggleNav}>
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Logo and Logo Text */}
          <div className="logo-container">
            <img src="/healtheaselogo.png" alt="Logo" className="logo" />
            <span className="logo-text">HealthEase</span>
          </div>

          {/* Navigation Menu */}
          <div
            className={`collapse navbar-collapse ${isNavOpen ? 'show' : ''}`}
            id="navbarNav"
          >
            {getNavigationLinks()}
            <div className="userLogbut">
              <button className="btn logusrButton " onClick={logOutUser}>
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Header;
