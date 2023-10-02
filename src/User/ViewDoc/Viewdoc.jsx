import React, { useEffect, useState } from 'react';
import './Viewdoc.scss';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { createInstance } from '../../Axios/Axios';
import { useLocation, useNavigate } from 'react-router-dom';
import NotFound from '../../Common/NotFound/NotFound';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Viewdoc() {

    const token = localStorage.getItem('token');
    const navigate = useNavigate()

    const [doctors, setDoctors] = useState([])
    const [error, setError] = useState(false)

    const location = useLocation()
    const searchParams = new URLSearchParams(location.search);
    const specialName = searchParams.get('specialization');

    const viewDoctors = async (specialName) => {

        try {
            const axiosInstance = createInstance(token)
            const response = await axiosInstance.get(`view-doctors-spec/${specialName}`)
            if (response.status === 200) {
                setDoctors(response.data.doctor)
            } 
        } catch (error) {
            setError(true)
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
                <div className="viewdoc-Card">
                    <p className='view-docmainhead '>Book an appointment for an online consultation</p>
                    <div className='view-doccard-container'  >
                        {doctors.map((doctor) => (
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