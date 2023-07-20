import React, { useState, useEffect } from 'react'
import './Viewschedule.css'
import axiosinstance from '../../Axios/Axios'
import { useDispatch, useSelector } from 'react-redux'
import { addSchedule } from '../../Redux- toolkit/authslice'
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



function Viewschedule() {
  const [schedule, setSchedule] = useState(true)
  const [completed, setCompleted] = useState(false)
  const [upcomming, setUpcomming] = useState(false)
  const [cancelled, setCancelled] = useState(false)
  const [viewSelectedDay, setViewSelectedDay] = useState('')


  const [docSchedule, setViewSchedule] = useState(null);

  const [selectedDays, setSelectedDays] = useState([])
  const [selectedTimeSlotsByDay, setSelectedTimeSlotsByDay] = useState({});
  const openschedule = () => {
    setSchedule(true)
    setUpcomming(false)
    setCancelled(false)
    setCompleted(false)

  }
  const opencompleted = () => {
    setCompleted(true)
    setSchedule(false)
    setUpcomming(false)
    setCancelled(false)
  }
  const openupcomming = () => {
    setUpcomming(true)
    setSchedule(false)
    setCancelled(false)
    setCompleted(false)
  }
  const opencancelled = () => {
    setCancelled(true)
    setSchedule(false)
    setUpcomming(false)
    setCompleted(false)
  }

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
        setViewSchedule(response.data.schedule);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
    }
    console.log('Selected Time Slots:', selectedTimeSlotsByDay, 'and', selectedDays);
  };




  function TimeSlotBox({ timeSlot, daySlot, isSelected, handleClick }) {
    const className = `time-slot-box ${isSelected ? 'selected' : ''}`;

    return (
      <div className={className} onClick={() => handleClick(timeSlot, daySlot)}>
        {timeSlot}
      </div>
    );
  }


  function DaySlotBox({ daySlot, isSelected, handleClick }) {
    const className = `day-slot-box ${isSelected ? 'selected' : ''}`;

    return (
      <div className={className} onClick={() => handleClick(daySlot)}>
        {daySlot}
      </div>
    );
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
    '09:00 am - 09:30 am',
    '09:30 am - 10:00 am',
    '10:00 am - 10:30 am',
    '10:30 am - 11:00 am',
    '11:00 am - 11:30 am',
    '11:30 am - 12:00 pm',
    '12:00 pm - 12:30 pm',
    '12:30 pm - 01:00 pm',
    '01:00 pm - 01:30 pm',
    '01:30 pm - 02:00 pm',
    '02:00 pm - 02:30 pm',
    '02:30 pm - 03:00 pm',
    '03:00 pm - 03:30 pm',
    '03:30 pm - 04:00 pm',
    '04:00 pm - 04:30 pm',
    '04:30 pm - 05:00 pm',
    '05:00 pm - 05:30 pm',
    '05:30 pm - 06:00 pm',
    '06:00 pm - 07:00 pm',
    '07:00 pm - 07:30 pm',
    '07:30 pm - 08:00 pm',
    '08:00 pm - 08:30 pm',
    '08:30 pm - 09:00 pm',
    '09:00 pm - 09:30 pm',
  ];

  const dispatch = useDispatch()

  const selector = useSelector((state) => state.schedule.schedule);

  useEffect(() => {
    if (selector) {
      setViewSchedule(selector.schedule);
    } else {

      const getSchedules = async () => {
        try {
          const scheduleData = await axiosinstance.get('doctor/schedule-data', {
            headers: {
              Authorization: `Bearer ${doctortoken}`,
            },
          });
          if (scheduleData.status === 200) {
            setViewSchedule(scheduleData.data.schedule);
            dispatch(addSchedule(scheduleData.data.schedule));
          }
        } catch (error) {
          console.log(error);
        }
      };

      getSchedules();
    }
  }, [selector]);

  const viewHandleDayClick = (day) => {
    setViewSelectedDay(day)
  }



  return (
    <>
      <ToastContainer />
      <div className="mx-4 mt-5" >
        <section className='rounded-3 doc-schedule-page' >
          <div className='the-buttons-vs p-3'>
            <div className="radio-inputs">
              <label className="radio">
                <input type="radio" name="radio" />
                <span onClick={openschedule} className="name">Schedule</span>
              </label>
              <label className="radio">
                <input type="radio" name="radio" />
                <span onClick={opencompleted} className="name">Completed</span>
              </label>

              <label className="radio">
                <input type="radio" name="radio" />
                <span onClick={openupcomming} className="name">Upcomming</span>
              </label>
              <label className="radio">
                <input type="radio" name="radio" />
                <span onClick={opencancelled} className="name">Cancelled</span>
              </label>
            </div>
          </div>
          <div className='p-2'>
            {schedule && (
              <div className="schedule-panel rounded-3 ">

                {docSchedule ? (
                  <>
                    <h3 className="text-center the-first-text">Selected Dates</h3>
                    <div className="view-day-slot-container">
                      {docSchedule.map((day) => (
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
                        <div className='d-flex justify-content-center m-3'>
                          <div className='notselected-box-ident' >
                            <h6>Not Booked</h6>
                          </div>
                          <div className='selected-box-identi' >
                            <h6>Booked</h6>
                          </div>
                        </div>
                        {docSchedule.find((day) => day.day === viewSelectedDay)?.time.some((time) => time.isAvailable) ? (
                          <div className="view-time-slot-container">
                            {docSchedule.find((day) => day.day === viewSelectedDay)?.time.map((time) => (
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
                      <button className="time-submit-button">
                        Change
                      </button>
                    </div>
                  </>
                ) : (
                  <form onSubmit={handleSubmit}>
                    <h3 className='text-center the-first-text'>Select your prefered day</h3>
                    <div className="day-slot-container">

                      {day.map((daySlot) => (
                        <DaySlotBox
                          key={daySlot}
                          daySlot={daySlot}
                          isSelected={selectedDays.includes(daySlot)}
                          handleClick={handleDaySlotClick}
                        />
                      ))}

                    </div>

                    {selectedDays.map((selectedDay) => (
                      <div key={selectedDay}>
                        <h3 className="text-center the-first-text">Available Time Slots for {selectedDay}</h3>
                        <div className="time-slot-container">
                          {timeSlots.map((timeSlot) => (
                            <TimeSlotBox
                              key={timeSlot}
                              timeSlot={timeSlot}
                              daySlot={selectedDay}
                              isSelected={selectedTimeSlotsByDay[selectedDay]?.includes(timeSlot)}
                              handleClick={handleTimeSlotClick}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                    <div className="time-set-butt">
                      <button type="submit" className="time-submit-button">
                        Save
                      </button>
                    </div>
                  </form>
                )}
              </div>

            )}
            {completed && (
              <h3 className='text-center' >No Completed data available to display</h3>
            )}
            {upcomming && (
              <h3 className='text-center' >No Upcomming data available to display</h3>
            )}
            {cancelled && (
              <h3 className='text-center' >No Cancelled data available to display</h3>
            )}
          </div>

        </section>
      </div>


    </>
  )
}

export default Viewschedule