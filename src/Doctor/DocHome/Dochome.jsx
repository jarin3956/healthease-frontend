import React, { useEffect, useState } from 'react';
import './DocHome.scss';
import axiosinstance from '../../Axios/Axios';

import Docschedule from '../Docschedule/Docschedule';

import NotFound from '../../Common/NotFound/NotFound';

import DocChart from '../DocChart/DocChart';
import { useNavigate } from 'react-router-dom';

import Swal from 'sweetalert2';



function Dochome() {

  const [schedule, setSchedule] = useState(null)

  const [docId, setDocId] = useState(null);

  const doctortoken = localStorage.getItem('doctortoken')

  const navigate = useNavigate()

  useEffect(() => {
    if (doctortoken) {
      const getSchedule = async () => {
        try {
          const response = await axiosinstance.get('doctor/schedule-data', {
            headers: {
              Authorization: `Bearer ${doctortoken}`,
            },
          });
          if (response.status === 200) {
            console.log(response.data.schedule.doc_id, " this is doc id i need to pass to the chart");
            setSchedule(response.data.schedule.schedule)
            setDocId(response.data.schedule.doc_id);
          }
          

        } catch (error) {
          if (error.response) {
            const status = error.response.status;
            if (status === 401) {
              localStorage.removeItem('doctortoken');
              Swal.fire('Unauthorized', 'You are not authorized to access this resource.', 'error')
                .then(() => {
                  navigate('/doctor/login')
                });
            } else if (status === 403) {
              localStorage.removeItem('doctortoken');
              Swal.fire('Forbidden', 'You do not have permission to access this resource.', 'error')
                .then(() => {
                  navigate('/doctor/login')
                });
            } 
          } else {
            console.log(error);
            Swal.fire('Oops!', 'Error when loading doctor data', 'error');
          }
        }
      }
      getSchedule()
    }
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
                {docId &&
                  <DocChart chartData={docId} />
                }
                <Docschedule data={schedule} />
              </>
            ) : (
              <>
                <p className='text-center the-main-head-dochome' >Please Update your Profile</p>
                <NotFound />
              </>

            )}
          </div>
        </div>
      </section>

    </>
  );
}

export default Dochome;
