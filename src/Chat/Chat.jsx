import React from 'react'
import './Chat.scss'
import {
    MDBCard,
    MDBCardBody,
    MDBCol,
    MDBContainer,
    MDBRow,
} from "mdb-react-ui-kit";

function Chat() {
    return (
        <>
            <div className="ho-cookieCard " style={{ minHeight: '90vh' }}>
                <MDBContainer className="py-5 h-100">
                    <MDBRow className="justify-content-center align-items-center h-100">
                        <MDBCol lg="12" xl="12">
                            <MDBCard style={{ borderRadius: "10px" }}>
                                <MDBCardBody className="p-4">
                                    <MDBCard className="shadow border m-2">
                                        <MDBCardBody>
                                            <MDBRow>
                                                <div className="chat-card">
                                                    <div className="chat-header">
                                                        <div className="chat-head-txt">Feel Free to Ask</div>
                                                    </div>
                                                    <div className="chat-body" >
                                                        <div className="message incoming">
                                                            <p>Hello, how can I assist you today?</p>
                                                        </div>
                                                        <div className="message outgoing">
                                                            <p>I have a question about your services.</p>
                                                        </div>
                                                        <div className="message incoming">
                                                            <p>Sure, I'm here to help. What would you like to know?</p>
                                                        </div>
                                                    </div>
                                                    <div className="chat-footer">
                                                        <input placeholder="Type your message"  type="text" />
                                                        <button className="chat-send-button">
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
                                            </MDBRow>
                                        </MDBCardBody>
                                    </MDBCard>
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