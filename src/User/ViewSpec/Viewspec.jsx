import React, { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { useNavigate } from 'react-router-dom';

import './Viewspec.scss'
import { useSpring, animated } from 'react-spring';

function Viewspec({ spec }) {

    const navigate = useNavigate()
    const [hovered, setHovered] = useState(false);


    const viewDoctors = (specialName) => {
        navigate(`/viewDoctors?specialization=${specialName}`);
    }

    const hoverProps = useSpring({
        opacity: hovered ? 1.2 : 1,
        transform: hovered ? 'scale(1.05)' : 'scale(1)',
    });

    return (
        <div className='p-3 ' >
            <animated.div className='card-container'
                style={hoverProps}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)} >
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
            </animated.div>

        </div>
    )
}

export default Viewspec