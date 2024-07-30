'use client';
import { Grid, useMediaQuery } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import React, { useEffect, useState, useContext } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import axiosInstance from '../../../utils/axios';
import AppLayout from '../../../components/AppLayout';
import { useParams, usePathname } from 'next/navigation';
import ModelDialogue from '../../../components/Dialog/ModelDialogue';
import { handleApiError } from '../../../utils/apiHelpers';
import PrivateRoute from '../../../components/PrivateRoute';
import { passwordGenerator } from '../../../utils/utilityFn';
import {
  FirstName,
  LastName,
  Email,
  DateSelect,
  Remove,
  Confirm,
  MyTimePicker,
} from './inputs';

const MeetingAdd = React.memo(() => {
  const params = useParams();
  const [editData, setEditData] = useState({});
  const [timeData, setTimeData] = useState({});

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm();

  const router = useRouter();

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    setEditData((prevData) => ({ ...prevData, [name]: value }));
    setValue(name, value, { shouldValidate: true });
  };

  const handleDOBChange = (e) => {
    const date = new Date(e);
    if (!isNaN(date.getTime())) {
      const year = date.getFullYear().toString();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');

      let constfinalDate = `${year}-${month}-${day}T00:00:00.000Z`;
      console.log(constfinalDate);
      setEditData((prevData) => ({
        ...prevData,
        ['Geburtsdatum']: constfinalDate,
      }));
      setValue('Geburtsdatum', constfinalDate, { shouldValidate: true });
    }
  };

  const handleTimeChange = (newTime) => {
    const time = newTime;
    const hour = new Date(time).getHours();
    const minute = new Date(time).getMinutes();

    let selectedTimeObj = {
      time: {
        hour,
        minute,
      },
    };
    console.log(newTime);
    console.log(selectedTimeObj);
    setTimeData(selectedTimeObj);
  };

  const onSubmit = async (data) => {
    try {
      console.log(data);
      if (data && timeData?.time?.hour) {
        toast('scheduling email');
        const accessCode = passwordGenerator();
        const url =
          process.env.NEXT_PUBLIC_CLIENT_HOST +
          `/dashboard/videosprechstunde/rtc?accessKey=${accessCode}&clientName=${data.Vorname}`;

        data.url = url;
        data.accessKey = accessCode;
        data.meetingTime = {
          hour: timeData?.time?.hour,
          minutes: timeData?.time?.minute,
        };
        let userData = localStorage?.getItem('psymax-user-data');

        if (userData) {
          userData = JSON.parse(userData);
          data.userId = userData._id;
          console.log(data);
          const meetingRes = await axiosInstance.post(`/meetings/create`, data);
          if (meetingRes.status === 200) {
            toast.success('meeting has been scheduled');
            router.push('/dashboard/videosprechstunde');
          }
        }
      }
    } catch (error) {
      handleApiError(error, router);
    }
  };

  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  // Define the spacing based on the screen size
  const spacing = isMobile ? 0 : 2;

  return (
    <AppLayout>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={spacing}>
          <FirstName
            handleChange={handleChange}
            errors={errors}
            register={register}
            editData={editData}
          />
          <LastName
            handleChange={handleChange}
            errors={errors}
            register={register}
            editData={editData}
          />
        </Grid>
        <Grid container spacing={spacing}>
          <Email
            handleChange={handleChange}
            errors={errors}
            register={register}
            editData={editData}
          />
          <DateSelect
            errors={errors}
            register={register}
            editData={editData}
            handleDOBChange={handleDOBChange}
          />
        </Grid>

        <Grid container sx={{ mt: 4 }}>
          <MyTimePicker handleTimeChange={handleTimeChange} />
        </Grid>
        <Grid container sx={{ mt: 4 }}>
          <Remove router={router} />
          <Confirm />
        </Grid>
      </form>
    </AppLayout>
  );
});
export default PrivateRoute(MeetingAdd);
