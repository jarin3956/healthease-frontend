import { useLocation,Navigate,Outlet } from "react-router-dom";

function CheckDoctor() {
    const doctor = localStorage.getItem('doctortoken')
    const location = useLocation();
  return (
    doctor ? <Navigate to={'/doctor/home'} state={{from:location}} replace ></Navigate> : <Outlet/>
  )
}

export default CheckDoctor