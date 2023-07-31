import React, { useEffect, useState } from 'react';
import './Home.scss';
import axiosinstance from '../../Axios/Axios';
import Viewspec from '../ViewSpec/Viewspec';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';


function Home() {

    const navigate = useNavigate()

    const [spec, setSpec] = useState([])

    const token = localStorage.getItem('token')

    useEffect(() => {
        if (token) {
            const fetchSpec = async () => {
                try {
                    const response = await axiosinstance.get('view-specialization',{
                        headers: {'Authorization': `Bearer ${token}`},
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
                        } else {
                            Swal.fire('Oops!', 'Error when loading user data', 'error')
                            
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
                    <div className="ho-contentWrapper">
                        <p className="ho-cookieHeading mt-3">Home</p>
                        <p className='text-center the-main-head'>Book an appointment for an online consultation</p>
                        <div className='ho-thecrd-container row row-cols-1 row-cols-md-2 row-cols-lg-4 g-3'  >
                            { spec && spec.map((special) => (
                                <Viewspec spec={special} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>

    )
}

export default Home