import React, { useState, useEffect } from 'react'
import './Viewschedule.scss'
import axiosinstance from '../../Axios/Axios'
import { useDispatch, useSelector } from 'react-redux'
import { addSchedule } from '../../Redux- toolkit/authslice'
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Docschedule from '../Docschedule/Docschedule'
import ScheduleForm from '../ScheduleForm/ScheduleForm'
import Bookings from '../Bookings/Bookings'

import NotFound from '../../Common/NotFound/NotFound'


function Viewschedule() {
  const [schedule, setSchedule] = useState(true)
  const [completed, setCompleted] = useState(false)
  const [upcomming, setUpcomming] = useState(false)
  const [cancelled, setCancelled] = useState(false)

  const [docSchedule, setViewSchedule] = useState(null);

  const [selectedDays, setSelectedDays] = useState([])
  const [selectedTimeSlotsByDay, setSelectedTimeSlotsByDay] = useState({});

  const [booking, setBooking] = useState(null)


  const doctortoken = localStorage.getItem('doctortoken')




  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedDays.length === 0 || Object.keys(selectedTimeSlotsByDay).length === 0) {
      toast.error('Please select at least one day and one time slot');
      return;
    }

    try {
      const response = await axiosinstance.post(
        'doctor/set-schedule',
        {
          schedule: Object.entries(selectedTimeSlotsByDay).map(([day, timeSlots]) => ({
            day,
            time: timeSlots.map((timeslot) => ({ timeslot })),
          })),
        },
        {
          headers: {
            Authorization: `Bearer ${doctortoken}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success('Successfully saved schedule');
        setViewSchedule(response.data.schedule.schedule);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
    }
    console.log('Selected Time Slots:', selectedTimeSlotsByDay, 'and', selectedDays);
  };




  



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

  const day = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday'
  ]


  const timeSlots = [
    '10:00 am - 10:30 am', '10:30 am - 11:00 am', '11:00 am - 11:30 am', '11:30 am - 12:00 pm', '12:00 pm - 12:30 pm', '12:30 pm - 01:00 pm', '01:00 pm - 01:30 pm', '01:30 pm - 02:00 pm', '02:00 pm - 02:30 pm', '02:30 pm - 03:00 pm', '03:00 pm - 03:30 pm', '03:30 pm - 04:00 pm', '04:00 pm - 04:30 pm', '04:30 pm - 05:00 pm', '05:00 pm - 05:30 pm',
  ];

  const dispatch = useDispatch()

  // const selector = useSelector((state) => state.schedule.schedule);

  const fetchBookingData = async () => {
    try {
      const bookingsData = await axiosinstance.get('booking/load-doc-bookings', {
        headers: {
          Authorization: `Bearer ${doctortoken}`,
        },
      });
      if (bookingsData.status === 200) {
        setBooking(bookingsData.data.bookingData)
      }
    } catch (error) {
      console.log(error);
    }
  }


  useEffect(() => {


    const getSchedules = async () => {
      try {
        const scheduleData = await axiosinstance.get('doctor/schedule-data', {
          headers: {
            Authorization: `Bearer ${doctortoken}`,
          },
        });
        if (scheduleData.status === 200) {
          setViewSchedule(scheduleData.data.schedule.schedule);
          dispatch(addSchedule(scheduleData.data.schedule));
        }
      } catch (error) {
        console.log(error);
      }
    };


    // if (selector) {
    //   setViewSchedule(selector.schedule);
    // } else {
      
    // }

    getSchedules();

    fetchBookingData()

  }, []);

  const handleCancelBooking = async (bookingId) => {
    try {
      const response = await axiosinstance.put(`booking/cancel-booking/${bookingId}`);
      if (response.status === 200) {
        fetchBookingData();
      }

    } catch (error) {
      console.log(error);
    }
  };





  return (
    <>
      <ToastContainer />
      
        <section className='rounded-3 doc-schedule-page' >
          <div className='the-buttons-vs p-3 ' >
            <div className="radio-inputs">
              <label className="radio">
                <input
                  type="radio"
                  name="radio"
                  checked={schedule}
                  onChange={() => {
                    setSchedule(true);
                    setCompleted(false);
                    setUpcomming(false);
                    setCancelled(false);
                  }}
                />
                <span className="name">Schedule</span>
              </label>
              <label className="radio">
                <input
                  type="radio"
                  name="radio"
                  checked={completed}
                  onChange={() => {
                    setSchedule(false);
                    setCompleted(true);
                    setUpcomming(false);
                    setCancelled(false);
                  }}
                />
                <span className="name">Completed</span>
              </label>
              <label className="radio">
                <input
                  type="radio"
                  name="radio"
                  checked={upcomming}
                  onChange={() => {
                    setSchedule(false);
                    setCompleted(false);
                    setUpcomming(true);
                    setCancelled(false);
                  }}
                />
                <span className="name">Upcoming</span>
              </label>
              <label className="radio">
                <input
                  type="radio"
                  name="radio"
                  checked={cancelled}
                  onChange={() => {
                    setSchedule(false);
                    setCompleted(false);
                    setUpcomming(false);
                    setCancelled(true);
                  }}
                />
                <span className="name">Cancelled</span>
              </label>
            </div>
          </div>
          {schedule && (
            <>
              {docSchedule ? (
                <>
                  <Docschedule data={docSchedule} />

                </>
              ) : (
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

          )}
          {completed && (
            <>
              {booking && booking.filter((bookingItem) => bookingItem.bookingData.Status === 'COMPLETED').length > 0 ? (
                <Bookings bookingData={booking.filter((bookingItem) => bookingItem.bookingData.Status === 'COMPLETED')} />
              ) : (
                <NotFound/>
                
              )}
            </>
          )}
          {upcomming && (
            <>
              {booking && booking.filter((bookingItem) => bookingItem.bookingData.Status === 'PENDING').length > 0 ? (
                <Bookings bookingData={booking.filter((bookingItem) => bookingItem.bookingData.Status === 'PENDING')} handleCancelBooking={handleCancelBooking} />
              ) : (
                <NotFound/>
              )}
            </>
          )}
          {cancelled && (
            <>
              {booking && booking.filter((bookingItem) => bookingItem.bookingData.Status === 'CANCELLED').length > 0 ? (
                <Bookings bookingData={booking.filter((bookingItem) => bookingItem.bookingData.Status === 'CANCELLED')} />
              ) : (
                <NotFound/>
              )}
            </>
          )}
        </section>
      
    </>
  )
}

export default Viewschedule