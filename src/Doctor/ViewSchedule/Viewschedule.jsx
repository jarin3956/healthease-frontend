import React, { useState } from 'react'
import './Viewschedule.css'


function Viewschedule() {

  const [schedule, setSchedule] = useState(true)
  const [completed, setCompleted] = useState(false)
  const [upcomming, setUpcomming] = useState(false)
  const [cancelled, setCancelled] = useState(false)
  const [selectedTimeSlots, setSelectedTimeSlots] = useState([]);
  const [selectedDays, setSelectedDays] = useState([])

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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Selected Time Slot:', selectedTimeSlots,"and",selectedDays);
  }

  function TimeSlotBox({ timeSlot, isSelected, handleClick }) {
    const className = `time-slot-box ${isSelected ? 'selected' : ''}`;

    return (
      <div className={className} onClick={() => handleClick(timeSlot)}>
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

  const handleTimeSlotClick = (timeSlot) => {
    if (selectedTimeSlots.includes(timeSlot)) {
      setSelectedTimeSlots(selectedTimeSlots.filter((slot) => slot !== timeSlot));
    } else {
      setSelectedTimeSlots([...selectedTimeSlots, timeSlot]);
    }
  };

  const handleDaySlotClick = (daySlot) => {
    if (selectedDays.includes(daySlot)) {
      setSelectedDays(selectedDays.filter((slot) => slot !== daySlot));
    } else {
      setSelectedDays([...selectedDays, daySlot]);
    }
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
    '09:30 pm - 10:00 pm',
  ];



  return (
    <>
      <div className="mx-4 mt-5" >
        <section className='rounded-3 doc-schedule-page' >
          <div className='the-buttons-vs p-3'>
            <div className="radio-inputs">
              <label className="radio">
                <input type="radio" name="radio"  />
                <span onClick={openschedule} className="name"   >Schedule</span>
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
              <div className="schedule-panel rounded-3">
                <form onSubmit={handleSubmit}>

                  <h3 className='text-center'>Select your prefered day</h3>
                  <div className="day-slot-container">
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
                  </div>




                  <h3 className="text-center">Schedule your time</h3>
                  <div className="time-slot-container">
                    {timeSlots.map((timeSlot) => (
                      <TimeSlotBox
                        key={timeSlot}
                        timeSlot={timeSlot}
                        isSelected={selectedTimeSlots.includes(timeSlot)}
                        handleClick={handleTimeSlotClick}
                      />
                    ))}
                  </div>
                  <div className="time-set-butt">
                    <button type="submit" className="time-submit-button">
                      Save
                    </button>
                  </div>
                </form>
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