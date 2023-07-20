import React, { useEffect, useState } from 'react';
import './DocHome.scss';
import axiosinstance from '../../Axios/Axios';

function Dochome() {

  const [schedule, setSchedule] = useState(null)
  const [viewSelectedDay, setViewSelectedDay] = useState('')

  const doctortoken = localStorage.getItem('doctortoken')

  useEffect(() => {
    const getSchedule = async () => {
      try {
        const response = await axiosinstance.get('doctor/schedule-data', {
          headers: {
            Authorization: `Bearer ${doctortoken}`,
          },
        });
        if (response.status === 200) {
          setSchedule(response.data.schedule.schedule)
        }

      } catch (error) {
        console.log(error);
      }
    }
    getSchedule()
  }, [])

  const handleDayClick = (day) => {
    setViewSelectedDay(day)
  }

  return (
    <>
      <div className="mx-4 mt-5">
        <section className="rounded-3 doc-home-page">
          <div className="p-2">
            <p className="cookieHeading text-center mt-3">Your Schedule</p>
            <div className="home-sch-panel rounded-3">
              {schedule ? (
                <>
                  <h3 className="text-center the-first-text">Your Scheduled Days</h3>
                  <div className="view-day-slot-container mb-3">
                    {schedule.map((day) => (
                      <div className={`view-day-box ${viewSelectedDay === day.day ? 'selected' : ''}`}
                        key={day.day} onClick={() => handleDayClick(day.day)} >
                        <h6>{day.day}</h6>
                      </div>
                    ))}
                  </div>

                  {viewSelectedDay && (
                    <>
                      <h3 className="text-center the-first-text">Selected Time Slots</h3>
                      <div className='d-flex justify-content-center m-3'>
                        <div className='notselected-box-ident' >
                          <h6>Not Booked</h6>
                        </div>
                        <div className='selected-box-identi' >
                          <h6>Booked</h6>
                        </div>
                      </div>
                      {schedule.find((day) => day.day === viewSelectedDay)?.time.some((time) => time.isAvailable) ? (
                        <div className="view-time-slot-container">
                          {schedule.find((day) => day.day === viewSelectedDay)?.time.map((time) => (
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
                  
                </>
              ) : (
                <h1>Please Schedule</h1>
              )}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default Dochome;
