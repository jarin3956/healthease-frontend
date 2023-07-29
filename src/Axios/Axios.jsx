import axios from 'axios';


const axiosinstance = axios.create({
  baseURL: 'http://localhost:3001/',
});


axiosinstance.interceptors.response.use(
  (response) => {
    
    if (response.data.error === 'Doctor Blocked'){
      localStorage.removeItem('doctortoken')
      if(!localStorage.getItem('doctortoken')) {
        window.location='/doctor/login'
      }
    }

    else if (response.data.error === 'User Blocked'){
      
      localStorage.removeItem('token')
      if(!localStorage.getItem('token')) {
        window.location='/login'
      }
    }

    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosinstance;
