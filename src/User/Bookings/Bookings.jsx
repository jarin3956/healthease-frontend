import React, { useEffect, useState } from 'react'
import './Bookings.scss'
import axiosinstance from '../../Axios/Axios';

import Swal from 'sweetalert2';

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import {
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBCol,
  MDBContainer,
  MDBRow,
} from "mdb-react-ui-kit";


function Bookings() {

  const [bookings, setBooking] = useState(null)

  const token = localStorage.getItem('token');

  const fetchBooking = async () => {
    try {
      const response = await axiosinstance.get('booking/load-user-bookings', {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (response.status === 200) {
        setBooking(response.data.bookingData)
      }

    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (token) {
      fetchBooking()
    }


  }, [token]);

  const CancelBooking = async (bookingId) => {
    try {
      const response = await axiosinstance.put(`booking/cancel-booking/${bookingId}`);
      if (response.status === 200) {
        fetchBooking()
        toast.success('Booking cancelled successfully!')

      }

    } catch (error) {
      console.log(error);
    }
  }

  const handleCancelBooking = (bookingId) => {
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

  return (

    <>
      <ToastContainer />
      <div className="mx-4 mt-5">
        <div className="ho-cookieCard rounded-3">
          <div className="ho-contentWrapper">
            <p className="ho-cookieHeading mt-3">Bookings</p>
            {bookings && bookings.length > 0 ? (
              <MDBContainer className="py-5 h-100">
                <MDBRow className="justify-content-center align-items-center h-100">
                  <MDBCol lg="12" xl="12">
                    <MDBCard style={{ borderRadius: "10px" }}>
                      <MDBCardBody className="p-4">
                        {bookings.map((booking) => (

                          <MDBCard className="shadow border m-2">
                            <MDBCardBody>
                              <MDBRow>
                                <MDBCol md="2">
                                  <MDBCardImage
                                    src={`/DocImages/${booking.doctorData.profileimg}`}
                                    className='rounded-5 '
                                    fluid
                                    alt="Phone"
                                    style={{
                                      height: '130px', 
                                      width: '130px', 
                                  }}
                                  />
                                </MDBCol>

                                <>
                                  <MDBCol
                                    md="2"
                                    className="text-center d-flex justify-content-center align-items-center"
                                  >
                                    <p className=" mb-0">{booking.doctorData.name}</p>
                                  </MDBCol>
                                  <MDBCol
                                    md="1"
                                    className="text-center d-flex justify-content-center align-items-center"
                                  >
                                    <p className=" mb-0 small">{booking.bookingData.Booked_date}</p>
                                  </MDBCol>
                                  <MDBCol
                                    md="2"
                                    className="text-center d-flex justify-content-center align-items-center"
                                  >
                                    <p className=" mb-0 small">
                                      {booking.bookingData.Booked_day}
                                    </p>
                                  </MDBCol>
                                  <MDBCol
                                    md="2"
                                    className="text-center d-flex justify-content-center align-items-center"
                                  >
                                    <p className=" mb-0 small">{booking.bookingData.Booked_timeSlot}</p>
                                  </MDBCol>
                                  <MDBCol
                                    md="1"
                                    className="text-center d-flex justify-content-center align-items-center"
                                  >
                                    {booking.bookingData.Status === 'CANCELLED' ? (
                                      <p className=" mb-0 small text-danger" style={{fontWeight:'700'}}>{booking.bookingData.Status}</p>
                                    ): (
                                      <p className=" mb-0 small">{booking.bookingData.Status}</p>
                                    )}
                                    

                                  </MDBCol>

                                </>

                                {booking.bookingData.Status === "PENDING" && (
                                  <MDBCol
                                    md="2"
                                    className="text-center d-flex justify-content-center align-items-center"
                                  >

                                    <button className="cancel-book-user-button" onClick={() => handleCancelBooking(booking.bookingData._id)} >
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="20"
                                        viewBox="0 0 20 20"
                                        height="20"
                                        fill="none"
                                        stroke="#FFFFFF"
                                        className="svg-icon"
                                      >
                                        <circle cx="10" cy="10" r="2.5" />
                                        <path
                                          fillRule="evenodd"
                                          clipRule="evenodd"
                                          d="M8.39079 2.80235c.53842-1.51424 2.67991-1.51424 3.21831 0 .3392.95358 1.4284 1.40477 2.3425.97027 1.4514-.68995 2.9657.82427 2.2758 2.27575-.4345.91407.0166 2.00334.9702 2.34248 1.5143.53842 1.5143 2.67996 0 3.21836-.9536.3391-1.4047 1.4284-.9702 2.3425.6899 1.4514-.8244 2.9656-2.2758 2.2757-.9141-.4345-2.0033.0167-2.3425.9703-.5384 1.5142-2.67989 1.5142-3.21831 0-.33914-.9536-1.4284-1.4048-2.34247-.9703-1.45148.6899-2.96571-.8243-2.27575-2.2757.43449-.9141-.01669-2.0034-.97028-2.3425-1.51422-.5384-1.51422-2.67994.00001-3.21836.95358-.33914 1.40476-1.42841.97027-2.34248-.68996-1.45148.82427-2.9657 2.27575-2.27575.91407.4345 2.00333-.01669 2.34247-.97026z"
                                          stroke="#FFFFFF"
                                        />
                                      </svg>
                                      <span className="label">Cancel</span>
                                    </button>

                                  </MDBCol>
                                )
                                }
                              </MDBRow>
                            </MDBCardBody>
                          </MDBCard>
                        ))}
                      </MDBCardBody>
                    </MDBCard>
                  </MDBCol>
                </MDBRow>
              </MDBContainer>
            ) : (
              <h6> NO bookings for you</h6>
            )}

          </div>
        </div>
      </div>
    </>


  )
}

export default Bookings