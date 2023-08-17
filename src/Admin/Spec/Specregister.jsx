import React, { useState } from 'react';
import { createInstance } from '../../Axios/Axios';
import { useNavigate } from 'react-router-dom';
import './Specregister.scss';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Specregister() {

    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [image, setImage] = useState(null)
    // const [error, setError] = useState('');

    const navigate = useNavigate()

    const admintoken = localStorage.getItem('admintoken')

    const registerSpec = async (e) => {
        e.preventDefault();
        if (!name || !description || !image) {
            toast.error('Please fill in all fields.');
            return;
        }

        const nameRegex = /^[A-Z]{1,50}$/;
        if (!name.match(nameRegex)) {
            toast.error('Name must be all capital letters within 50 characters');
            return;
        }

        const descriptionRegex = /^[A-Za-z,\-\s]{10,300}$/;
        if (!description.match(descriptionRegex)) {
            toast.error('Description must start with a capital letter and be between 10 and 300 characters');
            return;
        }

        if (!image) {
            toast.error('Image is required');
            return false;
        }

        try {
            const formData = new FormData();
            formData.append('name', name)
            formData.append('description', description)
            formData.append('image', image)

            const axiosInstance = createInstance(admintoken)

            const response = await axiosInstance.post('specialization/register', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.status === 200) {
                toast.success(response.data.message)
                navigate('/admin/specialization')
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
                    <form className="reg-spl-form-main p-2" >
                        <p className="reg-spl-heading">Add Specialization</p>
                        {/* {error && (
                            <p className="text-danger" style={{ marginBottom: '10px' }}>
                                {error}
                            </p>
                        )} */}
                        <div className="reg-spl-inputContainer">
                            <input placeholder="Name" value={name} className="reg-spl-inputField" type="text" onChange={(e) => setName(e.target.value)} />
                        </div>
                        <div className="reg-spl-inputContainer">
                            <input placeholder="Description" value={description} className="reg-spl-inputField" type="text" onChange={(e) => setDescription(e.target.value)} />
                        </div>
                        <div className="reg-spl-inputContainer">
                            <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files.item(0))} required="" className="reg-splfle-input" />
                        </div>
                        <button className="reg-splbutton" onClick={(e) => registerSpec(e)} >Save</button>
                        <p onClick={() => navigate('/admin/specialization')} className='text-danger thespl-backbtn' >Go Back</p>
                    </form>
                </div>
            </div>
        </>
    )
}

export default Specregister