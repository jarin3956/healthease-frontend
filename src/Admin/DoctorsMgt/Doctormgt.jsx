import React, { useState, useEffect } from 'react';
import axiosinstance from '../../Axios/Axios';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Doctormgt() {
    const [doctors, setDoctors] = useState([])
    useEffect(() => {
        const fetchDoctorsData = async () => {
            try {

                const response = await axiosinstance.get('admin/doctors');
                const doctorData = response.data.doctors
                setDoctors(doctorData)

            } catch (error) {
                console.log(error);
            }
        }
        fetchDoctorsData()
    }, [])

    const handleBlockDoctor = async (doctorId) => {
        try {
          const response = await axiosinstance.put(`admin/change-doctor-status/${doctorId}`);
          const updatedDoctor = response.data.doctor;
      
          setDoctors((prevDoctors) =>
            prevDoctors.map((doctor) => (doctor._id === updatedDoctor._id ? updatedDoctor : doctor))
          );
            
          if (response.status === 200) {
            toast.success(response.data.message);
          } else {
            toast.error(response.data.message);
          }
          
        } catch (error) {
          console.log(error);
          toast.error('An error occurred. Please try again.');
        }
      };
      



    return (
        <>
            <ToastContainer />

            <div className="mx-4 mt-5">
                <div className="row justify-content-center">
                    <div className="col-md-12">
                        <div className="card p-3 py-4 mb-5">
                            <div className='adminusrtable rounded-3' >
                                <p className="cookieHeading text-center mt-3">Doctor Management</p>
                            </div>
                            <TableContainer component={Paper}>
                                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                    <TableHead sx={{ backgroundColor: 'lightgrey' }} >
                                        <TableRow>
                                            <TableCell sx={{ fontSize: '18px', fontWeight: '700' }} >Name</TableCell>
                                            <TableCell sx={{ fontSize: '18px', fontWeight: '700' }} align="right">Reg.no</TableCell>
                                            <TableCell sx={{ fontSize: '18px', fontWeight: '700' }} align="right">Email</TableCell>
                                            <TableCell sx={{ fontSize: '18px', fontWeight: '700' }} align="right">Age</TableCell>
                                            <TableCell sx={{ fontSize: '18px', fontWeight: '700' }} align="right">Gender</TableCell>
                                            <TableCell sx={{ fontSize: '18px', fontWeight: '700' }} align="right">Specialization</TableCell>
                                            <TableCell sx={{ fontSize: '18px', fontWeight: '700' }} align="right">Experience</TableCell>
                                            <TableCell sx={{ fontSize: '18px', fontWeight: '700' }} align="right">Fare</TableCell>
                                            <TableCell sx={{ fontSize: '18px', fontWeight: '700' }} align="right">Status</TableCell>
                                            <TableCell sx={{ fontSize: '18px', fontWeight: '700' }} align="right">Action</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {doctors.map((doctor) => (
                                            <TableRow
                                                key={doctor.name}
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
                                                <TableCell component="th" scope="row">
                                                    {doctor.name}
                                                </TableCell>
                                                <TableCell align="right">{doctor.regno}</TableCell>
                                                <TableCell align="right">{doctor.email}</TableCell>
                                                <TableCell align="right">{doctor.age}</TableCell>
                                                <TableCell align="right">{doctor.gender}</TableCell>
                                                <TableCell align="right">{doctor.specialization}</TableCell>
                                                <TableCell align="right">{doctor.experience} Years</TableCell>
                                                <TableCell align="right">{doctor.fare} Rupees</TableCell>
                                                <TableCell align="right">{doctor.approval === true ? "Verified" : "Not Verified"}</TableCell>
                                                <TableCell align="right">
                                                    <Button
                                                        variant="contained"
                                                        color="secondary"
                                                        onClick={() => handleBlockDoctor(doctor._id)}
                                                    >
                                                        {doctor.approval === true ? 'Block' : 'Verify'}
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Doctormgt