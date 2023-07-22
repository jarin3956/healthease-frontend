import React, { useEffect, useState } from 'react';
import './DocHome.scss';
import axiosinstance from '../../Axios/Axios';

import Docschedule from '../Docschedule/Docschedule';

function Dochome() {

  const [schedule, setSchedule] = useState(null)

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

  

  return (
    <>
      <div className="mx-4 mt-5">
        <section className="rounded-3 doc-home-page">
          <div className="p-2">
            <p className="cookieHeading text-center mt-3">Your Schedule</p>
            <div className="home-sch-panel rounded-3">
              {schedule ? (
                <>
                <Docschedule data={schedule}/>
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
