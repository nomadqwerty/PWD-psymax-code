import { useRouter } from 'next/router';
import { useEffect } from 'react';
import axiosInstance from '../utils/axios';
import PrivateRoute from '../components/PrivateRoute';

const Logout = () => {
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.delete(`/logout`);
        if (response?.status === 200) {
          localStorage.removeItem('psymax-token');
          localStorage.removeItem('psymax-user-data');
          localStorage.removeItem('psymax-is-admin');
          localStorage.removeItem('psymax-loggedin');
        }
      } catch (error) {
        console.error('Logout error:', error);
      }
      router.push('/login');
    };

    fetchData(); // Call the async function immediately
  }, []);

  return <>Logging Out...</>;
};

export default PrivateRoute(Logout);
