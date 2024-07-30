'use client';
import DatePicker from './DatePicker';
import { Controller, useForm } from 'react-hook-form';
import TitleInput from './Title';
import SubmitBtn from './Submit';
import { useEffect, useState } from 'react';
import AppLayout from '../AppLayout';
import MeetingList from './meetingList';
import { Typography, Grid } from '@mui/material';
import axiosInstance from '../../utils/axios';
import { useRouter } from 'next/navigation';
import {
  MeetingHeader,
  SessionsHeader,
  AddMeeting,
  FilterMeetings,
  SearchMeetings,
  Cipher,
  ClickToAddNew,
} from './headers';

const VideoConsultationPage = () => {
  const {
    handleSubmit,
    setValue,
    getValues,
    setError,
    clearErrors,
    register,
    control,
    formState: { errors, isSubmitting },
  } = useForm();
  const [values, setValues] = useState();
  const [meetings, setMeetings] = useState([]);
  const [userName, setUserName] = useState(null);
  const [newMeeting, setNewMeeting] = useState(null);
  const router = useRouter();
  useEffect(() => {
    const userLocalStorageData = localStorage.getItem('psymax-user-data');
    if (userLocalStorageData !== 'undefined') {
      const userData = JSON.parse(userLocalStorageData);
      if (!userData?.Chiffre) {
        router.push('/dashboard/kontoeinstellungen');
      }
    }
  }, []);

  useEffect(() => {
    (async () => {
      let userData = localStorage?.getItem('psymax-user-data');

      if (userData) {
        userData = JSON.parse(userData);

        const meetingRes = await axiosInstance.get(
          `/meetings/all/${userData._id}`
        );
        if (meetingRes.status === 200) {
          if (meetingRes.data.data) {
            setMeetings(meetingRes.data.data.meetings);
          }
        }
      }
    })();
  }, []);
  useEffect(() => {
    let userData = localStorage?.getItem('psymax-user-data');

    if (userData) {
      userData = JSON.parse(userData);
      setUserName(userData.Nachname);
    }
  });
  return (
    <AppLayout>
      <Grid container sx={{ mb: 4, alignItems: 'center' }} spacing={2}>
        <MeetingHeader />
        {/* neue client */}
        <AddMeeting router={router} />

        {/* suche */}
        <SearchMeetings />
      </Grid>
      <Grid container sx={{ mb: 4, alignItems: 'center' }} spacing={2}>
        <SessionsHeader />
        {/* neue client */}
        <Cipher />

        <MeetingList
          userName={userName}
          meetingsList={meetings}
          router={router}
        ></MeetingList>

        <ClickToAddNew router={router} />
      </Grid>
    </AppLayout>
  );
};

export default VideoConsultationPage;
