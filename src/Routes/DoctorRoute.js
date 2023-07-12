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
import Header from '../Common/Header/Header';

import ErrorPage from '../ErrorPage/ErrorPage';

function DoctorRoute() {
    return (
        <>
        <Header userType="doctor" />
            <Routes>
                <Route element={<CheckDoctor />} >
                    <Route path="register" element={<Docregister />} />
                    <Route path="verify" element={<Verifyp />} />
                    <Route path="login" element={<Loginp user={"doctor"} />} />
                </Route>
                <Route element={<RequireDoctor />}>
                    <Route path='home' element={<Dochome />} />
                    <Route path='profile' element={<Docprofile />}></Route>
                    <Route path='view-schedule' element={<Viewschedule />} />
                    <Route path="aboutus" element={<Aboutusp user={"doctor"} />} />
                    <Route path="contactus" element={<Contactusp user={"doctor"} />} />
                </Route>
                <Route path='*' element={<ErrorPage/>} />
            </Routes>
        </>
    )
}

export default DoctorRoute