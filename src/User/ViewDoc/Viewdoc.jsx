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

function Viewdoc() {

    const navigate = useNavigate()

    const [doctors, setDoctors] = useState([])
    const [error,setError] = useState(false)
    const location = useLocation()
    const searchParams = new URLSearchParams(location.search);
    const specialName = searchParams.get('specialization');

    const viewDoctors = async (specialName) => {
        try {
            const response = await axiosinstance.get(`view-doctors-spec/${specialName}`)
            if (response.data.status === 'ok') {

                if (response.data.doctor.length > 0) {
                    setDoctors(response.data.doctor)
                } else {
                    setError(true)
                }

            } else {
                console.log("error");
            }
        } catch (error) {
            console.log(error);
        }
    }
    
    useEffect(() => {
        
        if (specialName) {
            viewDoctors(specialName)
        }
    }, [location])

    const bookAppointment =  (docId) => {
        navigate(`/bookAppointment?doc=${docId}`)
    } 

    return (
        <>
           
                <div className="vdoc-cookieCard ">
                    <p className='text-center the-main-head'>Book an appointment for an online consultation</p>
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
                        {error && <h1 className='text-center' >No doctors Available</h1>}
                    </div>
                    
                </div>
       
        </>
    )
}

export default Viewdoc