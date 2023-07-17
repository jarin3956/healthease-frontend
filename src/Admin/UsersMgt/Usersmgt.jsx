
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
import './Usersmgt.css'

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function Usersmgt() {

    const [users, setUsersData] = useState([]);

    useEffect(() => {
        const fetchUsersData = async () => {
            try {
                const response = await axiosinstance.get('admin/users');
                const userdata = response.data.users;
                setUsersData(userdata);
                console.log(userdata, "this is the data");
            } catch (error) {
                console.log(error);
            }
        };

        fetchUsersData();
    }, []);


    const handleBlockUser = async (userId) => {
        // Handle the block user action here
        console.log('Block user with ID:', userId);
        try {
            const response = await axiosinstance.put(`admin/change-user-status/${userId}`)
            const updatedUser = response.data.user
            setUsersData((prevUsers) =>
                prevUsers.map((user) => (user._id === updatedUser._id ? updatedUser : user))
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
                                <p className="cookieHeading text-center mt-3">User Management</p>
                            </div>
                            <TableContainer component={Paper}>
                                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                    <TableHead sx={{ backgroundColor: 'lightgrey' }} >
                                        <TableRow>
                                            <TableCell sx={{ fontSize: '18px', fontWeight: '700' }} align="center" >Name</TableCell>
                                            <TableCell sx={{ fontSize: '18px', fontWeight: '700' }} align="center">Email</TableCell>
                                            <TableCell sx={{ fontSize: '18px', fontWeight: '700' }} align="center">Age</TableCell>
                                            <TableCell sx={{ fontSize: '18px', fontWeight: '700' }} align="center">Gender</TableCell>
                                            <TableCell sx={{ fontSize: '18px', fontWeight: '700' }} align="center">Status</TableCell>
                                            <TableCell sx={{ fontSize: '18px', fontWeight: '700' }} align="center">Action</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {users.map((user) => (
                                            <TableRow
                                                key={user.name}
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
                                                <TableCell component="th" scope="row">
                                                    {user.name}
                                                </TableCell>
                                                <TableCell align="center">{user.email}</TableCell>
                                                <TableCell align="center">{user.age ? user.age :'No data updated'}</TableCell>
                                                <TableCell align="center">{user.gender ? user.gender : 'No data updated'}</TableCell>
                                                <TableCell align="center">{user.status === true ? "Active" : "Blocked"}</TableCell>
                                                <TableCell align="center">
                                                    <Button
                                                        variant="contained"
                                                        color="secondary"
                                                        onClick={() => handleBlockUser(user._id)}
                                                    >
                                                        {user.status ? 'Block' : 'Unblock'}
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
    );
}

export default Usersmgt;