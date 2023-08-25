import React, { useEffect, useState } from 'react'
import './Profile.scss';
import { createInstance } from '../../Axios/Axios';
import { useNavigate } from 'react-router-dom';
import WalletTable from '../WalletTable/WalletTable';
import Swal from 'sweetalert2';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Image } from 'cloudinary-react';
import CryptoJS from 'crypto-js';
import cloudinaryConfig from '../../cloudinaryConfig';

function Profile() {

    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    const [user, setUserr] = useState(null);
    const [showDetails, setShowDetails] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [height, setHeight] = useState('');
    const [weight, setWeight] = useState('');
    const [age, setAge] = useState('');
    const [gender, setGender] = useState('');
    const [heighte, setHeighte] = useState('');
    const [weighte, setWeighte] = useState('');
    const [agee, setAgee] = useState('');
    const [gendere, setGendere] = useState('');
    const [namee, setNamee] = useState('');
    const [imagee, setImagee] = useState(null);
    const [main, setMain] = useState(true);
    const [proImageUrl, setProImgUrl] = useState('');

    const cloudName = cloudinaryConfig.cloudName;
    const apiKey = cloudinaryConfig.apiKey ;
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

    useEffect(() => {
        if (!token) {
            navigate('/login');
        } else {
            const fetchUserProfile = async () => {

                try {

                    const axiosInstance = createInstance(token)
                    const response = await axiosInstance.get('profile')

                    if (response.status === 200) {
                        setUserr(response.data);
                        setImagee(response.data.image);
                        setNamee(response.data.name);
                        setAgee(response.data.age);
                        setHeighte(response.data.height);
                        setWeighte(response.data.weight);
                        setGendere(response.data.gender);
                        setProImgUrl(response.data.image ? imagee : user.picture)
                    }

                } catch (error) {
                    console.log(error);
                }
            };

            fetchUserProfile();
        }
    }, [showEdit]);


    const handleedit = () => {
        setShowEdit(true)
        setShowDetails(false);
        setMain(false)
    }
    const closeEdit = () => {
        setShowEdit(false)
        setMain(true)

    }
    const handleAddMoreDetails = () => {
        setShowDetails(true);
        setShowEdit(false);
        setMain(false)
    };
    const closemore = () => {
        setShowDetails(false);
        setMain(true)
        setAge('');
        setGender('');
        setHeight('');
        setWeight('');
    }



    const handleeditsave = async (userId) => {

        try {
            setMain(true);
            let formData = new FormData();

            const nameRegex = /^[A-Z][a-zA-Z]{4,29}$/;
            if (!namee.match(nameRegex)) {
                toast.error('Name should start with a capital letter and be between 5 to 30 characters long (only alphabets).');
                setShowEdit(true);
                setMain(false);
                return;
            }

            formData.append('name', namee);

            if (imagee) {
                // formData.append("image", imagee);
                let formDataCloud = new FormData();
                formDataCloud.append('file', imagee);
                const { signature, timestamp } = generateSignature();
                formDataCloud.append('signature', signature);
                formDataCloud.append('timestamp', timestamp);
                formDataCloud.append('api_key', apiKey);
                formDataCloud.append('upload_preset', cloudinaryUploadPreset);

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
                    formData.append("image", cloudinaryUrl);
                } else {
                    toast.error('Cannot upload image. Please try again later');
                    setShowEdit(true);
                    setMain(false);
                }
            }

            if (agee && heighte && weighte && gendere) {

                if (isNaN(agee) || agee < 10 || agee > 100) {
                    toast.error('Age must be a number between 10 and 100.');
                    setShowEdit(true);
                    setMain(false);
                    return;
                }

                if (isNaN(weighte) || weighte < 10 || weighte > 300) {
                    toast.error('Weight must be a number between 10 and 300.');
                    setShowEdit(true);
                    setMain(false);
                    return;
                }

                if (isNaN(heighte) || heighte < 50 || heighte > 300) {
                    toast.error('Height must be a number between 50 and 300.');
                    setShowEdit(true);
                    setMain(false);
                    return;
                }

                if (!gendere) {
                    toast.error('Please select a gender.');
                    setShowEdit(true);
                    setMain(false);
                    return;
                }

                formData.append('age', agee);
                formData.append('height', heighte);
                formData.append('weight', weighte);
                formData.append('gender', gendere);
            }

            const axiosInstance = createInstance(token)

            const response = await axiosInstance.post('edit-user-profile', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })

            if (response.status === 200) {
                setShowEdit(false);
                setUserr(response.data.updateduser);
                toast.success(response.data.message)

                const walletBalance = calculateWalletBalance(response.data.updateduser.wallet);
                setUserr(prevUser => ({ ...prevUser, wallet: walletBalance }));
            } else {
                toast.error('There was an error in saving data');
                setShowEdit(true);
                setMain(false);

            }

        } catch (error) {
            console.log(error);
        }
    };


    const handleSave = async (userId) => {

        try {
            setMain(true)

            if (!age || !height || !weight || !gender) {
                toast.error('Please fill in all fields.');
                setShowDetails(true);
                setMain(false);
                return
            }

            if (isNaN(age) || age < 10 || age > 100) {
                toast.error('Age must be a number between 10 and 100.');
                setShowDetails(true);
                setMain(false);

                return;
            }

            if (isNaN(weight) || weight < 50 || weight > 300) {
                toast.error('Weight must be a number between 50 and 300.');
                setShowDetails(true);
                setMain(false);
                return;
            }

            if (isNaN(height) || height < 50 || height > 300) {
                toast.error('Height must be a number between 50 and 300.');
                setShowDetails(true);
                setMain(false);
                return;
            }

            if (!gender) {
                toast.error('Please select a gender.');
                setShowDetails(true);
                setMain(false);
                return;
            }


            const dataNeeded = {
                age,
                gender,
                height,
                weight,
            };

            const axiosInstance = createInstance(token)
            const response = await axiosInstance.post('add-more-info', dataNeeded)

            if (response.status === 200) {
                const updatedUser = response.data.user;
                const walletBalance = calculateWalletBalance(updatedUser.wallet);
                setUserr({ ...response.data.user, wallet: walletBalance });
                setShowDetails(false);
                setUserr(response.data.user);
                toast.success(response.data.message)
            }
        } catch (error) {
            console.log(error);
        }
    };


    const calculateWalletBalance = (walletTransactions) => {
        if (!Array.isArray(walletTransactions)) {
            console.error('walletTransactions is not an array');
            return 0;
        }
        let balance = 0;
        for (const transaction of walletTransactions) {
            if (transaction.type === 'C') {
                balance += transaction.amount;
            } else if (transaction.type === 'D') {
                balance -= transaction.amount;
            }
        }
        return balance.toFixed(2);
    };


    const [isPopupOpen, setIsPopupOpen] = useState(false);

    const openPopup = () => {
        setIsPopupOpen(true);
    };

    const closePopup = () => {
        setIsPopupOpen(false);
    };

    const walletBalance = user && user.wallet ? calculateWalletBalance(user.wallet) : 0;
    return (
        <>
            <ToastContainer />
            <div className='pr-cookieCard'>
                {user && (
                    <div className="pr-userprocard ">
                        <p className="pr-cookieHeading mt-3">Profile</p>
                        {main && !isPopupOpen && (<>
                            <div className="userpro-img">
                                <img
                                    src={user.image ? user.image : user.picture}
                                    alt="Profile"
                                    style={{ width: "100%", height: "100%", borderRadius: "100%" }}
                                />
                            </div>
                            <span className='pr-user-sp'>{user.name}</span>
                            <h6 className="userprocarddet">{user.email}</h6>
                            {user.age && <h6 className="userprocarddet">Age : {user.age}</h6>}
                            {user.gender && <h6 className="userprocarddet">Gender : {user.gender}</h6>}
                            {user.height && <h6 className="userprocarddet">Height : {user.height}cms</h6>}
                            {user.weight && <h6 className="userprocarddet">Weight : {user.weight}kgs</h6>}
                            <div className='d-flex '>
                                <button className="userprocardbutt  " onClick={handleedit} >Edit</button>
                                {user.age && user.gender && user.height && user.weight ? null : (
                                    <button className="userprocardbutt ms-2 " onClick={handleAddMoreDetails}>Add More</button>
                                )}
                                <button className="userprocardbutt ms-2" onClick={openPopup} >Wallet</button>
                            </div>
                        </>)}
                        {isPopupOpen && (
                            <div className="popup-overlay">
                                <div className="popup-content">
                                    <div className='d-flex justify-content-center p-2' >
                                        <button onClick={closePopup} className="noselect">
                                            <span className="text">Close</span><span className="icon">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                                    <path d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z">
                                                    </path>
                                                </svg>
                                            </span>
                                        </button>
                                    </div>
                                    <div>
                                        {walletBalance ? (
                                            <h6 className="text-center text-bold text-success">Wallet Balance : ₹{walletBalance}</h6>
                                        ) : (
                                            <h6 className="text-center text-bold text-danger">Wallet Balance : ₹{walletBalance}</h6>
                                        )}
                                    </div>
                                    {user.wallet.length > 0 && (
                                        <WalletTable userwallet={user.wallet} />
                                    )}
                                </div>
                            </div>
                        )}
                        {showEdit && (<>
                            <h3 style={{ color: '#3D4102' }} >Edit Profile</h3>
                            <div className='p-3 theedit-pan rounded-3 mb-3'>
                                <input
                                    type="text"
                                    value={namee}
                                    className='more-input'
                                    onChange={(e) => setNamee(e.target.value)}
                                    placeholder="Name"
                                />
                                <img
                                    src={proImageUrl}
                                    alt="profile image"
                                    style={{ width: '100px', height: '100px' }}
                                    className='more-img-input p-2 rounded-3'
                                />
                                <input
                                    type="file"
                                    onChange={(e) => {
                                        const file = e.target.files.item(0);
                                        setImagee(file)
                                        setProImgUrl(URL.createObjectURL(file));
                                    }}
                                    accept="image/*"
                                    className="more-input bg-white" />
                                {user.age && user.gender && user.weight && user.height ? (<>
                                    <input
                                        type="text"
                                        value={heighte}
                                        className='more-input'
                                        onChange={(e) => setHeighte(e.target.value)}
                                        placeholder="Height (cm)"
                                    />
                                    <input
                                        type="text"
                                        value={weighte}
                                        className='more-input'
                                        onChange={(e) => setWeighte(e.target.value)}
                                        placeholder="Weight (kg)"
                                    />
                                    <input
                                        type="text"
                                        value={agee}
                                        className='more-input'
                                        onChange={(e) => setAgee(e.target.value)}
                                        placeholder="Age"
                                    />
                                    <p className=" text-center" style={{ fontWeight: '800' }}>Gender</p>
                                    <div className="gender-selection">
                                        <br />
                                        <label className="text-white p-2">
                                            <input
                                                type="radio"
                                                name="gender"
                                                value="male"
                                                checked={gendere === "male"}
                                                onChange={(e) => setGendere(e.target.value)}
                                            />
                                            Male
                                        </label>
                                        <label className="text-white p-2">
                                            <input
                                                type="radio"
                                                name="gender"
                                                value="female"
                                                checked={gendere === "female"}
                                                onChange={(e) => setGendere(e.target.value)}
                                            />
                                            Female
                                        </label>
                                        <label className="text-white p-2">
                                            <input
                                                type="radio"
                                                name="gender"
                                                value="others"
                                                checked={gendere === "others"}
                                                onChange={(e) => setGendere(e.target.value)}
                                            />
                                            Others
                                        </label>
                                    </div></>) : null}
                                <div className='d-flex ' >
                                    <button className="userprocardbutt" onClick={() => handleeditsave(user._id)} >
                                        Save
                                    </button>
                                    <button className="userprocardbutt ms-2" onClick={closeEdit} >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </>)}
                        {showDetails && (
                            <>
                                <h3 style={{ color: '#3D4102' }} >Add More Details</h3>
                                <div className='p-3 theedit-pan rounded-3 m-3'>
                                    <input
                                        type="text"
                                        value={height}
                                        className='more-input'
                                        onChange={(e) => setHeight(e.target.value)}
                                        placeholder="Height (cm)"
                                    />
                                    <input
                                        type="text"
                                        value={weight}
                                        className='more-input'
                                        onChange={(e) => setWeight(e.target.value)}
                                        placeholder="Weight (kg)"
                                    />
                                    <input
                                        type="text"
                                        value={age}
                                        className='more-input'
                                        onChange={(e) => setAge(e.target.value)}
                                        placeholder="Age"
                                    />
                                    <p className=" text-center" style={{ fontWeight: '800' }}>Gender</p>
                                    <div className="gender-selection">
                                        <br />
                                        <label className="text-white p-2">
                                            <input
                                                type="radio"
                                                name="gender"
                                                value="male"
                                                checked={gender === "male"}
                                                onChange={(e) => setGender(e.target.value)}
                                            />
                                            Male
                                        </label>
                                        <label className="text-white p-2">
                                            <input
                                                type="radio"
                                                name="gender"
                                                value="female"
                                                checked={gender === "female"}
                                                onChange={(e) => setGender(e.target.value)}
                                            />
                                            Female
                                        </label>
                                        <label className="text-white p-2">
                                            <input
                                                type="radio"
                                                name="gender"
                                                value="others"
                                                checked={gender === "others"}
                                                onChange={(e) => setGender(e.target.value)}
                                            />
                                            Others
                                        </label>
                                    </div>
                                    <div className='d-flex ' >
                                        <button className="userprocardbutt" onClick={() => handleSave(user._id)} >
                                            Save
                                        </button>
                                        <button className="userprocardbutt ms-2" onClick={closemore} >
                                            Close
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>
        </>
    )
}

export default Profile