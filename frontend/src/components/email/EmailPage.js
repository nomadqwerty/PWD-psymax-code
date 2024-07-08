'use client';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import AppLayout from '../../components/AppLayout';
import { Controller, useForm } from 'react-hook-form';
import { Grid, useMediaQuery } from '@mui/material';
import { handleApiError } from '../../utils/apiHelpers';
import { useRouter } from 'next/navigation';
import axiosInstance from '../../utils/axios';
import FileUpload from '../../components/FileUpload';
import { KlientContext } from '../../context/klient.context';
import PrivateRoute from '../../components/PrivateRoute';
import { EmailHeader } from '../../components/email/HeadersAndInfo';
import vaultContext from '../../context/vault.context';
import Worker from 'worker-loader!../brief/briefUtils/briefWorker';
import toast from 'react-hot-toast';

import {
  Cancel,
  EmailEditor,
  FileUploader,
  LetterTemplate,
  Reference,
  SendEmail,
} from '../../components/email/InputsAndButtons';

const EmailPage = React.memo(() => {
  const params = useParams();
  const {
    register,
    handleSubmit,
    control,
    setValue,
    getValues,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const router = useRouter();
  const [templates, setTemplates] = useState([]);
  const [klient, setKlient] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [selectedBriefvorlage, setSelectedBriefvorlage] = useState('');
  const editor = useRef(null);
  const { state: klientState, dispatch: klientDispatch } =
    useContext(KlientContext);
  const { vaultState } = useContext(vaultContext);
  const {
    fileVault,
    clientVault,
    updateClientVault,
    setFileVault,
    serverVault,
    setUpdateFileVault,
    storeFile,
    setStoreFile,
  } = vaultState;

  const getTemplates = async () => {
    try {
      const response = await axiosInstance.get(`templates/getBriefAll`);
      const responseData = response?.data?.data;
      setTemplates(responseData);
    } catch (error) {
      handleApiError(error, router);
    }
  };

  const getKlientById = async () => {
    try {
      const response = await axiosInstance.get('/klient/getById/' + params?.id);
      const responseData = response?.data?.data;
      if (responseData?._id) {
        // // console.log(responseData);
        const operations = window.crypto.subtle || window.crypto.webkitSubtle;
        let serverVaultLength = Object.keys(serverVault).length;
        let userData = localStorage.getItem('psymax-user-data');
        if (serverVaultLength > 0 && userData) {
          userData = JSON.parse(userData);
          // // console.log(userData);
          let ePass = userData.emergencyPassword;
          let pass;
          let dualKeySalt = serverVault.dualKeySalt;
          let masterKeySalt = serverVault.masterKeySalt;
          // // console.log(updateClientVault);
          // // console.log(clientVault);
          if (params?.id) {
            if (clientVault?.data?.length > 0) {
              clientVault.data.forEach((vault) => {
                // console.log('main vault');
                let clientId = vault.clientId;
                let clientKey = vault.clientKey;
                if (params.id === clientId) {
                  pass = clientKey;
                }
              });
            }
            if (updateClientVault?.data?.length > 0 && !pass) {
              updateClientVault.data.forEach((vault) => {
                // console.log('update vault');
                let clientId = vault.clientId;
                let clientKey = vault.clientKey;
                if (params.id === clientId) {
                  pass = clientKey;
                }
              });
            }
          }
          // // console.log(pass);
          const briefWorker = new Worker();
          const psymaxToken = localStorage.getItem('psymax-token');
          toast('Patientendaten entschlüsseln');
          briefWorker.postMessage({
            type: 'decryptClient',
            data: JSON.stringify({
              responseData,
              pass,
              ePass,
              dualKeySalt,
              masterKeySalt,
            }),
          });

          briefWorker.onmessage = (message) => {
            const decryptedData = JSON.parse(message.data);

            setKlient(decryptedData.setEmpfaenger);
            toast.success('Patientendaten erfolgreich entschlüsselt');
          };
        }
      }
      // setKlient(responseData);
    } catch (error) {
      handleApiError(error, router);
    }
  };

  const handleChange = (name, value) => {
    setValue(name, value, {
      shouldValidate: true,
    });
  };

  const replaceVariables = (content, variables) => {
    return content.replace(/\{\{(\w+)\}\}/g, (match, variableName) => {
      return variables[variableName] || match;
    });
  };

  const handleBriefvorlageChange = (value) => {
    if (value !== 'none') {
      handleChange('Briefvorlage', value);
      const selectedTemp = templates.find((obj) => obj.templateId === value);

      const dateObject = new Date(klient?.Geburtsdatum);
      const Geburtsdatum = `${dateObject
        .getUTCDate()
        .toString()
        .padStart(2, '0')}.${(dateObject.getUTCMonth() + 1)
        .toString()
        .padStart(2, '0')}.${dateObject.getUTCFullYear().toString().slice(-2)}`;

      const variables = {
        KlientVorname: klient?.Vorname,
        KlientNachname: klient?.Nachname,
        KlientGebDatum: Geburtsdatum,
        KlientOrt: klient?.Ort,
        KlientPlz: klient?.PLZ,
        KlientStrasse: klient?.Strasse_und_Hausnummer,
      };

      const inhalt = replaceVariables(selectedTemp?.content, variables);

      setValue('Betreff', selectedTemp?.subject, {
        shouldValidate: true,
      });
      setValue('Inhalt', inhalt, {
        shouldValidate: true,
      });
    } else {
      handleChange('Briefvorlage', value);
      setValue('Betreff', '', {
        shouldValidate: false,
      });

      setValue('Inhalt', '', {
        shouldValidate: false,
      });
    }
  };

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      uploadedFiles.forEach((file) => {
        formData.append('attachments', file);
      });
      formData.append('Betreff', data?.Betreff);
      formData.append(
        'Briefvorlage',
        data?.Briefvorlage !== 'none' ? data?.Briefvorlage : ''
      );
      formData.append('Inhalt', data?.Inhalt);
      formData.append('KlientId', params?.id);

      const response = await axiosInstance.post('/email/send', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response?.status === 200) {
        if (klientState?.email?.length > 0) {
          router.push(`/dashboard/email/${klientState?.email?.[0]}`);
        } else {
          router.push('/dashboard/klientinnen');
        }
        reset();
        setSelectedBriefvorlage('');
        reset({
          Briefvorlage: '',
        });
        setUploadedFiles([]);
      }
    } catch (error) {
      handleApiError(error, router);
    }
  };

  const deleteFile = (index) => {
    const files = [...uploadedFiles];
    files.splice(index, 1);
    setUploadedFiles([...files]);
  };

  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  // Define the spacing based on the screen size
  const spacing = isMobile ? 0 : 2;

  useEffect(() => {
    if (params?.id) {
      getTemplates();
      getKlientById(params?.id);
      const index = klientState?.email?.indexOf(params?.id);

      if (index !== -1) {
        klientState?.email.splice(index, 1);
      }
      klientDispatch({
        type: 'EMAIL',
        payload: {
          email: klientState?.email,
        },
      });
    }
  }, [params]);

  return (
    <AppLayout>
      <form onSubmit={handleSubmit(onSubmit)}>
        <EmailHeader />
        {/* email */}

        <Grid container spacing={spacing}>
          <Reference
            register={register}
            errors={errors}
            getValues={getValues}
            handleChange={handleChange}
          />
          {/* betreff */}
          <LetterTemplate
            Controller={Controller}
            control={control}
            errors={errors}
            register={register}
            setSelectedBriefvorlage={setSelectedBriefvorlage}
            handleBriefvorlageChange={handleBriefvorlageChange}
            selectedBriefvorlage={selectedBriefvorlage}
            templates={templates}
          />
          {/* breifVorlage */}
        </Grid>

        <Grid container spacing={spacing}>
          <Grid item xs={12} sm={12} md={12} xl={12}></Grid>
        </Grid>

        <Grid container spacing={spacing}>
          <EmailEditor
            Controller={Controller}
            control={control}
            register={register}
            editor={editor}
            handleChange={handleChange}
            getValues={getValues}
            errors={errors}
          />
          {/* dynamic editor */}
        </Grid>

        <FileUploader
          FileUpload={FileUpload}
          uploadedFiles={uploadedFiles}
          setUploadedFiles={setUploadedFiles}
          deleteFile={deleteFile}
          spacing={spacing}
        />
        {/* file upload */}

        <Grid container spacing={spacing} sx={{ mt: 6 }}>
          <Cancel router={router} />
          {/* abbrechen */}
          <SendEmail isSubmitting={isSubmitting} />
          {/* email absenden */}
        </Grid>
      </form>
    </AppLayout>
  );
});
export default PrivateRoute(EmailPage);
