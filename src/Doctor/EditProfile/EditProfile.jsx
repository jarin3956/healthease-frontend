import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { createInstance, axiosinstance } from '../../Axios/Axios'
import Swal from 'sweetalert2';
import { toast, ToastContainer } from 'react-toastify';
import { Image } from 'cloudinary-react';
import CryptoJS from 'crypto-js';
import cloudinaryConfig from '../../cloudinaryConfig';

function EditProfile() {

    const doctortoken = localStorage.getItem('doctortoken');
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [gender, setGender] = useState('');
    const [regno, setRegno] = useState('');
    const [experience, setExperience] = useState('');
    const [profileimg, setProfileimg] = useState(null);
    const [certificate, setCertificate] = useState(null);
    const [fare, setFare] = useState('');
    const [specialization, setSpecialization] = useState('');
    const [selectedSpecializationId, setSelectedSpecializationId] = useState('');
    const [proImageUrl, setProImgUrl] = useState('');
    const [certiImageUrl, setCertiImgUrl] = useState('');
    const [spec, setSpec] = useState([]);

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


    const getProfile = async () => {
        try {

            const axiosInstance = createInstance(doctortoken)
            const response = await axiosInstance.get('doctor/profile')

            if (response.status === 200) {
                let docdata = response.data.doctor
                setName(docdata.name)
                setAge(docdata.age)
                setGender(docdata.gender)
                setRegno(docdata.regno)
                setExperience(docdata.experience)
                setSpecialization(docdata.specialization)
                setFare(docdata.fare)
                setProImgUrl(docdata.profileimg)
                setCertiImgUrl(docdata.certificate)
            }
        } catch (error) {
            console.log(error);
        }
    }

    const fetchSpec = async () => {
        try {
            const response = await axiosinstance.get('specialization/view');
            if (response.status === 200) {
                setSpec(response.data.spec)
            }
            else {
                Swal.fire({ title: "Error", text: "Please Try again later." })
            }

        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {

        fetchSpec()
        getProfile()


    }, [doctortoken]);

    useEffect(() => {
        const specializationItem = spec.find(
            (item) => item.name === specialization
        );
        if (specializationItem) {
            setSelectedSpecializationId(specializationItem._id);
        }
    }, [spec, specialization]);


    const handleSubmit = async (e) => {

        e.preventDefault();

        const nameRegex = /^[A-Z][a-zA-Z]{4,29}$/;
        if (!name.match(nameRegex)) {
            toast.error('Name should start with a capital letter and be between 5 to 30 characters long (only alphabets).');
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

        try {
            const formData = new FormData();

            const { signature, timestamp } = generateSignature();
            formData.append('file', profileimg);
            formData.append('signature', signature);
            formData.append('timestamp', timestamp);
            formData.append('api_key', apiKey);
            formData.append('upload_preset', cloudinaryUploadPreset);

            const profileImageResponse = await fetch(
                `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
                {
                    method: 'POST',
                    body: formData,
                }
            );

            const profileImageData = await profileImageResponse.json();

            if (profileImageData.secure_url) {
                const profileImageUrl = profileImageData.secure_url;
                const certificateFormData = new FormData();
                certificateFormData.append('file', certificate);
                certificateFormData.append('signature', signature);
                certificateFormData.append('timestamp', timestamp);
                certificateFormData.append('api_key', apiKey);
                certificateFormData.append('upload_preset', cloudinaryUploadPreset);

                const certificateImageResponse = await fetch(
                    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
                    {
                        method: 'POST',
                        body: certificateFormData,
                    }
                );

                const certificateImageData = await certificateImageResponse.json();

                if (certificateImageData.secure_url) {

                    const certificateUrl = certificateImageData.secure_url;
                    const axiosInstance = createInstance(doctortoken)
                    const response = await axiosInstance.put('doctor/edit-profile', {
                        name,
                        age,
                        regno,
                        experience,
                        fare,
                        gender,
                        selectedSpecializationId,
                        profileimg: profileImageUrl,
                        certificate: certificateUrl,
                    })

                    if (response.status === 200) {
                        navigate('/doctor/profile')
                    }

                } else {
                    Swal.fire('Error', 'Cannot upload certificate image. Please try again later', 'error')
                }
            } else {
                Swal.fire('Error', 'Cannot upload profile image. Please try again later', 'error')
            }

        } catch (error) {
            console.log(error);
        }
    }
    return (
        <>
            <ToastContainer />
            <div className="spl-regCard ">
                <div className='spl-reg-main' >
                    <form className="reg-spl-form-main p-2" encType="multipart/form-data" onSubmit={handleSubmit}  >
                        <p className="reg-spl-heading">Edit Profile</p>

                        <div className="reg-spl-inputContainer">
                            <input placeholder="Name" value={name} className="reg-spl-inputField" type="text" onChange={(e) => setName(e.target.value)} />
                        </div>
                        <div className="reg-spl-inputContainer">
                            <input placeholder="Age" value={age} className="reg-spl-inputField" type="text" onChange={(e) => setAge(e.target.value)} />
                        </div>
                        <div className="reg-spl-inputContainer">
                            <input placeholder="Reg.No" value={regno} className="reg-spl-inputField" type="text" onChange={(e) => setRegno(e.target.value)} />
                        </div>
                        <div className="reg-spl-inputContainer">
                            <input placeholder="Experience" value={experience} className="reg-spl-inputField" type="text" onChange={(e) => setExperience(e.target.value)} />
                        </div>
                        <div className="reg-spl-inputContainer">
                            <input placeholder="Experience" value={fare} className="reg-spl-inputField" type="text" onChange={(e) => setFare(e.target.value)} />
                        </div>


                        <div className="reg-spl-inputContainer">
                            <img
                                src={proImageUrl}
                                alt={name}
                                style={{ width: '100px', height: '100px', borderRadius: '25px' }}
                            />
                        </div>
                        <div className="reg-spl-inputContainer">
                            <input
                                type="file"
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    setProfileimg(file)
                                    setProImgUrl(URL.createObjectURL(file));
                                }}
                                accept="image/*"
                                className="reg-splfle-input"
                            />
                        </div>
                        <div className="reg-spl-inputContainer">
                            <img
                                src={certiImageUrl}
                                alt={name}
                                style={{ width: '100px', height: '100px', borderRadius: '25px' }}
                            />
                        </div>
                        <div className="reg-spl-inputContainer">
                            <input
                                type="file"
                                onChange={(e) => {
                                    const file = e.target.files[0]
                                    setCertificate(file)
                                    setCertiImgUrl(URL.createObjectURL(file))
                                }}
                                accept="image/*"
                                className="reg-splfle-input"
                            />
                        </div>

                        <div className="reg-spl-inputContainer">
                            <p className="text-center ">Gender :</p>

                        </div>
                        <div className="reg-spl-inputContainer">
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
                        <div className="reg-spl-inputContainer">

                            <label className='text-center'>Specialization</label>
                            <select
                                className='docselect'
                                value={selectedSpecializationId}
                                onChange={(e) => setSelectedSpecializationId(e.target.value)}
                                required
                            >
                                {spec.map((specItem) => (
                                    <option
                                        key={specItem._id}
                                        className='docoption'
                                        value={specItem._id}
                                    >
                                        {specItem.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <button className="reg-splbutton" type="submit"  >Save</button>
                        <p onClick={() => navigate('/doctor/profile')} className='text-danger thespl-backbtn' >Go Back</p>
                    </form>
                </div>
            </div>
        </>
    )
}

export default EditProfile