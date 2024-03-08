import {
  Autocomplete,
  Chip,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/router';
import axiosInstance from '../../../utils/axios';
import AppLayout from '../../../components/AppLayout';
import CssTextField from '../../../components/CssTextField';
import { useParams } from 'next/navigation';
import { DesktopDatePicker } from '@mui/x-date-pickers';
import ModelDialogue from '../../../components/Dialog/ModelDialogue';
import { handleApiError } from '../../../utils/apiHelpers';
import PrivateRoute from '../../../components/PrivateRoute';

const KlientAddEdit = React.memo(() => {
  const params = useParams();

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
      if (isEdit) {
        data.id = params?.id;
        delete data?.Chiffre;
        delete data?.userChiffre;
        response = await axiosInstance.put('/klient/update', data);
      } else {
        response = await axiosInstance.post('/klient/save', data);
      }

      if (response?.status === 200) {
        const responseData = response?.data;
        toast.success(responseData?.message);
        router.push('/app/klientinnen');
      }
    } catch (error) {
      handleApiError(error, router);
    }
  };

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('psymax-user-data'));
    if (!userData?.Chiffre) {
      router.push('/app/kontoeinstellungen');
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

  const agreeModel = async () => {
    try {
      setOpen(!open);
      const response = await axiosInstance.delete(
        `/klient/remove/${params?.id}`
      );
      if (response?.status === 200) {
        router.push('/app/klientinnen');
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
        <Grid container sx={{ mb: 2 }}>
          <Grid item xs={12}>
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: 36,
                lineHeight: 1.6,
                color: '#363F4A',
                fontFamily: 'Inter Tight',
              }}
            >
              {editData?.Chiffre ? editData?.Chiffre : `${'{{Chiffre}}'}`}
            </Typography>
          </Grid>
        </Grid>

        <Grid container sx={{ mt: 1 }}>
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
          <Grid item xs={12} sm={12} md={6} xl={6}>
            <CssTextField
              disabled={isEdit}
              name="Chiffre"
              sx={{
                mt: 4,
              }}
              type="text"
              focusColor="#3C3C3C"
              color="primary"
              id="Chiffre"
              fullWidth
              label="Chiffre"
              variant="outlined"
              {...register('Chiffre', { required: true })}
              error={!!errors.Chiffre}
              inputProps={{
                className: 'interFonts',
              }}
              InputLabelProps={{
                shrink: !!editData?.Chiffre,
              }}
              value={editData?.Chiffre || ''}
              onChange={handleChange}
            />
            {errors?.Chiffre && (
              <span className="validationErr">
                Dieses Feld ist ein Pflichtfeld
              </span>
            )}
          </Grid>
          <Grid item xs={12} sm={12} md={3} xl={3}>
            <FormControl sx={{ mt: [2, 0, 4] }} fullWidth>
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
                // defaultValue={editData?.Anrede}
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
                shrink: !!editData?.Titel,
              }}
              value={editData?.Titel || ''}
              onChange={handleChange}
            />
          </Grid>
        </Grid>
        <Grid container spacing={spacing}>
          <Grid item xs={12} sm={12} md={12} xl={12}>
            <CssTextField
              name="Firma"
              sx={{ mt: [2, 0, 2] }}
              type="text"
              focusColor="#3C3C3C"
              color="primary"
              id="Firma"
              fullWidth
              label="Firma"
              variant="outlined"
              {...register('Firma', { required: true })}
              error={!!errors.Firma}
              InputLabelProps={{
                shrink: !!editData?.Firma,
              }}
              inputProps={{
                className: 'interFonts',
              }}
              value={editData?.Firma || ''}
              onChange={handleChange}
            />
            {errors?.Firma && (
              <span className="validationErr">
                Dieses Feld ist ein Pflichtfeld
              </span>
            )}
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
                shrink: !!editData?.Vorname,
              }}
              value={editData?.Vorname}
              onChange={handleChange}
              onBlur={(e) => handleBlur(e, 'Vorname')}
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
                shrink: !!editData?.Nachname,
              }}
              value={editData?.Nachname}
              onChange={handleChange}
              onBlur={(e) => handleBlur(e, 'Nachname')}
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
                shrink: !!editData?.Strasse_und_Hausnummer,
              }}
              value={editData?.Strasse_und_Hausnummer}
              onChange={handleChange}
            />
            {errors?.Strasse_und_Hausnummer && (
              <span className="validationErr">
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
                shrink: !!editData?.PLZ,
              }}
              value={editData?.PLZ}
              onChange={handleChange}
            />
            {errors?.PLZ && (
              <span className="validationErr pl-2">{errors?.PLZ?.message}</span>
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
                shrink: !!editData?.Ort,
              }}
              value={editData?.Ort}
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
                shrink: !!editData?.Land,
              }}
              value={editData?.Land}
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
              name="email"
              sx={{ mt: 2 }}
              type="text"
              focusColor="#3C3C3C"
              id="email"
              fullWidth
              label="Email"
              variant="outlined"
              {...register('email', {
                required: 'Dieses Feld ist ein Pflichtfeld',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                  message: 'Die E-Mail-Adresse sollte korrekt sein.',
                },
              })}
              error={!!errors.email}
              inputProps={{
                className: 'interFonts',
              }}
              InputLabelProps={{
                shrink: !!editData?.email,
              }}
              value={editData?.email}
              onChange={handleChange}
            />
            {errors?.email && (
              <span className="validationErr">
                {errors.email?.message ? errors.email?.message : null}
              </span>
            )}
          </Grid>
          <Grid item xs={12} sm={12} md={6} xl={6}>
            <CssTextField
              name="Telefonnummer"
              sx={{ mt: 2 }}
              type="text"
              focusColor="#3C3C3C"
              id="Telefonnummer"
              fullWidth
              label="Telefonnummer"
              variant="outlined"
              {...register('Telefonnummer', {
                required: 'Dieses Feld ist ein Pflichtfeld',
                pattern: {
                  value: /^\d{1,20}$/,
                  message: 'Ungültiges Telefonnummer.',
                },
              })}
              error={!!errors.Telefonnummer}
              inputProps={{
                className: 'interFonts',
              }}
              InputLabelProps={{
                shrink: !!editData?.Telefonnummer,
              }}
              value={editData?.Telefonnummer}
              onChange={handleChange}
            />
            {errors?.Telefonnummer && (
              <span className="validationErr">
                {errors.Telefonnummer?.message
                  ? errors.Telefonnummer?.message
                  : null}
              </span>
            )}
          </Grid>
        </Grid>

        <Grid container spacing={spacing}>
          <Grid item xs={12} sm={12} md={6} xl={6}>
            <Autocomplete
              sx={{ mt: 2 }}
              multiple
              freeSolo
              options={[]}
              value={editData?.Diagnose || []}
              name="Diagnose"
              id="Diagnose"
              {...register('Diagnose', {
                required: editData?.Diagnose?.length > 0 ? false : true,
              })}
              error={!!errors.Diagnose}
              inputProps={{
                className: 'interFonts',
              }}
              InputLabelProps={{
                shrink: !!editData?.Diagnose,
              }}
              onChange={(_, newValue) => {
                handleDiagnose(newValue);
              }}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    key={index}
                    variant="outlined"
                    label={option}
                    {...getTagProps({ index })}
                  />
                ))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  label="Diagnose"
                  placeholder="Weitere Diagnose hinzufügen"
                  error={!!errors.Diagnose}
                />
              )}
            />

            {errors?.Diagnose && (
              <span className="validationErr pl-2">
                Dieses Feld ist ein Pflichtfeld
              </span>
            )}
          </Grid>
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
                editData?.Geburtsdatum ? new Date(editData?.Geburtsdatum) : null
              }
              onChange={handleDOBChange}
              onAccept={handleBlur}
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
              Angaben zum Betreuenden Arzt
            </Typography>
          </Grid>
        </Grid>

        <Grid container spacing={spacing}>
          <Grid item xs={12} sm={12} md={3} xl={3}>
            <FormControl sx={{ mt: [2, 0, 4] }} fullWidth>
              <InputLabel
                id="ArztAnrede"
                className="text-md"
                sx={{
                  fontStyle: 'normal',
                  fontWeight: 400,
                }}
              >
                Anrede
              </InputLabel>
              <Controller
                name="ArztAnrede"
                control={control}
                // defaultValue={editData?.ArztAnrede}
                {...register('ArztAnrede', { required: true })}
                render={({ field }) => (
                  <Select
                    labelId="ArztAnrede"
                    label="ArztAnrede"
                    fullWidth
                    {...field}
                    error={!!errors.ArztAnrede}
                    onChange={(e) => {
                      setValue('ArztAnrede', e?.target?.value, {
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
              {errors?.ArztAnrede && (
                <span className="validationErr">
                  Dieses Feld ist ein Pflichtfeld
                </span>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={12} md={3} xl={3}>
            <CssTextField
              name="ArztTitel"
              sx={{ mt: [2, 0, 4] }}
              type="text"
              focusColor="#3C3C3C"
              id="ArztTitel"
              fullWidth
              label="Titel"
              variant="outlined"
              {...register('ArztTitel')}
              error={!!errors.ArztTitel}
              inputProps={{
                className: 'interFonts',
              }}
              InputLabelProps={{
                shrink: !!editData?.ArztTitel,
              }}
              value={editData?.ArztTitel || ''}
              onChange={handleChange}
            />
          </Grid>
        </Grid>
        <Grid container spacing={spacing}>
          <Grid item xs={12} sm={12} md={6} xl={6}>
            <CssTextField
              key="ArztVorname"
              name="ArztVorname"
              sx={{ mt: 2 }}
              type="text"
              fullWidth
              label="Vorname"
              variant="outlined"
              {...register('ArztVorname', { required: true })}
              error={!!errors.ArztVorname}
              InputProps={{
                className: 'interFonts',
              }}
              InputLabelProps={{
                shrink: !!editData?.ArztVorname,
              }}
              value={editData?.ArztVorname || ''}
              onChange={handleChange}
            />

            {errors?.ArztVorname && (
              <span className="validationErr">
                Dieses Feld ist ein Pflichtfeld
              </span>
            )}
          </Grid>
          <Grid item xs={12} sm={12} md={6} xl={6}>
            <CssTextField
              name="ArztNachname"
              sx={{ mt: [2, 0, 2] }}
              type="text"
              focusColor="#3C3C3C"
              id="ArztNachname"
              fullWidth
              label="Nachname"
              variant="outlined"
              {...register('ArztNachname', { required: true })}
              error={!!errors.ArztNachname}
              inputProps={{
                className: 'interFonts',
              }}
              InputLabelProps={{
                shrink: !!editData?.ArztNachname,
              }}
              value={editData?.ArztNachname || ''}
              onChange={handleChange}
            />
            {errors?.ArztNachname && (
              <span className="validationErr pl-2">
                Dieses Feld ist ein Pflichtfeld
              </span>
            )}
          </Grid>
        </Grid>

        <Grid container spacing={spacing}>
          <Grid item xs={12} sm={12} md={6} xl={6}>
            <CssTextField
              name="ArztStrasse_und_Hausnummer"
              sx={{ mt: 2 }}
              type="text"
              focusColor="#3C3C3C"
              id="ArztStrasse_und_Hausnummer"
              fullWidth
              label="Strasse und Hausnummer"
              variant="outlined"
              {...register('ArztStrasse_und_Hausnummer', {
                required: true,
              })}
              error={!!errors.ArztStrasse_und_Hausnummer}
              inputProps={{
                className: 'interFonts',
              }}
              InputLabelProps={{
                shrink: !!editData?.ArztStrasse_und_Hausnummer,
              }}
              value={editData?.ArztStrasse_und_Hausnummer || ''}
              onChange={handleChange}
            />
            {errors?.ArztStrasse_und_Hausnummer && (
              <span className="validationErr">
                Dieses Feld ist ein Pflichtfeld
              </span>
            )}
          </Grid>
          <Grid item xs={12} sm={12} md={6} xl={6}>
            <CssTextField
              name="ArztPLZ"
              sx={{ mt: [2, 0, 2] }}
              type="number"
              focusColor="#3C3C3C"
              id="ArztPLZ"
              fullWidth
              label="PLZ"
              variant="outlined"
              {...register('ArztPLZ', {
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
              error={!!errors.ArztPLZ}
              inputProps={{
                className: 'interFonts',
              }}
              InputLabelProps={{
                shrink: !!editData?.ArztPLZ,
              }}
              value={editData?.ArztPLZ || ''}
              onChange={handleChange}
            />
            {errors?.ArztPLZ && (
              <span className="validationErr pl-2">
                {errors?.ArztPLZ?.message}
              </span>
            )}
          </Grid>
        </Grid>
        <Grid container spacing={spacing}>
          <Grid item xs={12} sm={12} md={6} xl={6}>
            <CssTextField
              name="ArztOrt"
              sx={{ mt: 2 }}
              type="text"
              focusColor="#3C3C3C"
              id="ArztOrt"
              fullWidth
              label="Ort"
              variant="outlined"
              {...register('ArztOrt', { required: true })}
              error={!!errors.ArztOrt}
              inputProps={{
                className: 'interFonts',
              }}
              InputLabelProps={{
                shrink: !!editData?.ArztOrt,
              }}
              value={editData?.ArztOrt || ''}
              onChange={handleChange}
            />
            {errors?.ArztOrt && (
              <span className="validationErr">
                Dieses Feld ist ein Pflichtfeld
              </span>
            )}
          </Grid>
          <Grid item xs={12} sm={12} md={6} xl={6}>
            <CssTextField
              name="ArztLand"
              sx={{ mt: [2, 0, 2] }}
              type="text"
              focusColor="#3C3C3C"
              id="ArztLand"
              fullWidth
              label="Land"
              variant="outlined"
              {...register('ArztLand', { required: true })}
              error={!!errors.ArztLand}
              inputProps={{
                className: 'interFonts',
              }}
              InputLabelProps={{
                shrink: !!editData?.ArztLand,
              }}
              value={editData?.ArztLand || ''}
              onChange={handleChange}
            />
            {errors?.ArztLand && (
              <span className="validationErr">
                Dieses Feld ist ein Pflichtfeld
              </span>
            )}
          </Grid>
        </Grid>

        <Grid container spacing={spacing}>
          <Grid item xs={12} sm={12} md={6} xl={6}>
            <CssTextField
              name="ArztEmail"
              sx={{ mt: 2 }}
              type="text"
              focusColor="#3C3C3C"
              id="ArztEmail"
              fullWidth
              label="Email"
              variant="outlined"
              {...register('ArztEmail', {
                required: 'Dieses Feld ist ein Pflichtfeld',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                  message: 'Die E-Mail-Adresse sollte korrekt sein.',
                },
              })}
              error={!!errors.ArztEmail}
              inputProps={{
                className: 'interFonts',
              }}
              InputLabelProps={{
                shrink: !!editData?.ArztEmail,
              }}
              value={editData?.ArztEmail || ''}
              onChange={handleChange}
            />
            {errors?.ArztEmail && (
              <span className="validationErr">
                {errors.ArztEmail?.message ? errors.ArztEmail?.message : null}
              </span>
            )}
          </Grid>
          <Grid item xs={12} sm={12} md={6} xl={6}>
            <CssTextField
              name="ArztTelefonnummer"
              sx={{ mt: 2 }}
              type="text"
              focusColor="#3C3C3C"
              id="ArztTelefonnummer"
              fullWidth
              label="Telefonnummer"
              variant="outlined"
              {...register('ArztTelefonnummer', {
                required: 'Dieses Feld ist ein Pflichtfeld',
                pattern: {
                  value: /^\d{1,20}$/,
                  message: 'Ungültiges Telefonnummer.',
                },
              })}
              error={!!errors.ArztTelefonnummer}
              inputProps={{
                className: 'interFonts',
              }}
              InputLabelProps={{
                shrink: !!editData?.ArztTelefonnummer,
              }}
              value={editData?.ArztTelefonnummer || ''}
              onChange={handleChange}
            />
            {errors?.ArztTelefonnummer && (
              <span className="validationErr">
                {errors.ArztTelefonnummer?.message
                  ? errors.ArztTelefonnummer?.message
                  : null}
              </span>
            )}
          </Grid>
        </Grid>

        <Grid container sx={{ mt: 4 }}>
          <Grid
            item
            xs={6}
            sm={6}
            md={6}
            xl={6}
            style={{ textAlign: 'left', cursor: 'pointer' }}
          >
            <button
              type="button"
              className="text-center text-sm font-medium interFonts rounded-[8px] justify-center items-center w-22 h-[42px] px-5 py-2 gap-2.5 inline-flex bg-[#FBD6D8] text-[#E30C40] hover:bg-[#e30c40] hover:text-[#fff]"
              onClick={() => {
                isEdit && setOpen(true);
              }}
            >
              Entfernen
            </button>
          </Grid>
          <Grid item xs={6} sm={6} md={6} xl={6} style={{ textAlign: 'right' }}>
            <button
              type="submit"
              disabled={isSubmitting}
              className="text-center text-sm font-medium interFonts rounded-[8px] justify-center items-center w-22 h-[42px] px-5 py-2 gap-2.5 inline-flex bg-[#EEE] text-[#0E0E0E] hover:bg-[#2B86FC] hover:text-[#FFFFFF]"
            >
              Bestätigen
            </button>
          </Grid>
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
export default PrivateRoute(KlientAddEdit);
