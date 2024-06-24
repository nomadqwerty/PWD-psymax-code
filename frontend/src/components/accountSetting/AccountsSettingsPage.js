'use client';
import {
  Grid,
  useMediaQuery,
  RadioGroup,
  FormLabel,
  FormControlLabel,
} from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import React, { useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { AuthContext } from '../../context/auth.context';
import { IMAGEURL, SOMETHING_WRONG } from '../../utils/constants';
import axiosInstance from '../../utils/axios';
import AppLayout from '../../components/AppLayout';
import { handleApiError } from '../../utils/apiHelpers';
import PrivateRoute from '../../components/PrivateRoute';
import kontoContext from '../../context/konto.context';

// components
import TitleInput from '../../components/accountSetting/TitleInput';
import DatePicker from '../../components/accountSetting/DatePicker';
import NameInput from '../../components/accountSetting/NameInput';
import PhoneNumberInput from '../../components/accountSetting/PhoneNumberInput';
import Website from '../../components/accountSetting/Website';
import JobTitle from '../../components/accountSetting/JobTitle';
import {
  PracticeInput,
  PracticeDescInput,
} from '../../components/accountSetting/Practice';
import Logo from '../../components/accountSetting/Logo';
import PrimaryColorInput from '../../components/accountSetting/PrimaryColor';
import { Address, Location } from '../../components/accountSetting/Address';
import {
  BankName_Bic,
  Iban,
} from '../../components/accountSetting/BankDetails';
import {
  InvoiceEmail,
  SalesTax,
} from '../../components/accountSetting/InvoiceEmailAndSalesTax';

import TaxNumAndPostCode from './TaxNumber';

import {
  Email,
  Password,
} from '../../components/accountSetting/EmailAndPassword';
import { TwoFA } from '../../components/accountSetting/TwoFA';
import SubmitBtn from '../../components/accountSetting/SubmitBtn';

import {
  AccountSetting,
  Empfehlungsprogramm,
  Personliche,
  Praxisangaben,
  Rechnungsanschrift,
  Bankangaben,
  Abrechnungsangaben,
  Emailadresse,
  Kontodaten,
  TwoFaktorAuthentifizierung,
  TwoFaktorMessage,
} from '../../components/accountSetting/SectionHeaders';

//

const AccountSettingsPage = React.memo(() => {
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

  const context = useContext(kontoContext);
  const { kontoData, setKontoData } = context.menuState;
  const [oldPassword, setOldPassword] = useState('');
  const [logoName, setLogoName] = useState('');
  const [iban, setIban] = useState('');
  const router = useRouter();
  const { state, dispatch } = useContext(AuthContext);
  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setKontoData((prevData) => ({ ...prevData, [name]: value }));
    setValue(name, value, { shouldValidate: true });
  };
  /*handleChange,setKontoData, setValue*/

  const handleIbanChange = (e) => {
    const value = e.target.value.replace(/\s/g, ''); // Remove spaces

    if (value) {
      const limit = value.replace(/\s/g, '').length;
      if (limit <= 22) {
        const formattedValue = value.match(/.{1,4}/g).join(' ');
        setValue('IBAN', formattedValue);
        setIban(formattedValue);
      }
    } else {
      setValue('IBAN', '');
      setIban('');
    }
  };

  const handleDOBChange = (e) => {
    const date = new Date(e);
    const year = date.getFullYear().toString();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');

    let constfinalDate = `${year}-${month}-${day}T00:00:00.000Z`;

    setKontoData((prevData) => ({
      ...prevData,
      ['Geburtsdatum']: constfinalDate,
    }));
    setValue('Geburtsdatum', constfinalDate, { shouldValidate: true });
  };

  const setDefaultValues = (fieldNames, data) => {
    fieldNames.forEach((fieldName) => {
      (fieldNames !== '_id' || fieldNames !== 'Logo') &&
        setValue(fieldName, data[fieldName] || '', { shouldValidate: true });
    });
  };

  const handleFileUpload = async (data) => {
    if (data?.Logo?.[0]) {
      const fileRes = await axiosInstance.post(
        '/saveLogo',
        { logo: data.Logo[0], deleteFile: kontoData?.Logo },
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (fileRes?.status === 200) {
        return fileRes?.data?.data;
      }
    }
    return null;
  };

  const onSubmit = async (data) => {
    try {
      const logo =
        typeof data?.Logo === 'object'
          ? await handleUploadLogo(data?.Logo[0])
          : false;
      let finalLogo = logoName;
      if (logo) {
        finalLogo = await handleFileUpload(data);
      }
      data.email = kontoData?.email;
      data.password = kontoData?.newPassword
        ? kontoData?.newPassword
        : oldPassword;
      data.confirmPassword = data?.password;

      const finalData = { ...kontoData, ...data };
      console.log(finalData);
      delete finalData?._id;
      delete finalData?.status;
      delete finalData?.newPassword;

      const finalDatas = {
        Anrede: finalData?.Anrede,
        Titel: finalData?.Titel,
        Vorname: finalData?.Vorname,
        Nachname: finalData?.Nachname,
        Geburtsdatum: finalData?.Geburtsdatum,
        Telefon: finalData?.Telefon,
        Website: finalData?.Website,
        Berufsbezeichnung: finalData?.Berufsbezeichnung,
        Praxistitel: finalData?.Praxistitel,
        Praxisbezeichnung: finalData?.Praxisbezeichnung,
        Praxisbeschreibung: finalData?.Praxisbeschreibung,
        Logo: finalLogo ? finalLogo : '',
        Primaerfarbe: finalData?.Primaerfarbe,
        Strasse_und_Hausnummer: finalData?.Strasse_und_Hausnummer,
        Ort: finalData?.Ort,
        Land: finalData?.Land,
        Steuernummer: finalData?.Steuernummer,
        PLZ: finalData?.PLZ,
        Bankname: finalData?.Bankname,
        BIC: finalData?.BIC,
        invoiceEmail: finalData?.invoiceEmail,
        StandardSalesTax: finalData?.StandardSalesTax,
        confirmPassword: finalData?.confirmPassword,
        Authentifizierungscode: finalData?.Authentifizierungscode,
        IBAN: finalData?.IBAN,
        TwoFaPermission: finalData?.TwoFaPermission,
        // password: finalData?.password,
      };
      // console.log(finalDatas);
      const response = await axiosInstance.post('/user/save', finalDatas);
      console.log(response);
      if (response?.status === 200) {
        const responseData = response?.data?.data;
        localStorage.setItem('psymax-loggedin', true);
        localStorage.setItem('psymax-token', responseData?.token);
        localStorage.setItem('psymax-user-data', JSON.stringify(responseData));
        localStorage.setItem('psymax-is-admin', responseData?.isAdmin);
        dispatch({
          type: 'LOGIN',
          payload: { isLoggedin: true, userData: responseData },
        });
        router.push('/dashboard');
      }
    } catch (error) {
      handleApiError(error, router);
    }
  };

  const handleUploadLogo = async (value) => {
    clearErrors('Logo');

    if (!value || value?.length <= 0) {
      return true; // No file selected, so no validation needed
    }

    // Check if the file type is allowed (png, svg)
    const allowedTypes = ['image/png', 'image/svg+xml'];
    const fileType = value?.type;

    if (fileType && allowedTypes.includes(fileType)) {
      // Check if the file size is less than or equal to 0.3 MB
      const maxSize = 0.3 * 1024 * 1024; // 0.3 MB in bytes
      const fileSize = value?.size;
      if (fileSize > maxSize) {
        setError('Logo', {
          type: 'manual',
          message: 'Ihre Datei ist zu groß (maximal 0.3 MB)',
        });
        return false;
      }
    } else {
      setError('Logo', {
        type: 'manual',
        message: 'Nur PNG und SVG Dateien sind erlaubt',
      });
      return false;
    }
    return true;
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axiosInstance.get(`/user/get`);
        const responseData = response?.data?.data;
        if (response?.status === 200) {
          if (responseData?.isAdmin === 1) {
            router.push('/admin');
          }
          setOldPassword(responseData.confirmPassword);
          responseData.confirmPassword = '';
          setIban(responseData?.IBAN);
          setKontoData(responseData);
          setLogoName(responseData?.Logo);
          setDefaultValues(Object.keys(responseData), responseData);
        } else {
          toast.error(SOMETHING_WRONG);
        }
      } catch (error) {
        handleApiError(error, router);
      }
    }
    const checkIsAdmin = localStorage.getItem('psymax-is-admin');
    if (checkIsAdmin === '1') {
      router.push('/admin');
    } else {
      fetchData();
    }
  }, []);

  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  // Define the spacing based on the screen size
  const spacing = isMobile ? 0 : 2;
  return (
    <AppLayout>
      <div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <AccountSetting />
          <Empfehlungsprogramm state={state} />
          {/* Personliche */}
          <Personliche />
          <Grid container spacing={spacing}>
            <TitleInput
              spacing={spacing}
              kontoData={kontoData}
              setKontoData={setKontoData}
              handleChange={handleChange}
              Controller={Controller}
              register={register}
              control={control}
              setValue={setValue}
              errors={errors}
            />
          </Grid>
          <Grid container spacing={spacing}>
            <NameInput
              spacing={spacing}
              kontoData={kontoData}
              setKontoData={setKontoData}
              handleChange={handleChange}
              register={register}
              errors={errors}
            />
          </Grid>
          <Grid container spacing={spacing}>
            <DatePicker
              kontoData={kontoData}
              setKontoData={setKontoData}
              handleDOBChange={handleDOBChange}
              register={register}
              errors={errors}
            />
            <PhoneNumberInput
              kontoData={kontoData}
              setKontoData={setKontoData}
              handleChange={handleChange}
              register={register}
              errors={errors}
            />
          </Grid>
          <Grid container spacing={spacing}>
            <Website
              kontoData={kontoData}
              setKontoData={setKontoData}
              handleChange={handleChange}
              register={register}
              errors={errors}
            />
            <JobTitle
              kontoData={kontoData}
              setKontoData={setKontoData}
              handleChange={handleChange}
              register={register}
              errors={errors}
            />
          </Grid>
          {/* Praxisangaben */}
          <Praxisangaben spacing={spacing} />
          <PracticeInput
            spacing={spacing}
            kontoData={kontoData}
            setKontoData={setKontoData}
            handleChange={handleChange}
            register={register}
            errors={errors}
          />
          <PracticeDescInput
            spacing={spacing}
            kontoData={kontoData}
            setKontoData={setKontoData}
            handleChange={handleChange}
            register={register}
            errors={errors}
          />
          <Logo
            kontoData={kontoData}
            setKontoData={setKontoData}
            handleUploadLogo={handleUploadLogo}
            register={register}
            errors={errors}
          />
          <PrimaryColorInput
            spacing={spacing}
            kontoData={kontoData}
            setKontoData={setKontoData}
            handleChange={handleChange}
            register={register}
            errors={errors}
          />
          {/* Rechnungsanschrift */}
          <Rechnungsanschrift spacing={spacing} />
          <Address
            spacing={spacing}
            kontoData={kontoData}
            setKontoData={setKontoData}
            handleChange={handleChange}
            register={register}
            errors={errors}
          />
          <Location
            spacing={spacing}
            kontoData={kontoData}
            setKontoData={setKontoData}
            handleChange={handleChange}
            register={register}
            errors={errors}
          />
          <TaxNumAndPostCode
            spacing={spacing}
            register={register}
            setValue={setValue}
            errors={errors}
            setKontoData={setKontoData}
            kontoData={kontoData}
          />
          <Grid container spacing={spacing}></Grid>
          {/*  Bankangaben */}
          <Bankangaben spacing={spacing} />

          <BankName_Bic
            spacing={spacing}
            kontoData={kontoData}
            setKontoData={setKontoData}
            handleChange={handleChange}
            register={register}
            errors={errors}
          />
          <Iban
            spacing={spacing}
            iban={iban}
            setIban={setIban}
            handleIbanChange={handleIbanChange}
            control={control}
            Controller={Controller}
            errors={errors}
          />
          {/* Abrechnungsangaben */}
          <Abrechnungsangaben spacing={spacing} />

          <InvoiceEmail
            spacing={spacing}
            kontoData={kontoData}
            setKontoData={setKontoData}
            handleChange={handleChange}
            register={register}
            errors={errors}
          />
          {/* Email message  */}
          <Emailadresse spacing={spacing} />

          <SalesTax
            spacing={spacing}
            kontoData={kontoData}
            setKontoData={setKontoData}
            handleChange={handleChange}
            register={register}
            errors={errors}
          />
          {/* Kontodaten */}
          <Kontodaten spacing={spacing} />
          <Email
            spacing={spacing}
            kontoData={kontoData}
            setKontoData={setKontoData}
            register={register}
          />
          {/* <Password
            spacing={spacing}
            kontoData={kontoData}
            setKontoData={setKontoData}
            handleChange={handleChange}
            register={register}
            getValues={getValues}
            errors={errors}
          /> */}
          {/* TwoFA */}
          {/* FIXME: 2fa has been added to login and account recovery by default */}
          <TwoFaktorAuthentifizierung spacing={spacing} />
          <TwoFaktorMessage spacing={spacing} />

          <TwoFA
            spacing={spacing}
            kontoData={kontoData}
            setKontoData={setKontoData}
            handleChange={handleChange}
            register={register}
            errors={errors}
            values={getValues()}
          />
          {/* TwoFA message */}

          <SubmitBtn isSubmitting={isSubmitting} />
        </form>
      </div>
    </AppLayout>
  );
});
export default PrivateRoute(AccountSettingsPage);
