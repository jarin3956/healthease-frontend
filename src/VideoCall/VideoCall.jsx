import React, { useEffect } from 'react';
import { useSocket } from '../Context/SocketProvider';
import { useNavigate } from 'react-router-dom';

function VideoCall({ userEmail, doctorEmail, bookingId, patientId }) {
    console.log(userEmail,"user mail",doctorEmail,"doctor mail",bookingId,"bookingId");
    const socket = useSocket();
    const navigate = useNavigate();

    useEffect(() => {
        const joinEventData = doctorEmail
            ? { email: doctorEmail, bookingId }
            : { email: userEmail, bookingId };

        socket.emit('room:join', joinEventData);

        const handleRoomJoin = ({ email, bookingId }) => {
            if (email === doctorEmail) {
                socket.emit('request-patient',bookingId,patientId)
                navigate(`/doctor/room/${bookingId}`);
            } else if (email === userEmail) {
                navigate(`/room/${bookingId}`);
            }
        };

        socket.on('room:join', handleRoomJoin);

        return () => {
            // socket.off('room:join');
            socket.off('room:join', handleRoomJoin);
        };
    }, [socket, navigate, userEmail, doctorEmail, bookingId]);

    

    return (
        <>
            <h1>Connecting to video call...</h1>
        </>
    );
}

export default VideoCall;
