import { useAuth0 } from '@auth0/auth0-react';
import axiosinstance from '../Axios/Axios';
import Swal from 'sweetalert2';

const useGoogleAuth = () => {
  const { isAuthenticated, user, logout } = useAuth0();

  const handleGoogleLogin = async () => {
    if (isAuthenticated && user) {
      try {
        const response = await axiosinstance.post('google-login', {
          user
        });

        if (response.status === 200) {
          localStorage.setItem('token', response.data.user);
          logout();
        }
      } catch (error) {
        if (error.response) {
          const status = error.response.status;
          if (status === 403 || status === 500) {
            Swal.fire('Oops!', error.response.data.message, 'error');
          }
        }
        logout();
        console.log(error);
      }
    }
  };

  return handleGoogleLogin;
};

export default useGoogleAuth;
