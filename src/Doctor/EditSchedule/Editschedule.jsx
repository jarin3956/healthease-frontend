
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import ScheduleForm from '../ScheduleForm/ScheduleForm';
import { createInstance } from '../../Axios/Axios';
import { addSchedule } from '../../Redux- toolkit/authslice'
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';


function Editschedule() {

  const navigate = useNavigate();
  const doctortoken = localStorage.getItem('doctortoken');

  const [selectedDays, setSelectedDays] = useState([])
  const [selectedTimeSlotsByDay, setSelectedTimeSlotsByDay] = useState({});
  const [day, setDay] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);

  useEffect(() => {
    if (doctortoken) {
      const daySlots = async () => {
        try {
          const axiosInstance = createInstance(doctortoken)
          const response = await axiosInstance.get('doctor/find-dayslots');
          if (response.status === 200) {
            setDay(response.data.extractedDays);
            setTimeSlots(response.data.extractedTime)
          }
        } catch (error) {
          console.log(error);
        }
      }
      daySlots();
    }
    
  },[doctortoken]);

  console.log(day,'it is the days');

  // const day = [
  //   'Monday',
  //   'Tuesday',
  //   'Wednesday',
  //   'Thursday',
  //   'Friday',
  //   'Saturday',
  //   'Sunday'
  // ]
  // const timeSlots = [
  //   '10:00 am - 10:30 am', '10:30 am - 11:00 am', '11:00 am - 11:30 am', '11:30 am - 12:00 pm', '12:00 pm - 12:30 pm', '12:30 pm - 01:00 pm', '01:00 pm - 01:30 pm', '01:30 pm - 02:00 pm', '02:00 pm - 02:30 pm', '02:30 pm - 03:00 pm', '03:00 pm - 03:30 pm', '03:30 pm - 04:00 pm', '04:00 pm - 04:30 pm', '04:30 pm - 05:00 pm', '05:00 pm - 05:30 pm',
  // ];

  const selector = useSelector((state) => state.schedule.schedule.schedule);
  console.log(selector);


  useEffect(() => {
    const days = selector.map((item) => item.day);
    const timeSlotsByDay = {};
    selector.forEach((item) => {

      if (Array.isArray(item.time) && item.time.length > 0) {
        const timeSlots = item.time.map((slot) => slot.timeslot);
        timeSlotsByDay[item.day] = timeSlots;
      } else {
        timeSlotsByDay[item.day] = [];
      }

    });

    setSelectedDays(days);
    setSelectedTimeSlotsByDay(timeSlotsByDay)

  }, []);



  const dispatch = useDispatch()

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedDays.length === 0 || Object.keys(selectedTimeSlotsByDay).length === 0) {
      toast.error('Please select at least one day and one time slot');
      return;
    }

    try {

      const axiosInstance = createInstance(doctortoken)

      const response = await axiosInstance.put('doctor/update-schedule',{
        schedule: Object.entries(selectedTimeSlotsByDay).map(([day, timeSlots]) => ({
          day,
          time: timeSlots.map((timeslot) => ({ timeslot })),
        })),
      })

      if (response.status === 200) {
        toast.success(response.data.message);
        dispatch(addSchedule(response.data.schedule))
        navigate('/doctor/view-schedule')
      } else {
        toast.error('Something went wrong, Please try after sometime')
      }

    } catch (error) {
      console.log(error);
    }

  }

  const handleTimeSlotClick = (timeSlot, daySlot) => {
    setSelectedTimeSlotsByDay((prevSelectedTimeSlotsByDay) => {
      const selectedTimeSlotsForDay = prevSelectedTimeSlotsByDay[daySlot] || [];
      if (selectedTimeSlotsForDay.includes(timeSlot)) {
        return {
          ...prevSelectedTimeSlotsByDay,
          [daySlot]: selectedTimeSlotsForDay.filter((slot) => slot !== timeSlot),
        };
      } else {
        return {
          ...prevSelectedTimeSlotsByDay,
          [daySlot]: [...selectedTimeSlotsForDay, timeSlot],
        };
      }
    });
  };

  const handleDaySlotClick = (daySlot) => {
    setSelectedDays((prevSelectedDays) => {
      if (prevSelectedDays.includes(daySlot)) {
        setSelectedTimeSlotsByDay((prevSelectedTimeSlotsByDay) => {
          const updatedSelectedTimeSlotsByDay = { ...prevSelectedTimeSlotsByDay };
          delete updatedSelectedTimeSlotsByDay[daySlot];
          return updatedSelectedTimeSlotsByDay;
        });
        return prevSelectedDays.filter((slot) => slot !== daySlot);
      } else {
        return [...prevSelectedDays, daySlot];
      }
    });
  };

  return (
    <>
      <ToastContainer />
      {day.length > 0 && timeSlots.length > 0 && (
        <ScheduleForm
        selectedDays={selectedDays}
        selectedTimeSlotsByDay={selectedTimeSlotsByDay}
        handleSubmit={handleSubmit}
        handleDaySlotClick={handleDaySlotClick}
        handleTimeSlotClick={handleTimeSlotClick}
        day={day}
        timeSlots={timeSlots}
      />
      )}
      
    </>

  )
}

export default Editschedule