import React, { useEffect, useState } from 'react';
import './Home.scss';
import axiosinstance from '../../Axios/Axios';
import Viewspec from '../ViewSpec/Viewspec';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import DisplayCards from '../DisplayCards/DisplayCards';


function Home() {

    const navigate = useNavigate()

    const [spec, setSpec] = useState([])

    const token = localStorage.getItem('token')

    useEffect(() => {
        if (token) {
            const fetchSpec = async () => {
                try {
                    const response = await axiosinstance.get('view-specialization', {
                        headers: { 'Authorization': `Bearer ${token}` },
                    })
                    if (response.status === 200) {
                        setSpec(response.data.spec)
                    } else {
                        Swal.fire('Oops!', 'Error when loading user data', 'error')
                    }
                } catch (error) {
                    if (error.response) {
                        const status = error.response.status;
                        if (status === 401) {
                            localStorage.removeItem('token');
                            Swal.fire('Unauthorized', 'You are not authorized to access this resource.', 'error')
                                .then(() => {
                                    navigate('/login')
                                });
                        } else if (status === 403) {
                            localStorage.removeItem('token');
                            Swal.fire('Forbidden', 'You do not have permission to access this resource.', 'error')
                                .then(() => {
                                    navigate('/login')
                                });
                        } else if(status === 404 || status === 500) {
                            Swal.fire('Oops!', error.response.data.message, 'error');

                        }
                    } else {
                        console.log(error);
                        Swal.fire('Oops!', 'Error when loading user data', 'error');
                    }
                }

            }
            fetchSpec()
        }
    }, [])




    return (
        <>

            <div className="">
                <div className="ho-cookieCard ">
                    <div >
                        <p className="ho-cookieHeading mt-3 text-center">Home</p>
                        <p className='text-center the-main-head'>Book an appointment for an online consultation</p>
                        <div className='ho-thecrd-container row row-cols-1 row-cols-md-2 row-cols-lg-4 g-3'  >
                            {spec && spec.map((special) => (
                                <Viewspec spec={special} />
                            ))}
                        </div>
                        <p className='text-center m-3' style={{fontSize:'40px',fontWeight:'500'}}>Medical History</p>
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