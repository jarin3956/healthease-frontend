import React, { useCallback, useEffect, useState } from 'react';
import { useSocket } from '../Context/SocketProvider';
import ReactPlayer from 'react-player'
import peer from '../Service/Peer'
import { useNavigate } from 'react-router-dom';

import './Room.scss'


function Room({ user }) {

    const socket = useSocket();

    const navigate = useNavigate()

    const [remoteSocketId, setRemoteSocketId] = useState(null);
    const [myStream, setMyStream] = useState(null);
    const [remoteStream, setRemoteStream] = useState(null);
    const [callAccepted, setCallAccepted] = useState(false);
    const [callActive, setCallActive] = useState(false)

    const handleUserJoined = useCallback(({ email, id }) => {
        console.log(`Email ${email} joined room`);
        setRemoteSocketId(id)
    }, [])

    const handleCallUser = useCallback(async () => {
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: true
        });
        const offer = await peer.getOffer()
        socket.emit('user:call', { to: remoteSocketId, offer })
        setMyStream(stream);
        setCallActive(true);
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
        // Step 1: Clean up event listeners
        socket.off('user:joined', handleUserJoined);
        socket.off('incomming:call', handleIncommingCall);
        socket.off('call:accepted', handleCallAccepted);
        socket.off('peer:nego:needed', handleNegoNeedIncomming);
        socket.off('peer:nego:final', handleNegoNeedFinal);

        // if (peer.peer) {
        //     peer.peer.close();
        // }

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


        if (user === 'user') {
            navigate('/home');
        } else if (user === 'doctor') {
            navigate('/doctor/home');
        }
    };





    return (
        <>
            {/* <h1>Health Ease</h1>
            
            {
                user === 'user' ? (!remoteSocketId && 'Please wait for the doctor to start the call') : (
                    !callActive && <h5>{remoteSocketId ? 'Patient online' : 'Waiting for the patient to join'}</h5>)
            }


            {user === 'doctor' && remoteSocketId && !callActive && (
                <button onClick={handleCallUser}>Call</button>
            )}

            {user === 'user' && myStream && !callAccepted && (
                <button onClick={sendStream}>Join Stream</button>
            )}


            {remoteStream && (
                <>
                    <h5>Remote Stream</h5>
                    <ReactPlayer playing muted height='200px' width='400px' url={remoteStream} />
                </>

            )}

            {myStream && (
                <>
                    <h5>My Stream</h5>
                    <ReactPlayer playing muted height='200px' width='400px' url={myStream} />
                </>

            )}

            {callActive && (
                <button className='btn-danger' onClick={leaveCall} >Leave Call</button>
            )} */}











            {/* <div className="room-cookieCard ">
                <div className="room-contentWrapper">
                    <div className="room-sch-panel rounded-3 m-2">
                        <div className='p-2' >

                            <h1>Health Ease</h1>

                            {
                                user === 'user' ? (!remoteSocketId && 'Please wait for the doctor to start the call') : (
                                    !callActive && <h5>{remoteSocketId ? 'Patient online' : 'Waiting for the patient to join'}</h5>)
                            }


                            {user === 'doctor' && remoteSocketId && !callActive && (
                                <button onClick={handleCallUser}>Call</button>
                            )}

                            {user === 'user' && myStream && !callAccepted && (
                                <button onClick={sendStream}>Join Stream</button>
                            )}

                            <div className="video-container">
                                {remoteStream && (
                                    <>
                                        <h5>Remote Stream</h5>
                                        <ReactPlayer className="react-player" playing muted height="200px" width="100%" url={remoteStream} />
                                    </>
                                )}

                                {myStream && (
                                    <>
                                        <h5>My Stream</h5>
                                        <ReactPlayer className="react-player" playing muted height="200px" width="100%" url={myStream} />
                                    </>
                                )}
                            </div>

                            {callActive && (
                                <div className="buttons">
                                    <button className="btn-danger" onClick={leaveCall}>Leave Call</button>
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            </div> */}




            <div className="room-cookieCard">
                <div className="room-contentWrapper">
                    <div className="room-sch-panel rounded-3 m-2">
                        <div className='p-2'>
                           < h1 className='text-center'>Health Ease</h1>

                            {
                                user === 'user' ? (!remoteSocketId && 'Please wait for the doctor to start the call') : (
                                    !callActive && <h5>{remoteSocketId ? 'Patient online' : 'Waiting for the patient to join'}</h5>)
                            }


                            {user === 'doctor' && remoteSocketId && !callActive && (
                                <button onClick={handleCallUser}>Call</button>
                            )}

                            {user === 'user' && myStream && !callAccepted && (
                                <button onClick={sendStream}>Share Stream</button>
                            )}

                            <div className="video-container">
                                <div className="stream-container">
                                    {remoteStream && (
                                        <>
                                           {/* Remote Stream */}
                                            <ReactPlayer className="react-player" playing muted height="100%" width="100%" url={remoteStream} />
                                        </>
                                    )}
                                </div>

                                <div className="stream-container">
                                    {myStream && (
                                        <>
                                            {/* My Stream */}
                                            <ReactPlayer className="react-player" playing muted height="100%" width="100%" url={myStream} />
                                        </>
                                    )}
                                </div>
                            </div>

                            {callActive && (
                                <div className="buttons">
                                    <button className="btn-danger" onClick={leaveCall}>Leave Call</button>
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            </div>





        </>
    )
}

export default Room