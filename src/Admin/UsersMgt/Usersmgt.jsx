
import React, { useState, useEffect } from 'react';
import { createInstance } from '../../Axios/Axios';

import Swal from 'sweetalert2';

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

import './Usersmgt.css'
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NotFound from '../../Common/NotFound/NotFound'

function Usersmgt() {

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchQuery, setSearchQuery] = useState('');
    const [users, setUsersData] = useState([]);

    const admintoken = localStorage.getItem('admintoken');

    useEffect(() => {

        const fetchUsersData = async () => {

            try {

                const axiosInstance = createInstance(admintoken)
                const response = await axiosInstance.get('admin/users')

                if (response.status === 200) {
                    const sortedUsers = response.data.users.slice();
                    sortedUsers.sort((a,b) => {
                        return new Date(b.createdAt) - new Date(a.createdAt);
                    })
                    setUsersData(sortedUsers);
                }

            } catch (error) {
                console.log(error);
            }
        };

        fetchUsersData();
    }, []);


    const blockUser = async (userId,usrname,usrstate) => {
        let state = usrstate ? 'Unblock': 'Block'
        const result = await Swal.fire({
            title: 'Are you sure ?',
            text: `To ${state} ${usrname}`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, sure!',
            cancelButtonText: 'No, keep it'
        });
        if (result.isConfirmed) {
            handleBlockUser(userId);
        }
    }

    const handleBlockUser = async (userId) => {

        try {
            
            const axiosInstance = createInstance(admintoken)

            const response = await axiosInstance.put(`admin/change-user-status/${userId}`)

            if (response.status === 200) {
                toast.success(response.data.message);
                const updatedUser = response.data.user
                setUsersData((prevUsers) =>
                    prevUsers.map((user) => (user._id === updatedUser._id ? updatedUser : user))
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

    const filteredUsers = users.filter((user) => {
        return (
            user.name.toLowerCase().includes(searchQuery)
        )
    })

    const isDataFound = filteredUsers.length > 0;

    return (
        <>
            <ToastContainer />

            <div className="card p-3 py-4   rounded-0 " style={{ backgroundColor: 'rgb(70, 166, 210)', minHeight: '100vh' }}>
                <div className=' rounded-3' style={{ backgroundColor: '#0490DB' }} >
                    <p className="text-center text-white mt-3" style={{ fontWeight: '700', fontSize: '30px' }}>User Management</p>
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
                                        <TableCell sx={{ fontSize: '18px', fontWeight: '700' }} align="center">Image</TableCell>
                                        <TableCell sx={{ fontSize: '18px', fontWeight: '700' }} align="center">Email</TableCell>
                                        <TableCell sx={{ fontSize: '18px', fontWeight: '700' }} align="center">Age</TableCell>
                                        <TableCell sx={{ fontSize: '18px', fontWeight: '700' }} align="center">Gender</TableCell>
                                        <TableCell sx={{ fontSize: '18px', fontWeight: '700' }} align="center">Status</TableCell>
                                        <TableCell sx={{ fontSize: '18px', fontWeight: '700' }} align="center">Action</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user) => (
                                        <TableRow
                                            key={user.name}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell component="th" scope="row" align="center" >
                                                {user.name}
                                            </TableCell>
                                            <TableCell align="center"><img src={user.image ? user.image : user.picture} alt={user.name} style={{ width: '60px', height: '60px', borderRadius: '15px' }} /></TableCell>
                                            <TableCell align="center">{user.email}</TableCell>
                                            <TableCell align="center">{user.age ? user.age : 'No data updated'}</TableCell>
                                            <TableCell align="center">{user.gender ? user.gender : 'No data updated'}</TableCell>
                                            <TableCell align="center">{user.isBlocked === false ? "Active" : "Blocked"}</TableCell>
                                            <TableCell align="center">
                                                <Button
                                                    variant="contained"
                                                    color="secondary"
                                                    onClick={() => blockUser(user._id,user.name,user.isBlocked)}
                                                    sx={{
                                                        backgroundColor: `${user.isBlocked ? '#0490DB' : '#D41D1D'}`,
                                                        color: '#fff',
                                                        '&:hover': {
                                                            backgroundColor: '#B40F0F',

                                                        },
                                                    }}
                                                >
                                                    {user.isBlocked ? 'Unblock' : 'Block'}
                                                </Button>
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
                            count={users.length}
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
    );
}

export default Usersmgt;