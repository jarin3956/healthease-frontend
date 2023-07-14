import React, { useEffect, useState } from 'react'
import axiosinstance from '../../Axios/Axios';
import { useNavigate } from 'react-router-dom';
import './Docprofile.scss'

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


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
import { useSelector } from 'react-redux';


function Docprofile() {
    const navigate = useNavigate()
    const [doctor, setDoctor] = useState(null)
    const [showMore, setShowMore] = useState(false)

    const [docId, setDocId] = useState('')
    const [age, setAge] = useState('')
    const [fare, setFare] = useState('')
    const [gender, setGender] = useState('')
    const [regno, setRegno] = useState('')
    const [specialization, setSpecialization] = useState('');
    const [experience, setExperience] = useState('')
    const [certificate, setCertificate] = useState(null)
    const [spec, setSpec] = useState([])

    
    const [theMain, setTheMain] = useState(true)


    const selecter = useSelector((state) => state.schedule);


    const doctortoken = localStorage.getItem('doctortoken')
    useEffect(() => {
        if (!doctortoken) {
            navigate('/doclogin')
        } else {
            axiosinstance.get('doctor/profile', {
                headers: {
                    Authorization: `Bearer ${doctortoken}`
                }
            }).then((res) => {
                setDoctor(res.data);
            }).catch((error) => {
                console.log(error);
            })
        }
    }, []);


    useEffect(() => {
        const fetchSpec = async () => {
            try {
                const fetchspec = await axiosinstance.get('specialization')
                let specDatas = fetchspec.data.spec
                setSpec(specDatas)
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
        if (isNaN(fareNum) || fareNum < 2000 || fareNum > 100) {
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
            formData.append('docId', docId)
            formData.append('age', age);
            formData.append('gender', gender);
            formData.append('regno', regno);
            formData.append('specialization', specialization);
            formData.append('fare',fare)
            formData.append('experience', experience);
            formData.append('certificate', certificate);
            const response = await axiosinstance.post('doctor/start-journey', formData);
            if (response.status === 200) {
                setDoctor(response.data.doctor);
                let emailverify = await axiosinstance.post('doctor/send-verifyemail', { doctorId: docId });
                if (emailverify.status === 200) {
                    setShowMore(false)
                    toast.success( emailverify.data.message);
                } else {
                    toast.error(emailverify.data.message);
                }

            } else {
                toast.error('Verification failed: ' + response.data.message);
            }

        } catch (error) {
            console.log(error);
        }
    }

    const handleedit = () => {

    }


    return (
        <>

            <ToastContainer />
            <div className="mx-4 mt-5">
                {doctor && (
                    <>
                        {doctor.age && (
                            <section className='rounded-3 doc-profile-page' >
                                <MDBContainer className="py-5">
                                    <p className="cookieHeading mt-3">Profile</p>
                                    <MDBRow>
                                        <MDBCol lg="4">
                                            <MDBCard className="mb-4">
                                                <MDBCardBody className="text-center">
                                                    {/* {errorMessage && <h6 className="text-center text-danger">{errorMessage}</h6>}
                                                    {successmsg && <h6 className="text-center text-success">Successful, {successmsg}</h6>} */}
                                                    <MDBCardImage
                                                        src={`/DocImages/${doctor.profileimg}`}
                                                        alt="avatar"
                                                        className="rounded-3 m-2"
                                                        style={{ width: '149px', height: '149px' }}
                                                        fluid
                                                    />
                                                    <p className="text-muted mb-1 mt-1">Dr.{doctor.name}</p>
                                                    <p className="text-muted mb-4">{doctor.email}</p>
                                                    <div className="d-flex justify-content-center mb-2">
                                                        <button className='edit-doc-butt' onClick={handleedit}>Edit</button>
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
                                                                    src={`/DocImages/${doctor.certificate}`}
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
                                                                <MDBCardText>Reg.No</MDBCardText>
                                                            </MDBCol>
                                                            <MDBCol sm="9">
                                                                <MDBCardText className="text-muted">{doctor.regno}</MDBCardText>
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
                                                    {selecter ? (<>
                                                    alreday there
                                                    </>) : (<>
                                                    not sesle
                                                    </>)}
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
                            <section className='rounded-3 doc-profile-page' >
                                <MDBContainer className="py-5">
                                    <p className="cookieHeading mt-3">Profile</p>
                                    <MDBRow>
                                        <MDBCol lg="12">
                                            {theMain && (
                                                <MDBCard className="mb-4">
                                                    <MDBCardBody className="text-center">
                                                        {/* {errorMessage && <h6 className="text-center text-danger">{errorMessage}</h6>}
                                                        {successmsg && <h6 className="text-center text-success">Successful, {successmsg}</h6>} */}
                                                        <MDBCardImage
                                                            src={`/DocImages/${doctor.profileimg}`}
                                                            alt="avatar"
                                                            className="rounded-3 m-2"
                                                            style={{ width: '153px', height: '153px' }}
                                                            fluid
                                                        />
                                                        <p className="text-muted mb-1 mt-1">Dr.{doctor.name}</p>
                                                        <p className="text-muted mb-4">{doctor.email}</p>
                                                        <div className="the-doc-butt mb-2">
                                                            <button onClick={handleedit} className='doc-cardbutt'  >Edit</button>
                                                            {!doctor.age && <button outline className="doc-cardbutt ms-1" onClick={(e) => startJorney(e)}>Start</button>}
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
                                                            <input value={fare} onChange={(e) => setFare(e.target.value)} type="text" className="doc-addmore-input" placeholder="Fare" required />
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

            {/* <div className="mx-4 mt-5">
                {doctor && (
                    <div className="row justify-content-center">
                        <div className="col-md-12" >
                            <div className="card p-3 py-4 mb-5">
                                <br />

                                <div className="userprocard">
                                    <p className="cookieHeading mt-3">Profile</p>
                                    {errorMessage && <h6 className="text-center text-danger">{errorMessage}</h6>}
                                    {successmsg && <h6 className="text-center text-success">Successful, {successmsg}</h6>}
                                    <div className="userprocard-border-top"></div>
                                    <div className="img">
                                        {doctor.profileimg && (
                                            <img
                                                src={`/DocImages/${doctor.profileimg}`}
                                                alt="Profile"
                                                style={{ width: "100%", height: "100%", borderRadius: "100%" }}
                                            />
                                        )}
                                    </div>
                                    <span>{doctor.name}</span>
                                    <h6 className="userprocarddet">{doctor.email}</h6>
                                    {doctor.age && <h6 className="userprocarddet">Age : {doctor.age}</h6>}
                                    {doctor.gender && <h6 className="userprocarddet">Gender : {doctor.gender}</h6>}
                                    {doctor.regno && <h6 className="userprocarddet">Reg.No : {doctor.regno}</h6>}
                                    {doctor.specialization && <h6 className="userprocarddet">Specilization : {doctor.specialization}</h6>}
                                    {doctor.experience && <h6 className="userprocarddet">Experience : {doctor.experience}years</h6>}
                                    {doctor.certificate && <h6 className="userprocarddet">Certificate :</h6>}
                                    {doctor.certificate && <div className="img">
                                        <img
                                            src={`/DocImages/${doctor.certificate}`}
                                            alt="Profile"
                                            style={{ width: "100%", height: "100%", borderRadius: "15%" }}
                                        />
                                    </div>}
                                    <div className='d-flex '>
                                        {!doctor.age && <button className="userprocardbutt" onClick={startJorney} >Start </button>}
                                        <button className="userprocardbutt  " onClick={handleedit} >Edit</button>
                                    </div>
                                    {showMore && (
                                        <>
                                            <form encType="multipart/form-data" >
                                                <h3 className='text-white' >Start Your Journey</h3>
                                                <input value={age} onChange={(e) => setAge(e.target.value)} type="text" className="register-input" placeholder="Age" required />
                                                <p className="gender-title">Gender</p>
                                                <div className="gender-selection">
                                                    <br />
                                                    <label className="gender-label">
                                                        <input
                                                            type="radio"
                                                            name="gender"
                                                            value="male"
                                                            checked={gender === "male"}
                                                            onChange={(e) => setGender(e.target.value)}
                                                        />
                                                        Male
                                                    </label>
                                                    <label className="gender-label">
                                                        <input
                                                            type="radio"
                                                            name="gender"
                                                            value="female"
                                                            checked={gender === "female"}
                                                            onChange={(e) => setGender(e.target.value)}
                                                        />
                                                        Female
                                                    </label>
                                                    <label className="gender-label">
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
                                                <input value={regno} onChange={(e) => setRegno(e.target.value)} type="text" className="register-input" placeholder="Register.No" required />
                                                <div>
                                                    <label>Specialization:</label>
                                                    <select className='docselect' value={specialization} onChange={(e) => setSpecialization(e.target.value)} required>
                                                        <option className='docoption' value="">Select Specialization</option>
                                                        {spec.map((spec, index) => (
                                                            <option key={index} className='docoption' value={spec._id}>{spec.name}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <input value={experience} onChange={(e) => setExperience(e.target.value)} type="text" className="register-input" placeholder="Experience" required />
                                                <p className="gender-title">Upload Certificates</p>
                                                <input type="file" onChange={(e) => setCertificate(e.target.files.item(0))} accept="image/*" className="custom-file-upload" required />
                                                <div className='d-flex ' >
                                                    <button className="userprocardbutt" onClick={() => handlesave(doctor._id)} >
                                                        Save
                                                    </button>
                                                    <button className="userprocardbutt ms-2" onClick={closeStart} >
                                                        Close
                                                    </button>
                                                </div>
                                            </form>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div> */}
        </>
    )
}

export default Docprofile