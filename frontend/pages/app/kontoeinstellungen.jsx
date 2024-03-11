import {
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import React, { useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/router';
import CssTextField from '../../components/CssTextField';
import { AuthContext } from '../../context/auth.context';
import { IMAGEURL, SOMETHING_WRONG } from '../../utils/constants';
import axiosInstance from '../../utils/axios';
import PreviewIcon from '@mui/icons-material/Preview';
import AppLayout from '../../components/AppLayout';
import { DesktopDatePicker } from '@mui/x-date-pickers';
import { handleApiError } from '../../utils/apiHelpers';
import PrivateRoute from '../../components/PrivateRoute';
import zxcvbn from 'zxcvbn';

const Kontoeinstellungen = React.memo(() => {
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

  const [kontoData, setKontoData] = useState({});
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
        password: finalData?.password,
      };

      const response = await axiosInstance.post('/user/save', finalDatas);

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
        router.push('/app/dashboard');
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
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container sx={{ mb: 4 }}>
          <Grid item xs={12}>
            <Typography
              sx={{
                pl: 1,
                fontWeight: 700,
                fontSize: 36,
                lineHeight: 1.6,
                color: '#363F4A',
                fontFamily: 'inter Tight',
              }}
            >
              Kontoeinstellungen
            </Typography>
          </Grid>
        </Grid>

        <div className="bg-[#F3F3F3] px-4 py-4">
          <Typography className="text-[#0E0E0E] text-[18px] font-bold interFonts leading-[30px]">
            Empfehlungsprogramm
          </Typography>
          <Typography className="text-[#707070] text-[18px] font-normal interFonts pt-[12px] leading-[30px]">
            Für jede Nutzer:in, die sich mit Ihrem persönlichen Einladungscode{' '}
            {state?.userData?.inviteCode} anmeldet und psymax für mindestens 3
            Monate abonniert, erhalten Sie einen Gratismonat gutgeschrieben.
          </Typography>
        </div>

        <Grid container sx={{ mt: 4 }}>
          <Grid item xs={12}>
            <Typography
              sx={{
                lineHeight: 1.6,
              }}
              className="mt-3 pl-1 font-bold text-[20px] text-[#363F4A] interFonts"
            >
              Persönliche Angaben
            </Typography>
          </Grid>
        </Grid>
        <Grid container spacing={spacing}>
          <Grid item xs={12} sm={12} md={3} xl={3}>
            <FormControl sx={{ mt: 4 }} fullWidth>
              <InputLabel
                id="Anrede"
                className="text-md"
                sx={{
                  fontStyle: 'normal',
                  fontWeight: 400,
                }}
              >
                Anrede
              </InputLabel>
              <Controller
                name="Anrede"
                control={control}
                // defaultValue={kontoData?.Anrede}
                {...register('Anrede', { required: true })}
                render={({ field }) => (
                  <Select
                    labelId="Anrede"
                    label="Anrede"
                    fullWidth
                    {...field}
                    error={!!errors.Anrede}
                    onChange={(e) => {
                      setValue('Anrede', e?.target?.value, {
                        shouldValidate: true,
                      });
                      handleChange(e);
                    }}
                    value={field.value || ''}
                  >
                    <MenuItem value={'Herr'}>männlich</MenuItem>
                    <MenuItem value={'Frau'}>weiblich</MenuItem>
                    <MenuItem value={' '}>divers</MenuItem>
                  </Select>
                )}
              />
              {errors?.Anrede && (
                <span className="validationErr">
                  Dieses Feld ist ein Pflichtfeld
                </span>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={12} md={3} xl={3}>
            <CssTextField
              name="Titel"
              sx={{ mt: [2, 0, 4] }}
              type="text"
              focusColor="#3C3C3C"
              id="Titel"
              fullWidth
              label="Titel"
              variant="outlined"
              {...register('Titel')}
              error={!!errors.Titel}
              inputProps={{
                className: 'interFonts',
              }}
              InputLabelProps={{
                shrink: !!kontoData?.Titel,
              }}
              value={kontoData?.Titel || ''}
              onChange={handleChange}
            />
          </Grid>
        </Grid>
        <Grid container spacing={spacing}>
          <Grid item xs={12} sm={12} md={6} xl={6}>
            <CssTextField
              key="Vorname"
              name="Vorname"
              sx={{ mt: 2 }}
              type="text"
              fullWidth
              label="Vorname"
              variant="outlined"
              {...register('Vorname', { required: true })}
              error={!!errors.Vorname}
              InputProps={{
                className: 'interFonts',
              }}
              InputLabelProps={{
                shrink: !!kontoData?.Vorname,
              }}
              value={kontoData?.Vorname}
              onChange={handleChange}
            />

            {errors?.Vorname && (
              <span className="validationErr">
                Dieses Feld ist ein Pflichtfeld
              </span>
            )}
          </Grid>
          <Grid item xs={12} sm={12} md={6} xl={6}>
            <CssTextField
              name="Nachname"
              sx={{ mt: [2, 0, 2] }}
              type="text"
              focusColor="#3C3C3C"
              id="Nachname"
              fullWidth
              label="Nachname"
              variant="outlined"
              {...register('Nachname', { required: true })}
              error={!!errors.Nachname}
              inputProps={{
                className: 'interFonts',
              }}
              InputLabelProps={{
                shrink: !!kontoData?.Nachname,
              }}
              value={kontoData?.Nachname}
              onChange={handleChange}
            />
            {errors?.Nachname && (
              <span className="validationErr pl-2">
                Dieses Feld ist ein Pflichtfeld
              </span>
            )}
          </Grid>
        </Grid>

        <Grid container spacing={spacing}>
          <Grid item xs={12} sm={12} md={6} xl={6}>
            <DesktopDatePicker
              label="Geburtsdatum"
              name="Geburtsdatum"
              orientation="portrait"
              format="dd.MM.yy"
              sx={{
                mt: 2,
                '& input': {
                  fontFamily: 'Inter Tight',
                  color: '#717171',
                },
                '& fieldset': {
                  borderColor: errors?.Geburtsdatum && '#d32f2f',
                },
                '& .MuiInputLabel-formControl': {
                  color: errors?.Geburtsdatum && '#d32f2f',
                },
              }}
              className="w-full"
              disableFuture
              {...register('Geburtsdatum', {
                required: 'Dieses Feld ist ein Pflichtfeld',
              })}
              value={
                kontoData?.Geburtsdatum
                  ? new Date(kontoData?.Geburtsdatum)
                  : null
              }
              onChange={handleDOBChange}
              renderInput={(params) => (
                <TextField
                  placeholder="Geburtsdatum"
                  margin="normal"
                  {...params}
                  error={!!errors.Geburtsdatum}
                  InputProps={{
                    ...params.InputProps,
                    style: { border: 'none' },
                  }}
                />
              )}
            />
            {errors?.Geburtsdatum && (
              <span className="validationErr pl-2">
                {errors?.Geburtsdatum?.message}
              </span>
            )}
          </Grid>

          <Grid item xs={12} sm={12} md={6} xl={6}>
            <CssTextField
              name="Telefon"
              sx={{ mt: 2 }}
              type="text"
              focusColor="#3C3C3C"
              id="Telefon"
              fullWidth
              label="Telefonnummer"
              variant="outlined"
              {...register('Telefon', {
                required: 'Dieses Feld ist ein Pflichtfeld',
                pattern: {
                  value: /^(\+\d{1,3}[- ]?)?\d{10}$/,
                  message: 'Ungültiges Telefonnummer.',
                },
              })}
              error={!!errors.Telefon}
              inputProps={{
                className: 'interFonts',
              }}
              InputLabelProps={{
                shrink: !!kontoData?.Telefon,
              }}
              value={kontoData?.Telefon}
              onChange={handleChange}
            />
            {errors?.Telefon && (
              <span className="validationErr">
                {errors.Telefon?.message ? errors.Telefon?.message : null}
              </span>
            )}
          </Grid>
        </Grid>

        <Grid container spacing={spacing}>
          <Grid item xs={12} sm={12} md={6} xl={6}>
            <CssTextField
              name="Website"
              sx={{ mt: [2, 0, 2] }}
              type="text"
              focusColor="#3C3C3C"
              id="Website"
              fullWidth
              label="Website"
              variant="outlined"
              {...register('Website')}
              error={!!errors.Website}
              inputProps={{
                className: 'interFonts',
              }}
              InputLabelProps={{
                shrink: !!kontoData?.Website,
              }}
              value={kontoData?.Website}
              onChange={handleChange}
            />
            {errors?.Website && (
              <span className="validationErr pl-2">
                Dieses Feld ist ein Pflichtfeld
              </span>
            )}
          </Grid>
          <Grid item xs={12} sm={12} md={6} xl={6}>
            <CssTextField
              name="Berufsbezeichnung"
              sx={{ mt: 2 }}
              type="text"
              focusColor="#3C3C3C"
              id="Berufsbezeichnung"
              fullWidth
              label="Berufsbezeichnung"
              variant="outlined"
              {...register('Berufsbezeichnung')}
              error={!!errors.Berufsbezeichnung}
              inputProps={{
                className: 'interFonts',
              }}
              InputLabelProps={{
                shrink: !!kontoData?.Berufsbezeichnung,
              }}
              value={kontoData?.Berufsbezeichnung}
              onChange={handleChange}
            />
            {errors?.Berufsbezeichnung && (
              <span className="validationErr pl-2">
                Dieses Feld ist ein Pflichtfeld
              </span>
            )}
          </Grid>
        </Grid>

        <Grid container spacing={spacing}>
          <Grid item xs={12}>
            <Typography
              sx={{
                mt: 6,
                fontWeight: 700,
                fontSize: 20,
                lineHeight: 1.6,
                color: '#363F4A',
                fontFamily: 'inter Tight',
                fontStyle: 'normal',
              }}
            >
              Praxisangaben und Personalisierung
            </Typography>
          </Grid>
        </Grid>
        <Grid container spacing={spacing}>
          <Grid item xs={12} sm={12} md={6} xl={6}>
            <CssTextField
              name="Praxistitel"
              sx={{ mt: 2 }}
              type="text"
              focusColor="#3C3C3C"
              id="Praxistitel"
              fullWidth
              label="Praxistitel [optional]"
              variant="outlined"
              {...register('Praxistitel')}
              error={!!errors.Praxistitel}
              inputProps={{
                className: 'interFonts',
              }}
              InputLabelProps={{
                shrink: !!kontoData?.Praxistitel,
              }}
              value={kontoData?.Praxistitel}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} xl={6}>
            <CssTextField
              name="Praxisbezeichnung"
              sx={{ mt: [2, 0, 2] }}
              type="text"
              focusColor="#3C3C3C"
              id="Praxisbezeichnung"
              fullWidth
              label="Praxisbezeichnung [optional]"
              variant="outlined"
              {...register('Praxisbezeichnung')}
              error={!!errors.Praxisbezeichnung}
              inputProps={{
                className: 'interFonts',
              }}
              InputLabelProps={{
                shrink: !!kontoData?.Praxisbezeichnung,
              }}
              value={kontoData?.Praxisbezeichnung}
              onChange={handleChange}
            />
          </Grid>
        </Grid>
        <Grid container spacing={spacing}>
          <Grid item xs={12} sm={12} md={12} xl={12}>
            <CssTextField
              name="Praxisbeschreibung"
              sx={{ mt: 2 }}
              type="text"
              focusColor="#3C3C3C"
              id="Praxisbeschreibung"
              fullWidth
              label="Praxisbeschreibung [optional]"
              variant="outlined"
              {...register('Praxisbeschreibung')}
              error={!!errors.Praxisbeschreibung}
              inputProps={{
                className: 'interFonts',
              }}
              InputLabelProps={{
                shrink: !!kontoData?.Praxisbeschreibung,
              }}
              value={kontoData?.Praxisbeschreibung}
              onChange={handleChange}
            />
          </Grid>
        </Grid>
        <Grid container spacing={spacing}>
          <Grid item xs={12} sm={12} md={6} xl={6}>
            <div className="flex items-center">
              <div className="relative w-full">
                <CssTextField
                  name="Logo"
                  sx={{
                    mt: 2,
                  }}
                  type="file"
                  focusColor="#3C3C3C"
                  id="Logo"
                  fullWidth
                  label="Logo [optional]"
                  variant="outlined"
                  {...register('Logo')}
                  error={!!errors.Logo}
                  inputProps={{
                    className: 'interFonts text-md w-full',
                    accept: 'image/png,image/svg+xml',
                  }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  onChange={(e) => {
                    handleUploadLogo(e.target.files[0]);
                  }}
                />
                <IconButton
                  color="inherit"
                  sx={{
                    position: 'absolute',
                    right: 0,
                    top: '60%',
                    transform: 'translateY(-50%)',
                    '&:hover': {
                      color: '#2b86fc',
                    },
                  }}
                  onClick={() =>
                    window.open(
                      `${IMAGEURL}uploads/logo/${kontoData?.Logo}`,
                      '_blank'
                    )
                  }
                >
                  <PreviewIcon />
                </IconButton>
              </div>
            </div>

            {errors?.Logo && (
              <span className="validationErr pl-2">
                {errors?.Logo?.message}
              </span>
            )}
          </Grid>
          <Grid item xs={12} sm={12} md={6} xl={6}>
            <CssTextField
              name="Primaerfarbe"
              sx={{ mt: [2, 0, 2] }}
              type="text"
              focusColor="#3C3C3C"
              id="Primaerfarbe"
              fullWidth
              label="Primärfarbe [optional]"
              variant="outlined"
              {...register('Primaerfarbe', {
                pattern: {
                  value: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, // Regular expression for hex color code
                  message: 'Ungültiger Farbcode', // Error message if the pattern is not matched
                },
              })}
              error={!!errors.Primaerfarbe}
              inputProps={{
                className: 'interFonts',
              }}
              InputLabelProps={{
                shrink: !!kontoData?.Primaerfarbe,
              }}
              value={kontoData?.Primaerfarbe}
              onChange={handleChange}
            />
            {errors?.Primaerfarbe && (
              <span className="validationErr pl-2">
                {errors?.Primaerfarbe?.message}
              </span>
            )}
          </Grid>
        </Grid>

        <Grid container spacing={spacing}>
          <Grid item xs={12}>
            <Typography
              sx={{
                mt: 6,
                fontWeight: 700,
                fontSize: 20,
                lineHeight: 1.6,
                color: '#363F4A',
                fontFamily: 'inter Tight',
                fontStyle: 'normal',
              }}
            >
              Rechnungsanschrift und Steuernummerangabe
            </Typography>
          </Grid>
        </Grid>

        <Grid container spacing={spacing}>
          <Grid item xs={12} sm={12} md={6} xl={6}>
            <CssTextField
              name="Strasse_und_Hausnummer"
              sx={{ mt: 2 }}
              type="text"
              focusColor="#3C3C3C"
              id="Strasse_und_Hausnummer"
              fullWidth
              label="Strasse und Hausnummer"
              variant="outlined"
              {...register('Strasse_und_Hausnummer', {
                required: true,
              })}
              error={!!errors.Strasse_und_Hausnummer}
              inputProps={{
                className: 'interFonts',
              }}
              InputLabelProps={{
                shrink: !!kontoData?.Strasse_und_Hausnummer,
              }}
              value={kontoData?.Strasse_und_Hausnummer}
              onChange={handleChange}
            />
            {errors?.Strasse_und_Hausnummer && (
              <span className="validationErr">
                Dieses Feld ist ein Pflichtfeld
              </span>
            )}
          </Grid>
        </Grid>
        <Grid container spacing={spacing}>
          <Grid item xs={12} sm={12} md={6} xl={6}>
            <CssTextField
              name="Ort"
              sx={{ mt: 2 }}
              type="text"
              focusColor="#3C3C3C"
              id="Ort"
              fullWidth
              label="Ort"
              variant="outlined"
              {...register('Ort', { required: true })}
              error={!!errors.Ort}
              inputProps={{
                className: 'interFonts',
              }}
              InputLabelProps={{
                shrink: !!kontoData?.Ort,
              }}
              value={kontoData?.Ort}
              onChange={handleChange}
            />
            {errors?.Ort && (
              <span className="validationErr">
                Dieses Feld ist ein Pflichtfeld
              </span>
            )}
          </Grid>
          <Grid item xs={12} sm={12} md={6} xl={6}>
            <CssTextField
              name="Land"
              sx={{ mt: [2, 0, 2] }}
              type="text"
              focusColor="#3C3C3C"
              id="Land"
              fullWidth
              label="Land"
              variant="outlined"
              {...register('Land', { required: true })}
              error={!!errors.Land}
              inputProps={{
                className: 'interFonts',
              }}
              InputLabelProps={{
                shrink: !!kontoData?.Land,
              }}
              value={kontoData?.Land}
              onChange={handleChange}
            />
            {errors?.Land && (
              <span className="validationErr">
                Dieses Feld ist ein Pflichtfeld
              </span>
            )}
          </Grid>
        </Grid>
        <Grid container spacing={spacing}>
          <Grid item xs={12} sm={12} md={6} xl={6}>
            <CssTextField
              name="Steuernummer"
              sx={{ mt: 2 }}
              type="text"
              focusColor="#3C3C3C"
              id="Steuernummer"
              fullWidth
              label="Steuernummer/ Umsatzsteuer-ID"
              variant="outlined"
              {...register('Steuernummer', { required: true })}
              error={!!errors.Steuernummer}
              inputProps={{
                className: 'interFonts',
              }}
              InputLabelProps={{
                shrink: !!kontoData?.Steuernummer,
              }}
              value={kontoData?.Steuernummer}
              onChange={handleChange}
            />
            {errors?.Steuernummer && (
              <span className="validationErr pl-2">
                Dieses Feld ist ein Pflichtfeld
              </span>
            )}
          </Grid>
          <Grid item xs={12} sm={12} md={6} xl={6}>
            <CssTextField
              name="PLZ"
              sx={{ mt: [2, 0, 2] }}
              type="number"
              focusColor="#3C3C3C"
              id="PLZ"
              fullWidth
              label="PLZ"
              variant="outlined"
              {...register('PLZ', {
                required: 'Dieses Feld ist ein Pflichtfeld',
                pattern: {
                  value: /^(0|[1-9]\d*)(\.\d+)?$/,
                  message: 'Bitte nur Zahlen eingeben',
                },
                maxLength: {
                  value: 5,
                  message: 'Bitte maximal fünf Zeichen eingeben',
                },
              })}
              error={!!errors.PLZ}
              inputProps={{
                className: 'interFonts',
              }}
              InputLabelProps={{
                shrink: !!kontoData?.PLZ,
              }}
              value={kontoData?.PLZ}
              onChange={handleChange}
            />
            {errors?.PLZ && (
              <span className="validationErr pl-2">{errors?.PLZ?.message}</span>
            )}
          </Grid>
        </Grid>

        <Grid container spacing={spacing}>
          <Grid item xs={12}>
            <Typography
              sx={{
                mt: 6,
                fontWeight: 700,
                fontSize: 20,
                lineHeight: 1.6,
                color: '#363F4A',
                fontFamily: 'inter Tight',
                fontStyle: 'normal',
              }}
            >
              Bankangaben
            </Typography>
          </Grid>
        </Grid>
        <Grid container spacing={spacing}>
          <Grid item xs={12} sm={12} md={6} xl={6}>
            <CssTextField
              name="Bankname"
              sx={{ mt: 2 }}
              type="text"
              focusColor="#3C3C3C"
              id="Bankname"
              fullWidth
              label="Bankname"
              variant="outlined"
              {...register('Bankname', { required: true })}
              error={!!errors.Bankname}
              inputProps={{
                className: 'interFonts',
              }}
              InputLabelProps={{
                shrink: !!kontoData?.Bankname,
              }}
              value={kontoData?.Bankname}
              onChange={handleChange}
            />
            {errors?.Bankname && (
              <span className="validationErr">
                Dieses Feld ist ein Pflichtfeld
              </span>
            )}
          </Grid>
          <Grid item xs={12} sm={12} md={6} xl={6}>
            <CssTextField
              name="BIC"
              sx={{ mt: [2, 0, 2] }}
              type="text"
              focusColor="#3C3C3C"
              id="BIC"
              fullWidth
              label="BIC"
              variant="outlined"
              {...register('BIC', { required: true })}
              error={!!errors.BIC}
              inputProps={{
                className: 'interFonts',
              }}
              InputLabelProps={{
                shrink: !!kontoData?.BIC,
              }}
              value={kontoData?.BIC}
              onChange={handleChange}
            />
            {errors?.BIC && (
              <span className="validationErr pl-2">
                Dieses Feld ist ein Pflichtfeld
              </span>
            )}
          </Grid>
        </Grid>
        <Grid container spacing={spacing}>
          <Grid item xs={12} sm={12} md={12} xl={12}>
            <Controller
              name="IBAN"
              control={control}
              rules={{ required: 'IBAN is required' }}
              render={({ field }) => (
                <CssTextField
                  name={field.name}
                  sx={{ mt: 2 }}
                  type="text"
                  focusColor="#3C3C3C"
                  id="IBAN"
                  fullWidth
                  label="IBAN"
                  variant="outlined"
                  error={!!errors.IBAN}
                  inputProps={{
                    className: 'interFonts',
                  }}
                  value={iban && iban}
                  ref={field.ref}
                  onChange={(e) => {
                    handleIbanChange(e);
                    field.onChange(e);
                  }}
                />
              )}
            />
            {errors?.IBAN && (
              <span className="validationErr">
                Dieses Feld ist ein Pflichtfeld
              </span>
            )}
          </Grid>
        </Grid>

        <Grid container spacing={spacing}>
          <Grid item xs={12}>
            <Typography
              sx={{
                mt: 6,
                fontWeight: 700,
                fontSize: 20,
                lineHeight: 1.6,
                color: '#363F4A',
                fontFamily: 'inter Tight',
                fontStyle: 'normal',
              }}
            >
              Abrechnungsangaben
            </Typography>
          </Grid>
        </Grid>

        <Grid container spacing={spacing} style={{ alignItems: 'center' }}>
          <Grid item xs={12} sm={12} md={6} xl={6}>
            <CssTextField
              name="invoiceEmail"
              sx={{ mt: 2 }}
              type="text"
              focusColor="#3C3C3C"
              id="invoiceEmail"
              fullWidth
              label="Email für den Blindversand der Rechnung"
              variant="outlined"
              {...register('invoiceEmail', {
                required: false,
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                  message: 'Die E-Mail-Adresse sollte korrekt sein.',
                },
              })}
              error={!!errors.invoiceEmail}
              inputProps={{
                className: 'interFonts',
              }}
              InputLabelProps={{
                shrink: !!kontoData?.invoiceEmail,
              }}
              value={kontoData?.invoiceEmail}
              onChange={handleChange}
            />
            {errors?.invoiceEmail && (
              <span className="validationErr">
                {errors.invoiceEmail?.message
                  ? errors.invoiceEmail?.message
                  : null}
              </span>
            )}
          </Grid>
          <Grid item xs={12} sm={12} md={6} xl={6}>
            <Typography
              className={`interFonts text-[14px] font-normal text-[#6F7680] leading-[20px]`}
              sx={{
                mt: [2, 0, 2],
              }}
            >
              <span style={{ fontWeight: 500 }}>Hinweis</span>
              <br /> Die Angabe einer zusätzliche Email ist optional. Wir
              schicken dir an diese Emailadresse alle von dir erstellen
              Rechnungen zu.
            </Typography>
          </Grid>
        </Grid>
        <Grid container spacing={spacing}>
          <Grid item xs={12} sm={12} md={12} xl={12}>
            <CssTextField
              name="StandardSalesTax"
              sx={{ mt: 2 }}
              type="text"
              focusColor="#3C3C3C"
              id="StandardSalesTax"
              fullWidth
              label="Standard-Umsatzsteuerhinweis “Der Gesamtbetrag enthält gem. §4 Nr. 21 b) bb) UStG keine Umsatzsteuer.” anpassen."
              variant="outlined"
              {...register('StandardSalesTax')}
              error={!!errors.StandardSalesTax}
              inputProps={{
                className: 'interFonts',
              }}
              InputLabelProps={{
                shrink: !!kontoData?.StandardSalesTax,
              }}
              value={kontoData?.StandardSalesTax}
              onChange={handleChange}
            />
          </Grid>
        </Grid>

        <Grid container spacing={spacing}>
          <Grid item xs={12}>
            <Typography
              sx={{
                mt: 6,
                fontWeight: 700,
                fontSize: 20,
                lineHeight: 1.6,
                color: '#363F4A',
                fontFamily: 'inter Tight',
                fontStyle: 'normal',
              }}
            >
              Kontodaten
            </Typography>
          </Grid>
        </Grid>
        <Grid container spacing={spacing}>
          <Grid item xs={12} sm={12} md={6} xl={6}>
            <CssTextField
              disabled
              name="email"
              sx={{ mt: 2 }}
              type="text"
              focusColor="#3C3C3C"
              id="email"
              fullWidth
              label="Email Ihres Nutzerkontos"
              variant="outlined"
              {...register('email')}
              value={kontoData?.email}
              inputProps={{
                className: 'interFonts',
              }}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
        </Grid>
        <Grid container spacing={spacing}>
          <Grid item xs={12} sm={12} md={6} xl={6}>
            <CssTextField
              name="newPassword"
              sx={{ mt: 2 }}
              type="password"
              focusColor="#3C3C3C"
              id="newPassword"
              fullWidth
              label="Passwort aktualisieren"
              variant="outlined"
              {...register('newPassword', {
                required: false,
                validate: (value) =>
                  zxcvbn(value)?.score >= 3 ||
                  'Das Passwort sollte sicher sein',
              })}
              autoComplete="new-password"
              inputProps={{
                className: 'interFonts',
              }}
              InputLabelProps={{
                shrink: !!kontoData?.newPassword,
              }}
              value={kontoData?.newPassword}
              onChange={handleChange}
            />
            {errors?.newPassword && (
              <span className="validationErr">
                {errors?.newPassword?.message}
              </span>
            )}
          </Grid>
          <Grid item xs={12} sm={12} md={6} xl={6}>
            <CssTextField
              name="confirmPassword"
              sx={{ mt: [2, 0, 2] }}
              type="password"
              focusColor="#3C3C3C"
              id="confirmPassword"
              fullWidth
              label="Passwort bestätigen"
              variant="outlined"
              {...register('confirmPassword', {
                // required: "Dieses Feld ist ein Pflichtfeld.",
                validate: (value) =>
                  value === getValues('newPassword') ||
                  'Passwörter stimmen nicht überein', // Compare with the password field's value
              })}
              error={!!errors.confirmPassword}
              inputProps={{
                className: 'interFonts',
              }}
              InputLabelProps={{
                shrink: !!kontoData?.confirmPassword,
              }}
              value={kontoData?.confirmPassword}
              onChange={handleChange}
            />
            {(errors?.confirmPassword?.type === 'required' ||
              errors?.confirmPassword?.type === 'validate') && (
              <div className="validationErr pl-2">
                {errors.confirmPassword.message
                  ? errors.confirmPassword.message
                  : null}
              </div>
            )}
          </Grid>
        </Grid>

        <Grid container spacing={spacing}>
          <Grid item xs={12}>
            <Typography
              sx={{
                mt: 6,
                fontWeight: 700,
                fontSize: 20,
                lineHeight: 1.6,
                color: '#363F4A',
                fontFamily: 'inter Tight',
                fontStyle: 'normal',
              }}
            >
              2-Faktor-Authentifizierung
            </Typography>
          </Grid>
        </Grid>
        <Grid container spacing={spacing} style={{ alignItems: 'center' }}>
          <Grid item xs={12} sm={12} md={6} xl={6}>
            <CssTextField
              name="Authentifizierungscode"
              sx={{ mt: 2 }}
              type="text"
              focusColor="#3C3C3C"
              id="Authentifizierungscode"
              fullWidth
              label="Authentifizierungscode"
              variant="outlined"
              {...register('Authentifizierungscode')}
              error={!!errors.Authentifizierungscode}
              inputProps={{
                className: 'interFonts',
              }}
              InputLabelProps={{
                shrink: !!kontoData?.Authentifizierungscode,
              }}
              value={kontoData?.Authentifizierungscode}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} xl={6}>
            <Typography
              className={`interFonts text-[14px] font-normal text-[#6F7680] leading-[20px]`}
              sx={{
                mt: [2, 0, 2],
              }}
            >
              <span style={{ fontWeight: 500 }}>Hinweis</span>
              <br /> Wir empfehlen Ihnen ausdrücklich eine
              2-Faktor-Authentifizierung um Ihr Nutzerkonto und die damit
              verbunden Daten zu schützen.
            </Typography>
          </Grid>
        </Grid>

        <Grid container sx={{ mt: 4 }}>
          <Grid item xs={6} sm={6} md={6} xl={6} style={{ textAlign: 'left' }}>
            <button
              type="button"
              className="w-107 h-[42px] bg-[#EEE] px-5 py-2 rounded-[4px] justify-center items-center gap-2.5 inline-flex text-center text-[#0E0E0E] text-sm font-medium interFonts"
              onClick={() => router.back()}
            >
              Zurück
            </button>
          </Grid>
          <Grid item xs={6} sm={6} md={6} xl={6} style={{ textAlign: 'right' }}>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-107 h-[42px] bg-[#EEE] px-5 py-2 rounded-[4px] justify-center items-center gap-2.5 inline-flex text-center text-[#0E0E0E] text-sm font-medium interFonts"
            >
              Bestätigen
            </button>
          </Grid>
        </Grid>
      </form>
    </AppLayout>
  );
});
export default PrivateRoute(Kontoeinstellungen);
