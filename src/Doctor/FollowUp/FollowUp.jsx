import React, { useEffect, useState } from 'react';
import { createInstance } from '../../Axios/Axios';
import { addDays, format } from 'date-fns';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';


function FollowUp() {

    const doctortoken = localStorage.getItem('doctortoken');
    const navigate = useNavigate()
    const url = new URL(window.location.href);
    const bookingId = url.pathname.split('/').pop();

    const [schedule, setSchedule] = useState();
    const [selectedDay, setSelectedDay] = useState('');
    const [selectedTime, setSelectedTimeSlot] = useState('')

    const getSchedule = async () => {

        const axiosInstance = createInstance(doctortoken);
        const response = await axiosInstance.get('doctor/schedule-data');

        if (response.status === 200) {
            const currentDate = new Date();
            const currentDay = currentDate.getDay();
            const currentWeekStart = addDays(currentDate, -currentDay);
            const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

            const scheduleArray = Object.values(response.data.schedule.schedule);

            console.log(scheduleArray);

            const updatedSchedule = [];
            for (let index = 0; index < 7; index++) {
                const dayDate = addDays(currentWeekStart, index);
                const upcomingDate = addDays(dayDate, dayDate < currentDate ? 7 : 0);
                const dayName = weekDays[dayDate.getDay()];

                const dayObj = scheduleArray.find(scheduleDay => scheduleDay.day === dayName);
                if (dayObj) {
                    updatedSchedule.push({
                        ...dayObj,
                        day: dayName,
                        date: format(upcomingDate, 'MMM d, yyyy'),
                    });
                }
            }

            const sortedSchedule = updatedSchedule.sort((a, b) => {
                const dateA = new Date(a.date);
                const dateB = new Date(b.date);
                return dateA - dateB;
            });
            setSchedule(sortedSchedule)
        }
    }

    useEffect(() => {
        if (doctortoken && bookingId) {
            console.log('hai');
            getSchedule()

        }
    }, [doctortoken]);

    const handleDayClick = (day) => {
        setSelectedDay(day);
    };

    const handleTimeSlot = (timeslot) => {
        setSelectedTimeSlot(timeslot)
    }

    const bookTheSlot = async () => {
        if (!selectedDay || !selectedTime) {
            toast.error('Please select a day and time');
            return;
        }

        try {

            const bookingData = {
                bookingId,
                selectedDay,
                selectedTime,
                selectedDate: schedule.find((day) => day.day === selectedDay)?.date,
            }

            const axiosInstance = createInstance(doctortoken);
            const response = await axiosInstance.post('booking/follow-up-booking', {
                bookingData
            });
            if (response.status === 200) {
                toast.success(response.data.message)
                navigate('/doctor/view-schedule');
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <>
            <div className="book-cookieCard ">
                <div className="home-sch-panel rounded-3 m-2">
                    {schedule ? (
                        <>
                            <h3 className="text-center the-first-text-bk">Available Days</h3>
                            <div className="view-day-slot-container">
                                {schedule.map((day) => (
                                    <div
                                        className={`view-day-box ${selectedDay === day.day ? 'selected' : ''}`}
                                        key={day.day}
                                        onClick={() => handleDayClick(day.day)}
                                    >
                                        <h6>{day.day}</h6>
                                        <h6 style={{ color: '#8fb6c4' }} >{`${day.date}`}</h6>
                                    </div>
                                ))}
                            </div>

                            {selectedDay && (
                                <>
                                    <h3 className="text-center the-second-text-bk">Time Slots for {selectedDay}</h3>
                                    {schedule.find((day) => day.day === selectedDay)?.time.some((time) => time.isAvailable) ? (
                                        <div className="view-time-slot-container">
                                            {schedule.find((day) => day.day === selectedDay)
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
        </>
    )
}

export default FollowUp