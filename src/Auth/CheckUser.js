import { useLocation,Navigate,Outlet } from "react-router-dom";



function CheckUser() {

    const user = localStorage.getItem('token')
    const location = useLocation();
    console.log(user);
  return (
    user ? <Navigate to={'/home'} state={{from:location}} replace ></Navigate> : <Outlet/>
  )
}

export default CheckUser