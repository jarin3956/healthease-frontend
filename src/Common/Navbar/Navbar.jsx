import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import './Navbar.scss';
import { removeSchedule } from '../../Redux- toolkit/authslice';

function Navbar({ userType }) {

    const navigate = useNavigate();
    const dispatch = useDispatch()
    const logOutUser = (e) => {
        e.preventDefault();
        switch (userType) {
            case 'user':
                localStorage.removeItem('token');
                navigate('/login');
                break;
            case 'doctor':
                localStorage.removeItem('doctortoken');
                dispatch(removeSchedule());
                navigate('/doctor/login');
                break;
            case 'admin':
                localStorage.removeItem('admintoken');
                navigate('/admin/login');
                break;
            default:
                break;
        }

    };

    const [isNavOpen, setIsNavOpen] = useState(false);

    const toggleNav = () => {
        setIsNavOpen(!isNavOpen);
    };


    const getNavigationLinks = () => {
        if (userType === 'user') {
            let token = localStorage.getItem('token')
            return (
                <>
                    {token ? (
                        <>
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
                                    <Link to="/view-Bookings" className="nav-link">
                                        Bookings
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
                            <div className="userLogbut">
                                <button className="btn logusrButton" onClick={logOutUser}>
                                    Logout
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="userLogbut">
                            <button className="btn logusrButton" onClick={() => navigate('/login')}>
                                Login
                            </button>
                        </div>
                    )}
                </>

            );
        } else if (userType === 'doctor') {
            const doctortoken = localStorage.getItem('doctortoken')
            return (
                <>
                    {doctortoken ? (
                        <>
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
                            <div className="userLogbut">
                                <button className="btn logusrButton " onClick={logOutUser}>
                                    Logout
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="userLogbut">
                            <button className="btn logusrButton" onClick={() => navigate('/doctor/login')}>
                                Login
                            </button>
                        </div>
                    )}
                </>

            );
        } else if (userType === 'admin') {
            const admintoken = localStorage.getItem('admintoken')
            return (
                <>
                    {admintoken ? (
                        <>
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
                            <div className="userLogbut">
                                <button className="btn logusrButton " onClick={logOutUser}>
                                    Logout
                                </button>
                            </div>
                        </>
                    ) : ( 
                        <div className="userLogbut">
                            <button className="btn logusrButton" onClick={() => navigate('/admin/login')}>
                                Login
                            </button>
                        </div>
                    ) }
                </>

            );
        }
    };



    return (
        <header className="headerall">
            <nav className="navbar navbar-expand-lg">
                <div className="container">

                    <button className="navbar-toggler" type="button" onClick={toggleNav}>
                        <span className="navbar-toggler-icon"></span>
                    </button>


                    <div className="logo-container">
                        <img src="/healtheaselogo.png" alt="Logo" className="logo" />
                        <span className="logo-text">HealthEase</span>
                    </div>


                    <div
                        className={`collapse navbar-collapse ${isNavOpen ? 'show' : ''}`}
                        id="navbarNav"
                    >
                        {getNavigationLinks()}

                    </div>
                </div>
            </nav>
        </header>
    )
}

export default Navbar