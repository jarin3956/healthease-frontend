import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosinstance from '../../Axios/Axios';
import './Loginp.scss';
import { SiGoogle } from 'react-icons/si';



function Loginp({ user }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const [shake, setShake] = useState(false);


  const handleRegisterClick = () => {
    const registerRoutes = {
      user: '/register',
      doctor: '/doctor/register',
      admin: '/admin/register',
    };
  
    navigate(registerRoutes[user]);
  };


  async function loginUser(event) {
    event.preventDefault();

    try {

      if (user === 'user') {
        let userresponse = await axiosinstance.post('login', {
          email,
          password,
        });
        const userdata = userresponse.data;
        if (userdata.status === 'error') {
          setErrorMessage(userdata.message);
          setShake(true);
        }
        else if (userdata.user) {
          localStorage.setItem('token', userdata.user);
          navigate('/home');

        }
        else {
          setErrorMessage('An error occurred. Please try again later');
          setShake(true);
        }
      } else if (user === 'doctor') {
        let doctorresponse = await axiosinstance.post('doctor/login', {
          email,
          password,
        });
        const doctordata = doctorresponse.data;
        if (doctordata.status === 'error') {
          setErrorMessage(doctordata.message);
          setShake(true);
        }
        else if (doctordata.doctor) {
          localStorage.setItem('doctortoken', doctordata.doctor);
          navigate('/doctor/home');

        }
        else {
          setErrorMessage('An error occurred. Please try again later');
          setShake(true);
        }
      } else if(user === 'admin'){
        let adminresponse=await axiosinstance.post('admin/login',{
          email,
          password
        });
        const admindata = adminresponse.data;
        if (admindata.status === 'error') {
          setErrorMessage(admindata.message)
          setShake(true)
        } else if (admindata.admin) {
          localStorage.setItem('admintoken', admindata.admin);
          navigate('/admin/dashboard')
        } else {
          setErrorMessage('An error occurred. Please try again later')
          setShake(true)
        }
      }

    } catch (error) {
      console.log(error, 'errrrrrrrrrrrrrrrrrrrr');
    }
  }

  function handleAnimationEnd() {
    setShake(false);
  }

  useEffect(() => {
    if (errorMessage) {
      setShake(true);
      setTimeout(() => {
        setShake(false);
      }, 1000);
    }
  }, [errorMessage]);


  return (
    <div className={`login-container ${shake ? 'shake' : ''}`}>

      <form onSubmit={loginUser} className="login-form" onAnimationEnd={handleAnimationEnd} >
        <div className="doc-logo-container">
          <img src="/healtheaselogo.png" alt="Logo" className="doc-logo-image" />
        </div>
        <h1>Login</h1>
        {errorMessage && <h6 className="admin-login-error text-danger">{errorMessage}</h6>}

        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder="Email"
          className="login-input"
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="Password"
          className="login-input"
        />
        <input type="submit" value="Login" className="login-button" />
        <span className='ptoreg p-3' onClick={handleRegisterClick} >Need to register?</span>
        {/* <span>OR</span> */}
        {/* <button className='gosignupbut'><SiGoogle />Sign in with google</button> */}
      </form>
    </div>
  );
}

export default Loginp;
