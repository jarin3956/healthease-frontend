import { useAuth0 } from '@auth0/auth0-react';
import { axiosinstance } from '../Axios/Axios';

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
        logout();
        console.log(error);
      }
    }
  };

  return handleGoogleLogin;
};

export default useGoogleAuth;
