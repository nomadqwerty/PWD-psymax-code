'use client';
import React, { useEffect, useState } from 'react';
import { Grid } from '@mui/material';
import AppLayout from '../../components/AppLayout';
import { useRouter } from 'next/navigation';
import axiosInstance from '../../utils/axios';
import ModelDialogue from '../../components/Dialog/ModelDialogue';
import { handleApiError } from '../../utils/apiHelpers';
import PrivateRoute from '../../components/PrivateRoute';
import toast from 'react-hot-toast';
import {
  AppointmentInfo,
  BillingSpecification,
  PerformanceSpecifications,
  ServiceInfo,
  Services,
} from '../../components/Services/HeaderAndInfo';
import {
  AddService,
  GlobalPointValue,
  Return,
  Search,
} from '../../components/Services/InputsAndButtons';
import {
  InvoiceList,
  Pagination,
  ScheduleList,
} from '../../components/Services/ListAndPage';

const ServicesPage = () => {
  const [leistungenAbrechnung, setLeistungenAbrechnung] = useState([]);
  const [leistungenTerminplanung, setLeistungenTerminplanung] = useState([]);
  const [globalPoint, setGlobalPoint] = useState('');
  const [open, setOpen] = useState(false);
  const [deleteData, setDeleteData] = useState({});
  const [search, setSearch] = useState('');
  const [abrechnungPage, setAbrechnungPage] = useState({
    pagenum: 1,
    total: 0,
  });
  const [terminplanungPage, setTerminplanungPage] = useState({
    pagenum: 1,
    total: 0,
  });
  const router = useRouter();

  const agreeModel = async () => {
    try {
      setOpen(!open);
      if (deleteData?.flag === 1) {
        const response = await axiosInstance.delete(
          `/leistungen/abrechnungRemove/${deleteData?.id}`
        );
        if (response?.status === 200) {
          await getLeistungenAbrechnung(abrechnungPage?.pagenum);
          toast.success(response?.data?.message);
        }
      } else if (deleteData?.flag === 2) {
        const response = await axiosInstance.delete(
          `/leistungen/terminplanungRemove/${deleteData?.id}`
        );
        if (response?.status === 200) {
          await getLeistungenTerminplanung(abrechnungPage?.pagenum);
          toast.success(response?.data?.message);
        }
      }

      setDeleteData('');
    } catch (error) {
      setOpen(!open);
      handleApiError(error, router);
    }
  };

  const closeModel = () => {
    setOpen(false);
    setDeleteData('');
  };

  const getGlobalPointValue = async () => {
    try {
      const response = await axiosInstance.get(
        '/leistungen/getGlobalPointValue/'
      );
      setGlobalPoint(response?.data?.data);
    } catch (error) {
      handleApiError(error, router);
    }
  };

  const handleGlobalPointBlur = async (event) => {
    try {
      await axiosInstance.put('/leistungen/updateGlobalPointValue', {
        value: event?.target?.value,
      });
    } catch (error) {
      handleApiError(error, router);
    }
  };

  const getLeistungenAbrechnung = async (pagenum) => {
    try {
      const response = await axiosInstance.get(
        `leistungen/getAllAbrechnung?page=${pagenum}&pageSize=${process.env.NEXT_PUBLIC_PAGINATION_LIMIT}&search=${search}`
      );
      const responseData = response?.data?.data;
      setAbrechnungPage({
        ...abrechnungPage,
        pagenum: pagenum,
        total: responseData?.totalCount,
      });
      setLeistungenAbrechnung(responseData?.list);
    } catch (error) {
      handleApiError(error, router);
    }
  };

  const getLeistungenTerminplanung = async (pagenum) => {
    try {
      const response = await axiosInstance.get(
        `leistungen/getAllTerminplanung?page=${pagenum}&pageSize=${process.env.NEXT_PUBLIC_PAGINATION_LIMIT}&search=${search}`
      );
      const responseData = response?.data?.data;
      setTerminplanungPage({
        ...terminplanungPage,
        pagenum: pagenum,
        total: responseData?.totalCount,
      });
      setLeistungenTerminplanung(responseData?.list);
    } catch (error) {
      handleApiError(error, router);
    }
  };

  useEffect(() => {
    getGlobalPointValue();
  }, []);

  useEffect(() => {
    const userLocalStorageData = localStorage.getItem('psymax-user-data');
    if (userLocalStorageData !== 'undefined') {
      const userData = JSON.parse(userLocalStorageData);
      if (!userData?.Chiffre) {
        router.push('/dashboard/kontoeinstellungen');
      }
    }
    setAbrechnungPage({ ...abrechnungPage, pagenum: 1, total: 0 });
    setTerminplanungPage({ ...terminplanungPage, pagenum: 1, total: 0 });
    getLeistungenAbrechnung(1);
    getLeistungenTerminplanung(1);
  }, [search]);

  return (
    <AppLayout>
      <Grid container sx={{ mb: 4, alignItems: 'center' }} spacing={2}>
        <Services />

        <GlobalPointValue
          globalPoint={globalPoint}
          setGlobalPoint={setGlobalPoint}
          handleGlobalPointBlur={handleGlobalPointBlur}
        />

        <Search search={search} setSearch={setSearch} />
      </Grid>

      <BillingSpecification />

      <ServiceInfo />

      <InvoiceList
        leistungenAbrechnung={leistungenAbrechnung}
        router={router}
        setOpen={setOpen}
        setDeleteData={setDeleteData}
      />

      <AddService router={router} />

      <Pagination
        pageOptions={abrechnungPage}
        pageChangeHandler={getLeistungenAbrechnung}
      />

      <PerformanceSpecifications />

      <AppointmentInfo />

      <ScheduleList
        leistungenTerminplanung={leistungenTerminplanung}
        router={router}
        setOpen={setOpen}
        setDeleteData={setDeleteData}
      />

      <Return router={router} />

      <Pagination
        pageOptions={terminplanungPage}
        pageChangeHandler={getLeistungenTerminplanung}
      />
      <ModelDialogue
        open={open}
        setOpen={setOpen}
        actionTitle={'Aktion überprüfen'}
        confirmationText={
          'Bitte überprüfen Sie Ihre Aktion. Die von Ihnen beabsichtigte Aktion kann nicht rückgängig gemacht werden.'
        }
        agreeModel={agreeModel}
        closeModel={closeModel}
        options={''}
        cancelHide={false}
        submitHide={false}
      />
    </AppLayout>
  );
};

export default PrivateRoute(ServicesPage);
