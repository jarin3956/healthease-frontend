import React, { useCallback, useState, useEffect } from 'react'
import { useSocket } from '../Context/SocketProvider'
import { useNavigate } from 'react-router-dom';


function VideoCall() {
    
    const [email, setEmail] = useState('')
    const [room, setRoom] = useState('')

    const socket = useSocket();
    const navigate = useNavigate()

    // console.log(socket);

    const handleSubmitForm = useCallback((e) => {
        e.preventDefault();
        console.log(email, room, "this is the video call data");
        socket.emit('room:join', { email, room });
    }, [email, room, socket])

    const handleJoinRoom =  useCallback((data) => {
        const { email, room } = data;
        // console.log(email,room);
        navigate(`/doctor/room/${room}`)
    },[navigate])

    useEffect(() => {
        socket.on('room:join', handleJoinRoom);
        return () => {
            socket.off('room:join', handleJoinRoom)
        }
    }, [socket,handleJoinRoom])

    return (
        <>
            <h1>Video Call</h1>
            <form onSubmit={handleSubmitForm}>
                <label htmlFor='email' >Email id</label>
                <input type="email" id='email' value={email} onChange={(e) => setEmail(e.target.value)} />
                <br />
                <label htmlFor='room' >Room No</label>
                <input type="text" id='room' value={room} onChange={(e) => setRoom(e.target.value)} />
                <button>Join</button>
            </form>
        </>
    )
}

export default VideoCall