import React from 'react'
import {
    MDBCard,
    MDBCardBody,
    MDBCardImage,
    MDBCol,
    MDBContainer,
    MDBRow,
} from "mdb-react-ui-kit";

import Swal from 'sweetalert2';

function Bookings({ bookingData, handleCancelBooking }) {

    

    const handleCancelBookingClick = async (bookingId) => {
        try {

            const result = await Swal.fire({
                title: 'Are you sure?',
                text: 'You will not be able to recover this booking!',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Yes, cancel it!',
                cancelButtonText: 'No, keep it'
              });
              if (result.isConfirmed) {
                await handleCancelBooking(bookingId);
                Swal.fire('Cancelled!', 'Your booking has been cancelled.', 'success');
              }

        } catch (error) {
            console.log(error);
        }
    }

    return (
        <>
            <MDBContainer className="py-5 h-100">
                <MDBRow className="justify-content-center align-items-center h-100">
                    <MDBCol lg="10" xl="11">
                        <MDBCard style={{ borderRadius: "10px" }}>
                            <MDBCardBody className="p-4">
                                {bookingData.map((booking) => (

                                    <MDBCard className="shadow border m-2">
                                        <MDBCardBody>
                                            <MDBRow>
                                                <MDBCol md="2"className="d-flex justify-content-center" >
                                                    { booking.userData ? (
                                                        <MDBCardImage
                                                        src={`/UserImages/${booking.userData.image}`}
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
                                                    ) }
                                                    
                                                </MDBCol>
                                                {booking.bookingData.Status === "PENDING" ? (
                                                    <>
                                                        <MDBCol
                                                            md="2"
                                                            className="text-center d-flex justify-content-center align-items-center"
                                                        >
                                                            { booking.userData ? (
                                                                <p className=" mb-0">{booking.userData.name}</p>
                                                            ) : (
                                                                <p>No data</p>
                                                            ) }
                                                            
                                                        </MDBCol>
                                                        <MDBCol
                                                            md="2"
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
                                                            md="3"
                                                            className="text-center d-flex justify-content-center align-items-center"
                                                        >
                                                            <p className=" mb-0 small">{booking.bookingData.Booked_timeSlot}</p>
                                                        </MDBCol>
                                                        <MDBCol
                                                            md="1"
                                                            className="text-center d-flex justify-content-center align-items-center"
                                                        >
                                                            <button
                                                                onClick={() => handleCancelBookingClick(booking.bookingData._id)}
                                                                className="btn btn-danger btn-sm mb-0 "
                                                            >
                                                                Cancel
                                                            </button>
                                                        </MDBCol>
                                                    </>
                                                ) : (
                                                    <>
                                                        <MDBCol
                                                            md="3"
                                                            className="text-center d-flex justify-content-center align-items-center"
                                                        >
                                                            <p className=" mb-0">{booking.userData.name}</p>
                                                        </MDBCol>
                                                        <MDBCol
                                                            md="2"
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
                                                            md="3"
                                                            className="text-center d-flex justify-content-center align-items-center"
                                                        >
                                                            <p className=" mb-0 small">{booking.bookingData.Booked_timeSlot}</p>
                                                        </MDBCol>

                                                    </>
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
        </>
    )
}

export default Bookings