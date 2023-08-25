import React, { useState } from 'react';
import { createInstance } from '../../Axios/Axios';
import { useNavigate } from 'react-router-dom';
import './Specregister.scss';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Image } from 'cloudinary-react';
import CryptoJS from 'crypto-js';
import cloudinaryConfig from '../../cloudinaryConfig';

function Specregister() {

    const admintoken = localStorage.getItem('admintoken');
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);

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
            // formData.append('name', name);
            // formData.append('description', description);
            // formData.append('image', image)

            formData.append('file', image);
            const { signature, timestamp } = generateSignature();
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
                const axiosInstance = createInstance(admintoken)

                const response = await axiosInstance.post('specialization/register', {
                    name,
                    description,
                    image: cloudinaryUrl,
                });

                if (response.status === 200) {
                    toast.success(response.data.message)
                    navigate('/admin/specialization')
                }

            } else {
                toast.error('Cannot upload image')
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