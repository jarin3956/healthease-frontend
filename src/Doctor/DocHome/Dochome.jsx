import React, { useEffect } from 'react'
import axiosinstance from '../../Axios/Axios'
import { useDispatch, useSelector } from 'react-redux'
import { addSchedule } from '../../Redux- toolkit/authslice'
import './DocHome.css'



function Dochome() {

  const doctortoken = localStorage.getItem('doctortoken')
  const dispatch = useDispatch()

  const selecter = useSelector((state) => state.schedule);

  useEffect(() => {

    const docSchedule = async () => {
      try {
        const response = await axiosinstance.get('doctor/schedule-data', {
          headers: {
            Authorization: `Bearer ${doctortoken}`,
          },
        });
        if (response.status === 200) {
          console.log(response.data.schedule, "ithaaaaaaaaaaaaaaaaa");
          dispatch(addSchedule(response.data.schedule))
        }
      } catch (error) {
        console.log(error);
      }
    }
    docSchedule()
  }, [])
  return (
    <>
      <div className="mx-4 mt-5" >
      <section className='rounded-3 doc-home-page' >
      <div className="home-sch-panel rounded-3">
        <h3 className="text-center the-first-text">Selected Dates</h3>
        <div className="view-day-slot-container">
          {selecter && selecter.Day && selecter.Day.map((day) => (
            <div className="view-day-box" key={day}>
              <h6>{day}</h6>
            </div>
          ))}
        </div>
        <h3 className="text-center the-first-text">Selected Time Slots</h3>
        <div className="view-time-slot-container">
          {selecter && selecter.Time && selecter.Time.map((time) => (
            <div className="view-time-box" key={time}>
              <h6>{time}</h6>
            </div>
          ))}
        </div>
      </div>
      </section>

      </div>
      






    </>
  )
}

export default Dochome