import React, { useEffect, useState } from 'react';
import './Home.scss';

import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import axiosinstance from '../../Axios/Axios';
import { useNavigate } from 'react-router-dom';

function Home() {

    const navigate = useNavigate()
    const [spec, setSpec] = useState([])
   
    const viewDoctors = (specialName) => {
        navigate(`/viewDoctors?specialization=${specialName}`);
      };

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


    

    return (
        <>
            
            <div className="mx-4 mt-5">
                <div className="ho-cookieCard rounded-3">
                    <div className="ho-contentWrapper">
                        <p className="ho-cookieHeading mt-3">Home</p>
                        <p className='text-center the-main-head'>Book an appointment for an online consultation</p>
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
                                                <Button size="small" onClick={() => viewDoctors(special.name)}>View Doctors</Button>
                                            </CardActions>
                                        </Card>
                                    </div>

                                ))}
                            </div>
               
                        

                    </div>
                    
                </div>
            </div>
        </>

    )
}

export default Home