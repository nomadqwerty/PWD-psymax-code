import { useRouter } from 'next/navigation';
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
            const subRes = await axiosInstance.get(
              `/subscriptions/${responseData._id}`
            );
            let subResData;

            localStorage.setItem(
              'psymax-user-data',
              JSON.stringify(responseData)
            );
            // FIXME: Might be preferable to use next-js server side fetch to prevent page access
            if (subRes.status === 200) {
              subResData = subRes.data.data;

              let subStatus = subResData.status;
              let trialPeriod = responseData.trialPeriodActive;

              if (subStatus !== 'ACTIVE' && trialPeriod === false) {
                localStorage.setItem('psymax-account-restricted', true);
              }
            }

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
      const isAccountRestricted =
        localStorage.getItem('psymax-account-restricted') === 'true';

      if (!isAuthenticated || !token) {
        router.push('/logout');
        return;
      }
      console.log(isAccountRestricted);
      if (isAccountRestricted) {
        return router.push('/subscription');
      }

      refreshToken();
    }, []);

    return <WrappedComponent {...props} />;
  };

  return Wrapper;
};

export default PrivateRoute;
