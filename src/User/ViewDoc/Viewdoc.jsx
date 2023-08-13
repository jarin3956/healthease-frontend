import React, { useEffect, useState } from 'react'
import './Viewdoc.scss'

import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import axiosinstance from '../../Axios/Axios';
import { useLocation, useNavigate } from 'react-router-dom';

import NotFound from '../../Common/NotFound/NotFound';

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Viewdoc() {

    const navigate = useNavigate()
    const [doctors, setDoctors] = useState([])
    const [error, setError] = useState(false)
    const location = useLocation()
    const searchParams = new URLSearchParams(location.search);
    const specialName = searchParams.get('specialization');

    const token = localStorage.getItem('token');

    const viewDoctors = async (specialName) => {
        try {
            const response = await axiosinstance.get(`view-doctors-spec/${specialName}`,{
                headers: {'Authorization': `Bearer ${token}`}
            })

            if (response.status === 200) {
                setDoctors(response.data.doctor)
            } else {
                setError(true)
                toast.error('Something went wrong, Please try after sometime. ')
            }
        } catch (error) {
            setError(true)
            if (error.response) {
                const status = error.response.status
                if (status === 404 || status === 500) {
                    toast.error(error.response.data.message + 'Please try after sometime. ')
                }
            } else {
                toast.error('Something went wrong, Please try after sometime. ')
            }
            console.log(error);
        }
    }

    useEffect(() => {

        if (specialName) {
            viewDoctors(specialName)
        }
    }, [location])

    const bookAppointment = (docId) => {
        navigate(`/bookAppointment?doc=${docId}`)
    }

    return (
        <>

            <ToastContainer />

            {error ? <NotFound /> : (
                <div className="vdoc-cookieCard ">
                    <p className='text-center the-main-head '>Book an appointment for an online consultation</p>
                    <div className='vdoc-thecrd-container row row-cols-1 row-cols-md-2 row-cols-lg-4 g-3'  >
                        {doctors.map((doctor) => (
                            <div className='p-3' >
                                <Card key={doctor._id} sx={{ maxWidth: 330 }}>
                                    <CardMedia
                                        component="img"
                                        alt="doctor"
                                        height="220"
                                        src={`/DocImages/${doctor.profileimg}`}
                                    />
                                    <CardContent>
                                        <Typography gutterBottom variant="h5" component="div">
                                            Dr. {doctor.name}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {doctor.experience} Years of experience
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {specialName}
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
                </div>
            )}
        </>
    )
}

export default Viewdoc