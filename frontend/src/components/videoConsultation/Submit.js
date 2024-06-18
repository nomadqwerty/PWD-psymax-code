import { Grid } from '@mui/material';
import { passwordGenerator } from '../../utils/utilityFn';
import axiosInstance from '../../utils/axios';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const SubmitBtn = ({ isSubmitting, setValues, values, setNewMeeting }) => {
  const [userId, setUserId] = useState(null);
  useEffect(() => {
    let userData = localStorage?.getItem('psymax-user-data');

    if (userData) {
      userData = JSON.parse(userData);
      setUserId(userData._id);
    }
  });
  return (
    <Grid container sx={{ mt: 4 }}>
      <Grid item xs={6} sm={6} md={6} xl={6} style={{ textAlign: 'right' }}>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-107 h-[42px] bg-[#EEE] px-5 py-2 rounded-[4px] justify-center items-center gap-2.5 inline-flex text-center text-[#0E0E0E] text-sm font-medium interFonts"
          onClick={async () => {
            const meetingKey = passwordGenerator();
            const meetingDetails = { ...values, accessKey: meetingKey, userId };
            setValues({});
            console.log(meetingDetails);
            const length = Object.keys(meetingDetails).length;
            console.log(length);
            if (length === 4) {
              const meetingRes = await axiosInstance.post(
                `/meetings/create`,
                meetingDetails
              );
              if (meetingRes.status === 200) {
                toast.success('Treffen geplant');
                setNewMeeting('true');
              }
            }
          }}
        >
          Bestätigen
        </button>
      </Grid>
    </Grid>
  );
};

export default SubmitBtn;
