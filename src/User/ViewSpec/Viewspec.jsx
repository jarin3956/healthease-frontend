import React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { useNavigate } from 'react-router-dom';

function Viewspec({ spec }) {

    const navigate = useNavigate()

    const viewDoctors = (specialName) => {
        navigate(`/viewDoctors?specialization=${specialName}`);
    }

    return (
        <div className='p-2' >
            <Card sx={{ maxWidth: 400 }}>
                <CardMedia
                    component="img"
                    alt="specialization"
                    height="140"
                    src={`/SpecializationImages/${spec.image}`}
                />
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        {spec.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {spec.description}
                    </Typography>
                </CardContent>
                <CardActions>
                    <Button size="small" onClick={() => viewDoctors(spec.name)}>View Doctors</Button>
                </CardActions>
            </Card>
        </div>
    )
}

export default Viewspec