import React, { useEffect, useState } from 'react';
import './DocHome.scss';
import { createInstance } from '../../Axios/Axios'
import Docschedule from '../Docschedule/Docschedule';
import NotFound from '../../Common/NotFound/NotFound';
import DocChart from '../DocChart/DocChart';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../../Context/SocketProvider'
import Swal from 'sweetalert2';



function Dochome() {

  const socket = useSocket()
  const [schedule, setSchedule] = useState(null)
  const [docId, setDocId] = useState(null);
  const doctortoken = localStorage.getItem('doctortoken')
  const navigate = useNavigate()

  useEffect(() => {
    socket.on('user-requested', (user, roomId) => {

      Swal.fire({
        title: 'Chat Request',
        text: `${user.name} Requested a chat , Do you want to join ?`,
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'Cancel',
      }).then((result) => {

        if (result.isConfirmed) {
          socket.emit('join-chat', roomId)
          const handleRoomJoin = () => {
            navigate(`/doctor/chat/${user._id}`)
          }
          socket.on('chat-connected', handleRoomJoin);
        } else {
          socket.emit('doc-rejected', user._id)
        }
      });
    })
  })
  useEffect(() => {
    if (doctortoken) {
      const getSchedule = async () => {

        try {

          const axiosInstance = createInstance(doctortoken)

          const response = await axiosInstance.get('doctor/schedule-data')
          if (response.status === 200) {
            setSchedule(response.data.schedule.schedule)
            setDocId(response.data.schedule.doc_id);
            socket.emit('set-up', response.data.schedule.doc_id)
          }
          
        } catch (error) {
          console.log(error);
        }
      }
      getSchedule()
    }
  }, [])



  return (
    <>

      <section className=" doc-home-page">
        <p className='text-center the-main-head-dochome '>Embrace the future of medical consultations with HealthEase.</p>

        <div className="p-2">
          <div className="home-sch-panel rounded-3">
            {schedule ? (
              <>
                {docId &&
                  <DocChart chartData={docId} />
                }
                <p className="text-center text-white mt-3" style={{ fontWeight: '700', fontSize: '30px' }}>Your Schedule</p>

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
