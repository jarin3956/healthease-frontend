import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { axiosinstance } from '../../Axios/Axios';
import './Docregister.scss';
import { Image } from 'cloudinary-react';
import CryptoJS from 'crypto-js';
import cloudinaryConfig from '../../cloudinaryConfig';


function Docregister() {

    const navigate = useNavigate()

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [repassword, setRepassword] = useState('')
    const [profileimg, setProfileimg] = useState(null)
    const [loading, setLoading] = useState(false);
    const [errormsg, setError] = useState('');
    const [shake, setShake] = useState(false);

    const cloudName = cloudinaryConfig.cloudName;
    const apiKey = cloudinaryConfig.apiKey;
    const apiSecret = cloudinaryConfig.apiSecret;
    const cloudinaryUploadPreset = 'healthease_images';

    const generateSignature = () => {
        const timestamp = Math.floor(Date.now() / 1000);
        const paramsToSign = `timestamp=${timestamp}&upload_preset=${cloudinaryUploadPreset}${apiSecret}`;
        const signature = CryptoJS.SHA1(paramsToSign).toString();
        return {
            signature,
            timestamp
        };
    };


    const registerDoctor = async (e) => {

        e.preventDefault();

        setLoading(true);
        setError('');

        if (!name || !email || !password || !repassword || !profileimg) {
            setError('Please fill in all fields.');
            setShake(true);
            setLoading(false);
            return;
        }

        const nameRegex = /^[A-Z][a-zA-Z]{4,29}$/;
        if (!name.match(nameRegex)) {
            setError('Name should start with a capital letter and be between 5 to 30 characters long (only alphabets).');
            setShake(true);
            setLoading(false);
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.match(emailRegex)) {
            setError('Please enter a valid email address.');
            setShake(true);
            setLoading(false);
            return;
        }

        if (password.length < 6 || !/\d{6}/.test(password)) {
            setError('Password should be at least 6 characters long and contain 6 numbers.');
            setShake(true);
            setLoading(false);
            return;
        }

        if (!profileimg.type.includes('image')) {
            setError('Please upload a valid profile image.');
            setShake(true);
            setLoading(false);
            return;
        }

        try {
            const formData = new FormData();
            // formData.append('name', name);
            // formData.append('email', email);
            // formData.append('password', password);
            // formData.append('repassword', repassword);
            // formData.append('profileimg', profileimg);
            const { signature, timestamp } = generateSignature();
            formData.append('file', profileimg);
            formData.append('signature', signature);
            formData.append('timestamp', timestamp);
            formData.append('api_key', apiKey);
            formData.append('upload_preset', cloudinaryUploadPreset);

            const response = await fetch(
                `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
                {
                    method: 'POST',
                    body: formData,
                }
            );

            const data = await response.json();

            if (data.secure_url) {
                const cloudinaryUrl = data.secure_url;
                const response = await axiosinstance.post('doctor/register', {
                    name,
                    email,
                    password,
                    repassword,
                    profileimg: cloudinaryUrl,
                });

                const resdata = response.data
                if (response.status === 200) {
                    console.log('Registration successful');
                    navigate(`/doctor/verify?id=${resdata.id}&userType=doctor`);
                }
            } else {
                setError('Cannot upload image. Please try again later');
                setShake(true);
            }

        } catch (error) {
            setShake(true)
            console.log(error);
        } finally {
            setLoading(false)
            e.target.submit();
        }
    }

    function handleAnimationEnd() {
        setShake(false);
    }

    useEffect(() => {
        if (errormsg) {
            setShake(true);
            setTimeout(() => {
                setShake(false)
            }, 1000);
        }
    }, [errormsg])


    return (
        <div className="DocRegApp p-5">
            <div className={`doc-register-container ${shake ? 'shake' : ''}`}>
                <form onSubmit={registerDoctor} encType="multipart/form-data" className="register-form" onAnimationEnd={handleAnimationEnd} >
                    <div className="doc-logo-container">
                        <img src="/healtheaselogo.png" alt="Logo" className="doc-logo-image" />
                    </div>
                    <h1 className="register-title">Register</h1>
                    <p className="register-description">Please fill in the following details:</p>
                    <input value={name} onChange={(e) => setName(e.target.value)} type="text" className="register-input" placeholder="Name" required />
                    <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="register-input" placeholder="Email" required />
                    <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" className="register-input" placeholder="Password" required />
                    <input value={repassword} onChange={(e) => setRepassword(e.target.value)} type="password" className="register-input" placeholder="Confirm Password" required />
                    <p className="gender-title">Upload Profile Picture</p>
                    <input type="file" onChange={(e) => setProfileimg(e.target.files.item(0))} accept="image/*" className="custom-file-upload" required />
                    {errormsg && <p className="error-message text-danger text-center">{errormsg}</p>}

                    <input type="submit" value={loading ? 'Registering...' : 'Register'} className="register-button" disabled={loading} />
                    <p className="thep pt-3" onClick={() => navigate('/doctor/login')}>
                        Already a user?
                    </p>
                </form>
            </div>
        </div>
    )
}

export default Docregister