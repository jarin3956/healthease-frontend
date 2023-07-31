import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axiosinstance from '../../Axios/Axios'
import Swal from 'sweetalert2';


function EditProfile() {

    const [name, setName] = useState('')
    const [age, setAge] = useState('')
    const [gender, setGender] = useState('')
    const [regno, setRegno] = useState('')
    const [experience, setExperience] = useState('')
    const [profileimg, setProfileimg] = useState(null)
    const [certificate, setCertificate] = useState(null)
    const [fare, setFare] = useState('')
    const [specialization, setSpecialization] = useState('')
    const [selectedSpecializationId, setSelectedSpecializationId] = useState('');


    const [proImageUrl, setProImgUrl] = useState('')
    const [certiImageUrl, setCertiImgUrl] = useState('')

    const [spec, setSpec] = useState([]);


    const doctortoken = localStorage.getItem('doctortoken')
    const navigate = useNavigate()

    

    

    const getProfile = async () => {
        try {
            const response = await axiosinstance.get('doctor/profile', {
                headers: { Authorization: `Bearer ${doctortoken}` }
            })
            if (response.status === 200) {
                let docdata = response.data.doctor
                setName(docdata.name)
                setAge(docdata.age)
                setGender(docdata.gender)
                setRegno(docdata.regno)
                setExperience(docdata.experience)
                setSpecialization(docdata.specialization)
                setFare(docdata.fare)
                // setProfileimg(docdata.profileimg)
                //setCertificate(docdata.certificate)

                setProImgUrl(`/DocImages/${docdata.profileimg}`)
                setCertiImgUrl(`/DocImages/${docdata.certificate}`)
                
            }
        } catch (error) {
            if (error.response) {
                const status = error.response.status;
                if (status === 404) {
                    Swal.fire('Not Found', 'Doctor data not found.', 'error')

                } else if (status === 500) {
                    Swal.fire('Internal server error', 'Please try after some time.', 'error')

                }
            } else {
                console.log(error);
                Swal.fire('Oops!', 'Error when loading doctor data', 'error');
            }
        }
    }

    const fetchSpec = async () => {
        try {
            const fetchspec = await axiosinstance.get('specialization')
            let specDatas = fetchspec.data.spec
            setSpec(specDatas)
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
    },[spec, specialization]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('age', age);
            formData.append('regno', regno);
            formData.append('experience', experience);
            formData.append('fare', fare);
            formData.append('gender', gender);
            formData.append('specialization', selectedSpecializationId);
            formData.append('profileimg', profileimg);
            formData.append('certificate', certificate);

            const response = await axiosinstance.put('doctor/edit-profile', formData, {
                headers: {
                    Authorization: `Bearer ${doctortoken}`,
                }
            })

            if (response.status === 200) {
                navigate('/doctor/profile')
            }

            console.log(response);
        } catch (error) {
            if (error.response) {
                const status = error.response.status;
                if (status === 404) {
                    Swal.fire('Not Found', 'Doctor data not found.', 'error')

                } else if (status === 500) {
                    Swal.fire('Internal server error', 'Please try after some time.', 'error')

                }
            } else {
                console.log(error);
                Swal.fire('Oops!', 'Error when saving doctor data', 'error');
            }
            console.log(error);
        }
    }


    return (
        <>
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
                                // onChange={(e) => setProfileimg(e.target.files[0])}
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
                                // onChange={(e) => setCertificate(e.target.files[0])}
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