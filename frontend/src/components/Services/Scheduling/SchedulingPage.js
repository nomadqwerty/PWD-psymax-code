'use client';
import { Grid, useMediaQuery } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import React, { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import axiosInstance from '../../../utils/axios';
import AppLayout from '../../../components/AppLayout';
import { useParams } from 'next/navigation';
import ModelDialogue from '../../../components/Dialog/ModelDialogue';
import { handleApiError } from '../../../utils/apiHelpers';
import PrivateRoute from '../../../components/PrivateRoute';
import {
  Confirm,
  Cost,
  Delete,
  Description,
  Duration,
  SalesTaxElection,
  ServiceName,
} from '../../../components/Services/Scheduling/InputsAndButtons';
import {
  RelevantInformation,
  ValueAddedTax,
} from '../../../components/Services/Scheduling/HeadersAndInfo';

const AddEditSchedule = React.memo(() => {
  const params = useParams();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    getValues,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm();

  const [leistungEdit, setLeistungEdit] = useState(false);
  const [Leistung, setLeistung] = useState('Leistung');
  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [dauer, setDauer] = useState('');
  const router = useRouter();
  const inputRef = useRef(null);

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setValue(name, value, { shouldValidate: true });
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [leistungEdit]);

  useEffect(() => {
    const userLocalStorageData = localStorage.getItem('psymax-user-data');
    if (userLocalStorageData !== 'undefined') {
      const userData = JSON.parse(userLocalStorageData);
      if (!userData?.Chiffre) {
        router.push('/dashboard/kontoeinstellungen');
      }
    }
    const checkIsAdmin = localStorage.getItem('psymax-is-admin');
    if (checkIsAdmin === '1') {
      router.push('/admin');
    }
    if (params?.id === 'add') {
      setIsEdit(false);
    } else if (params && (params?.id !== '' || params?.id !== null)) {
      setIsEdit(true);
      async function fetchData() {
        try {
          const response = await axiosInstance.get(
            '/leistungen/getTerminplanungById/' + params?.id
          );
          const responseData = response?.data?.data;
          setLeistung(responseData?.Leistung);
          setDauer(responseData?.Dauer);
          const fieldsToSet = [
            'Dauer',
            'Beschreibung',
            'Kosten',
            'Umsatzsteuerwahl',
          ];

          fieldsToSet.forEach((field) => {
            setValue(field, responseData?.[field], {
              shouldValidate: true,
            });
          });
        } catch (error) {
          handleApiError(error, router);
        }
      }
      fetchData();
    }
  }, [params]);

  const agreeModel = async () => {
    try {
      setOpen(!open);
      const response = await axiosInstance.delete(
        `/leistungen/terminplanungRemove/${params?.id}`
      );
      if (response?.status === 200) {
        router.push('/dashboard/leistungen');
        toast.success(response?.data?.message);
      }
    } catch (error) {
      setOpen(!open);
      handleApiError(error, router);
    }
  };

  const closeModel = () => {
    setOpen(false);
  };

  const onSubmit = async (data) => {
    let dauer = getValues('Dauer');
    if (
      parseInt(dauer.substring(0, 2)) >= 13 ||
      parseInt(dauer.substring(3)) >= 60
    ) {
      setError('Dauer', {
        type: 'custom',
        message: 'Dauer sollte gültig sein',
      });
      return false;
    }
    if (Leistung !== 'Leistung') {
      data.Leistung = Leistung;
      try {
        let response;
        if (isEdit) {
          data.id = params?.id;
          response = await axiosInstance.put(
            '/leistungen/updateTerminplanung',
            data
          );
        } else {
          response = await axiosInstance.post(
            '/leistungen/saveTerminplanung',
            data
          );
        }

        if (response?.status === 200) {
          const responseData = response?.data;
          toast.success(responseData?.message);
          router.push('/dashboard/leistungen');
        }
      } catch (error) {
        handleApiError(error, router);
      }
    } else {
      setError('Leistung', {
        type: 'custom',
        message: 'Bitte austauschen Leistung',
      });
    }
  };

  const handleDauerChange = (event) => {
    let inputValue = event.target.value;
    // Remove non-numeric characters
    inputValue = inputValue.replace(/\D/g, '');

    // Insert ":" after the first two digits
    if (inputValue.length >= 2) {
      inputValue = inputValue.substring(0, 2) + ':' + inputValue.substring(2);
      setValue('Dauer', inputValue);
      setDauer(inputValue);
    }

    console.log(inputValue);

    if (inputValue.length <= 5) {
      setValue('Dauer', inputValue);
      setDauer(inputValue);
    }
  };

  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  // Define the spacing based on the screen size
  const spacing = isMobile ? 0 : 2;

  return (
    <AppLayout>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          await onSubmit(getValues());
          console.log('here');
        }}
      >
        <ServiceName
          leistungEdit={leistungEdit}
          setLeistungEdit={setLeistungEdit}
          Leistung={Leistung}
          setLeistung={setLeistung}
          clearErrors={clearErrors}
          register={register}
          inputRef={inputRef}
          errors={errors}
        />
        {/* above: lestung input */}

        <RelevantInformation />

        {/* relevante angaben */}
        <Grid container spacing={spacing}>
          <Duration
            register={register}
            errors={errors}
            getValues={getValues}
            handleDauerChange={handleDauerChange}
            dauer={dauer}
          />

          {/* dauer */}

          <Cost
            register={register}
            errors={errors}
            getValues={getValues}
            handleChange={handleChange}
          />
          {/* kosten */}
        </Grid>
        <Grid container spacing={spacing}>
          <Description
            register={register}
            errors={errors}
            getValues={getValues}
            handleChange={handleChange}
          />
          {/* beshreibung */}
        </Grid>

        <ValueAddedTax />
        {/* umsatzsteuer */}

        <Grid container spacing={spacing}>
          <SalesTaxElection
            control={control}
            errors={errors}
            setValue={setValue}
            register={register}
            handleChange={handleChange}
            Controller={Controller}
          />
          {/* umsatsteuerwahl */}
        </Grid>

        <Grid container sx={{ mt: 4 }}>
          <Delete isEdit={isEdit} setOpen={setOpen} />
          {/* loschen */}
          <Confirm isSubmitting={isSubmitting} />
          {/* bestatigen */}
        </Grid>
      </form>
      <ModelDialogue
        actionTitle={'Aktion überprüfen'}
        options={''}
        open={open}
        setOpen={setOpen}
        confirmationText="Bitte überprüfen Sie Ihre Aktion. Die von Ihnen beabsichtigte Aktion kann nicht rückgängig gemacht werden."
        agreeModel={agreeModel}
        closeModel={closeModel}
      />
    </AppLayout>
  );
});
export default PrivateRoute(AddEditSchedule);
