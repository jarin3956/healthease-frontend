import React, { useState, useEffect } from 'react'
import axiosinstance from '../../Axios/Axios';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';

import './Specmgt.css'

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function Specmgt() {
    const navigate = useNavigate()
    const [specialization, setSpecialization] = useState([])
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [image, setImage] = useState(null)
    const [showEdit, setShowEdit] = useState(false);
    const [specid, setSpecId] = useState('')
    const [imageUrl, setImageUrl] = useState('');

    

    const handleBlock = async (specId) => {
        try {
            const response = await axiosinstance.put(`specialization/control-specialization/${specId}`);
            const updatedSpec = response.data.spec
            setSpecialization((prevSpec) =>
                prevSpec.map((spec) => (spec._id === updatedSpec._id ? updatedSpec : spec))
            );

            if (response.status === 200) {
                toast.success(response.data.message);
              } else {
                toast.error(response.data.message);
              }

        } catch (error) {
            console.log(error);
            toast.error('Error changing status');
        }
    }

    const deleteSpec = async (specId) => {
        try {
            const response = await axiosinstance.delete(`specialization/delete-specialization/${specId}`);
            if (response.status === 200) {
                toast.success(response.data.message);
              } else {
                toast.error(response.data.message);
              }
        } catch (error) {
            console.log(error);
            toast.error('Error deleting the specialization');
        }
    }

    const viewEdit = async (specId) => {
        const specToEdit = specialization.find((spec) => spec._id === specId);
        if (specToEdit) {
            setName(specToEdit.name);
            setDescription(specToEdit.description);
            setImage(specToEdit.image)
            setSpecId(specId)
            setImageUrl(`/SpecializationImages/${specToEdit.image}`);
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
            formData.append('specid', specid)
            formData.append('name', name)
            formData.append('description', description)
            if (image) {
                formData.append('image', image)
            }
            const editresponse = await axiosinstance.post('specialization/edit-spec', formData)

            if (editresponse.status === 200) {
                toast.success(editresponse.data.message);
              } else {
                toast.error(editresponse.data.message);
              }

            setSpecialization(editresponse.data.spec)

            setShowEdit(false);
        } catch (error) {
            toast.error('Cannot proceed at this moment');
            console.log(error);
        }
    };

    useEffect(() => {
        const fetchSpecData = async () => {
            try {
                const response = await axiosinstance.get('specialization/admin-view')
                const specData = response.data.spec;
                setSpecialization(specData)
            } catch (error) {
                console.log(error);
            }
        }
        fetchSpecData();
    }, [deleteSpec]);

    return (
        <>
        <ToastContainer />
            
            <div className="mx-4 mt-5">
                <div className="row justify-content-center">
                    <div className="col-md-12">
                        <div className="card p-3 py-4 mb-5">
                            <div className='adminusrtable rounded-3' >
                                <p className="cookieHeading text-center mt-3">Specialization Management</p>
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
                                    <div className="txtcontainer p-3" style={{ maxWidth: "800px" }}>
                                        <div className="cookieCard rounded-3">
                                            <div className="contentWrapper">
                                                <p className="cookieHeading text-center mt-3 ">Edit</p>
                                                <form encType="multipart/form-data" className="register-form" onSubmit={handleSave} >
                                                    <div className='p-3 bg-info rounded-3 mb-3'>
                                                        
                                                        {/* <p>Enter Name</p> */}
                                                        <input
                                                            type="text"
                                                            value={name}
                                                            className='more-input'
                                                            onChange={(e) => setName(e.target.value)}
                                                            placeholder="Name"
                                                            required
                                                        />
                                                        {/* <p>Enter Description</p> */}
                                                        <input
                                                            type="text"
                                                            value={description}
                                                            className='more-input'
                                                            onChange={(e) => setDescription(e.target.value)}
                                                            placeholder="Description"
                                                            required
                                                        />

                                                        <img
                                                            src={imageUrl}
                                                            alt={name}
                                                            style={{ width: '100px', height: '100px', borderRadius: '25px' }}
                                                        />
                                                        {/* <p>Upload Image</p> */}
                                                        <input
                                                            type="file"
                                                            onChange={(e) => {
                                                                const file = e.target.files.item(0);
                                                                setImage(file); // Set the selected file
                                                                setImageUrl(URL.createObjectURL(file)); // Set the URL of the selected file
                                                            }}
                                                            accept="image/*"
                                                            className="more-input bg-white"
                                                        />

                                                        <div className='d-flex ' >
                                                            <button className="userprocardbutt" type='submit' >
                                                                Save
                                                            </button>
                                                            <button className="userprocardbutt ms-2" onClick={() => closeEdit()} >
                                                                Close
                                                            </button>
                                                        </div>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}

                            {!showEdit && (
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
                                            {specialization.map((spec) => (
                                                <TableRow
                                                    key={spec.name}
                                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                >
                                                    <TableCell component="th" scope="row">
                                                        {spec.name}
                                                    </TableCell>
                                                    <TableCell align="center"><img src={`/SpecializationImages/${spec.image}`} alt={spec.name} style={{ width: '100px' }} /></TableCell>
                                                    <TableCell align="center">{spec.description}</TableCell>
                                                    <TableCell align="center">{spec.status === true ? 'Active' : 'Blocked'}</TableCell>
                                                    <TableCell align="center">
                                                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                                                            <Button variant="contained" color="secondary" onClick={() => handleBlock(spec._id)} >
                                                                {spec.status ? 'Block' : 'Unblock'}
                                                            </Button>
                                                            <Button variant="contained" color="secondary" onClick={() => viewEdit(spec._id)} >
                                                                Edit
                                                            </Button>
                                                            <Button variant="contained" color="secondary" onClick={() => deleteSpec(spec._id)}  >
                                                                Delete
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            )}

                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}


export default Specmgt