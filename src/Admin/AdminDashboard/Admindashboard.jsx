import React, { useState, useEffect } from 'react';
import axiosinstance from '../../Axios/Axios';
import { useNavigate } from 'react-router-dom';
import Header from '../../Common/Header/Header';
import './Admindashboard.css'

function Admindashboard() {
    const navigate = useNavigate()
    const [admin, setAdmin] = useState(null)
    const admintoken = localStorage.getItem('admintoken')
    useEffect(() => {
        if (!admintoken) {
            navigate('/admin/login')
        } else {
            axiosinstance.get('admin/dashboard', {
                headers: {
                    Authorization: `Bearer ${admintoken}`
                }
            }).then((res) => {
                setAdmin(res.data);
            }).catch((error) => {
                console.log(error);
            })
        }
    }, [])
    return (
        <>
            
            <div className="mx-4 mt-5">
                <div className="row justify-content-center">
                    <div className="col-md-12">
                        <div className="card p-3 py-4 mb-5">
                            <div className="about-details p-3">
                                <div className="txtcontainer" style={{ maxWidth: "800px" }}>
                                    <div className="cookieCard rounded-3">
                                        <div className="contentWrapper">
                                            <p className="cookieHeading mt-3">Dashboard</p>
                                            <h6 className="cookieDescription">
                                            {admin && (<h1>{admin.name}</h1>)}
                                            </h6>
                                            <h6 className="cookieDescription">
                                                Through our user-friendly interface, you can easily schedule appointments, securely share medical records and symptoms, and engage in video or chat consultations with healthcare professionals. Our team of experienced doctors is dedicated to providing comprehensive diagnoses, offering expert advice, and developing tailored treatment plans to address your specific needs.
                                            </h6>
                                            <h6 className="cookieDescription">
                                                HealthEase ensures that your sensitive medical information is handled with utmost confidentiality and adheres to strict privacy and security standards. We prioritize patient satisfaction and strive to deliver high-quality healthcare services that are accessible to all, breaking geographical barriers and providing healthcare solutions to individuals regardless of their location.
                                            </h6>
                                            <h6 className="cookieDescription">
                                                Experience the convenience and peace of mind that HealthEase brings, as we empower you to take control of your health journey with ease, convenience, and confidence. Say goodbye to long queues and limited accessibility, and embrace the future of medical consultations with HealthEase.
                                            </h6>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Admindashboard