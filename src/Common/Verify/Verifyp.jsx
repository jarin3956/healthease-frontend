import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axiosinstance from '../../Axios/Axios';
import { Form } from 'react-bootstrap';
import './Verifyp.scss';

function Verifyp() {
  const [otp, setOtp] = useState('');
  const [verificationStatus, setVerificationStatus] = useState('');
  const [shake, setShake] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const [resendOtpStatus, setResendOtpStatus] = useState('');
  const [showButton, setShowButton] = useState(timer === 0);

  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get('id');
  const userType = queryParams.get('userType');
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      
      if (userType === 'user') {
        let usresponse = await axiosinstance.post('verify', {
          id,
          otp
        });
        let usdata = usresponse.data;
        if (usdata.status === 'ok') {
          navigate('/login');
        } else if (usdata.status === 'error') {
          setVerificationStatus('Verification failed: ' + usdata.message);
          setShake(true);
        }
      } else if (userType === 'doctor') {
        let docresponse = await axiosinstance.post('doctor/verify', {
          id,
          otp
        });
        let docdata = docresponse.data;
        if (docdata.status === 'ok') {
          
              navigate('/doctor/login');
            
          
        } else if (docdata.status === 'error') {
          setVerificationStatus('Verification failed: ' + docdata.message);
          setShake(true);
        }
      }
    } catch (error) {
      console.log(error);
      setVerificationStatus('Verification failed');
      setShake(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (userType === 'user') {
      try {
        let resendotpuser = await axiosinstance.post('resend-otp', { userId: id });
        let reuserdata = resendotpuser.data;
        if (reuserdata.status === 'ok') {
          setResendOtpStatus('success');
          setTimer(60);
          setShowButton(false);
        } else {
          setResendOtpStatus('error');
        }
      } catch (error) {
        setResendOtpStatus('error');
        console.log(error);
      }
    } else if (userType === 'doctor') {
      try {
        let resendotpdoc = await axiosinstance.post('doctor/resend-otp', { doctorId: id });
        let redocdata = resendotpdoc.data;
        if (redocdata.status === 'ok') {
          setResendOtpStatus('success');
          setTimer(60);
          setShowButton(false);
        } else {
          setResendOtpStatus('error');
        }

      } catch (error) {
        setResendOtpStatus('error');
        console.log(error);
      }
    }
  };

  function handleAnimationEnd() {
    setShake(false);
  }

  useEffect(() => {
    if (verificationStatus) {
      setShake(true);
      setTimeout(() => {
        setShake(false);
      }, 1000);
    }
  }, [verificationStatus]);

  useEffect(() => {
    if (timer > 0) {
      const countdown = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
      return () => {
        clearInterval(countdown);
      };
    } else {
      setShowButton(true);
    }
  }, [timer]);

  useEffect(() => {
    setShowButton(resendOtpStatus !== 'success');
    if (resendOtpStatus === 'success') {
      setTimer(60);
    }
  }, [resendOtpStatus]);

  return (
    <div className="VerifyPage p-3">
      <div className={`verify-register-container ${shake ? 'shake' : ''}`}>
          <Form onSubmit={handleSubmit} className="register-form" onAnimationEnd={handleAnimationEnd}>
            <div className="doc-logover-container">
              <img src="/healtheaselogo.png" alt="Logo" className="doc-logover-image" />
            </div>
            <h1 className="verify-title">Verify</h1>
            <p className="verify-description">Please enter the OTP</p>
            <p className="verify-description">OTP will expire in {timer} seconds</p>
            <Form.Control
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              type="text"
              className="verify-input"
              placeholder="Enter OTP"
              required
            />
            <button type="submit" className="verify-button" disabled={isLoading}>
              {isLoading ? 'Verifying...' : 'Verify'}
            </button>
            {verificationStatus && <h6 className="text-center text-danger">{verificationStatus}</h6>}
            {resendOtpStatus === 'success' && <p className="text-center text-success">OTP Resent Successfully</p>}
            {resendOtpStatus === 'error' && <p className="text-center text-danger">Failed to Resend OTP</p>}
          </Form>
          <br />
          {showButton && (
            <button className="verify-button" onClick={handleResendOTP}>
              Resend OTP
            </button>
          )}
        </div>
    </div>
  );
}

export default Verifyp;
