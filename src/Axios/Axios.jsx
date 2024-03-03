import axios from 'axios';
import Swal from 'sweetalert2';

// const baseURL = 'https://eniacecommerce.online/';
//const baseURL = 'http://localhost:3001/';
const baseURL = 'https://54.166.110.206/';

const axiosinstance = axios.create({
  baseURL: baseURL,
});

axiosinstance.interceptors.response.use(
  (response) => {

    return response;
  },
  (error) => {

    if (error.response) {
      const status = error.response.status
      if (status === 403 || status === 401 || status === 409) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.response.data.message + ', You do not have permission to access this resource.',
          confirmButtonText: 'OK',
        })

      } else if (status === 404 || status === 500 || status === 400) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.response.data.message + ', Please try after sometime',
          confirmButtonText: 'OK',
        })
      }
    }

    return Promise.reject(error);
  }

);



const createInstance = (token) => {
  const instance = axios.create({
    baseURL: baseURL,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  });

  instance.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error.response) {
        const status = error.response.status;
        if (status === 403 || status === 401) {
          const userType = error.response.data.user;
          if (userType === 'user') {
            localStorage.removeItem('token');
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: error.response.data.message + ', You do not have permission to access this resource.',
              confirmButtonText: 'OK',
            }).then(() => {
              window.location = '/login';
            });
          } else if (userType === 'doctor') {
            localStorage.removeItem('doctortoken');
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: error.response.data.message + ', You do not have permission to access this resource.',
              confirmButtonText: 'OK',
            }).then(() => {
              window.location = '/doctor/login';
            });
          } else if (userType === 'admin') {
            localStorage.removeItem('admintoken');
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: error.response.data.message + ', You do not have permission to access this resource.',
              confirmButtonText: 'OK',
            }).then(() => {
              window.location = '/admin/login';
            });
          }
        } else if (status === 404 || status === 500 || status === 400 || status === 409) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.response.data.message + ', Please try after sometime',
            confirmButtonText: 'OK',
          });
        } else if (status === 422) {
          Swal.fire({
            icon: 'warning',
            title: 'Warning',
            text: error.response.data.message,
            confirmButtonText: 'OK',
          })
        } else if (status === 409) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.response.data.message + ', Please try with another data',
            confirmButtonText: 'OK',
          });
        }
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

export { createInstance, axiosinstance };
