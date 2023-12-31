import React, { useEffect, useState } from 'react'
import { createInstance, axiosinstance } from '../../Axios/Axios';
import { useNavigate } from 'react-router-dom';
import './Docprofile.scss'
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Image } from 'cloudinary-react';
import CryptoJS from 'crypto-js';
import cloudinaryConfig from '../../cloudinaryConfig';

import {
    MDBCol,
    MDBContainer,
    MDBRow,
    MDBCard,
    MDBCardText,
    MDBCardBody,
    MDBCardImage,
    MDBBtn,
    MDBListGroup,
} from 'mdb-react-ui-kit';

import Swal from 'sweetalert2';


function Docprofile() {

    const doctortoken = localStorage.getItem('doctortoken');
    const navigate = useNavigate();

    const [doctor, setDoctor] = useState(null);
    const [showMore, setShowMore] = useState(false);
    const [docId, setDocId] = useState('');
    const [age, setAge] = useState('');
    const [fare, setFare] = useState('');
    const [gender, setGender] = useState('');
    const [regno, setRegno] = useState('');
    const [specialization, setSpecialization] = useState('');
    const [experience, setExperience] = useState('');
    const [certificate, setCertificate] = useState(null);
    const [spec, setSpec] = useState([]);
    const [theMain, setTheMain] = useState(true);
    const [rating, setRating] = useState(null);


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

    useEffect(() => {
        if (!doctortoken) {
            navigate('/doctor/login')
        } else {

            const getProfile = async () => {
                try {
                    const axiosInstance = createInstance(doctortoken)
                    const response = await axiosInstance.get('doctor/profile')

                    if (response.status === 200) {
                        setDoctor(response.data.doctor);
                        if (response.data.average) {
                            setRating(response.data.average)
                        }
                    }

                } catch (error) {
                    console.log(error);
                }
            }
            getProfile();
        }
    }, []);


    useEffect(() => {
        const fetchSpec = async () => {
            try {
                const response = await axiosinstance.get('specialization/view');

                if (response.status === 200) {
                    setSpec(response.data.spec)
                } else {
                    toast.error('Could not process now, Please try after sometime');
                }

            } catch (error) {
                console.log(error);
            }
        }
        fetchSpec()

    }, [])


    let startJorney = () => {
        setShowMore(true)
        setTheMain(false)
    }

    const closeStart = () => {
        setShowMore(false)
        setTheMain(true)
    }

    const handlesave = async (docId, e) => {

        e.preventDefault();

        setDocId(docId)

        if (!age || !gender || !regno || !specialization || !experience || !certificate) {
            toast.error('Please fill in all fields.');
            return;
        }

        const ageNum = parseInt(age);
        if (isNaN(ageNum) || ageNum < 23 || ageNum > 80) {
            toast.error('Age should be a number between 23 to 80.');
            return;
        }

        const fareNum = parseInt(fare);
        if (isNaN(fareNum)) {
            toast.error("Fare should be a number between 100 and 2000.")
            return

        }

        if (!gender) {
            toast.error('Please select a gender.');
            return;
        }

        const regnoRegex = /^[A-Z0-9]{6,12}$/;
        if (!regno.match(regnoRegex)) {
            toast.error('Registration number should only include capital letters and numbers, with a length of 6 to 12 characters.');
            return;
        }

        if (!specialization) {
            toast.error('Please select a specialization.');
            return;
        }

        const experienceNum = parseInt(experience);
        if (isNaN(experienceNum) || experienceNum < 0 || experienceNum > 40) {
            toast.error('Experience should be a number between 0 to 40.');
            return;
        }
        if (!certificate.type.includes('image')) {
            toast.error('Please upload a valid certificate image.');
            return;
        }

        try {
            const formData = new FormData();
            // formData.append('docId', docId)
            // formData.append('age', age);
            // formData.append('gender', gender);
            // formData.append('regno', regno);
            // formData.append('specialization', specialization);
            // formData.append('fare', fare)
            // formData.append('experience', experience);
            // formData.append('certificate', certificate);
            const { signature, timestamp } = generateSignature();
            formData.append('file', certificate);
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
                const axiosInstance = createInstance(doctortoken)
                const response = await axiosInstance.post('doctor/start-journey', {
                    docId,
                    age,
                    gender,
                    regno,
                    specialization,
                    fare,
                    experience,
                    certificate:cloudinaryUrl,
                })

                if (response.status === 200) {
                    setDoctor(response.data.doctor);

                    let emailverify = await axiosinstance.post('doctor/send-verifyemail', { doctorId: docId });
                    if (emailverify.status === 200) {
                        setShowMore(false)
                        toast.success(emailverify.data.message);
                    } else {
                        toast.error(emailverify.data.message);
                    }

                }

            } else {
                toast.error('Cannot upload image. Please try again later');
            }


        } catch (error) {
            console.log(error);
        }
    }

    const editDoc = (e) => {
        Swal.fire({
            icon: 'warning',
            title: 'Are you sure?',
            text: 'You cannot schedule for the next 24 hours!',
            showCancelButton: true,
            confirmButtonText: 'Yes, edit profile!',
            cancelButtonText: 'No, keep it',
            confirmButtonColor: '#FF0000',
            cancelButtonColor: '#333333',
        }).then((result) => {
            if (result.isConfirmed) {
                handleedit(e)
            }
        });
    }

    const handleedit = (e) => {
        e.preventDefault()
        navigate('/doctor/edit-profile')
    }

    const renderStars = () => {
        if (rating) {
            const stars = [];
            for (let i = 0; i < rating; i++) {
                stars.push(<span key={i} className="star-icon-docpro">⭐</span>);
            }
            return stars;
        } else {
            return doctor.regno;
        }
    };



    return (
        <>

            <ToastContainer />
            <div >
                {doctor && (
                    <>
                        {doctor.age && (
                            <section className=' doc-profile-page' >
                                <MDBContainer className="py-5">
                                    <p className="text-center text-white mt-3" style={{ fontWeight: '700', fontSize: '30px' }}>Profile</p>
                                    <MDBRow>
                                        <MDBCol lg="4">
                                            <MDBCard className="mb-4">
                                                <MDBCardBody className="text-center">
                                                    <MDBCardImage
                                                        src={doctor.profileimg}
                                                        alt="avatar"
                                                        className="rounded-3 m-2"
                                                        style={{ width: '149px', height: '149px' }}
                                                        fluid
                                                    />
                                                    <p className="text-muted mb-1 mt-1">Dr.{doctor.name}</p>
                                                    <p className="text-muted mb-4">{doctor.email}</p>
                                                    <div className="d-flex justify-content-center mb-2">
                                                        <button className='edit-doc-butt' onClick={(e) => editDoc(e)}>Edit</button>
                                                        {!doctor.age && <MDBBtn outline className="ms-1" onClick={startJorney}>Start Journey</MDBBtn>}
                                                    </div>
                                                </MDBCardBody>
                                            </MDBCard>

                                            {doctor.certificate && (
                                                <MDBCard className="mb-4 mb-lg-0">
                                                    <MDBCardBody className="p-0">
                                                        <MDBListGroup flush className="rounded-3">
                                                            <p className="text-muted text-center mb-1 mt-1">Certificates</p>
                                                            <div className="d-flex justify-content-center mb-3">
                                                                <MDBCardImage
                                                                    src={doctor.certificate}
                                                                    alt="avatar"
                                                                    className="rounded-3 m-2"
                                                                    style={{ width: '190px', height: '100px' }}
                                                                    fluid
                                                                />
                                                            </div>
                                                        </MDBListGroup>
                                                    </MDBCardBody>
                                                </MDBCard>
                                            )}

                                        </MDBCol>
                                        <MDBCol lg="8">
                                            <MDBCard className="mb-4">
                                                <MDBCardBody>
                                                    <h3 className="text-center mb-1 mt-1 ">More Details</h3>
                                                    {doctor.age && (
                                                        <MDBRow>
                                                            <MDBCol sm="3">
                                                                <MDBCardText>Age</MDBCardText>
                                                            </MDBCol>
                                                            <MDBCol sm="9">
                                                                <MDBCardText className="text-muted">{doctor.age}</MDBCardText>
                                                            </MDBCol>
                                                        </MDBRow>
                                                    )}

                                                    <hr />
                                                    {doctor.gender && (
                                                        <MDBRow>
                                                            <MDBCol sm="3">
                                                                <MDBCardText>Gender</MDBCardText>
                                                            </MDBCol>
                                                            <MDBCol sm="9">
                                                                <MDBCardText className="text-muted">{doctor.gender}</MDBCardText>
                                                            </MDBCol>
                                                        </MDBRow>
                                                    )}

                                                    <hr />
                                                    {doctor.regno && (
                                                        <MDBRow>
                                                            <MDBCol sm="3">
                                                                <MDBCardText>{rating ? 'Your Rating' : 'Reg.No'}</MDBCardText>
                                                            </MDBCol>
                                                            <MDBCol sm="9">
                                                                <MDBCardText className="text-muted">{renderStars()}</MDBCardText>
                                                            </MDBCol>
                                                        </MDBRow>
                                                    )}

                                                    <hr />
                                                    {doctor.specialization && (
                                                        <MDBRow>
                                                            <MDBCol sm="3">
                                                                <MDBCardText>Specialization</MDBCardText>
                                                            </MDBCol>
                                                            <MDBCol sm="9">
                                                                <MDBCardText className="text-muted">{doctor.specialization}</MDBCardText>
                                                            </MDBCol>
                                                        </MDBRow>
                                                    )}

                                                    <hr />
                                                    {doctor.experience && (
                                                        <MDBRow>
                                                            <MDBCol sm="3">
                                                                <MDBCardText>Experience</MDBCardText>
                                                            </MDBCol>
                                                            <MDBCol sm="9">
                                                                <MDBCardText className="text-muted">{doctor.experience} Years</MDBCardText>
                                                            </MDBCol>
                                                        </MDBRow>
                                                    )}

                                                </MDBCardBody>
                                            </MDBCard>
                                            <MDBCard className="mb-4">
                                                <MDBCardBody>
                                                    <h3 className="text-center mb-1 mt-1 ">Schedule</h3>

                                                    {doctor.approval && (<div className='the-doc-sche'>
                                                        <button className='shed-butt' onClick={() => navigate('/doctor/view-schedule')} >Schedule</button>
                                                    </div>)}
                                                    {!doctor.approval && <p className="text-danger text-center p-4">You are not verified by admin, you will be informed after admin's verification</p>}


                                                </MDBCardBody>
                                            </MDBCard>
                                        </MDBCol>
                                    </MDBRow>
                                </MDBContainer>
                            </section>
                        )}

                        {!doctor.age && (
                            <section className=' doc-profile-page' style={{ minHeight: '100vh' }} >
                                <MDBContainer className="py-5">
                                    <p className="text-center text-white mt-3" style={{ fontWeight: '700', fontSize: '30px' }}>Profile</p>
                                    <MDBRow>
                                        <MDBCol lg="12">
                                            {theMain && (
                                                <MDBCard className="mb-4">
                                                    <MDBCardBody className="text-center">
                                                        {/* {errorMessage && <h6 className="text-center text-danger">{errorMessage}</h6>}
                                                        {successmsg && <h6 className="text-center text-success">Successful, {successmsg}</h6>} */}
                                                        <MDBCardImage
                                                            src={doctor.profileimg}
                                                            alt="avatar"
                                                            className="rounded-3 m-2"
                                                            style={{ width: '153px', height: '153px' }}
                                                            fluid
                                                        />
                                                        <p className="text-muted mb-1 mt-1">Dr.{doctor.name}</p>
                                                        <p className="text-muted mb-4">{doctor.email}</p>
                                                        <div className="the-doc-butt mb-2">
                                                            {/* <button onClick={handleedit} className='doc-cardbutt'  >Edit</button> */}
                                                            {!doctor.age && <button outline className="doc-cardbutt" onClick={(e) => startJorney(e)}>Start</button>}
                                                        </div>
                                                    </MDBCardBody>
                                                </MDBCard>
                                            )}
                                            {showMore && (
                                                <>
                                                    <div className='d-flex justify-content-center bg-white rounded-3 the-doc-showmore'>
                                                        <form encType="multipart/form-data" className='the-showmore-form' >
                                                            <h3 className='text-white the-showmoreh' >Start Your Journey</h3>
                                                            {/* {errorMessage && <h6 className="text-center text-danger">{errorMessage}</h6>} */}
                                                            <input value={age} onChange={(e) => setAge(e.target.value)} type="text" className="doc-addmore-input" placeholder="Age" required />

                                                            <div className="doc-gender-selection">
                                                                <div className='text-center'>
                                                                    <p className="doc-gender-title ">Gender :</p>
                                                                </div>

                                                                <label className="doc-gender-label">
                                                                    <input
                                                                        type="radio"
                                                                        name="gender"
                                                                        value="male"
                                                                        checked={gender === "male"}
                                                                        onChange={(e) => setGender(e.target.value)}
                                                                    />
                                                                    Male
                                                                </label>
                                                                <label className="doc-gender-label">
                                                                    <input
                                                                        type="radio"
                                                                        name="gender"
                                                                        value="female"
                                                                        checked={gender === "female"}
                                                                        onChange={(e) => setGender(e.target.value)}
                                                                    />
                                                                    Female
                                                                </label>
                                                                <label className="doc-gender-label">
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
                                                            <input value={regno} onChange={(e) => setRegno(e.target.value)} type="text" className="doc-addmore-input" placeholder="Register.No" required />
                                                            <div>
                                                                <label className='text-center'>Specialization</label>
                                                                <select className='docselect' value={specialization} onChange={(e) => setSpecialization(e.target.value)} required>
                                                                    <option className='docoption' value="">Select Specialization</option>
                                                                    {spec.map((spec, index) => (
                                                                        <option key={index} className='docoption' value={spec._id}>{spec.name}</option>
                                                                    ))}
                                                                </select>
                                                            </div>
                                                            <input value={experience} onChange={(e) => setExperience(e.target.value)} type="text" className="doc-addmore-input" placeholder="Experience" required />
                                                            <p className="doc-gender-title">Upload Certificates</p>
                                                            <input type="file" onChange={(e) => setCertificate(e.target.files.item(0))} accept="image/*" className="doc-file-upload" required />
                                                            <input value={fare} onChange={(e) => setFare(e.target.value)} type="number" className="doc-addmore-input" placeholder="Fare" required />
                                                            <div className='d-flex mb-3' >
                                                                <button className="doc-procardbutt" onClick={(e) => handlesave(doctor._id, e)} >
                                                                    Save
                                                                </button>
                                                                <button className="doc-procardbutt" onClick={closeStart} >
                                                                    Close
                                                                </button>
                                                            </div>
                                                        </form>
                                                    </div>
                                                </>
                                            )}
                                        </MDBCol>
                                    </MDBRow>
                                </MDBContainer>
                            </section>
                        )}
                    </>
                )}
            </div>
        </>
    )
}

export default Docprofile