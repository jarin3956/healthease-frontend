import React from 'react'
import { Routes, Route } from 'react-router-dom';
import Register from '../User/Register/Register';
import Verifyp from '../Common/Verify/Verifyp';
import Loginp from '../Common/Login/Loginp';
import Home from '../User/Home/Home';
import Profile from './../User/Profile/Profile';
import Aboutusp from './../Common/Aboutus/Aboutusp';
import Contactusp from './../Common/Contactus/Contactusp';
import Bookconsult from '../User/Bookconsult/Bookconsult';
import CheckUser from '../Auth/CheckUser';
import RequireUser from '../Auth/RequireUser';
import Viewdoc from '../User/ViewDoc/Viewdoc';
import ErrorPage from '../ErrorPage/ErrorPage';
import Landingpage from '../User/LandingPage/Landingpage';
import Navbar from '../Common/Navbar/Navbar';
import Bookings from '../User/Bookings/Bookings';
import Payment from '../User/Payment/Payment';
import Room from '../VideoCall/Room';
import FeedbackPage from '../User/FeedbackPage/FeedbackPage';
import ViewPrescription from '../User/ViewPrescription/ViewPrescription';



function UserRoute() {
    const user = 'user'
    return (
        <>
         <Navbar userType={user} />
    
            <Routes>
                <Route element={<CheckUser />} >
                    <Route path="register" element={<Register />} />
                    <Route path="verify" element={<Verifyp />} />
                    <Route path="login" element={<Loginp user={user} />} />
                    <Route path='' element={<Landingpage/>} ></Route>
                </Route>
                <Route element={<RequireUser />}>
                    <Route path="home" element={<Home />} />
                    <Route path='profile' element={<Profile />} />
                    <Route path="aboutus" element={<Aboutusp user={user} />} />
                    <Route path="contactus" element={<Contactusp user={user} />} />
                    <Route path="bookAppointment" element={<Bookconsult />} />
                    <Route path='viewDoctors'element={<Viewdoc/>} />
                    <Route path='view-Bookings' element={<Bookings/>} />
                    <Route path='payment' element={<Payment/>} />
                    <Route path='room/:roomId'element={<Room user={user} />}/>
                    <Route path='feed-back/:bookingConfirmId' element={<FeedbackPage/>} />
                    <Route path='view-prescription/:bookingId' element={<ViewPrescription/>}/>
                    
                </Route>
                <Route path='*' element={<ErrorPage/>} />
               
            </Routes>

        </>
    )
}

export default UserRoute