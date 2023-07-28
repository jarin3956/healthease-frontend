import React, { useState, useEffect } from 'react';
import axiosinstance from '../../Axios/Axios';
import { useNavigate } from 'react-router-dom';
import './Admindashboard.scss'
import Swal from 'sweetalert2';

function Admindashboard() {
    const navigate = useNavigate()
    const [admin, setAdmin] = useState(null)
    const admintoken = localStorage.getItem('admintoken')
    useEffect(() => {

        const adminData = async () => {
            try {
                const response = await axiosinstance.get('admin/dashboard', {
                    headers: {
                        Authorization: `Bearer ${admintoken}`
                    }
                })
                if (response.status === 200) {
                    setAdmin(response.data.dashData);
                } else {
                    Swal.fire('Oops!', 'Error when loading admin data', 'error')
                }
            } catch (error) {
                console.log(error);
            }
        }
        adminData()

    }, [])




    return (
        <>
            <div className="ad-cookieCard">
                <p className="cookieHeading text-center p-3">Admin Dashboard</p>
                {admin && (
                    <>

                        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4  ad-cards">
                            
                                <div className="ad-card red">
                                    <p className="tip">User Count</p>
                                    <p className="second-text">{admin.userCount} users</p>
                                </div>
                            
                                <div className="ad-card blue">
                                    <p className="tip">Doctor Count</p>
                                    <p className="second-text">{admin.doctorCount} doctors</p>
                                </div>
                            
                                <div className="ad-card green">
                                    <p className="tip">Bookings Count</p>
                                    <p className="second-text">{admin.bookingCount} bookings</p>
                                </div>
                            
                                <div className="ad-card yellow">
                                    <p className="tip">Specialization Count</p>
                                    <p className="second-text">{admin.specCount} specializations</p>
                                </div>
                        </div>

                    </>

                )}


            </div>
        </>
    )
}

export default Admindashboard