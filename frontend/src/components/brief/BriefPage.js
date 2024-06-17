'use client';
import React, { useContext, useEffect, useRef, useState } from 'react';
import AppLayout from '../../components/AppLayout';
import { Controller, useForm } from 'react-hook-form';
import { Grid, useMediaQuery } from '@mui/material';
import { handleApiError } from '../../utils/apiHelpers';
import { useRouter } from 'next/navigation';
import axiosInstance from '../../utils/axios';
import dynamic from 'next/dynamic';
import ModelDialogue from '../../components/Dialog/ModelDialogue';
import { AuthContext } from '../../context/auth.context';
import { useParams } from 'next/navigation';
import { KlientContext } from '../../context/klient.context';
import PrivateRoute from '../../components/PrivateRoute';
import { BriefHeader, Options } from '../../components/brief/HeadersAndInfo';
import vaultContext from '../../context/vault.context';
import Worker from 'worker-loader!./briefUtils/briefWorker';
import toast from 'react-hot-toast';

import {
  Cancel,
  Confirm,
  LetterEditor,
  LetterTemplate,
  Recipient,
  Reference,
  SignatureFieldA,
  SignatureFieldB,
} from '../../components/brief/InputsAndButtons';

const BriefPage = React.memo(() => {
  const params = useParams();
  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const { state } = useContext(AuthContext);
  const { state: klientState, dispatch: klientDispatch } =
    useContext(KlientContext);
  const { vaultState } = useContext(vaultContext);

  const router = useRouter();
  const [empfaenger, setEmpfaenger] = useState({});
  const [templates, setTemplates] = useState([]);
  const [briefData, setBriefData] = useState({
    Empfaenger: 'klient',
    Briefvorlage: 'none',
  });
  const [open, setOpen] = useState(false);
  const editor = useRef(null);

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

  const getKlientById = async () => {
    try {
      const response = await axiosInstance.get(`klient/getById/${params?.id}`);
      const responseData = response?.data?.data;
      if (responseData?._id) {
        // console.log(responseData);
        const operations = window.crypto.subtle || window.crypto.webkitSubtle;
        let serverVaultLength = Object.keys(serverVault).length;
        let userData = localStorage.getItem('psymax-user-data');
        if (serverVaultLength > 0 && userData) {
          userData = JSON.parse(userData);
          // console.log(userData);
          let ePass = userData.emergencyPassword;
          let pass;
          let dualKeySalt = serverVault.dualKeySalt;
          let masterKeySalt = serverVault.masterKeySalt;
          // console.log(updateClientVault);
          // console.log(clientVault);
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
          // console.log(pass);
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

            setEmpfaenger(decryptedData.setEmpfaenger);
            toast.success('Patientendaten erfolgreich entschlüsselt');
          };
        }
      }
    } catch (error) {
      handleApiError(error, router);
    }
  };

  const getTemplates = async () => {
    try {
      const response = await axiosInstance.get(`templates/getBriefAll`);
      const responseData = response?.data?.data;
      setTemplates(responseData);
    } catch (error) {
      handleApiError(error, router);
    }
  };

  useEffect(() => {
    if (params?.id) {
      getTemplates();
      handleEmpfaenger('klient');
      getKlientById(params?.id);
      const index = klientState?.brief?.indexOf(params?.id);

      if (index !== -1) {
        klientState?.brief.splice(index, 1);
      }
      klientDispatch({
        type: 'BRIEF',
        payload: {
          brief: klientState?.brief,
        },
      });
    }
  }, [params, clientVault, serverVault]);

  const handleChange = (name, value) => {
    const update = { ...briefData };
    update[name] = value;
    setBriefData(update);
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
    // console.log(value);
    if (value !== 'none') {
      if (briefData?.Empfaenger) {
        handleChange('Briefvorlage', value);
        setInhaltCommon(value, briefData?.Empfaenger);
      } else {
        setValue('Empfaenger', '', {
          shouldValidate: true,
        });
      }
    } else {
      handleChange('Briefvorlage', value);
      setBriefData((prev) => {
        return {
          ...prev,
          Betreff: '',
          Inhalt: '',
        };
      });

      setValue('Betreff', '', {
        shouldValidate: false,
      });

      setValue('Inhalt', '', {
        shouldValidate: false,
      });
    }
  };

  const handleEmpfaenger = (value) => {
    handleChange('Empfaenger', value);

    const Unterschriftsfeld1 = `${state?.userData?.Titel || ''} ${
      state?.userData?.Vorname || ''
    } ${state?.userData?.Nachname || ''}`;
    const Unterschriftsfeld2 = `${state?.userData?.Berufsbezeichnung || ''}`;
    setValue('Unterschriftsfeld1', Unterschriftsfeld1, {
      shouldValidate: true,
    });
    setValue('Unterschriftsfeld2', Unterschriftsfeld2, {
      shouldValidate: Unterschriftsfeld2 || false,
    });

    setBriefData((prev) => {
      return {
        ...prev,
        Unterschriftsfeld1: Unterschriftsfeld1,
        Unterschriftsfeld2: Unterschriftsfeld2,
      };
    });

    if (briefData?.Briefvorlage !== 'none') {
      setInhaltCommon(briefData?.Briefvorlage, value);
    }
  };

  const setInhaltCommon = (value, Empfaenger) => {
    const selectedTemp = templates.find((obj) => obj.templateId === value);

    const empfaengerData =
      Empfaenger === 'arzt' ? empfaenger?.ArztId : empfaenger;
    const dateObject = new Date(empfaenger?.Geburtsdatum);
    const Geburtsdatum = `${dateObject
      .getUTCDate()
      .toString()
      .padStart(2, '0')}.${(dateObject.getUTCMonth() + 1)
      .toString()
      .padStart(2, '0')}.${dateObject.getUTCFullYear().toString().slice(-2)}`;

    const variables = {
      KlientVorname: empfaengerData?.Vorname,
      KlientNachname: empfaengerData?.Nachname,
      KlientGebDatum: Geburtsdatum,
      KlientOrt: empfaengerData?.Ort,
      KlientPlz: empfaengerData?.PLZ,
      KlientStrasse: empfaengerData?.Strasse_und_Hausnummer,
    };

    const inhalt = replaceVariables(selectedTemp?.content, variables);

    setBriefData((prev) => {
      return {
        ...prev,
        Betreff: selectedTemp?.subject,
        Inhalt: inhalt,
      };
    });

    setValue('Betreff', selectedTemp?.subject, {
      shouldValidate: true,
    });

    setValue('Inhalt', inhalt, {
      shouldValidate: true,
    });
  };

  const handleBriefAction = async (option) => {
    try {
      let finalId =
        briefData?.Empfaenger === 'klient'
          ? params?.id
          : empfaenger?.ArztId?._id;
      const data = {
        id: finalId,
        Templete: String(briefData?.Briefvorlage),
        Betreff: briefData?.Betreff,
        Inhalt: briefData?.Inhalt,
        Unterschriftsfeld1: briefData?.Unterschriftsfeld1,
        Unterschriftsfeld2: briefData?.Unterschriftsfeld2,
        OptionSelected: option,
      };
      const response = await axiosInstance.post(`brief/save`, data);
      const responseData = response?.data?.data;
      // console.log(responseData);
      if (responseData) {
        let userData = localStorage.getItem('psymax-user-data');

        const briefWorker = new Worker();
        const psymaxToken = localStorage.getItem('psymax-token');
        toast('PDF verschlüsseln, Download vorbereiten.');
        briefWorker.postMessage({
          type: 'encryptClientBrief',
          data: JSON.stringify({
            responseData,
            serverVault,
            userData,
            fileVault,
            storeFile,
          }),
        });

        briefWorker.onmessage = (message) => {
          const encryptedData = JSON.parse(message.data);

          let data = new Uint8Array(encryptedData.file).buffer;
          let downloadFile = new Blob([data]);
          setStoreFile(encryptedData.setStoreFile);
          setUpdateFileVault(encryptedData.setUpdateFileVault);
          setFileVault(encryptedData.setFileVault);
          //  Trigger file download.
          // on return.
          toast.success(
            'Verschlüsselte PDF-Datei erfolgreich, jetzt herunterladen'
          );
          let elem = window.document.createElement('a');
          elem.href = window.URL.createObjectURL(downloadFile);
          elem.download = encryptedData.fileName;
          // console.log('here');

          elem.click();
        };
      }

      // if (klientState?.brief?.length > 0) {
      //   router.push(`/dashboard/brief/${klientState?.brief?.[0]}`);
      // } else {
      //   router.push('/dashboard/klientinnen');
      // }
      // setOpen(false);
      // setBriefData({
      //   Empfaenger: '',
      //   Briefvorlage: 'none',
      // });
      // reset();
    } catch (error) {
      handleApiError(error, router);
    }
  };

  const onSubmit = (data) => {
    // console.log(data);
    setOpen(true);
  };

  const DynamicJoditEditor = dynamic(() => import('jodit-react'), {
    ssr: false,
  });

  const closeModel = () => {
    setOpen(false);
  };

  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  // Define the spacing based on the screen size
  const spacing = isMobile ? 0 : 2;

  // {Options}
  return (
    <AppLayout>
      <form onSubmit={handleSubmit(onSubmit)}>
        <BriefHeader />
        {/* brief */}

        <Grid container spacing={spacing}>
          <Recipient
            Controller={Controller}
            control={control}
            register={register}
            errors={errors}
            handleEmpfaenger={handleEmpfaenger}
          />
          {/* emphaenger */}
          <LetterTemplate
            Controller={Controller}
            control={control}
            register={register}
            briefData={briefData}
            errors={errors}
            templates={templates}
            handleBriefvorlageChange={handleBriefvorlageChange}
          />
          {/* briefvorlage */}
        </Grid>

        <Grid container spacing={spacing}>
          <Reference
            register={register}
            errors={errors}
            briefData={briefData}
            handleChange={handleChange}
          />
          {/* betreff */}
        </Grid>

        <Grid container spacing={spacing}>
          <LetterEditor
            Controller={Controller}
            control={control}
            register={register}
            editor={editor}
            handleChange={handleChange}
            errors={errors}
          />
          {/* letterEditor */}
        </Grid>

        <Grid container spacing={spacing}>
          <SignatureFieldA
            register={register}
            errors={errors}
            briefData={briefData}
            handleChange={handleChange}
          />
          {/* unterschriftsfeld1 */}
        </Grid>

        <Grid container spacing={spacing}>
          <SignatureFieldB
            register={register}
            errors={errors}
            briefData={briefData}
            handleChange={handleChange}
          />
          {/* unterschriftsfeld2 */}
        </Grid>

        <Grid container spacing={spacing} sx={{ mt: 6 }}>
          <Cancel router={router} />
          {/* delete */}
          <Confirm isSubmitting={isSubmitting} />
          {/* bestatigen */}
        </Grid>
      </form>

      <ModelDialogue
        open={open}
        setOpen={setOpen}
        actionTitle={'Brief'}
        confirmationText={
          'Möchten Sie die Anlage(n) als PDF exportieren oder an den Empfänger versenden?'
        }
        agreeModel={() => console.log('hidden')}
        closeModel={closeModel}
        cancelHide={false}
        submitHide={true}
      >
        <Options handleBriefAction={handleBriefAction}></Options>
      </ModelDialogue>
    </AppLayout>
  );
});
export default PrivateRoute(BriefPage);
