import React,{useState,useEffect} from 'react'
import './Adminregister.css'
import { useNavigate } from 'react-router-dom';
import axiosinstance from '../../Axios/Axios';


function Adminregister() {
    const [name,setName] = useState('');
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const [repassword,setRepassword] = useState('');
    const [errorMessage,setErrorMessage] = useState('');
    const [shake, setShake] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const registerAdmin = async (e) => {
        e.preventDefault();

        if (!name || !email || !password || !repassword ) {
            setErrorMessage('Please fill in all fields.');
            setShake(true);
            return;
        }

        // Name validation
        const nameRegex = /^[A-Z][a-zA-Z]{4,29}$/;
        if (!name.match(nameRegex)) {
            setErrorMessage('Name should start with a capital letter and be between 5 to 30 characters long (only alphabets).');
            setShake(true);
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.match(emailRegex)) {
            setErrorMessage('Please enter a valid email address.');
            setShake(true);
            return;
        }

        if (password.length < 6 || !/\d{6}/.test(password)) {
            setErrorMessage('Password should be at least 6 characters long and contain 6 numbers.');
            setShake(true);
            return;
        }

        try {
            setIsLoading(true);

            const neededData = {
                name,
                email,
                password,
                repassword,
            };
            const response = await axiosinstance.post('admin/register',neededData);
            const data = response.data;
            if (data.status === 'ok') {
                navigate('/admin/login')
            }else if(data.status === 'error'){
                setErrorMessage(data.message)
                setShake(true)
            }else{
                setErrorMessage('An error occurred. Please try again later');
                setShake(true)
            }
            
        } catch (error) {
            console.log(error);
            setErrorMessage('An error occurred. Please try again later');
            setShake(true);
        }finally{
            setIsLoading(false)
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
        <div className="admRegApp p-5">
            <div className={`admRegister-container ${shake ? 'shake' : ''}`}>
                <form onSubmit={registerAdmin} className="admRegister-form" onAnimationEnd={handleAnimationEnd} >
                    <div className="admDoc-logo-container">
                        <img src="/healtheaselogo.png" alt="Logo" className="admDoc-logo-image" />
                    </div>
                    <h1 className="admRegister-title">Register Admin</h1>
                    <p className="admRegister-description">Please fill in the following details:</p>
                    {errorMessage && <h6 className='text-danger text-center' >{errorMessage}</h6>}
                    <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        type="text"
                        className="admRegister-input"
                        placeholder="Name"
                        pattern="^[A-Za-z]+$"
                        title="Provide a valid name only with A-Z"
                        required
                    />

                    <input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        type="email"
                        className="admRegister-input"
                        placeholder="Email"
                        required
                    />
                    <input
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        type="password"
                        className="admRegister-input"
                        placeholder="Password"
                        required
                    />
                    <input
                        value={repassword}
                        onChange={(e) => setRepassword(e.target.value)}
                        type="password"
                        className="admRegister-input"
                        placeholder="Confirm Password"
                        required
                    />
                    <input type="submit" value="Register" className="admRegister-button" disabled={isLoading} />
                   
                    <p className="admThep pt-3" onClick={() => navigate('/admin/login')}>Need to login?</p>
                </form>
            </div>
        </div>

    )
}

export default Adminregister