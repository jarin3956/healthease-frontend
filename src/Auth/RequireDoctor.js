import { useLocation,Navigate,Outlet } from "react-router-dom";



function RequireDoctor() {
    const doctor = localStorage.getItem('doctortoken')
    const location = useLocation()
  return (
    doctor ? <Outlet/> : <Navigate to={'/doctor/login'} state={{from:location}} replace ></Navigate>
  )
}

export default RequireDoctor