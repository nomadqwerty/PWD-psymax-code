import { useRouter } from 'next/router';
import { useContext, useEffect } from 'react';
import axiosInstance from '../utils/axios';
import { AuthContext } from '../context/auth.context';
import { handleApiError } from '../utils/apiHelpers';

const PrivateRoute = (WrappedComponent) => {
  const Wrapper = (props) => {
    const router = useRouter();
    const { dispatch } = useContext(AuthContext);

    const refreshToken = async () => {
      const token = localStorage.getItem('psymax-token');

      if (token) {
        try {
          const response = await axiosInstance.post(`/refreshToken`);
          const responseData = response?.data?.data;
          if (response?.status === 200) {
            localStorage.setItem('psymax-token', responseData?.token);
            localStorage.setItem(
              'psymax-user-data',
              JSON.stringify(responseData)
            );
            dispatch({
              type: 'LOGIN',
              payload: { isLoggedin: true, userData: responseData },
            });
          }
        } catch (error) {
          handleApiError(error, router);
        }
      }
    };

    useEffect(() => {
      // Perform authentication logic here
      const isAuthenticated = localStorage.getItem('psymax-loggedin');
      const token = localStorage.getItem('psymax-token');

      if (!isAuthenticated || !token) {
        router.push('/logout');
        return;
      }
      refreshToken();
    }, []);

    return <WrappedComponent {...props} />;
  };

  return Wrapper;
};

export default PrivateRoute;
