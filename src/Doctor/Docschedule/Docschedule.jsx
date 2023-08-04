import React, { useState } from 'react'
import './Docschedule.scss';
import {
    MDBCol,
    MDBContainer,
    MDBRow,
    MDBCardBody,
    MDBCard,
} from "mdb-react-ui-kit";
import { useNavigate } from 'react-router-dom';

function Docschedule({ data }) {

    const navigate = useNavigate()

    const [viewSelectedDay, setViewSelectedDay] = useState('')
    const viewHandleDayClick = (day) => {
        setViewSelectedDay(day)
    }
    return (
        <>
            <MDBContainer className="py-5 h-100">
                <MDBCol lg="12" xl="12">
                    <MDBCard style={{ borderRadius: "10px"}}  >
                        <MDBCardBody className="p-4">
                            <MDBCard className="shadow-0 border-0 m-4">
                                <h3 className="text-center the-first-text">Selected Dates</h3>
                                <div className="view-day-slot-container">
                                    {data.map((day) => (
                                        <div className={`view-day-box ${viewSelectedDay === day.day ? 'selected' : ''}`}
                                            key={day.day}
                                            onClick={() => viewHandleDayClick(day.day)}
                                        >
                                            <h6>{day.day}</h6>
                                        </div>
                                    ))}
                                </div>
                                {viewSelectedDay && (
                                    <>
                                        <h3 className="text-center the-next-text">Selected Time Slots</h3>
                                        <div className='d-flex justify-content-center p-3'>
                                            <div className='notselected-box-ident' >
                                                <h6>Not Booked</h6>
                                            </div>
                                            <div className='selected-box-identi' >
                                                <h6>Booked</h6>
                                            </div>
                                        </div>
                                        {data.find((day) => day.day === viewSelectedDay)?.time.some((time) => time.isAvailable) ? (
                                            <div className="view-time-slot-container">
                                                {data.find((day) => day.day === viewSelectedDay)?.time.map((time) => (
                                                    <div className={`view-time-box ${!time.isAvailable ? 'booked' : ''}`} key={time.timeslot}>
                                                        <h6>{time.timeslot}</h6>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-center">No Time Slots Available for {viewSelectedDay}</p>

                                        )}
                                    </>
                                )}

                                <div className="time-set-butt">
                                    <button className="time-submit-button" onClick={() => navigate('/doctor/edit-schedule')} >
                                        Change
                                    </button>
                                </div>

                            </MDBCard>
                        </MDBCardBody>
                    </MDBCard>
                </MDBCol>

            </MDBContainer>
        </>
    )
}

export default Docschedule