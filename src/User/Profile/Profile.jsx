import React, { useEffect, useState } from 'react'
import './Profile.scss';
import axiosinstance from '../../Axios/Axios';
import { useNavigate } from 'react-router-dom';

import WalletTable from '../WalletTable/WalletTable';

import Swal from 'sweetalert2';

function Profile() {
    const navigate = useNavigate();

    const [user, setUserr] = useState(null);

    const [showDetails, setShowDetails] = useState(false);
    const [showEdit, setShowEdit] = useState(false)
    const [height, setHeight] = useState('');
    const [weight, setWeight] = useState('');
    const [age, setAge] = useState('');
    const [gender, setGender] = useState('');
    const [heighte, setHeighte] = useState('');
    const [weighte, setWeighte] = useState('');
    const [agee, setAgee] = useState('');
    const [gendere, setGendere] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [editError, setEditError] = useState('')
    const [namee, setNamee] = useState('')
    const [imagee, setImagee] = useState(null)
    const [main, setMain] = useState(true)

    const [proImageUrl, setProImgUrl] = useState('')


    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!token) {
            navigate('/login');
        } else {
            const fetchUserProfile = async () => {
                try {
                    const response = await axiosinstance.get('profile', {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    if (response.status === 200) {
                        setUserr(response.data);
                        setImagee(response.data.image);
                        setNamee(response.data.name);
                        setAgee(response.data.age);
                        setHeighte(response.data.height);
                        setWeighte(response.data.weight);
                        setGendere(response.data.gender);
                        setProImgUrl(response.data.image ? `/UserImages/${imagee}` : user.picture)
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops!',
                            text: 'There was an error, Please try after sometime',
                            confirmButtonText: 'OK',
                        })
                    }

                } catch (error) {
                    if (error.response) {
                        const status = error.response.status;
                        if (status === 404 || status === 500) {
                            Swal.fire({
                                icon: 'error',
                                title: 'Oops!',
                                text: error.response.data.message,
                                confirmButtonText: 'OK',
                            })
                        }
                    } 
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
        setEditError('')
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
        setErrorMessage('');
    }



    const handleeditsave = async (userId) => {
        try {
            setMain(true);
            let formData = new FormData();
            const nameRegex = /^[A-Z][a-zA-Z]{4,29}$/;

            if (!namee.match(nameRegex)) {
                setEditError('Name should start with a capital letter and be between 5 to 30 characters long (only alphabets).');
                return;
            }

            formData.append('name', namee);

            if (imagee) {
                formData.append("image", imagee);
            }

            if (agee && heighte && weighte && gendere) {
                if (isNaN(agee) || agee < 10 || agee > 100) {
                    setEditError('Age must be a number between 10 and 100.');
                    return;
                }

                if (isNaN(weighte) || weighte < 10 || weighte > 300) {
                    setEditError('Weight must be a number between 10 and 300.');
                    return;
                }

                if (isNaN(heighte) || heighte < 50 || heighte > 300) {
                    setEditError('Height must be a number between 50 and 300.');
                    return;
                }

                if (!gendere) {
                    setEditError('Please select a gender.');
                    return;
                }

                formData.append('age', agee);
                formData.append('height', heighte);
                formData.append('weight', weighte);
                formData.append('gender', gendere);
            }

            let response = await axiosinstance.post('edit-user-profile', formData , {
                headers : {'Authorization': `Bearer ${token}`}
            });

            if (response.status === 200) {
                setShowEdit(false);
                setUserr(response.data.updateduser);
                setEditError('');

                const walletBalance = calculateWalletBalance(response.data.updateduser.wallet);
                setUserr(prevUser => ({ ...prevUser, wallet: walletBalance }));
            } else {
                setEditError('There was an error in saving data');
            }

        } catch (error) {
            if (error.response) {
                const status = error.response.status;
                if (status === 404 || status === 500 || status === 400) {
                    setEditError(error.response.data.message);
                }
            } else {
                setEditError('There was an error in saving data');
                console.log(error);
            }
        }
    };


    const handleSave = async (userId) => {

        try {
            setMain(true)

            if (!age || !height || !weight || !gender) {
                setErrorMessage('Please fill in all fields.');
                return
            }

            if (isNaN(age) || age < 10 || age > 100) {
                setErrorMessage('Age must be a number between 10 and 100.');
                return;
            }

            if (isNaN(weight) || weight < 50 || weight > 300) {
                setErrorMessage('Weight must be a number between 50 and 300.');
                return;
            }

            if (isNaN(height) || height < 50 || height > 300) {
                setErrorMessage('Height must be a number between 50 and 300.');
                return;
            }

            if (!gender) {
                setErrorMessage('Please select a gender.');
                return;
            }


            const dataNeeded = {
                age,
                gender,
                height,
                weight,
            };
            const response = await axiosinstance.post('add-more-info', dataNeeded , {
                headers : {'Authorization': `Bearer ${token}`}
            });
            // const { status, user } = addMore.data;
            if (response.status === 200) {
                const updatedUser = response.data.user;
                const walletBalance = calculateWalletBalance(updatedUser.wallet);
                setUserr({ ...response.data.user, wallet: walletBalance });
                setShowDetails(false);
                setUserr(response.data.user);
                setErrorMessage('');

            } else {
                setErrorMessage('Error occurred while saving details.');
            }
        } catch (error) {
            if (error.response) {
                const status = error.response.status;
                if (status === 404 || status === 500) {
                    setErrorMessage(error.response.data.message);
                }
            } else {
                setErrorMessage('Error occurred while saving details.');
                console.log(error);
            }

        }
    };


    const calculateWalletBalance = (walletTransactions) => {
        if (!Array.isArray(walletTransactions)) {
            console.error('walletTransactions is not an array');
            return 0; // Return some default value or handle the error as needed
        }
        let balance = 0;
        for (const transaction of walletTransactions) {
            if (transaction.type === 'C') {
                balance += transaction.amount; // Credit
            } else if (transaction.type === 'D') {
                balance -= transaction.amount; // Debit
            }
        }
        return balance;
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


            <div className='pr-cookieCard'>
                {user && (
                    <div className="pr-userprocard ">
                        <p className="pr-cookieHeading mt-3">Profile</p>
                        {main && !isPopupOpen && (<>
                            <div className="userpro-img">

                                <img
                                    src={user.image ? `/UserImages/${user.image}` : user.picture}
                                    alt="Profile"
                                    style={{ width: "100%", height: "100%", borderRadius: "100%" }}
                                />
                            </div>
                            <span className='pr-user-sp'>{user.name}</span>
                            <h6 className="userprocarddet">{user.email}</h6>
                            {/* <h6 className="userprocarddet">Wallet Balance : ₹{calculateWalletBalance(user.wallet)}</h6> */}
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
                            <h3 className='text-white' >Edit Profile</h3>
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
                                    // onChange={(e) => setImagee(e.target.files.item(0))}
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
                                {editError && <p className="text-center text-danger">{editError}</p>}


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
                                <h3 className='text-white' >Add More Details</h3>
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
                                    {errorMessage && <p className="text-center text-danger">{errorMessage}</p>}

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