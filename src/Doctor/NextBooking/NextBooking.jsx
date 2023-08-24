import React, { useState, useEffect } from 'react';
import ReactModal from 'react-modal';
import {
    MDBCard,
    MDBCardBody,
    MDBCardImage,
    MDBCol,
    MDBContainer,
    MDBRow,
} from "mdb-react-ui-kit";
import VideoCall from '../../VideoCall/VideoCall';
import { createInstance } from '../../Axios/Axios';

function NextBooking({ isOpen, onClose }) {

    const doctortoken = localStorage.getItem('doctortoken');

    const [booking, setNextBooking] = useState([]);
    const [user, setUser] = useState([])
    const [selectedBookingId, setSelectedBookingId] = useState(null);
    const [selectedEmailId, setSelectedEmailId] = useState(null);
    const [empty, setEmpty] = useState(false)

    const modalStyles = {
        content: {
            width: '80%',
            height: '30%',
            margin: 'auto',
            borderRadius: '10px',
        },
    };

    useEffect(() => {
        if (doctortoken) {
            getNextBooking()
        }
    }, []);

    const getNextBooking = async () => {
        try {
            const axiosInstance = createInstance(doctortoken)
            const response = await axiosInstance.get('booking/load-doc-nextbooking');
            if (response.status === 200) {
                setNextBooking(response.data.booking);
                setUser(response.data.user);
            } else if (response.status === 204) {
                setEmpty(true)

            }
            console.log(response.data, 'this sis the next booking');
        } catch (error) {
            console.log(error);
        }
    }

    const handleStartBookingClick = async (bookingId, email) => {
        setSelectedBookingId(bookingId);
        setSelectedEmailId(email);
    }

    return (
        <ReactModal
            isOpen={isOpen}
            onRequestClose={onClose}
            contentLabel="Example Modal"
            style={modalStyles}
        >
            <MDBCard className="shadow border m-2">
                <MDBCardBody>
                    <MDBRow>
                        {booking && user && empty === false ? (
                            <>
                                <MDBCol md="2" className="d-flex justify-content-center" >
                                    {user ? (
                                        <MDBCardImage
                                            src={user.image ? `/UserImages/${user.image}` : user.picture}
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
                                <MDBCol
                                    md="1"
                                    className="text-center d-flex justify-content-center align-items-center"
                                >
                                    {user ? (
                                        <p className=" mb-0">{user.name}</p>
                                    ) : (
                                        <p>No data</p>
                                    )}
                                </MDBCol>
                                <MDBCol
                                    md="2"
                                    className="text-center d-flex justify-content-center align-items-center"
                                >
                                    <p className=" mb-0 small">{booking.Booked_date}</p>
                                </MDBCol>
                                <MDBCol
                                    md="3"
                                    className="text-center d-flex justify-content-center align-items-center"
                                >
                                    <p className=" mb-0 small">{booking.Booked_day}, {booking.Booked_timeSlot}</p>
                                </MDBCol>
                                <MDBCol
                                    md="2"
                                    className="text-center d-flex justify-content-center align-items-center"
                                >
                                    <button onClick={() => handleStartBookingClick(booking._id, user.email)} className='doc-vdo-startbutt' >
                                        Start
                                    </button>
                                </MDBCol>
                                <MDBCol
                                    md="2"
                                    className="text-center d-flex justify-content-center align-items-center"
                                >
                                    <button onClick={onClose} className='doc-vdo-cancelbutt' >
                                        Close
                                    </button>
                                </MDBCol>
                            </>
                        ) : (
                            <>
                                <MDBCol
                                    md="8"
                                    className="text-center d-flex justify-content-center align-items-center" style={{ fontWeight: 'bold', fontSize: '20px' }}
                                >
                                    All of your bookings are over 
                                </MDBCol>
                                <MDBCol
                                    md="4"
                                    className="text-center d-flex justify-content-center align-items-center"
                                >
                                    <button onClick={onClose} className='doc-vdo-cancelbutt' >
                                        Close
                                    </button>
                                </MDBCol>
                            </>
                        )}
                    </MDBRow>
                </MDBCardBody>
            </MDBCard>
            {selectedBookingId && selectedEmailId && (
                <VideoCall
                    doctorEmail={selectedEmailId}
                    bookingId={selectedBookingId}
                />
            )}
        </ReactModal>
    )
}

export default NextBooking