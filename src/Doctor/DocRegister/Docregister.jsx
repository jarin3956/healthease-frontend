import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { axiosinstance } from '../../Axios/Axios'
import './Docregister.scss'


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
            formData.append('name', name);
            formData.append('email', email);
            formData.append('password', password);
            formData.append('repassword', repassword);
            formData.append('profileimg', profileimg);
            const response = await axiosinstance.post('doctor/register', formData);

            const data = response.data
            if (response.status === 200) {
                console.log('Registration successful');
                navigate(`/doctor/verify?id=${data.id}&userType=doctor`);
            }

        } catch (error) {
            setShake(true)
            console.log(error);
        } finally {
            setLoading(false)
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