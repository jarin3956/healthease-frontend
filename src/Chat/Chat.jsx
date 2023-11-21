import React, { useEffect, useState } from 'react'
import './Chat.scss'
import {
    MDBCard,
    MDBCardBody,
    MDBCol,
    MDBContainer,
    MDBRow,
} from "mdb-react-ui-kit";

import { useSocket } from '../Context/SocketProvider'
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useSelector } from 'react-redux';
import { createInstance } from '../Axios/Axios';

function Chat({ user }) {

    const navigate = useNavigate()
    const [message, setMessage] = useState();
    const [chatHistory, setChatHistory] = useState([]);
    const url = new URL(window.location.href);
    const chatId = url.pathname.split('/').pop();
    const socket = useSocket();

    const [docData, setDocData] = useState([]);
    const [usrData, setUsrData] = useState([]);

    const SendMessage = () => {
        if (message && message.trim().length > 0) {
            socket.emit('send-message', message, chatId);
            setChatHistory([...chatHistory, { send: true, message: message }]);
            setMessage('');
        } else {
            Swal.fire({
                title: 'Empty Message',
                text: 'Please enter a message before sending.',
                icon: 'error',
                confirmButtonText: 'OK',
            });
        }
    };


    const selecter = useSelector((state) => state.chatRoomId);

    useEffect(() => {
        if (selecter) {
            findUserAndDoctor()
        }
    }, [selecter])


    const findUserAndDoctor = async () => {
        try {
            
            if (user === 'user') {
                const token = localStorage.getItem('token');
                const axiosInstance = createInstance(token)
                const response = await axiosInstance.get(`booking/load-user-chatess/${chatId}`)
                if (response.status === 200) {
                    setDocData(response.data.doctor)
                }
            } else if (user === 'doctor') {
                const doctortoken = localStorage.getItem('doctortoken');
                const axiosInstance = createInstance(doctortoken);
                const response = await axiosInstance.get(`booking/load-doc-chatess/${chatId}`)
                setUsrData(response.data.user)
            }
        } catch (error) {
            console.log(error);
        }
    }



    useEffect(() => {

        socket.on('doctor-joined', (user) => {
            console.log(`Doctor ${user.name} joined the chat`);
        });

        socket.on('recieved-message', (message) => {
            // console.log(message, 'front-end');
            setChatHistory([...chatHistory, { send: false, message: message }]);
        })

        socket.on('chat-rejected', () => {

            Swal.fire({
                title: 'Chat Rejected',
                text: "Doctor is not available to chat with you. Please try again later.",
                icon: 'error',
                confirmButtonText: 'OK',
            }).then(() => {
                closeChat();
            });
        });

        return () => {
            socket.off('recieved-message');
            socket.off('chat-rejected');
        };

    }, [socket.connected, chatHistory]);

    const closeChat = () => {
        socket.emit('leave-chat', selecter.chatRoomId);
        navigate(user === 'user' ? '/view-Bookings' : '/doctor/home');
    }

    return (
        <>
            <div className="ho-cookieCard " style={{ minHeight: '90vh' }}>
                <MDBContainer className="py-5 h-100">
                    <MDBRow className="justify-content-center align-items-center h-100">
                        <MDBCol lg="12" xl="12">
                            <MDBCard style={{ borderRadius: "10px" }}>
                                <MDBCardBody>
                                    <MDBRow>
                                        <div className="chat-card">
                                            <div className="chat-header">
                                                {user === 'user' ? (
                                                    <div className="user-info d-flex" >
                                                        <div className="user-avatar" style={{width:'40%'}}>
                                                            <img src={docData.profileimg} alt={docData.name} width="50" height="50" style={{borderRadius:'50%',margin:'10px'}} />
                                                        </div>
                                                        <div className="chat-head-txt" style={{margin:'10px'}} >{docData.name ? `Dr.${docData.name}` : 'Loading'}</div>
                                                    </div>
                                                ) : (
                                                    <div className="user-info d-flex">
                                                        <div className="user-avatar" style={{width:'40%'}} >
                                                            <img src={usrData.image?usrData.image:usrData.picture} alt={usrData.name} width="50" height="50" style={{borderRadius:'50%',margin:'10px'}} />
                                                        </div>
                                                        <div className="chat-head-txt" style={{margin:'10px'}}>{usrData.name ? usrData.name : 'Loading'}</div>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="chat-body" style={{ minHeight: '40vh' }}>

                                                {chatHistory.map((e, index) => {
                                                    const isOutgoing = !e.send;
                                                    return (
                                                        <div className={`message ${isOutgoing ? 'outgoing' : 'incoming'}`} key={index}>
                                                            <div className="message-content">
                                                                <p>{e.message}</p>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                            <div className="chat-footer">
                                                <input onChange={(e) => { setMessage(e.target.value) }} placeholder="Type your message" value={message} type="text" />
                                                <button className="chat-send-button" onClick={SendMessage}>
                                                    <div className="svg-wrapper-1">
                                                        <div className="svg-wrapper">
                                                            <svg height="24" width="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M0 0h24v24H0z" fill="none"></path>
                                                                <path d="M1.946 9.315c-.522-.174-.527-.455.01-.634l19.087-6.362c.529-.176.832.12.684.638l-5.454 19.086c-.15.529-.455.547-.679.045L12 14l6-8-8 6-8.054-2.685z" fill="currentColor"></path>
                                                            </svg>
                                                        </div>
                                                    </div>
                                                    <span>Send</span>
                                                </button>
                                            </div>
                                        </div>
                                        <div className='d-flex justify-content-center p-3'>
                                            <button className='chat-end-butt' onClick={closeChat}>Close</button>
                                        </div>
                                    </MDBRow>
                                </MDBCardBody>
                            </MDBCard>
                        </MDBCol>
                    </MDBRow>
                </MDBContainer>
            </div>
        </>
    )
}

export default Chat