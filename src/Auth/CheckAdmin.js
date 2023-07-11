import { useLocation,Navigate,Outlet } from "react-router-dom";

function CheckAdmin() {
    const admin = localStorage.getItem('admintoken')
    const location = useLocation();
  return (
    admin ? <Navigate to={'/admin/dashboard'} state={{from:location}} replace ></Navigate> : <Outlet/>
  )
}

export default CheckAdmin