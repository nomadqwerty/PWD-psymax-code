import toast from 'react-hot-toast';
import { SOMETHING_WRONG } from './constants';

export const handleApiError = (error, router) => {
  console.log('error', error);
  if (error?.response?.status === 401 || error?.response?.status === 403) {
    router.push('/login');
  } else if (error?.response?.data?.message) {
    toast.error(error?.response?.data?.message);
  } else {
    toast.error(SOMETHING_WRONG);
  }
};
