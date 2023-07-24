import React, { useEffect, useState } from 'react';
import './DocHome.scss';
import axiosinstance from '../../Axios/Axios';

import Docschedule from '../Docschedule/Docschedule';

import NotFound from '../../Common/NotFound/NotFound';



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

      <section className=" doc-home-page">
        <p className='text-center the-main-head-dochome'>Embrace the future of medical consultations with HealthEase.</p>
        
        <div className="p-2">
          <p className="text-center text-white mt-3" style={{ fontWeight: '700', fontSize: '30px' }}>Your Schedule</p>
          <div className="home-sch-panel rounded-3">
            {schedule ? (
              <>
                <Docschedule data={schedule} />
              </>
            ) : (
              <NotFound />
            )}
          </div>
        </div>
      </section>

    </>
  );
}

export default Dochome;
