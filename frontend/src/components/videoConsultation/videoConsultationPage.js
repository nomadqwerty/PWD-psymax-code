'use client';
import DatePicker from './DatePicker';
import { Controller, useForm } from 'react-hook-form';
import TitleInput from './Title';
import SubmitBtn from './Submit';
import { useState } from 'react';
import AppLayout from '../AppLayout';
import MeetingList from './meetingList';
import { Typography, Grid } from '@mui/material';

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
  const onScheduleCall = () => {};
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
        <MeetingList></MeetingList>
      </div>
    </AppLayout>
  );
};

export default VideoConsultationPage;
