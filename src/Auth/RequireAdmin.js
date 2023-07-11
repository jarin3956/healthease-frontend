import { useLocation,Navigate,Outlet } from "react-router-dom";



function RequireAdmin() {
    const admin = localStorage.getItem('admintoken')
    const location = useLocation()
  return (
    admin ? <Outlet/> : <Navigate to={'admin/login'} state={{from:location}} replace ></Navigate>
  )
}

export default RequireAdmin