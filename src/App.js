import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import UserRoute from './Routes/UserRoute';
import AdminRoute from './Routes/AdminRoute';
import DoctorRoute from './Routes/DoctorRoute';
import { useState, useEffect } from 'react';
import Loader from './Loader/Loader'




function App() {

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => {
      setLoading(false)
    }, 1500);
  })


  return (
    <> {loading ? <Loader /> : <div className="App">
      <BrowserRouter>

        <Routes>

          <Route path='/admin/*' element={<AdminRoute />} />
          <Route path='/*' element={<UserRoute />} />
          <Route path='/doctor/*' element={<DoctorRoute />} />

        </Routes>

      </BrowserRouter>
    </div>}
    </>

  );
}

export default App;
