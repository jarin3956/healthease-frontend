import React, { useEffect, useState } from 'react'
import './Bookings.scss'
import { createInstance } from '../../Axios/Axios';
import Swal from 'sweetalert2';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import VideoCall from '../../VideoCall/VideoCall';
import { useSocket } from '../../Context/SocketProvider';
import { useDispatch } from 'react-redux';
import { addChatRoomId } from '../../Redux- toolkit/chatSlice'

import {
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBCol,
  MDBContainer,
  MDBRow,
} from "mdb-react-ui-kit";

import { useNavigate } from 'react-router-dom';


function Bookings() {

  const socket = useSocket();
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const [bookings, setBooking] = useState(null);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [selectedEmailId, setSelectedEmailId] = useState(null);
  const [userData, setUserData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const bookingsPerPage = 10;

  const fetchBooking = async () => {

    try {

      const axiosInstance = createInstance(token)
      const response = await axiosInstance.get('booking/load-user-bookings', {
        params: {
          page: currentPage,
          limit: bookingsPerPage,
        },
      })

      if (response.status === 200) {
        setBooking(response.data.bookingData);
        setUserData(response.data.user)
      }

    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (token) {
      fetchBooking()
    }

  }, [token, currentPage]);

  const CancelBooking = async (bookingId) => {

    try {
      const axiosInstance = createInstance(token)
      const response = await axiosInstance.put(`booking/cancel-booking-user/${bookingId}`)
      if (response.status === 200) {
        fetchBooking()
        toast.success('Booking cancelled successfully!')
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleCancelBooking = (bookingId,booked_Date) => {

    const bookedDate = new Date(booked_Date);
    const currentDate = new Date();
    const timeDifference = bookedDate - currentDate;
    const oneDayInMillis = 24 * 60 * 60 * 1000;
    if (timeDifference < oneDayInMillis) {
      toast.error("It's too late to cancel now. Your booking is less than 24 hours away !!!");
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Are you sure?',
        text: 'This action cannot be undone!',
        showCancelButton: true,
        confirmButtonText: 'Yes, cancel it!',
        cancelButtonText: 'No, keep it',
        confirmButtonColor: '#FF0000',
        cancelButtonColor: '#333333',
      }).then((result) => {
        if (result.isConfirmed) {
          CancelBooking(bookingId);
        }
      });
    }
  }

  const handleStartBooking = (bookingId, email) => {
    setSelectedBookingId(bookingId)
    setSelectedEmailId(email)
  }

  const dispatch = useDispatch()

  const handleChat = (roomId, docterId) => {

    if (userData && bookings && docterId) {
      socket.emit('setup', userData);
      socket.emit('join-chat', roomId, userData, docterId);

      const handleRoomJoin = () => {
        dispatch(addChatRoomId(roomId))
        navigate(`/chat/${docterId}`)
      }

      socket.on('chat-connected', handleRoomJoin);

      return () => {
        socket.off('chat-connected', handleRoomJoin);
      }
    }
  }

  return (

    <>
      <ToastContainer />
      <div className="ho-cookieCard " style={{ minHeight: '100vh' }}>
        {bookings && bookings.length > 0 ? (
          <>
            <MDBContainer className="py-5 h-100">
              <MDBRow className="justify-content-center align-items-center h-100">
                <MDBCol lg="12" xl="12">
                  <MDBCard style={{ borderRadius: "10px" }}>
                    <p className="text-center mt-5" style={{ fontWeight: '700', fontSize: '25px' }}>Bookings</p>
                    <MDBCardBody className="p-4">
                      {bookings.map((booking) => (
                        <MDBCard className="shadow border m-2">
                          <MDBCardBody>
                            <MDBRow>
                              <MDBCol md="2">
                                {booking.doctorData ? (
                                  <MDBCardImage
                                    src={booking.doctorData.profileimg}
                                    className='rounded-5 '
                                    fluid
                                    alt="Phone"
                                    style={{
                                      height: '130px',
                                      width: '130px',
                                    }}
                                  />
                                ) : (
                                  <p>No image</p>
                                )}
                              </MDBCol>

                              <>

                                <MDBCol
                                  md="1"
                                  className="text-center d-flex justify-content-center align-items-center"
                                >
                                  {booking.doctorData ? (
                                    <p className=" mb-0">Dr.{booking.doctorData.name}</p>
                                  ) : (
                                    <p>No data</p>
                                  )}
                                </MDBCol>
                                <MDBCol
                                  md="4"
                                  className="text-center d-flex justify-content-center align-items-center"
                                >
                                  <p className=" mb-0 small">{booking.bookingData.Booked_date}, {booking.bookingData.Booked_day}, {booking.bookingData.Booked_timeSlot}</p>
                                </MDBCol>

                                <MDBCol
                                  md="1"
                                  className="text-center d-flex justify-content-center align-items-center"
                                >
                                  {booking.bookingData.Status === 'CANCELLED' && (
                                    <p className=" mb-0 small text-danger" style={{ fontWeight: '700' }}>{booking.bookingData.Status}</p>
                                  )}
                                  {booking.bookingData.Status === 'COMPLETED' && (
                                    <p className=" mb-0 small text-success" style={{ fontWeight: '700' }}>{booking.bookingData.Status}</p>
                                  )}
                                  {booking.bookingData.Status === 'FAILED' && (
                                    <p className=" mb-0 small text-warning" style={{ fontWeight: '700' }}>{booking.bookingData.Status}</p>
                                  )}
                                  {booking.bookingData.Status === 'CONFIRMED' && (
                                    <p className=" mb-0 small text-primary" style={{ fontWeight: '700' }}>{booking.bookingData.Status}</p>
                                  )}
                                  {booking.bookingData.Status === 'NOTPAID' && (
                                    <p className=" mb-0 small" style={{ fontWeight: '700', color: 'orange' }}>{booking.bookingData.Status}</p>
                                  )}
                                </MDBCol>
                              </>

                              {booking.bookingData.Status === "PENDING" && (
                                <>
                                  <MDBCol
                                    md="2"
                                    className="text-center d-flex justify-content-center align-items-center"
                                  >
                                    <button
                                      onClick={() => handleCancelBooking(booking.bookingData._id,booking.bookingData.Booked_date)}
                                      className="user-vdo-cancelbutt"
                                    >
                                      Cancel
                                    </button>
                                  </MDBCol>
                                  <MDBCol
                                    md="2"
                                    className="text-center d-flex justify-content-center align-items-center"
                                  >
                                    {/* <button
                                      onClick={() => handleStartBooking(booking.bookingData._id, booking.doctorData.email)}
                                      className="user-vdo-startbutt"
                                    >
                                      Join
                                    </button> */}
                                    {/* <button
                                      onClick={() => handleStartBooking(booking.bookingData._id, userData.email)}
                                      className="user-vdo-startbutt"
                                    >
                                      Join
                                    </button> */}
                                  </MDBCol>
                                </>
                              )}
                              {booking.bookingData.Status === "COMPLETED" && (
                                <>
                                  <MDBCol
                                    md="2"
                                    className="text-center d-flex justify-content-center align-items-center"
                                  >
                                    <button
                                      onClick={() => navigate(`/view-prescription/${booking.bookingData._id}`)}
                                      className="user-vdo-startbutt"
                                    >
                                      ViewRx
                                    </button>
                                  </MDBCol>
                                  <MDBCol
                                    md="2"
                                    className="text-center d-flex justify-content-center align-items-center"
                                  >
                                    <button className="chatBtn" onClick={() => handleChat(booking.bookingData._id, booking.doctorData._id)}>
                                      <svg height="1.6em" fill="white" xmlSpace="preserve" viewBox="0 0 1000 1000" y="0px" x="0px" version="1.1">
                                        <path d="M881.1,720.5H434.7L173.3,941V720.5h-54.4C58.8,720.5,10,671.1,10,610.2v-441C10,108.4,58.8,59,118.9,59h762.2C941.2,59,990,108.4,990,169.3v441C990,671.1,941.2,720.5,881.1,720.5L881.1,720.5z M935.6,169.3c0-30.4-24.4-55.2-54.5-55.2H118.9c-30.1,0-54.5,24.7-54.5,55.2v441c0,30.4,24.4,55.1,54.5,55.1h54.4h54.4v110.3l163.3-110.2H500h381.1c30.1,0,54.5-24.7,54.5-55.1V169.3L935.6,169.3z M717.8,444.8c-30.1,0-54.4-24.7-54.4-55.1c0-30.4,24.3-55.2,54.4-55.2c30.1,0,54.5,24.7,54.5,55.2C772.2,420.2,747.8,444.8,717.8,444.8L717.8,444.8z M500,444.8c-30.1,0-54.4-24.7-54.4-55.1c0-30.4,24.3-55.2,54.4-55.2c30.1,0,54.4,24.7,54.4,55.2C554.4,420.2,530.1,444.8,500,444.8L500,444.8z M282.2,444.8c-30.1,0-54.5-24.7-54.5-55.1c0-30.4,24.4-55.2,54.5-55.2c30.1,0,54.4,24.7,54.4,55.2C336.7,420.2,312.3,444.8,282.2,444.8L282.2,444.8z"></path>
                                      </svg>
                                      <span className="tooltip">Chat</span>
                                    </button>

                                  </MDBCol>
                                </>
                              )}
                              {booking.bookingData.Status === "NOTPAID" && (
                                <>
                                  <MDBCol
                                    md="2"
                                    className="text-center d-flex justify-content-center align-items-center"
                                  >
                                    <button
                                      onClick={() => navigate(`/follow-up-payment/${booking.bookingData._id}`)}
                                      className="user-vdo-startbutt"
                                    >
                                      PAY
                                    </button>
                                  </MDBCol>
                                </>
                              )}
                            </MDBRow>
                          </MDBCardBody>
                        </MDBCard>
                      ))}
                      {selectedBookingId && selectedEmailId && (
                        <>
                          <VideoCall
                            userEmail={selectedEmailId}
                            bookingId={selectedBookingId}
                          />
                        </>
                      )}
                    </MDBCardBody>
                  </MDBCard>
                </MDBCol>
              </MDBRow>
            </MDBContainer>



            <div className='d-flex justify-content-center' >
              <button
                className='user-vdo-cancelbutt m-2'
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Previous
              </button>
              <button
                className='user-vdo-startbutt m-2'
                disabled={bookings.length < bookingsPerPage}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Next
              </button>
            </div>

          </>

        ) : (
          <h6> NO bookings for you</h6>
        )}


      </div>
    </>


  )
}

export default Bookings