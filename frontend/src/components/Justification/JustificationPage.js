'use client';
import React, { useEffect, useState } from 'react';
import Button from '../../components/common/Button';
import { Grid, TablePagination, Typography } from '@mui/material';
import AppLayout from '../../components/AppLayout';
import { useRouter } from 'next/navigation';
import axiosInstance from '../../utils/axios';
import CssTextField from '../../components/CssTextField';
import ModelDialogue from '../../components/Dialog/ModelDialogue';
import { handleApiError } from '../../utils/apiHelpers';
import PrivateRoute from '../../components/PrivateRoute';
import JustificationSection from '../../components/Justification/HeadersAndInfo';
import {
  AddJustification,
  AddReason,
  JustificationInput,
  Return,
  Submit,
} from '../../components/Justification/ButtonsAndInputs';
import {
  JustificationList,
  Pagination,
} from '../../components/Justification/ListAndPages';

const JustificationPage = () => {
  const [justificationDetails, setJustificationDetails] = useState([]);
  const [open, setOpen] = useState(false);
  const [deleteData, setDeleteData] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState({ pagenum: 1, total: 0 });
  const [activeInput, setActiveInput] = useState(null);
  const router = useRouter();

  const inputRefs = {};

  const handleFocus = (inputName) => {
    setActiveInput(inputName);
  };

  const agreeModel = async () => {
    setOpen(false);
    deletJustification(deleteData);
  };

  const closeModel = () => {
    setOpen(false);
    setDeleteData('');
  };

  const getJustifications = async (pagenum) => {
    try {
      const response = await axiosInstance.get(
        `begruendungstexte/getAll?page=${pagenum}&pageSize=${process.env.NEXT_PUBLIC_PAGINATION_LIMIT}&search=${search}`
      );
      const responseData = response?.data?.data;
      const finalData = [];
      if (responseData?.list?.length > 0) {
        responseData?.list?.map((item) => {
          finalData?.push({
            id: item?._id,
            begruendungstexte: item?.begruendungstexte,
          });
        });
      }
      setPage({
        ...page,
        pagenum: pagenum,
        total: responseData?.totalCount,
      });
      return finalData;
    } catch (error) {
      handleApiError(error, router);
    }
  };

  const setJustificationData = async (pagenum) => {
    let finalData = await getJustifications(pagenum);
    setJustificationDetails(finalData);
  };

  const handleChange = (e, index) => {
    const updatedDetails = [...justificationDetails];
    updatedDetails[index].begruendungstexte = e?.target?.value;
    setJustificationDetails(updatedDetails);
  };

  const handleBlur = (index) => {
    const updatedDetails = [...justificationDetails];
    updatedDetails[index].edit = false;
    setJustificationDetails(updatedDetails);
    setActiveInput(null);
  };

  const handleEdit = (index) => {
    const updatedDetails = [...justificationDetails];
    updatedDetails[index].edit = true;
    setJustificationDetails(updatedDetails);
    handleFocus(`begruendungstexte${index}`);
  };

  const handleSubmit = async () => {
    try {
      const newJustifications = justificationDetails.filter(
        (item) => item.id === '' && item?.begruendungstexte !== ''
      );
      const updatedJustifications = justificationDetails.filter(
        (item) => item.id !== '' && item?.begruendungstexte !== ''
      );

      if (newJustifications?.length > 0) {
        const payload = [];
        newJustifications?.map((item) => {
          payload.push({
            begruendungstexte: item?.begruendungstexte,
          });
        });
        await axiosInstance.post('/begruendungstexte/save', payload);
      }

      if (updatedJustifications?.length > 0) {
        const payload = [];
        updatedJustifications?.map((item) => {
          payload.push({
            id: item?.id,
            begruendungstexte: item?.begruendungstexte,
          });
        });
        await axiosInstance.put('/begruendungstexte/update', payload);
      }

      if (newJustifications?.length > 0 || updatedJustifications?.length > 0) {
        setJustificationData(page?.pagenum);
      }
    } catch (error) {
      handleApiError(error, router);
    }
  };

  const addJustification = async () => {
    const lastPage = Math.ceil(
      page?.total / process.env.NEXT_PUBLIC_PAGINATION_LIMIT
    );
    const finalData =
      page?.pagenum !== lastPage
        ? await getJustifications(lastPage)
        : justificationDetails;

    const updatedDetails = finalData.map((item) => ({ ...item, edit: false }));

    const newJustification = {
      begruendungstexte: '',
      id: '',
      edit: true,
    };

    setJustificationDetails([...updatedDetails, newJustification]);
    handleFocus(`begruendungstexte${updatedDetails.length}`);
  };

  const deletJustification = async (index) => {
    try {
      const id = justificationDetails[index]?.id;

      if (id) {
        await axiosInstance.delete(`begruendungstexte/remove/${id}`);
      } else {
        setJustificationDetails((prev) => prev.filter((_, i) => i !== index));
      }

      setJustificationData(page?.pagenum);
      setDeleteData('');
    } catch (error) {
      handleApiError(error, router);
    }
  };
  // Use useEffect to focus on the active input when it changes
  useEffect(() => {
    if (inputRefs[activeInput]) {
      inputRefs[activeInput].focus();
    }
  }, [activeInput]);

  useEffect(() => {
    const userLocalStorageData = localStorage.getItem('psymax-user-data');
    if (userLocalStorageData !== 'undefined') {
      const userData = JSON.parse(userLocalStorageData);
      if (!userData?.Chiffre) {
        router.push('/dashboard/kontoeinstellungen');
      }
    }
    setPage({ ...page, pagenum: 1, total: 0 });
    setJustificationData(1);
  }, [search]);

  return (
    <AppLayout>
      <Grid container sx={{ mb: 4, alignItems: 'center' }} spacing={2}>
        <JustificationSection />
        <AddJustification addJustification={addJustification} />
        <JustificationInput search={search} setSearch={setSearch} />
      </Grid>

      <JustificationList
        justificationDetails={justificationDetails}
        page={page}
        inputRefs={inputRefs}
        handleEdit={handleEdit}
        handleChange={handleChange}
        handleBlur={handleBlur}
        setOpen={setOpen}
        setDeleteData={setDeleteData}
      />

      <AddReason addJustification={addJustification} />

      <Grid container sx={{ mt: 3, alignItems: 'center' }}>
        <Return router={router} />
        <Pagination page={page} setJustificationData={setJustificationData} />
        <Submit handleSubmit={handleSubmit} />
      </Grid>
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
};

export default PrivateRoute(JustificationPage);
