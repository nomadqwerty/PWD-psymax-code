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
import clientContext from '@/context/client.context';
import {
  deriveAllKeys,
  encryptData,
  passwordGenerator,
} from '@/utils/utilityFn';
import {
  CipherHeader,
  PersonalData,
  SupervisingDoctorInfo,
} from '../../../components/client/add/HeadersAndInfo';
import {
  CipherInput,
  DateSelect,
  Diagnosis,
  Email,
  Firm,
  FirstName,
  Land,
  LastName,
  Location,
  PhoneNumber,
  PostCode,
  Salutation,
  StreetAndHouseNumber,
  Title,
} from '../../../components/client/add/InputsAndButtons';
import {
  Confirm,
  DoctorEmail,
  DoctorFirstName,
  DoctorLand,
  DoctorLastName,
  DoctorLocation,
  DoctorPhoneNumber,
  DoctorPostCode,
  DoctorSalutation,
  DoctorStreetAndHouseNumber,
  DoctorTitle,
  Remove,
} from '../../../components/client/add/InputsAndButtonsB';

import vaultContext from '@/context/vault.context';

const ClientAddEdit = React.memo(() => {
  const params = useParams();

  const { vaultState } = useContext(vaultContext);
  const { clientState } = useContext(clientContext);
  //
  const {
    fileVault,
    clientVault,
    serverVault,
    updateFileVault,
    updateClientVault,
    setUpdateClientVault,
  } = vaultState;

  const {
    activeKlients,
    setActiveKlients,
    archivedKlients,
    setArchivedKlients,
    newKlients,
    setNewKlients,
  } = clientState;

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm();

  const [editData, setEditData] = useState({});
  const [isEdit, setIsEdit] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setEditData((prevData) => ({ ...prevData, [name]: value }));
    setValue(name, value, { shouldValidate: true });
  };

  const handleDiagnose = (values) => {
    setEditData((prevData) => ({
      ...prevData,
      Diagnose: values,
    }));

    setValue('Diagnose', values, { shouldValidate: true });
  };

  const handleDOBChange = (e) => {
    const date = new Date(e);
    if (!isNaN(date.getTime())) {
      const year = date.getFullYear().toString();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');

      let constfinalDate = `${year}-${month}-${day}T00:00:00.000Z`;

      setEditData((prevData) => ({
        ...prevData,
        ['Geburtsdatum']: constfinalDate,
      }));
      setValue('Geburtsdatum', constfinalDate, { shouldValidate: true });
      handleBlur(date, 'Geburtsdatum');
    }
  };

  const setDefaultValues = (responseData, flg = 0) => {
    const excludeFields = ['status', 'createdAt', 'ArztId', 'userId', '_id'];
    for (const field in responseData) {
      if (!excludeFields.includes(field)) {
        if (flg) {
          let ff = field;
          if (ff === 'email') {
            ff = 'Email';
          }
          setValue('Arzt' + ff, responseData?.[field], {
            shouldValidate: true,
          });
        } else {
          setValue(field, responseData[field], {
            shouldValidate: true,
          });
        }
      }
    }
  };

  const handleBlur = async (e, name) => {
    try {
      // if (!editData?.Chiffre) {
      const Vorname = name === 'Vorname' ? e?.target?.value : editData?.Vorname;
      const Nachname =
        name === 'Nachname' ? e?.target?.value : editData?.Nachname;
      const Geburtsdatum = name === 'Geburtsdatum' ? e : editData?.Geburtsdatum;
      if (Vorname && Nachname && Geburtsdatum) {
        const data = {
          Vorname: Vorname,
          Nachname: Nachname,
          Geburtsdatum: Geburtsdatum,
        };
        const response = await axiosInstance.post('/klient/getChiffre', data);
        setEditData((prevData) => ({
          ...prevData,
          ['Chiffre']: response?.data?.data,
        }));
        setValue('Chiffre', response?.data?.data, { shouldValidate: true });
      }
      // }
    } catch (error) {
      handleApiError(error, router);
    }
  };

  const onSubmit = async (data) => {
    try {
      let response;
      // TODO: encrypt client data fields.
      // perform checks if data exists.
      // encrypt client using client password+client salt.
      // store client password in vault.
      const operations = window.crypto.subtle || window.crypto.webkitSubtle;
      let serverVaultLength = Object.keys(serverVault).length;
      let userData = localStorage.getItem('psymax-user-data');
      if (serverVaultLength > 0 && userData) {
        userData = JSON.parse(userData);

        let pass = passwordGenerator();
        let ePass = userData.emergencyPassword;
        let dualKeySalt = serverVault.dualKeySalt;
        let masterKeySalt = serverVault.masterKeySalt;

        let allKeys = await deriveAllKeys(
          pass,
          ePass,
          dualKeySalt,
          masterKeySalt,
          window
        );
        let clientKeys = await deriveAllKeys(
          userData.password,
          ePass,
          dualKeySalt,
          masterKeySalt,
          window
        );
        let keysLength = Object.keys(allKeys).length;
        let clientKeyLength = Object.keys(clientKeys).length;
        if (keysLength > 0 && clientKeyLength > 0) {
          const { masterKey, iv } = allKeys;

          const fieldsToEncrypt = [
            'Anrede',
            'Titel',
            'Firma',
            'Vorname',
            'Nachname',
            'Strasse_und_Hausnummer',
            'PLZ',
            'Ort',
            'Land',
            'Diagnose',
            'Geburtsdatum',
            'ArztTitel',
            'ArztAnrede',
            'ArztVorname',
            'ArztNachname',
            'ArztStrasse_und_Hausnummer',
            'ArztPLZ',
            'ArztOrt',
            'ArztLand',
          ];
          for (let i = 0; i < fieldsToEncrypt.length; i++) {
            const dataField = data[fieldsToEncrypt[i]];
            const encField = await encryptData(
              operations,
              masterKey,
              iv,
              dataField
            );
            const uintField = new Uint8Array(encField);
            const arrayField = Array.from(uintField);
            data[fieldsToEncrypt[i]] = arrayField;
          }
          if (isEdit) {
            data.id = params?.id;
            delete data?.Chiffre;
            delete data?.userChiffre;
            // response = await axiosInstance.put('/klient/update', data);
          } else {
            data.isEncrypted = true;
            console.log(data);
            response = await axiosInstance.post('/klient/save', data);
            // TODO: Add client key and id to client vault

            let updateVault = {
              data: [
                ...clientVault.data,
                {
                  clientId: response.data.data._id,
                  clientKey: pass,
                },
              ],
              type: 'update',
            };

            setUpdateClientVault(updateVault);

            const vaultEnc = await encryptData(
              operations,
              clientKeys.masterKey,
              clientKeys.iv,
              updateVault
            );
            console.log(vaultEnc);
            let clientUpdateUint = new Uint8Array(vaultEnc);
            console.log(clientUpdateUint);
            let clientVaultRes = await axiosInstance.post(
              `/vault/user/update/main`,
              {
                userId: userData._id,
                type: 'update',
                clients: Array.from(clientUpdateUint),
                vault: 'client',
              }
            );
            console.log(clientVaultRes);
          }
        }

        // TODO: encrypt client data fields.

        if (response?.status === 200) {
          const responseData = response?.data;
          toast.success(responseData?.message);
          router.push('/dashboard/klientinnen');
        }
      }
    } catch (error) {
      handleApiError(error, router);
    }
  };

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
            '/klient/getById/' + params?.id
          );
          const responseData = response?.data?.data;
          const ArztData = responseData?.ArztId;
          setDefaultValues(responseData?.ArztId, 1);
          delete responseData?.ArztId;
          setDefaultValues(responseData);

          delete ArztData?._id;
          delete ArztData?.createdAt;
          const email = ArztData?.email;
          delete ArztData?.email;
          ArztData.Email = email;

          const modifiedArzt = {};
          for (const key in ArztData) {
            modifiedArzt[`Arzt${key}`] = ArztData[key];
          }

          setEditData({ ...responseData, ...modifiedArzt });
        } catch (error) {
          handleApiError(error, router);
        }
      }
      fetchData();
    }
  }, [params]);

  useEffect(() => {
    if (params?.id) {
      let clients = [...activeKlients, ...archivedKlients, ...newKlients];
      if (clients.length > 0) {
        clients.forEach((client) => {
          if (client._id === params.id) {
            if (client.isEncrypted) {
              // TODO: decrypt client
            } else {
              console.log('client is not encrypted.');
            }
          }
        });
      }
    }
  }, [params]);

  const agreeModel = async () => {
    try {
      setOpen(!open);
      const response = await axiosInstance.delete(
        `/klient/remove/${params?.id}`
      );
      if (response?.status === 200) {
        router.push('/dashboard/klientinnen');
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

  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  // Define the spacing based on the screen size
  const spacing = isMobile ? 0 : 2;

  return (
    <AppLayout>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CipherHeader editData={editData} />
        {/* chiffre */}

        <PersonalData />
        {/* personliche Angaben */}

        <Grid container spacing={spacing}>
          <CipherInput
            isEdit={isEdit}
            register={register}
            errors={errors}
            editData={editData}
            handleChange={handleChange}
          />
          {/* chiffre input */}

          <Salutation
            Controller={Controller}
            control={control}
            register={register}
            errors={errors}
            setValue={setValue}
            editData={editData}
            handleChange={handleChange}
          />
          {/* andrede */}

          <Title
            register={register}
            errors={errors}
            editData={editData}
            handleChange={handleChange}
          />
          {/* title */}
        </Grid>
        <Grid container spacing={spacing}>
          <Firm
            register={register}
            errors={errors}
            editData={editData}
            handleChange={handleChange}
          />
          {/* firma */}
        </Grid>
        <Grid container spacing={spacing}>
          <FirstName
            register={register}
            errors={errors}
            editData={editData}
            handleChange={handleChange}
            handleBlur={handleBlur}
          />
          {/* vorname */}

          <LastName
            register={register}
            errors={errors}
            editData={editData}
            handleChange={handleChange}
            handleBlur={handleBlur}
          />

          {/* nachname */}
        </Grid>

        <Grid container spacing={spacing}>
          <StreetAndHouseNumber
            register={register}
            errors={errors}
            editData={editData}
            handleChange={handleChange}
          />
          {/* strasse und hausnummer */}

          <PostCode
            register={register}
            errors={errors}
            editData={editData}
            handleChange={handleChange}
          />
          {/* PLZ */}
        </Grid>
        <Grid container spacing={spacing}>
          <Location
            register={register}
            errors={errors}
            editData={editData}
            handleChange={handleChange}
          />
          {/* Ort */}

          <Land
            register={register}
            errors={errors}
            editData={editData}
            handleChange={handleChange}
          />
          {/* land */}
        </Grid>

        <Grid container spacing={spacing}>
          <Email
            register={register}
            errors={errors}
            editData={editData}
            handleChange={handleChange}
          />
          <PhoneNumber
            register={register}
            errors={errors}
            editData={editData}
            handleChange={handleChange}
          />
          {/* email telefon */}
        </Grid>

        <Grid container spacing={spacing}>
          <Diagnosis
            register={register}
            errors={errors}
            editData={editData}
            handleDiagnose={handleDiagnose}
          />
          <DateSelect
            register={register}
            errors={errors}
            editData={editData}
            handleDOBChange={handleDOBChange}
            handleBlur={handleBlur}
          />
          {/* diagnosis geburtsdatum */}
        </Grid>

        <SupervisingDoctorInfo spacing={spacing} />
        {/*Angaben zum Betreuenden Arzt  */}

        {/*  */}

        <Grid container spacing={spacing}>
          <DoctorSalutation
            register={register}
            errors={errors}
            editData={editData}
            handleChange={handleChange}
          />
          <DoctorTitle
            Controller={Controller}
            control={control}
            register={register}
            errors={errors}
            setValue={setValue}
            editData={editData}
            handleChange={handleChange}
          />
          {/* artztitel artzandere */}
        </Grid>
        <Grid container spacing={spacing}>
          <DoctorFirstName
            register={register}
            errors={errors}
            editData={editData}
            handleChange={handleChange}
          />
          <DoctorLastName
            register={register}
            errors={errors}
            editData={editData}
            handleChange={handleChange}
          />
          {/* artzvorname artznachname */}
        </Grid>

        <Grid container spacing={spacing}>
          <DoctorStreetAndHouseNumber
            register={register}
            errors={errors}
            editData={editData}
            handleChange={handleChange}
          />
          <DoctorPostCode
            register={register}
            errors={errors}
            editData={editData}
            handleChange={handleChange}
          />
          {/* artz strass und hausenummer, artz plz */}
        </Grid>
        <Grid container spacing={spacing}>
          <DoctorLocation
            register={register}
            errors={errors}
            editData={editData}
            handleChange={handleChange}
          />
          <DoctorLand
            register={register}
            errors={errors}
            editData={editData}
            handleChange={handleChange}
          />
          {/* artz ort artz land */}
        </Grid>

        <Grid container spacing={spacing}>
          <DoctorEmail
            register={register}
            errors={errors}
            editData={editData}
            handleChange={handleChange}
          />
          <DoctorPhoneNumber
            register={register}
            errors={errors}
            editData={editData}
            handleChange={handleChange}
          />
          {/* artz email telefone */}
        </Grid>

        <Grid container sx={{ mt: 4 }}>
          <Remove isEdit={isEdit} setOpen={setOpen} />
          <Confirm isSubmitting={isSubmitting} />
          {/* entfernen bestatigen */}
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
export default PrivateRoute(ClientAddEdit);
