import React, { useEffect, useState } from 'react'
import './Bookconsult.scss'
import { useLocation, useNavigate } from 'react-router-dom';
import axiosinstance from '../../Axios/Axios';

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { addBooking } from '../../Redux- toolkit/bookingsSlice';
import { useDispatch } from 'react-redux';


import { addDays, format, getDay } from 'date-fns';





function Bookconsult() {

    const [selectedDay, setSelectedDay] = useState('');
    const [selectedTime, setSelectedTimeSlot] = useState('')
    const [docSchedule, setDocSchedule] = useState([])
    const location = useLocation()
    const searchParams = new URLSearchParams(location.search);
    const docId = searchParams.get('doc');
    const [doctorId, setDoctorId] = useState('')

    const dispatch = useDispatch()

    const navigate = useNavigate()

    const showSlots = async (docId) => {
        try {
            const response = await axiosinstance.get(`view-doctor-slots/${docId}`)
            if (response.status === 200) {
                const currentDate = new Date();
                const currentDay = currentDate.getDay();

                const scheduleArray = Object.values(response.data.schedule);

                const updatedSchedule = scheduleArray.map((dayObj) => {
                    const dayIndex = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].indexOf(dayObj.day);
                    const dayDate = addDays(currentDate, dayIndex - currentDay);
                    return {
                        ...dayObj,
                        date: format(dayDate, 'MMM d, yyyy'),
                    };
                });

                const filteredSchedule = updatedSchedule.filter((schedule) => {
                    const todayDate = format(currentDate, 'MMM d, yyyy');
                    return schedule.date > todayDate;
                });

                setDocSchedule(filteredSchedule);
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
            setDoctorId(docId)
        }
    }, [location])

    const handleDayClick = (day) => {
        setSelectedDay(day);
    };

    const handleTimeSlot = (timeslot) => {
        setSelectedTimeSlot(timeslot)
    }


    const token = localStorage.getItem('token')

    const bookTheSlot = async () => {

        if (!selectedDay || !selectedTime) {
            toast.error('Please select a day and time');
            return;
        }

        try {

            const bookingData = {
                docId: doctorId,
                selectedDay: selectedDay,
                selectedTime: selectedTime,
                selectedDate: docSchedule.find((day) => day.day === selectedDay)?.date,
            };

            if (bookingData) {
                dispatch(addBooking(bookingData))
                navigate('/payment')

            }
            

        } catch (error) {
            console.log(error);
        }
    }

    return (
        <>

            <ToastContainer />
            
                <div className="book-cookieCard ">
                    <div className="book-contentWrapper">
                        <div className="home-sch-panel rounded-3 m-2">
                            {docSchedule ? (
                                <>
                                    <h3 className="text-center the-first-text-bk">Available Days</h3>
                                    <div className="view-day-slot-container">
                                        {docSchedule.map((day) => (
                                            <div
                                                className={`view-day-box ${selectedDay === day.day ? 'selected' : ''}`}
                                                key={day.day}
                                                onClick={() => handleDayClick(day.day)}
                                            >
                                                <h6>{`${day.day} (${day.date})`}</h6>
                                            </div>
                                        ))}
                                    </div>
                                    {selectedDay && (
                                        <>
                                            <h3 className="text-center the-second-text-bk">Time Slots ({selectedDay})</h3>
                                            {docSchedule.find((day) => day.day === selectedDay)?.time.some((time) => time.isAvailable) ? (
                                                <div className="view-time-slot-container">
                                                    {docSchedule.find((day) => day.day === selectedDay)
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
                                                <button className="time-submit-button" onClick={() => bookTheSlot()}>
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
            
        </>
    )
}

export default Bookconsult