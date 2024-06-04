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
  const [meetings, setMeetings] = useState(null);
  const [userName, setUserName] = useState(null);
  const onScheduleCall = () => {};
  useEffect(() => {
    (async () => {
      let userData = localStorage?.getItem('psymax-user-data');

      if (userData) {
        userData = JSON.parse(userData);
        const meetingListRes = await axiosInstance.get(
          `/meetings/all/${userData._id}`
        );
        if (
          meetingListRes.status === 200 &&
          meetingListRes?.data?.data &&
          meetings === null
        ) {
          setMeetings(meetingListRes.data.data.meetings);
          setUserName(userData.Nachname);
        }
      }
    })();
  });
  return (
    <AppLayout>
      <div>
        <Grid item xs={12} sm={12} md={12} lg={6}>
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: 36,
              lineHeight: 1.6,
              color: '#3C3C3C',
              fontFamily: 'inter Tight',
            }}
          >
            Schedule Meeting
          </Typography>
        </Grid>
        <div>
          <DatePicker
            register={register}
            errors={errors}
            setValues={setValues}
            values={values}
          ></DatePicker>
          <TitleInput
            register={register}
            errors={errors}
            setValues={setValues}
            values={values}
          ></TitleInput>
          <SubmitBtn
            isSubmitting={isSubmitting}
            setValues={setValues}
            values={values}
          ></SubmitBtn>
        </div>
        <button onClick={onScheduleCall}></button>
      </div>
      <div>
        <div>
          <Grid item xs={12} sm={12} md={12} lg={6}>
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: 36,
                lineHeight: 1.6,
                color: '#3C3C3C',
                fontFamily: 'inter Tight',
              }}
            >
              Scheduled Meetings
            </Typography>
          </Grid>
        </div>
        <MeetingList meetingsList={meetings} userName={userName}></MeetingList>
      </div>
    </AppLayout>
  );
};

export default VideoConsultationPage;
