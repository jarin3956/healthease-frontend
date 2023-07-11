import React from 'react'

import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import axiosinstance from '../../Axios/Axios';

function Viewdoc({ doctor }) {
    console.log(doctor);
    return (
        <>
            <Card sx={{ maxWidth: 330 }}>
                <CardMedia
                    component="img"
                    alt="doctor"
                    height="140"
                    src={`/DocImages/${doctor.profileimg}`}
                />
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        Dr.{doctor.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {doctor.experience} Years of experience
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {doctor.specialization}
                    </Typography>
                </CardContent>
                <CardActions>
                    <Button size="small" >Book Appoinment</Button>
                </CardActions>
            </Card>
            
            
        </>
    )
}

export default Viewdoc