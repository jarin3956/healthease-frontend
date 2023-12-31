import React, { useState, useEffect } from 'react'
import { createInstance } from '../../Axios/Axios';

import {
    TableContainer,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    Paper,
    Button,
    TablePagination,
    TextField,
} from '@mui/material';

import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import './Specmgt.scss'
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NotFound from '../../Common/NotFound/NotFound';
import cloudinaryConfig from '../../cloudinaryConfig';
import { Image } from 'cloudinary-react';
import CryptoJS from 'crypto-js';


function Specmgt() {

    const navigate = useNavigate();
    const admintoken = localStorage.getItem('admintoken');

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchQuery, setSearchQuery] = useState('');
    const [specialization, setSpecialization] = useState([]);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);
    const [showEdit, setShowEdit] = useState(false);
    const [specid, setSpecId] = useState('');
    const [imageUrl, setImageUrl] = useState('');

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

    const blockSpec = async (specId,specname,specstate) => {
        let state = specstate ? 'Block' : 'Unblock'
        Swal.fire({
            icon: 'warning',
            title: 'Are you sure?',
            text: `To ${state} ${specname} !`,
            showCancelButton: true,
            confirmButtonText: 'Yes, sure it!',
            cancelButtonText: 'No, keep it',
            confirmButtonColor: '#FF0000',
            cancelButtonColor: '#333333',
        }).then((result) => {
            if (result.isConfirmed) {

                handleBlock(specId);
            }
        });
    }

    const handleBlock = async (specId) => {
        try {

            const axiosInstance = createInstance(admintoken)
            const response = await axiosInstance.put(`specialization/control-specialization/${specId}`)

            if (response.status === 200) {
                toast.success(response.data.message);
                const updatedSpec = response.data.spec
                setSpecialization((prevSpec) =>
                    prevSpec.map((spec) => (spec._id === updatedSpec._id ? updatedSpec : spec))
                );
            } else {
                toast.error('Cannot process now, Please try after sometime');
            }

        } catch (error) {
            console.log(error);
        }
    }

    const deleteConfirm = async (specId,specname) => {
        Swal.fire({
            icon: 'warning',
            title: 'Are you sure?',
            text: 'This action cannot be undone!',
            showCancelButton: true,
            confirmButtonText: `Yes, Delete ${specname}!`,
            cancelButtonText: 'No, keep it',
            confirmButtonColor: '#FF0000',
            cancelButtonColor: '#333333',
        }).then((result) => {
            if (result.isConfirmed) {

                deleteSpec(specId);
            }
        });
    }

    const deleteSpec = async (specId) => {
        try {

            const axiosInstance = createInstance(admintoken)
            const response = await axiosInstance.delete(`specialization/delete-specialization/${specId}`)

            if (response.status === 200) {
                toast.success(response.data.message);
                fetchSpecData()
            } else {
                toast.error('Could not process now, Please try after sometime');
            }
        } catch (error) {
            console.log(error);
        }
    }

    const viewEdit = async (specId) => {
        const specToEdit = specialization.find((spec) => spec._id === specId);
        if (specToEdit) {
            setName(specToEdit.name);
            setDescription(specToEdit.description);
            setImage(specToEdit.image)
            setSpecId(specId)
            setImageUrl(specToEdit.image);
            setShowEdit(true)
        }
    }
    const closeEdit = async () => {
        setShowEdit(false)
    }

    const handleSave = async (event) => {
        event.preventDefault();
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
        try {

            const formData = new FormData();
            // formData.append('specid', specid)
            // formData.append('name', name)
            // formData.append('description', description)
            if (image) {
                // formData.append('image', image)
                formData.append('file', image);
                const { signature, timestamp } = generateSignature();
                formData.append('signature', signature);
                formData.append('timestamp', timestamp);
                formData.append('api_key', apiKey);
                formData.append('upload_preset', cloudinaryUploadPreset);
            }

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

                const response = await axiosInstance.post('specialization/edit-spec', {
                    specid,
                    name,
                    description,
                    image: cloudinaryUrl,
                })

                if (response.status === 200) {
                    toast.success(response.data.message);
                    setSpecialization(response.data.spec)
                }
                setShowEdit(false);
            } else {
                toast.error('Cannot upload image. Please try again later')
            }

        } catch (error) {
            console.log(error);
        }
    };


    const fetchSpecData = async () => {

        try {

            const axiosInstance = createInstance(admintoken)
            const response = await axiosInstance.get('specialization/admin-view')

            if (response.status === 200) {
                const specData = response.data.spec;
                setSpecialization(specData)
            } else {
                toast.error('Could not find data now, Please try after sometime');
            }

        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {

        if (admintoken) {
            fetchSpecData();
        }


    }, [admintoken]);



    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
        setPage(0);
    };

    const filteredSpecialization = specialization.filter((spec) => {
        return (
            spec.name.toLowerCase().includes(searchQuery)
        )
    })

    const isDataFound = filteredSpecialization.length > 0;



    return (
        <>
            <ToastContainer />
            <div className="card p-3 py-4  rounded-0 " style={{ backgroundColor: 'rgb(70, 166, 210)', minHeight: '100vh' }}>
                <div className=' rounded-3' style={{ backgroundColor: '#0490DB' }} >
                    <p className="text-center text-white pt-3" style={{ fontWeight: '700', fontSize: '30px' }}>Specialization Management</p>
                    {!showEdit && (
                        <div className=" p-3 d-flex justify-content-center">
                            <button className="theSpecButt" onClick={() => navigate('/admin/spec-register')} >
                                Add
                            </button>
                        </div>
                    )}
                </div>
                {showEdit && (
                    <>
                        <div className="spl-regCard ">
                            <div className='spl-reg-main' >
                                <form className="reg-spl-form-main p-2" >
                                    <p className="reg-spl-heading">Edit Specialization</p>

                                    <div className="reg-spl-inputContainer">
                                        <input placeholder="Name" value={name} className="reg-spl-inputField" type="text" onChange={(e) => setName(e.target.value)} />
                                    </div>
                                    <div className="reg-spl-inputContainer">
                                        <input placeholder="Description" value={description} className="reg-spl-inputField" type="text" onChange={(e) => setDescription(e.target.value)} />
                                    </div>
                                    <div className="reg-spl-inputContainer">
                                        <img
                                            src={imageUrl}
                                            alt={name}
                                            style={{ width: '100px', height: '100px', borderRadius: '25px' }}
                                        />
                                    </div>
                                    <div className="reg-spl-inputContainer">
                                        <input type="file" accept="image/*" onChange={(e) => {
                                            const file = e.target.files.item(0);
                                            setImage(file);
                                            setImageUrl(URL.createObjectURL(file));
                                        }} required="" className="reg-splfle-input" />
                                    </div>
                                    <button className="reg-splbutton" onClick={handleSave} >Save</button>
                                    <p onClick={closeEdit} className='text-danger thespl-backbtn' >Go Back</p>
                                </form>
                            </div>
                        </div>
                    </>
                )}

                {!showEdit && (
                    <div className='bg-white'>
                        <div className='d-flex justify-content-center'>
                            <TextField
                                label="Search"
                                value={searchQuery}
                                onChange={handleSearchChange}
                                variant="outlined"
                                sx={{ m: 1 }}
                                InputProps={{
                                    sx: {
                                        width: '300px',
                                        height: '45px',

                                    },
                                }}
                            />
                        </div>
                        {isDataFound ? (
                            <TableContainer component={Paper}>
                                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                    <TableHead sx={{ backgroundColor: 'lightgrey' }} >
                                        <TableRow>
                                            <TableCell sx={{ fontSize: '18px', fontWeight: '700' }} align="center" >Name</TableCell>
                                            <TableCell sx={{ fontSize: '18px', fontWeight: '700' }} align="center">Image</TableCell>
                                            <TableCell sx={{ fontSize: '18px', fontWeight: '700' }} align="center">Description</TableCell>
                                            <TableCell sx={{ fontSize: '18px', fontWeight: '700' }} align="center">Status</TableCell>
                                            <TableCell sx={{ fontSize: '18px', fontWeight: '700' }} align="center">Action</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {filteredSpecialization.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((spec) => (
                                            <TableRow
                                                key={spec.name}
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
                                                <TableCell component="th" scope="row" align="center" >
                                                    {spec.name}
                                                </TableCell>
                                                <TableCell align="center"><img src={spec.image} alt={spec.name} style={{ width: '100px' }} /></TableCell>
                                                <TableCell align="center">{spec.description}</TableCell>
                                                <TableCell align="center">{spec.status === true ? 'Active' : 'Blocked'}</TableCell>
                                                <TableCell align="center">
                                                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                                                        <Button variant="contained" color="secondary" onClick={() => blockSpec(spec._id,spec.name,spec.status)}
                                                            sx={{
                                                                backgroundColor: '#D49425',
                                                                color: '#fff',
                                                                '&:hover': {
                                                                    backgroundColor: '#E85A0D',

                                                                },
                                                            }} >
                                                            {spec.status ? 'Block' : 'Unblock'}
                                                        </Button>
                                                        <Button variant="contained" color="secondary" onClick={() => viewEdit(spec._id)}
                                                            sx={{
                                                                backgroundColor: 'rgb(23, 116, 197)',
                                                                color: '#fff',
                                                                '&:hover': {
                                                                    backgroundColor: '#094593',

                                                                },
                                                            }}
                                                        >
                                                            Edit
                                                        </Button>
                                                        <Button variant="contained" color="secondary" onClick={() => deleteConfirm(spec._id,spec.name)}
                                                            sx={{
                                                                backgroundColor: '#D41D1D',
                                                                color: '#fff',
                                                                '&:hover': {
                                                                    backgroundColor: '#B40F0F',

                                                                },
                                                            }}
                                                        >
                                                            Delete
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        ) : (
                            <NotFound />
                        )}
                        <div className='d-flex justify-content-center' >
                            <TablePagination
                                rowsPerPageOptions={[5, 10, 25]}
                                component="div"
                                count={specialization.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                                sx={{ mt: '10px' }}
                            />
                        </div>

                    </div>

                )}

            </div>

        </>
    )
}


export default Specmgt