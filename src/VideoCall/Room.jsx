import React, { useCallback, useEffect, useState } from 'react';
import { useSocket } from '../Context/SocketProvider';
import ReactPlayer from 'react-player'
import peer from '../Service/Peer'
import { useNavigate } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import './Room.scss'
import { axiosinstance } from '../Axios/Axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';
import { BsMicFill, BsMicMuteFill } from 'react-icons/bs'


function Room({ user }) {

    const socket = useSocket();
    const navigate = useNavigate();

    const [remoteSocketId, setRemoteSocketId] = useState(null);
    const [myStream, setMyStream] = useState(null);
    const [remoteStream, setRemoteStream] = useState(null);
    const [callAccepted, setCallAccepted] = useState(false);
    const [callActive, setCallActive] = useState(false);
    const [muted, setMuted] = useState(true);

    const handleUserJoined = useCallback(({ email, id }) => {
        console.log(`Email ${email} joined room`);
        setRemoteSocketId(id)
    }, []);

    const handleCallUser = useCallback(async () => {
        console.log('Calling user:', remoteSocketId);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: true,
                video: true
            });
            console.log('Local stream obtained:', stream);
            const offer = await peer.getOffer();
            console.log('Local offer created:', offer);
            socket.emit('user:call', { to: remoteSocketId, offer });
            console.log('Sent call request to:', remoteSocketId);
            setMyStream(stream);
            setCallActive(true);
        } catch (error) {
            console.error('Error in handleCallUser:', error);
        }

    }, [remoteSocketId, socket]);

    const handleIncommingCall = useCallback(async ({ from, offer }) => {
        setRemoteSocketId(from);
        setCallActive(true);
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: true,
        });
        setMyStream(stream);
        console.log(`Incomming Call`, from, offer);
        const ans = await peer.getAnswer(offer);
        socket.emit('call:accepted', { to: from, ans })

    },
        [socket])



    const sendStream = useCallback(() => {
        setCallAccepted(true)
        for (const track of myStream.getTracks()) {
            peer.peer.addTrack(track, myStream);
        }
        setCallActive(true);
    }, [myStream]);


    const handleCallAccepted = useCallback(({ from, ans }) => {
        peer.setLocalDescription(ans);
        console.log('Call Accepted');
        setCallActive(true);
        sendStream()
    }, [sendStream])

    const handleNegoNeeded = useCallback(async () => {
        const offer = await peer.getOffer();
        socket.emit('peer:nego:needed', { offer, to: remoteSocketId })
    }, [remoteSocketId, socket]);

    useEffect(() => {
        peer.peer.addEventListener('negotiationneeded', handleNegoNeeded);
        return () => {
            peer.peer.removeEventListener('negotiationneeded', handleNegoNeeded);
        }
    }, [handleNegoNeeded])

    const handleNegoNeedIncomming = useCallback(async ({ from, offer }) => {
        const ans = await peer.getAnswer(offer);
        socket.emit('peer:nego:done', { to: from, ans })
    }, [socket])

    const handleNegoNeedFinal = useCallback(async ({ ans }) => {
        await peer.setLocalDescription(ans)
    }, [])

    useEffect(() => {
        peer.peer.addEventListener('track', async ev => {
            const remoteStream = ev.streams;
            console.log('Getting TRACK');
            setRemoteStream(remoteStream[0])
        })
    }, [])

    useEffect(() => {

        socket.on('user:joined', handleUserJoined);
        socket.on('incomming:call', handleIncommingCall);
        socket.on('call:accepted', handleCallAccepted);
        socket.on('peer:nego:needed', handleNegoNeedIncomming);
        socket.on('peer:nego:final', handleNegoNeedFinal);

        return () => {
            socket.off('user:joined', handleUserJoined);
            socket.off('incomming:call', handleIncommingCall);
            socket.off('call:accepted', handleCallAccepted);
            socket.off('peer:nego:needed', handleNegoNeedIncomming);
            socket.off('peer:nego:final', handleNegoNeedFinal);
        }
    }, [socket, user, handleUserJoined, handleIncommingCall, handleCallAccepted, handleNegoNeedIncomming, handleNegoNeedFinal])


    const leaveCall = () => {

        socket.off('user:joined', handleUserJoined);
        socket.off('incomming:call', handleIncommingCall);
        socket.off('call:accepted', handleCallAccepted);
        socket.off('peer:nego:needed', handleNegoNeedIncomming);
        socket.off('peer:nego:final', handleNegoNeedFinal);


        if (myStream) {
            myStream.getTracks().forEach((track) => track.stop());
        }
        if (remoteStream) {
            remoteStream.getTracks().forEach((track) => track.stop());
        }

        setMyStream(null);
        setRemoteStream(null);
        setRemoteSocketId(null);
        setCallAccepted(false);
        setCallActive(false);

        const url = new URL(window.location.href);
        const bookingConfirmId = url.pathname.split('/').pop();
        console.log(bookingConfirmId, "this is the confirm id for booking");



        const updateBooking = async () => {
            try {
                const response = await axiosinstance.post(`booking/completed-booking/${bookingConfirmId}`);
                if (response.status === 200) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Success!',
                        text: 'Successfully completed your bookings',
                        confirmButtonText: 'OK',
                    })
                    if (user === 'user') {
                        navigate(`/feed-back/${bookingConfirmId}`);
                    } else if (user === 'doctor') {
                        navigate(`/doctor/add-prescription/${bookingConfirmId}`);
                    }
                }

            } catch (error) {
                console.log(error);
            }
        }

        updateBooking()
    };


    const handleMute = useCallback(() => {
        setMuted(!muted)
    }, [muted])


    return (
        <>
            <ToastContainer />
            <div className="video-callCard">
                <div className='videocall-esse my-4'>
                    <h3 className='text-center'>HealthEase</h3>
                    {
                        user === 'user' ? (!remoteSocketId && 'Please wait for the doctor to start the call') : (
                            !callActive && <h5 className='text-center'>{remoteSocketId ? 'Patient online' : 'Waiting for the patient to join'}</h5>)
                    }
                    {user === 'doctor' && remoteSocketId && !callActive && (
                        <div className='call-butt-cont'>
                            <button onClick={handleCallUser} className="signupBtn">
                                CALL NOW
                                <span className="arrow">
                                    <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 320 512" fill="rgb(183, 128, 255)">
                                        <path d="M278.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-160 160c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L210.7 256 73.4 118.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l160 160z"></path>
                                    </svg>
                                </span>
                            </button>
                        </div>
                    )}

                    {user === 'user' && myStream && !callAccepted && (

                        <div className='call-butt-cont'>
                            <button onClick={sendStream} className="signupBtn">
                                SHARE STREAM
                                <span className="arrow">
                                    <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 320 512" fill="rgb(183, 128, 255)">
                                        <path d="M278.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-160 160c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L210.7 256 73.4 118.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l160 160z"></path>
                                    </svg>
                                </span>
                            </button>
                        </div>
                    )}

                </div>
                {!myStream && !remoteStream ? (
                    <div className='responsive-video-imagecont'>
                        <img src="/video-call.png" alt="VideoCall" className="responsive-video-image" />
                    </div>

                ) : (
                    <div className='videocall-container row row-cols-1 row-cols-md-2 row-cols-lg-2 g-3'  >
                        <Card sx={{ maxWidth: 750 }}>
                            {remoteStream ? (
                                <CardMedia
                                    component="div"
                                    height="350"
                                >
                                    <ReactPlayer className="react-player" playing muted={muted} height="100%" width="100%" url={remoteStream} />
                                </CardMedia>

                            ) : (
                                <CardMedia
                                    component="img"
                                    alt="specialization"
                                    height="350"
                                    src="/healtheaselogo.png"
                                />
                            )}
                        </Card>
                        <Card sx={{ maxWidth: 750 }}>
                            {myStream ? (
                                <CardMedia
                                    component="div"
                                    height="350"
                                >
                                    <ReactPlayer className="react-player" playing muted height="100%" width="100%" url={myStream} />
                                </CardMedia>

                            ) : (
                                <CardMedia
                                    component="img"
                                    alt="specialization"
                                    height="350"
                                    src="/healtheaselogo.png"
                                />
                            )}

                        </Card>
                    </div>
                )}

                {myStream && (
                    <button className={!muted ? 'btn btn-primary ms-3' : 'btn btn-dark ms-3'} onClick={handleMute}>{muted ? <BsMicMuteFill /> : <BsMicFill />}</button>
                )}

                {callActive && (
                    <div className='videocall-esse mt-3'>
                        <div className="call-end-butt">
                            <div onClick={leaveCall} className="btn btn--huge">
                                <div className="btn--huge__text">
                                    <div>
                                        Leave Call
                                        <span>Leave Call</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}

export default Room