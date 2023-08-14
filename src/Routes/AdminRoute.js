import React from 'react';
import Loginp from '../Common/Login/Loginp'
import Adminregister from '../Admin/Adminregister/Adminregister';
import Admindashboard from '../Admin/AdminDashboard/Admindashboard';
import Usersmgt from '../Admin/UsersMgt/Usersmgt';
import Doctormgt from '../Admin/DoctorsMgt/Doctormgt';
import Bookingsmgt from '../Admin/BookingsMgt/Bookingsmgt';
import Revenue from '../Admin/Revenue/Revenue';
import Specregister from '../Admin/Spec/Specregister';
import Specmgt from '../Admin/SpecMgt/Specmgt';
import CheckAdmin from '../Auth/CheckAdmin';
import RequireAdmin from "../Auth/RequireAdmin";
import {  Routes, Route } from 'react-router-dom';

import ErrorPage from '../ErrorPage/ErrorPage';
import Viewdoctor from '../Admin/ViewDoctor/Viewdoctor';
import ViewUser from '../Admin/ViewUsers/ViewUser';

import Navbar from '../Common/Navbar/Navbar';

function AdminRoute() {
    const admin = 'admin'
    return (
        <>
        <Navbar userType={admin} />

            <Routes>
                <Route element={<CheckAdmin />} >
                    <Route path="login" element={<Loginp user={admin} />} />
                    <Route path='register' element={<Adminregister />} />
                </Route>
                <Route element={<RequireAdmin />} >
                    <Route path='dashboard' element={<Admindashboard />} />
                    <Route path='users' element={<Usersmgt />} />
                    <Route path='doctors' element={<Doctormgt />} />
                    <Route path='bookings' element={<Bookingsmgt />} />
                    <Route path='revenue' element={<Revenue />} />
                    <Route path='spec-register' element={<Specregister />} />
                    <Route path='specialization' element={<Specmgt />} />
                    <Route path='viewDoctorProfile' element={<Viewdoctor/>} />
                    <Route path='viewUserProfile' element={<ViewUser/>} />
                    
                </Route>
                <Route path='*' element={<ErrorPage/>} />
            </Routes>

        </>
    )
}

export default AdminRoute