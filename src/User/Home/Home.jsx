import React, { useEffect, useState } from 'react';
import './Home.scss';
import { createInstance } from '../../Axios/Axios';
import Viewspec from '../ViewSpec/Viewspec';
import DisplayCards from '../DisplayCards/DisplayCards';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../../Context/SocketProvider';
import VideoCall from '../../VideoCall/VideoCall';

function Home() {

    const token = localStorage.getItem('token')
    const [spec, setSpec] = useState([])
    const navigate = useNavigate();
    const socket = useSocket();
    const [userMail, setUserMail] = useState(null)
    const [selectedBookingId, setSelectedBookingId] = useState(null);
    const [selectedEmailId, setSelectedEmailId] = useState(null);

    useEffect(() => {
        if (token) {
            const fetchSpec = async () => {

                try {

                    const axiosInstance = createInstance(token)
                    const response = await axiosInstance.get('view-specialization')

                    if (response.status === 200) {
                        setSpec(response.data.spec)
                        setUserMail(response.data.logUser.email)
                        socket.emit('set-up', response.data.logUser._id)
                    }

                } catch (error) {
                    console.log(error);
                }
            }
            fetchSpec()
        }
    }, [])

    useEffect(() => {
        console.log("Inside useEffect for call-request-topatient");
        socket.on('call-request-topatient', (bookingId) => {
            console.log("Received call request with bookingId:", bookingId);
            Swal.fire({
                title: 'Video call Request',
                text: `Your booking with ${bookingId} is going to start , Do you want to join ?`,
                icon: 'info',
                showCancelButton: true,
                confirmButtonText: 'Yes',
                cancelButtonText: 'Cancel',
            }).then((result) => {

                if (result.isConfirmed) {
                    setSelectedBookingId(bookingId)
                    console.log(userMail, 'this is the user maiul');
                    setSelectedEmailId(userMail)
                } 
            });
        })
    }, [socket,userMail])

    

    return (
        <>
            <div className="">
                <div className="ho-cookieCard ">
                    <div >
                        <p className="ho-cookieHeading mt-3 text-center">Home</p>
                        <p className='text-center the-main-head'>Book an appointment for an online consultation</p>
                        {selectedBookingId && selectedEmailId && (
                            <>
                                <VideoCall
                                    userEmail={selectedEmailId}
                                    bookingId={selectedBookingId}
                                />
                            </>
                        )}
                        <div className='ho-thecrd-container row row-cols-1 row-cols-md-2 row-cols-lg-4 g-3'  >
                            {spec && spec.map((special) => (
                                <Viewspec spec={special} />
                            ))}

                        </div>
                        <p className='text-center m-3' style={{ fontSize: '40px', fontWeight: '500' }}>Medical History</p>
                        <div className='thedisCard row row-cols-1 row-cols-md-2 row-cols-lg-4 g-3 mt-4'  >
                            <DisplayCards />
                        </div>
                    </div>
                </div>
            </div>
        </>

    )
}

export default Home