import React, { useState, useEffect } from 'react';
import './Viewschedule.scss';
import { createInstance } from '../../Axios/Axios';
import { useDispatch, useSelector } from 'react-redux';
import { addSchedule } from '../../Redux- toolkit/authslice';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Docschedule from '../Docschedule/Docschedule';
import ScheduleForm from '../ScheduleForm/ScheduleForm';
import Bookings from '../Bookings/Bookings';
import NotFound from '../../Common/NotFound/NotFound';


function Viewschedule() {

  const doctortoken = localStorage.getItem('doctortoken')

  const [schedule, setSchedule] = useState(true)
  const [completed, setCompleted] = useState(false)
  const [upcomming, setUpcomming] = useState(false)
  const [cancelled, setCancelled] = useState(false)
  const [notPaid, setNotPaid] = useState(false)
  const [docSchedule, setViewSchedule] = useState(null);
  const [selectedDays, setSelectedDays] = useState([])
  const [selectedTimeSlotsByDay, setSelectedTimeSlotsByDay] = useState({});
  const [booking, setBooking] = useState(null);
  const [doctorData, setDoctorData] = useState(null);

  const [day, setDay] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedDays.length === 0 || Object.keys(selectedTimeSlotsByDay).length === 0) {
      toast.error('Please select at least one day and one time slot');
      return;
    }

    try {

      const axiosInstance = createInstance(doctortoken)
      const response = await axiosInstance.post('doctor/set-schedule', {
        schedule: Object.entries(selectedTimeSlotsByDay).map(([day, timeSlots]) => ({
          day,
          time: timeSlots.map((timeslot) => ({ timeslot })),
        })),
      })

      if (response.status === 200) {
        toast.success('Successfully saved schedule');
        setViewSchedule(response.data.schedule.schedule);
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


  const dispatch = useDispatch()

  // const selector = useSelector((state) => state.schedule.schedule);

  const fetchBookingData = async () => {

    try {

      const axiosInstance = createInstance(doctortoken)
      const response = await axiosInstance.get('booking/load-doc-bookings')

      if (response.status === 200) {
        setBooking(response.data.bookingData);
        setDoctorData(response.data.doctor);
      } else if (response.status === 204) {
        toast.success("Consider adjusting your schedule to attract more patients.");
      }
    } catch (error) {
      console.log(error);
    }
  }

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


  useEffect(() => {

    const getSchedules = async () => {

      try {

        const axiosInstance = createInstance(doctortoken)
        const response = await axiosInstance.get('doctor/schedule-data')

        if (response.status === 200) {
          setViewSchedule(response.data.schedule.schedule);
          dispatch(addSchedule(response.data.schedule));
        } else {
          toast.error('Something went wrong, Please try after sometime.')
        }
      } catch (error) {
        console.log(error);
      }
    };



    getSchedules();

    fetchBookingData();

    daySlots();

  }, []);

  const handleCancelBooking = async (bookingId) => {

    try {

      const axiosInstance = createInstance(doctortoken)
      const response = await axiosInstance.put(`booking/cancel-booking-doctor/${bookingId}`)

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

      <section className='rounded-3 doc-schedule-page' style={{ minHeight: '90vh' }} >
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
                  setNotPaid(false);
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
                  setNotPaid(false);
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
                  setNotPaid(false);
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
                  setNotPaid(false);
                }}
              />
              <span className="name">Cancelled</span>
            </label>
            <label className="radio">
              <input
                type="radio"
                name="radio"
                checked={notPaid}
                onChange={() => {
                  setNotPaid(true);
                  setSchedule(false);
                  setCompleted(false);
                  setUpcomming(false);
                  setCancelled(false);
                }}
              />
              <span className="name">Not paid</span>
            </label>
          </div>
        </div>
        {schedule && (
          <>
            {docSchedule ? (
              <>
                <Docschedule data={docSchedule} context="viewsch"  />
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
              <Bookings bookingData={booking.filter((bookingItem) => bookingItem.bookingData.Status === 'COMPLETED')} doctorData={doctorData} />
            ) : (
              <NotFound />

            )}
          </>
        )}
        {upcomming && (
          <>
            {booking && booking.filter((bookingItem) => bookingItem.bookingData.Status === 'PENDING').length > 0 ? (
              <Bookings bookingData={booking.filter((bookingItem) => bookingItem.bookingData.Status === 'PENDING')} handleCancelBooking={handleCancelBooking} doctorData={doctorData} />
            ) : (
              <NotFound />
            )}


          </>
        )}
        {cancelled && (
          <>
            {booking && booking.filter((bookingItem) => bookingItem.bookingData.Status === 'CANCELLED').length > 0 ? (
              <Bookings bookingData={booking.filter((bookingItem) => bookingItem.bookingData.Status === 'CANCELLED')} />
            ) : (
              <NotFound />
            )}
          </>
        )}
        {notPaid && (
          <>
            {booking && booking.filter((bookingItem) => bookingItem.bookingData.Status === 'NOTPAID').length > 0 ? (
              <Bookings bookingData={booking.filter((bookingItem) => bookingItem.bookingData.Status === 'NOTPAID')} />
            ) : (
              <NotFound />
            )}
          </>
        )}
      </section>

    </>
  )
}

export default Viewschedule