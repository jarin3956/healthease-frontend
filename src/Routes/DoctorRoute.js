import React from 'react'
import { Routes, Route } from 'react-router-dom';
import Docregister from '../Doctor/DocRegister/Docregister';
import Verifyp from '../Common/Verify/Verifyp';
import Loginp from '../Common/Login/Loginp';
import Dochome from '../Doctor/DocHome/Dochome';
import Docprofile from '../Doctor/DocProfile/Docprofile';
import Viewschedule from '../Doctor/ViewSchedule/Viewschedule';
import Aboutusp from '../Common/Aboutus/Aboutusp';
import Contactusp from '../Common/Contactus/Contactusp';
import CheckDoctor from '../Auth/CheckDoctor';
import RequireDoctor from '../Auth/RequireDoctor';
import ErrorPage from '../ErrorPage/ErrorPage';
import Navbar from '../Common/Navbar/Navbar';
import EditSchedule from '../Doctor/EditSchedule/Editschedule';
import EditProfile from '../Doctor/EditProfile/EditProfile';
import VideoCall from '../VideoCall/VideoCall';
import Room from '../VideoCall/Room';
import AddPrescription from '../Doctor/AddPrescription/AddPrescription';
import Chat from '../Chat/Chat';
import FollowUp from '../Doctor/FollowUp/FollowUp';
import Footer from '../Common/Footer/Footer'

function DoctorRoute() {
    const doctor = 'doctor'
    return (
        <>
        <Navbar userType={doctor} />
            <Routes>
                <Route element={<CheckDoctor />} >
                    <Route path="register" element={<Docregister />} />
                    <Route path="verify" element={<Verifyp />} />
                    <Route path="login" element={<Loginp user={doctor} />} />
                </Route>
                <Route element={<RequireDoctor />}>
                    <Route path='home' element={<Dochome />} />
                    <Route path='profile' element={<Docprofile />}></Route>
                    <Route path='view-schedule' element={<Viewschedule />} />
                    <Route path='edit-schedule'element={<EditSchedule/>} />
                    <Route path="aboutus" element={<Aboutusp user={doctor} />} />
                    <Route path="contactus" element={<Contactusp user={doctor} />} />
                    <Route path='edit-profile' element={<EditProfile/>} />
                    <Route path='video-call' element={<VideoCall/>}/>
                    <Route path='room/:roomId'element={<Room user={doctor} />} />
                    <Route path='add-prescription/:bookingConfirmId' element={<AddPrescription/>} />
                    <Route path='chat/:chatId' element={<Chat user={doctor} />} />
                    <Route path='follow-up-appointment/:bookingId' element={<FollowUp/>} />
                </Route>
                <Route path='*' element={<ErrorPage/>} />
            </Routes>
            <Footer />
        </>
    )
}

export default DoctorRoute