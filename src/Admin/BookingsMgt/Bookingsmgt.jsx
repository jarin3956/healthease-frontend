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

import { useNavigate } from 'react-router-dom';

import NotFound from '../../Common/NotFound/NotFound';

function Bookingsmgt() {

  const admintoken = localStorage.getItem('admintoken');
  const navigate = useNavigate()

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [bookings, setBookings] = useState([])
  const [searchQuery, setSearchQuery] = useState('');

  const fetchBookingData = async () => {

    try {

      const axiosInstance = createInstance(admintoken)
      const response = await axiosInstance.get('admin/bookings')

      if (response.status === 200) {
        const sortedData = response.data.bookingData.sort((a, b) => new Date(b.CreatedAt) - new Date(a.CreatedAt));
        setBookings(sortedData);
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

  const filteredBookings = bookings.filter((booking) =>
    booking._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    booking.CreatedAt.toLowerCase().includes(searchQuery.toLowerCase()) ||
    booking.Payment_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    booking.Fare.toString().includes(searchQuery.toLowerCase()) ||
    booking.Booked_date.toLowerCase().includes(searchQuery.toLowerCase()) ||
    booking.Booked_day.toLowerCase().includes(searchQuery.toLowerCase()) ||
    booking.Booked_timeSlot.toLowerCase().includes(searchQuery.toLowerCase()) ||
    booking.Payment_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    booking.Status.toLowerCase().includes(searchQuery.toLowerCase()) ||
    booking.UserId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    booking.DocId.toLowerCase().includes(searchQuery.toLowerCase())
  );


  const isDataFound = filteredBookings.length > 0;

  return (
    <>

      <div className="card p-3 py-4   rounded-0 " style={{ backgroundColor: 'rgb(70, 166, 210)', minHeight: '100vh' }}>
        <div className=' rounded-3' style={{ backgroundColor: '#0490DB' }} >
          <p className="text-center text-white mt-3" style={{ fontWeight: '700', fontSize: '30px' }}>Bookings Management</p>
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
                    <TableCell sx={{ fontSize: '18px', fontWeight: '700' }} align="center">Booking Id</TableCell>
                    <TableCell sx={{ fontSize: '18px', fontWeight: '700' }} align="center">Doctor</TableCell>
                    <TableCell sx={{ fontSize: '18px', fontWeight: '700' }} align="center">User</TableCell>
                    <TableCell sx={{ fontSize: '18px', fontWeight: '700' }} align="center">Amount</TableCell>
                    <TableCell sx={{ fontSize: '18px', fontWeight: '700' }} align="center">Booked Slot</TableCell>
                    <TableCell sx={{ fontSize: '18px', fontWeight: '700' }} align="center">Booking Date</TableCell>
                    <TableCell sx={{ fontSize: '18px', fontWeight: '700' }} align="center">Payment Id</TableCell>
                    <TableCell sx={{ fontSize: '18px', fontWeight: '700' }} align="center">Payment Type</TableCell>
                    <TableCell sx={{ fontSize: '18px', fontWeight: '700' }} align="center">Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredBookings.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((booking) => (
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
                      <TableCell align="center">₹ {booking.Fare}</TableCell>
                      <TableCell align="center">{booking.Booked_date}, {booking.Booked_day}, {booking.Booked_timeSlot}</TableCell>
                      <TableCell align="center">{booking.CreatedAt}</TableCell>
                      <TableCell align="center">{booking.Payment_id ? booking.Payment_id : 'Not paid yet'}</TableCell>
                      <TableCell align="center">{booking.Payment_type ? booking.Payment_type :'Not paid yet'}</TableCell>
                      <TableCell align="center">{booking.Status}</TableCell>
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
              count={bookings.length}
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

export default Bookingsmgt