import React, { useEffect, useState } from 'react';
import './Home.scss';
import { createInstance } from '../../Axios/Axios';
import Viewspec from '../ViewSpec/Viewspec';
import DisplayCards from '../DisplayCards/DisplayCards';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../../Context/SocketProvider';
import VideoCall from '../../VideoCall/VideoCall';
import Search from '../../Common/Search/Search';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import NotFound from '../../Common/NotFound/NotFound';
import News from '../../Common/News/News';
import Books from '../../Common/Books/Books';

function Home() {

    const token = localStorage.getItem('token')
    const [spec, setSpec] = useState([])
    const navigate = useNavigate();
    const socket = useSocket();
    const [userMail, setUserMail] = useState(null)
    const [selectedBookingId, setSelectedBookingId] = useState(null);
    const [selectedEmailId, setSelectedEmailId] = useState(null);
    const [allDoc, setAllDoc] = useState([]);
    const [searchedData, setSearchedData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    const [sortedData, setSortedData] = useState([]);
    const [sortOrder, setSortOrder] = useState('asc');

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
                        setAllDoc(response.data.doctorData)
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
    }, [socket, userMail])


    const handleSearch = (query) => {
        const filteredData = allDoc.filter((doc) => {
            const lowerCaseQuery = query.toLowerCase();
            return (
                doc.name.toLowerCase().includes(lowerCaseQuery) ||
                doc.experience.toString().toLowerCase().includes(lowerCaseQuery) ||
                doc.specialization.toLowerCase().includes(lowerCaseQuery)
            )
        });

        setSearchTerm(query);

        const sorted = [...filteredData].sort((a, b) => {
            const fareA = a.final_fare;
            const fareB = b.final_fare;
            return sortOrder === 'asc' ? fareA - fareB : fareB - fareA;
        });

        setSortedData(sorted);
    };

    const bookAppointment = (docId) => {
        navigate(`/bookAppointment?doc=${docId}`)
    }

    const handleGoBack = () => {
        setSearchTerm('');
        setSearchedData([]);
    };


    // const dataToDisplay = searchTerm ? searchedData : spec;
    const dataToDisplay = searchTerm ? sortedData : spec;

    const toggleSortOrder = () => {
        const newOrder = sortOrder === 'asc' ? 'desc' : 'asc';
        setSortOrder(newOrder);
        const sorted = [...sortedData].sort((a, b) => {
            const fareA = a.final_fare;
            const fareB = b.final_fare;
            return newOrder === 'asc' ? fareA - fareB : fareB - fareA;
        });
        setSortedData(sorted);
    };

    return (
        <>
            {searchTerm ? (
                <div className="viewdoc-Card">
                    {dataToDisplay.length === 0 ? (
                        <NotFound />
                    ) : (
                        <>
                            <div className='d-flex justify-content-center p-3' >
                                <button className='user-vdo-startbutt' onClick={toggleSortOrder}>
                                    Sort by {sortOrder === 'asc' ? 'Low to High' : 'High to Low'} Fare
                                </button>
                            </div>

                            <div className='view-doccard-container'  >

                                {dataToDisplay.map((doctor) => (
                                    <div className='p-3' >
                                        <Card key={doctor._id} sx={{ width: 300 }}>
                                            <CardMedia
                                                component="img"
                                                alt="doctor"
                                                height="220"
                                                src={doctor.profileimg}
                                                onClick={() => bookAppointment(doctor._id)}
                                            />
                                            <CardContent>
                                                <Typography gutterBottom variant="h5" component="div">
                                                    Dr. {doctor.name}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {doctor.specialization}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {doctor.experience} Years of experience
                                                </Typography>
                                                <Typography variant="body2" color="text.black">
                                                    ₹{doctor.final_fare} for Consultation
                                                </Typography>
                                            </CardContent>
                                            <CardActions>
                                                <Button size="small" onClick={() => bookAppointment(doctor._id)} >Book Appointment</Button>
                                            </CardActions>
                                        </Card>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                    <div className='d-flex justify-content-center pt-3'>
                        <button className='user-vdo-cancelbutt' onClick={handleGoBack}>Go back</button>
                    </div>

                </div>
            ) : (
                <div className="">
                    <div className="ho-cookieCard ">
                        <div >
                            <div className='d-flex justify-content-center mb-4'>
                                <Search onSearch={handleSearch} />
                            </div>
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
                            <p className='text-center m-3' style={{ fontSize: '40px', fontWeight: '500',color:'white' }}>News</p>
                            <div className='thedisCard row row-cols-1 row-cols-md-2 row-cols-lg-4 g-3 mt-4'  >
                                <News />
                            </div>
                            <p className='text-center m-3' style={{ fontSize: '40px', fontWeight: '500',color:'white' }}>Books</p>
                            <div className='thedisCard row row-cols-1 row-cols-md-2 row-cols-lg-4 g-3 mt-4'  >
                                <Books />
                            </div>
                            <p className='text-center m-3' style={{ fontSize: '40px', fontWeight: '500',color:'white' }}>History</p>
                            <div className='thedisCard row row-cols-1 row-cols-md-2 row-cols-lg-4 g-3 mt-4'  >
                                <DisplayCards />
                            </div>
                        </div>
                    </div>
                </div>
            )
            }

        </>

    )
}

export default Home