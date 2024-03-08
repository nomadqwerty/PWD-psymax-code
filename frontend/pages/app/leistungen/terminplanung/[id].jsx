import {
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import React, { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/router';
import axiosInstance from '../../../../utils/axios';
import AppLayout from '../../../../components/AppLayout';
import CssTextField from '../../../../components/CssTextField';
import { useParams } from 'next/navigation';
import ModelDialogue from '../../../../components/Dialog/ModelDialogue';
import { handleApiError } from '../../../../utils/apiHelpers';
import PrivateRoute from '../../../../components/PrivateRoute';

const AddEditTerminplanung = React.memo(() => {
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
        router.push('/app/leistungen');
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
          router.push('/app/leistungen');
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
    }

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
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container sx={{ mb: 2 }}>
          <Grid item xs={12}>
            <div className="flex items-center  interFonts text-[#3C3C3C] font-bold text-4xl">
              {!leistungEdit ? (
                <>
                  <span className="pr-2">{Leistung}</span>
                  <svg
                    className="editBtn"
                    onClick={() => setLeistungEdit(true)}
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M5.25 11.8124H2.625C2.50897 11.8124 2.39769 11.7663 2.31564 11.6843C2.23359 11.6022 2.1875 11.491 2.1875 11.3749V8.93115C2.1875 8.8737 2.19882 8.81681 2.2208 8.76373C2.24279 8.71065 2.27502 8.66242 2.31564 8.62179L8.87814 2.05929C8.96019 1.97725 9.07147 1.93115 9.1875 1.93115C9.30353 1.93115 9.41481 1.97725 9.49686 2.05929L11.9406 4.50307C12.0227 4.58512 12.0688 4.6964 12.0688 4.81243C12.0688 4.92847 12.0227 5.03975 11.9406 5.12179L5.25 11.8124Z"
                      stroke="#2B86FC"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M7.4375 3.5L10.5 6.5625"
                      stroke="#2B86FC"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M11.8125 11.8125H5.25L2.21533 8.77783"
                      stroke="#2B86FC"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </>
              ) : (
                <input
                  name="Leistung"
                  type="text"
                  id="Leistung"
                  className="interFonts text-[#3C3C3C] font-bold text-4xl"
                  value={Leistung}
                  onChange={(e) => {
                    if (leistungEdit) {
                      setLeistung(e?.target.value);
                      clearErrors();
                    }
                  }}
                  onBlur={() => setLeistungEdit(false)}
                  style={{ outline: 'none' }}
                  ref={(e) => {
                    register('Leistung');
                    inputRef.current = e;
                  }}
                />
              )}
            </div>
            {errors?.Leistung && (
              <span className="validationErr">{errors?.Leistung?.message}</span>
            )}
          </Grid>
        </Grid>

        <Grid container sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <Typography
              sx={{
                lineHeight: 1.6,
              }}
              className="mt-3 font-bold text-[20px] text-[#363F4A] interFonts"
            >
              Relevante Angaben
            </Typography>
          </Grid>
        </Grid>
        <Grid container spacing={spacing}>
          <Grid item xs={12} sm={12} md={6} xl={6}>
            <CssTextField
              name="Dauer"
              sx={{
                mt: 4,
              }}
              type="text"
              focusColor="#3C3C3C"
              color="primary"
              id="Dauer"
              fullWidth
              label="Dauer"
              variant="outlined"
              {...register('Dauer', {
                required: 'Dieses Feld ist ein Pflichtfeld',
              })}
              error={!!errors.Dauer}
              InputLabelProps={{
                shrink: !!getValues('Dauer'),
              }}
              inputProps={{
                className: 'interFonts',
              }}
              onChange={handleDauerChange}
              value={dauer}
            />
            {errors?.Dauer && (
              <span className="validationErr">{errors?.Dauer?.message}</span>
            )}
          </Grid>

          <Grid item xs={12} sm={12} md={6} xl={6}>
            <CssTextField
              name="Kosten"
              sx={{ mt: [2, 0, 4] }}
              type="number"
              focusColor="#3C3C3C"
              id="Kosten"
              fullWidth
              label="Kosten"
              variant="outlined"
              {...register('Kosten', { required: true })}
              error={!!errors.Kosten}
              InputLabelProps={{
                shrink: !!getValues('Kosten'),
              }}
              inputProps={{
                className: 'interFonts',
              }}
              onChange={handleChange}
            />
            {errors?.Kosten && (
              <span className="validationErr">
                Dieses Feld ist ein Pflichtfeld
              </span>
            )}
          </Grid>
        </Grid>
        <Grid container spacing={spacing}>
          <Grid item xs={12} sm={12} md={12} xl={12}>
            <CssTextField
              multiline
              rows={6}
              name="Beschreibung"
              sx={{ mt: [2, 0, 2] }}
              type="text"
              focusColor="#3C3C3C"
              color="primary"
              id="Beschreibung"
              fullWidth
              label="Beschreibung"
              variant="outlined"
              {...register('Beschreibung', { required: true })}
              InputLabelProps={{
                shrink: !!getValues('Beschreibung'),
              }}
              error={!!errors.Beschreibung}
              inputProps={{
                className: 'interFonts',
              }}
              onChange={handleChange}
            />
            {errors?.Beschreibung && (
              <span className="validationErr">
                Dieses Feld ist ein Pflichtfeld
              </span>
            )}
          </Grid>
        </Grid>

        <Grid container sx={{ mt: 6 }}>
          <Grid item xs={12}>
            <Typography
              sx={{
                lineHeight: 1.6,
              }}
              className="mt-3 pl-1 font-bold text-[20px] text-[#363F4A] interFonts"
            >
              Umsatzsteuer
            </Typography>
          </Grid>
        </Grid>

        <Grid container spacing={spacing}>
          <Grid item xs={12} sm={12} md={6} xl={6}>
            <FormControl sx={{ mt: [2, 0, 4] }} fullWidth>
              <InputLabel
                id="Umsatzsteuerwahl"
                className="text-md"
                sx={{
                  fontStyle: 'normal',
                  fontWeight: 400,
                }}
              >
                Umsatzsteuerwahl
              </InputLabel>
              <Controller
                name="Umsatzsteuerwahl"
                control={control}
                {...register('Umsatzsteuerwahl', { required: true })}
                render={({ field }) => (
                  <Select
                    labelId="Umsatzsteuerwahl"
                    label="Umsatzsteuerwahl"
                    fullWidth
                    {...field}
                    error={!!errors.Umsatzsteuerwahl}
                    onChange={(e) => {
                      setValue('Umsatzsteuerwahl', e?.target?.value, {
                        shouldValidate: true,
                      });
                      handleChange(e);
                    }}
                    value={field.value || ''}
                  >
                    <MenuItem value={'1'}>
                      Die Leistung enthält gem. § 19 UStG keine Umsatzsteuer.
                    </MenuItem>
                    <MenuItem value={'2'}>
                      Die Leistung enthält gem. § 4 Nr. 14a) UStG keine
                      Umsatzsteuer.{' '}
                    </MenuItem>
                    <MenuItem value={'3'}>
                      Die Leistung inkludiert eine Umsatzsteuer in Höhe von 19%.
                    </MenuItem>
                  </Select>
                )}
              />
              {errors?.Umsatzsteuerwahl && (
                <span className="validationErr">
                  Dieses Feld ist ein Pflichtfeld
                </span>
              )}
            </FormControl>
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
              Löschen
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
export default PrivateRoute(AddEditTerminplanung);
