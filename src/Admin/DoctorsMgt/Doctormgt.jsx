import React, { useState, useEffect } from 'react';
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

import Swal from 'sweetalert2';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NotFound from '../../Common/NotFound/NotFound'

function Doctormgt() {

    const admintoken = localStorage.getItem('admintoken')

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchQuery, setSearchQuery] = useState('');
    const [doctors, setDoctors] = useState([])

    const fetchDoctorsData = async () => {
        try {

            const axiosInstance = createInstance(admintoken)
            const response = await axiosInstance.get('admin/doctors')

            if (response.status === 200) {
                const sortedDoctors = response.data.doctors.slice();
                sortedDoctors.sort((a, b) => {
                    return new Date(b.createdAt) - new Date(a.createdAt);
                });
                setDoctors(sortedDoctors);
            }

        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if (admintoken) {
            fetchDoctorsData()
        }
    }, [])

    const BlockDoctor = async (doctorId) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: 'to change user status',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, sure!',
            cancelButtonText: 'No, keep it'
        });
        if (result.isConfirmed) {
            handleBlockDoctor(doctorId);
        }
    }

    const handleBlockDoctor = async (doctorId) => {

        try {

            const axiosInstance = createInstance(admintoken)
            const response = await axiosInstance.put(`admin/doctor-blocking-mgt/${doctorId}`)

            if (response.status === 200) {
                toast.success(response.data.message);
                const updatedDoctor = response.data.doctor;
                // setDoctors((prevDoctors) =>
                //     prevDoctors.map((doctor) => (doctor._id === updatedDoctor._id ? updatedDoctor : doctor))
                // );
                fetchDoctorsData()
            }

        } catch (error) {
            console.log(error);
        }
    };

    const verifyDoctor = async (doctorId) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: 'To change verify doctor',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, sure!',
            cancelButtonText: 'No, keep it'
        });
        if (result.isConfirmed) {
            handleVerifyDoctor(doctorId);
        }
    }

    const handleVerifyDoctor = async (doctorId) => {
        try {

            const axiosInstance = createInstance(admintoken)
            const response = await axiosInstance.put(`admin/change-doctor-status/${doctorId}`)

            if (response.status === 200) {
                toast.success(response.data.message);
                const updatedDoctor = response.data.doctor;
                setDoctors((prevDoctors) =>
                    prevDoctors.map((doctor) => (doctor._id === updatedDoctor._id ? updatedDoctor : doctor))
                );
            } else {
                toast.error(response.data.message);
            }

        } catch (error) {
            console.log(error);
        }
    };



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

    const filteredDoctors = doctors.filter((doctor) => {
        return (
            doctor.name.toLowerCase().includes(searchQuery) ||
            doctor.age.toString().toLowerCase().includes(searchQuery) ||
            doctor.regno.toLowerCase().includes(searchQuery) ||
            doctor.email.toLowerCase().includes(searchQuery)
        )

    });

    const isDataFound = filteredDoctors.length > 0;

    return (
        <>
            <ToastContainer />
            <div className="card p-3 py-4   rounded-0 " style={{ backgroundColor: 'rgb(70, 166, 210)', minHeight: '100vh' }}>
                <div className=' rounded-3' style={{ backgroundColor: '#0490DB' }} >
                    <p className="text-center text-white mt-3" style={{ fontWeight: '700', fontSize: '30px' }}>Doctor Management</p>
                </div>
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
                                        <TableCell sx={{ fontSize: '18px', fontWeight: '700' }} align="center">Reg.no</TableCell>
                                        <TableCell sx={{ fontSize: '18px', fontWeight: '700' }} align="center">Email</TableCell>
                                        <TableCell sx={{ fontSize: '18px', fontWeight: '700' }} align="center">Age</TableCell>
                                        <TableCell sx={{ fontSize: '18px', fontWeight: '700' }} align="center">Gender</TableCell>
                                        <TableCell sx={{ fontSize: '18px', fontWeight: '700' }} align="center">Specialization</TableCell>
                                        <TableCell sx={{ fontSize: '18px', fontWeight: '700' }} align="center">Experience</TableCell>
                                        <TableCell sx={{ fontSize: '18px', fontWeight: '700' }} align="center">Fare</TableCell>
                                        <TableCell sx={{ fontSize: '18px', fontWeight: '700' }} align="center">Our Fare</TableCell>
                                        <TableCell sx={{ fontSize: '18px', fontWeight: '700' }} align="center">Status</TableCell>
                                        <TableCell sx={{ fontSize: '18px', fontWeight: '700' }} align="center">Action</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredDoctors.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((doctor) => (
                                        <TableRow
                                            key={doctor.name}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell component="th" scope="row" align="center">
                                                {doctor.name}
                                            </TableCell>
                                            <TableCell align="center">{doctor.regno}</TableCell>
                                            <TableCell align="center">{doctor.email}</TableCell>
                                            <TableCell align="center">{doctor.age}</TableCell>
                                            <TableCell align="center">{doctor.gender}</TableCell>
                                            <TableCell align="center">{doctor.specialization}</TableCell>
                                            <TableCell align="center">{doctor.experience} Yrs</TableCell>
                                            <TableCell align="center">₹{doctor.fare}</TableCell>
                                            <TableCell align="center">₹{doctor.final_fare}</TableCell>
                                            <TableCell align="center">{doctor.isBlocked === true ? "Blocked" : "Active"}</TableCell>
                                            <TableCell align="center">
                                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                                                    {doctor.approval === false && (
                                                        <Button
                                                            variant="contained"
                                                            color="secondary"
                                                            onClick={() => verifyDoctor(doctor._id)}
                                                            sx={{
                                                                backgroundColor: '#0AC726',
                                                                color: '#fff',
                                                                '&:hover': {
                                                                    backgroundColor: '#018916',

                                                                },
                                                            }}
                                                        >
                                                            Verify
                                                        </Button>
                                                    )}
                                                    <Button
                                                        variant="contained"
                                                        color="secondary"
                                                        onClick={() => BlockDoctor(doctor._id)}
                                                        sx={{
                                                            backgroundColor: '#D41D1D',
                                                            color: '#fff',
                                                            '&:hover': {
                                                                backgroundColor: '#B40F0F',

                                                            },
                                                        }}
                                                    >
                                                        {doctor.isBlocked === false ? 'Block' : 'Unblock'}
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
                            count={doctors.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            sx={{ mt: '10px' }}
                        />
                    </div>
                </div>
            </div>
        </>
    )
}

export default Doctormgt