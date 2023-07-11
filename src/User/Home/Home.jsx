import React, { useEffect, useState } from 'react';
import './Home.scss';
import Header from '../../Common/Header/Header';

import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import axiosinstance from '../../Axios/Axios';

import Viewdoc from '../ViewDoc/Viewdoc';

function Home() {

    const [spec, setSpec] = useState([])
    const [doctors, setDoctors] = useState([])
    const [data, showData] = useState(false)
    const [categories, setCategories] = useState(true)

    const viewDoctors = async (specialId) => {
        try {
            const response = await axiosinstance.get(`view-doctors-spec/${specialId}`)
            if (response.data.status === 'ok') {
                showData(true)
                setCategories(false)
                setDoctors(response.data.doctor)

            } else {
                console.log("error");
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        const fetchSpec = async () => {
            try {
                const response = await axiosinstance.get('specialization/view')
                console.log(response);
                setSpec(response.data.spec)
            } catch (error) {
                console.log(error);
            }

        }
        fetchSpec()
    }, [])


    const closeDetails = () => {
        showData(false)
        setCategories(true)
    }

    return (
        <>
            
            <div className="mx-4 mt-5">
                <div className="ho-cookieCard rounded-3">
                    <div className="ho-contentWrapper">
                        <p className="ho-cookieHeading mt-3">Home</p>
                        <p className='text-center the-main-head'>Book an appointment for an online consultation</p>

                        {categories && (
                            <div className='ho-thecrd-container row row-cols-1 row-cols-md-2 row-cols-lg-4 g-3'  >
                                {spec.map((special) => (
                                    <div className='p-2' >
                                        <Card sx={{ maxWidth: 330 }}>
                                            <CardMedia
                                                component="img"
                                                alt="specialization"
                                                height="140"
                                                src={`/SpecializationImages/${special.image}`}
                                            />
                                            <CardContent>
                                                <Typography gutterBottom variant="h5" component="div">
                                                    {special.name}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {special.description}
                                                </Typography>
                                            </CardContent>
                                            <CardActions>
                                                <Button size="small" onClick={() => viewDoctors(special._id)}>View Doctors</Button>
                                            </CardActions>
                                        </Card>
                                    </div>

                                ))}
                            </div>
                        )}
                        {data && (
                            <div className='ho-thecrd-container row row-cols-1 row-cols-md-2 row-cols-lg-4 g-3'  >
                                {doctors.map((doctor) => (
                                    <div className='p-2' >
                                        <Viewdoc doctor={doctor} />
                                    </div>

                                ))}

                            </div>
                        )}

                    </div>
                    {data && (
                        <div className='m-3 d-flex justify-content-center'>
                            <Button variant="contained" color="error" onClick={closeDetails} >
                                Close
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </>

    )
}

export default Home