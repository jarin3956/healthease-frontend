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

import { useNavigate } from 'react-router-dom';

function Bookingsmgt() {

  const [bookings, setBookings] = useState([])

  const navigate = useNavigate()

  const fetchBookingData = async () => {
    try {
      const response = await axiosinstance.get('admin/bookings');
      if (response.status === 200) {
        const sortedData = response.data.bookingData.sort((a, b) => new Date(b.CreatedAt) - new Date(a.CreatedAt));
        setBookings(sortedData);
      } else {
        console.log("error");
      }
    } catch (error) {
      console.log(error);
    }
  };


  useEffect(() => {
    
    fetchBookingData();
  }, [])

  const viewDoctor = (docId) => {
    navigate(`/admin/viewDoctorProfile?id=${docId}`)
  }
  const viewUser = (userId) => {
    navigate(`/admin/viewUserProfile?id=${userId}`);
  }

  return (
    <>
      <div className="mx-4 mt-5">
        <div className="row justify-content-center">
          <div className="col-md-12">
            <div className="card p-3 py-4 mb-5">
              <div className='adminusrtable rounded-3' >
                <p className="cookieHeading text-center mt-3">Bookings Management</p>
              </div>
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead sx={{ backgroundColor: 'lightgrey' }} >
                    <TableRow>
                      <TableCell sx={{ fontSize: '18px', fontWeight: '700' }} align="center">Booking Id</TableCell>
                      <TableCell sx={{ fontSize: '18px', fontWeight: '700' }} align="center">Doctor</TableCell>
                      <TableCell sx={{ fontSize: '18px', fontWeight: '700' }} align="center">User</TableCell>
                      <TableCell sx={{ fontSize: '18px', fontWeight: '700' }} align="center">Amount</TableCell>
                      <TableCell sx={{ fontSize: '18px', fontWeight: '700' }} align="center">Booking Date</TableCell>
                      <TableCell sx={{ fontSize: '18px', fontWeight: '700' }} align="center">Booked Day</TableCell>
                      <TableCell sx={{ fontSize: '18px', fontWeight: '700' }} align="center">Booked Time Slot</TableCell>
                      <TableCell sx={{ fontSize: '18px', fontWeight: '700' }} align="center">Booking Date</TableCell>
                      <TableCell sx={{ fontSize: '18px', fontWeight: '700' }} align="center">Payment Id</TableCell>
                      <TableCell sx={{ fontSize: '18px', fontWeight: '700' }} align="center">Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {bookings.map((booking) => (
                      <TableRow
                        key={booking._id}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      >
                        <TableCell component="th" scope="row">
                          {booking._id}
                        </TableCell>
                        <TableCell align="center">
                          <Button variant="contained" color="primary" onClick={() => viewDoctor(booking.DocId)} >
                            View Doctor
                          </Button>
                        </TableCell>
                        <TableCell align="center">
                          <Button variant="contained" color="primary" onClick={() => viewUser(booking.UserId)} >
                            View User
                          </Button>
                        </TableCell>
                        <TableCell align="center">{booking.Fare} Rupees</TableCell>
                        <TableCell align="center">{booking.Booked_date}</TableCell>
                        <TableCell align="center">{booking.Booked_day}</TableCell>
                        <TableCell align="center">{booking.Booked_timeSlot}</TableCell>
                        <TableCell align="center">{booking.CreatedAt}</TableCell>
                        <TableCell align="center">{booking.Payment_id}</TableCell>
                        <TableCell align="center">{booking.Status === true ? "Not Completed" : "Completed"}</TableCell>
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

export default Bookingsmgt