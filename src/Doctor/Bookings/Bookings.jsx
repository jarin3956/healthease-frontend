import React from 'react'
import {
    MDBCard,
    MDBCardBody,
    MDBCardImage,
    MDBCol,
    MDBContainer,
    MDBRow,
} from "mdb-react-ui-kit";

function Bookings({ bookingData, handleCancelBooking }) {

    const handleCancelBookingClick = async (bookingId) => {
        try {
            await handleCancelBooking(bookingId)
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <>
            <MDBContainer className="py-5 h-100">
                <MDBRow className="justify-content-center align-items-center h-100">
                    <MDBCol lg="10" xl="8">
                        <MDBCard style={{ borderRadius: "10px" }}>
                            <MDBCardBody className="p-4">
                                {bookingData.map((booking) => (

                                    <MDBCard className="shadow-0 border m-2">
                                        <MDBCardBody>
                                            <MDBRow>
                                                <MDBCol md="2">
                                                    <MDBCardImage
                                                        src={`/UserImages/${booking.userData.image}`}
                                                        fluid
                                                        alt="Phone"
                                                    />
                                                </MDBCol>
                                                {booking.bookingData.Status === "PENDING" ? (
                                                    <>
                                                        <MDBCol
                                                            md="2"
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