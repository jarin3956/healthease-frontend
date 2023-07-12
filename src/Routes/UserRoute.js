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
import Header from '../Common/Header/Header';

import ErrorPage from '../ErrorPage/ErrorPage';



function UserRoute() {
    return (
        <>
         <Header userType="user" />
    
            <Routes>
                <Route element={<CheckUser />} >
                    <Route path="register" element={<Register />} />
                    <Route path="verify" element={<Verifyp />} />
                    <Route path="login" element={<Loginp user={"user"} />} />
                </Route>
                <Route element={<RequireUser />}>
                    <Route path="home" element={<Home />} />
                    <Route path='profile' element={<Profile />} />
                    <Route path="aboutus" element={<Aboutusp user={"user"} />} />
                    <Route path="contactus" element={<Contactusp user={"user"} />} />
                    <Route path="bookconsult" element={<Bookconsult />} />
                </Route>
                <Route path='*' element={<ErrorPage/>} />
               
            </Routes>

        </>
    )
}

export default UserRoute