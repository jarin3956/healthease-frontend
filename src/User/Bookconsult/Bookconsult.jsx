import React, { useEffect, useState } from 'react'
import './Bookconsult.scss'
import { useLocation, useNavigate } from 'react-router-dom';
import axiosinstance from '../../Axios/Axios';

import { toast,ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Bookconsult() {

    const [selectedDay, setSelectedDay] = useState('');
    const [selectedTime, setSelectedTimeSlot] = useState('')
    const [docSchedule, setDocSchedule] = useState([])
    const location = useLocation()
    const searchParams = new URLSearchParams(location.search);
    const docId = searchParams.get('doc');

    const showSlots = async (docId) => {
        try {
            const response = await axiosinstance.get(`view-doctor-slots/${docId}`)
            console.log(response, "itha mone puthiya response");
            if (response.status === 200) {
                setDocSchedule(response.data.schedule)
                

            } else {
                console.log("error");
                
            }

        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if (docId) {
            showSlots(docId)
        }
    }, [location])

    const handleDayClick = (day) => {
        setSelectedDay(day);
    };

    const handleTimeSlot = (timeslot) => {
        setSelectedTimeSlot(timeslot)
    }

    const token = localStorage.getItem('token')

    const bookTheSlot = async (docId) => {
        // console.log(selectedDay,selectedTime,docId, "these are items to book");

        if (!selectedDay || !selectedTime) {
            // Display error message using react-toastify
            toast.error('Please select a day and time');
            return;
        }

        try {
            const response = await axiosinstance.post('book-consultation-slot', {
                docId: docId,
                selectedDay: selectedDay,
                selectedTime: selectedTime
            },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
            console.log(response);
            if (response.status === 200) {
                toast.success("Successfull booked your slot")
            } else {
                toast.error("Error, Please try again later")
            }
        } catch (error) {
            console.log("error");
        }
    }




    return (
        <>

            <ToastContainer />

            <div className="mx-4 mt-5">
                <div className="book-cookieCard rounded-3">
                    <div className="book-contentWrapper">
                        <p className="book-cookieHeading mt-3">Book Consult</p>
                        <div className='p-2'>
                            <div className="home-sch-panel rounded-3">
                                {docSchedule && docSchedule.schedule ? (
                                    <>
                                        <h3 className="text-center the-first-text">Available Days</h3>
                                        <div className="view-day-slot-container">
                                            {docSchedule.schedule.map((day) => (
                                                <div
                                                    className={`view-day-box ${selectedDay === day.day ? 'selected' : ''}`}
                                                    key={day.day}
                                                    onClick={() => handleDayClick(day.day)}
                                                >
                                                    <h6>{day.day}</h6>
                                                </div>
                                            ))}
                                        </div>
                                        {selectedDay && (
                                            <>
                                                <h3 className="text-center the-first-text">Available Time Slots ({selectedDay})</h3>
                                                {docSchedule.schedule.find((day) => day.day === selectedDay)?.time.some((time) => time.isAvailable) ? (
                                                    <div className="view-time-slot-container">
                                                        {docSchedule.schedule
                                                            .find((day) => day.day === selectedDay)
                                                            .time.filter((time) => time.isAvailable)
                                                            .map((time) => (
                                                                <div
                                                                    className={`view-time-box ${selectedTime === time.timeslot ? 'selected' : ''}`}
                                                                    key={time.timeslot}
                                                                    onClick={() => handleTimeSlot(time.timeslot)}
                                                                >
                                                                    <h6>{time.timeslot}</h6>
                                                                </div>
                                                            ))}
                                                    </div>
                                                ) : (
                                                    <p className="text-center">No Time Slots Available for {selectedDay}</p>
                                                )}
                                                <div className="time-set-butt">
                                                    <button className="time-submit-button" onClick={() => bookTheSlot(docSchedule.doc_id)}>
                                                        Book Slot
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                    </>
                                ) : (
                                    <h1>No Data Available</h1>
                                )}




                            </div>
                        </div>

                    </div>
                </div>
            </div>

        </>
    )
}

export default Bookconsult