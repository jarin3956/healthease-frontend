import React, { useEffect, useState } from 'react'
import './Docschedule.scss';
import {
    MDBCol,
    MDBContainer,
    MDBRow,
    MDBCardBody,
    MDBCard,
} from "mdb-react-ui-kit";
import { useNavigate } from 'react-router-dom';
import { createInstance } from '../../Axios/Axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';


function Docschedule({ data, context }) {

    const doctortoken = localStorage.getItem('doctortoken');
    const navigate = useNavigate();

    const [viewSelectedDay, setViewSelectedDay] = useState('');
    const [scheduleStatus, setScheduleStatus] = useState(null)

    const viewHandleDayClick = (day) => {
        setViewSelectedDay(day)
    }

    const sortedData = [...data].sort((a, b) => {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return days.indexOf(a.day) - days.indexOf(b.day);
    });

    const getScheduleStatus = async () => {
        try {
            const axiosInstance = createInstance(doctortoken)
            const response = await axiosInstance.get('doctor/view-doc-schedulestatus');
            if (response.status === 200) {
                setScheduleStatus(response.data.doctor)
            }
        } catch (error) {
            console.log(error);
        }

    }

    useEffect(() => {
        if (data && doctortoken && context === "viewsch") {
            getScheduleStatus()
        }
    }, [])

    const changeScheduleStatus = async () => {
        try {
            const axiosInstance = createInstance(doctortoken)
            const response = await axiosInstance.put('doctor/change-doc-schedulestatus');
            if (response.status === 200) {
                toast.success(response.data.message)
                getScheduleStatus()
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleScheduleStatus = async () => {
        
        Swal.fire({
          icon: 'warning',
          title: 'Are you sure?',
          text: 'To change your schedule status!',
          showCancelButton: true,
          confirmButtonText: 'Yes, do it!',
          cancelButtonText: 'No, keep it',
          confirmButtonColor: '#FF0000',
          cancelButtonColor: '#333333',
        }).then((result) => {
          if (result.isConfirmed) {
            changeScheduleStatus()
          }
        });
      }

    return (
        <>
            <ToastContainer />
            <MDBContainer className="py-5 h-100">
                <MDBCol lg="12" xl="12">
                    <MDBCard style={{ borderRadius: "10px" }}  >
                        <MDBCardBody className="p-4">
                            <MDBCard className="shadow-0 border-0 m-4">
                                <h3 className="text-center the-first-text">Selected Dates</h3>
                                <div className="view-day-slot-container">
                                    {sortedData.map((day) => (
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

                                {context === "viewsch" && (
                                    <>
                                        <div className="time-set-butt">
                                            <button className="time-submit-button" onClick={() => navigate('/doctor/edit-schedule')} >
                                                Change
                                            </button>
                                        </div>
                                        {scheduleStatus && (
                                            <div className='d-flex justify-content-center'>
                                                <button onClick={handleScheduleStatus}
                                                    className={
                                                        scheduleStatus.schedule_Status
                                                            ? 'doc-schedule-stopbutt'
                                                            : 'doc-schedule-startbutt'
                                                    }
                                                >
                                                    {scheduleStatus.schedule_Status ? 'Stop Scheduling' : 'Start Scheduling'}
                                                </button>
                                            </div>
                                        )}
                                    </>
                                )}
                            </MDBCard>
                        </MDBCardBody>
                    </MDBCard>
                </MDBCol>
            </MDBContainer>
        </>
    )
}

export default Docschedule