import React, { useContext, useEffect, useRef, useState } from 'react';
import AppLayout from '../../../components/AppLayout';
import { Controller, useForm } from 'react-hook-form';
import {
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { handleApiError } from '../../../utils/apiHelpers';
import { useRouter } from 'next/router';
import axiosInstance from '../../../utils/axios';
import CssTextField from '../../../components/CssTextField';
import dynamic from 'next/dynamic';
import ModelDialogue from '../../../components/Dialog/ModelDialogue';
import { AuthContext } from '../../../context/auth.context';
import { useParams } from 'next/navigation';
import { KlientContext } from '../../../context/klient.context';
import PrivateRoute from '../../../components/PrivateRoute';

const Brief = React.memo(() => {
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

  const router = useRouter();
  const [empfaenger, setEmpfaenger] = useState({});
  const [templates, setTemplates] = useState([]);
  const [briefData, setBriefData] = useState({
    Empfaenger: 'klient',
    Briefvorlage: 'none',
  });
  const [open, setOpen] = useState(false);
  const editor = useRef(null);

  const getKlientById = async () => {
    try {
      const response = await axiosInstance.get(`klient/getById/${params?.id}`);
      const responseData = response?.data?.data;
      setEmpfaenger(responseData);
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
  }, [params]);

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
      if (responseData) {
        const link = document.createElement('a');
        link.href = 'data:application/pdf;base64,' + responseData?.base64Pdf;
        link.setAttribute('download', responseData?.fileName);
        link.setAttribute('target', '_blank');
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
      }

      if (klientState?.brief?.length > 0) {
        router.push(`/app/brief/${klientState?.brief?.[0]}`);
      } else {
        router.push('/app/klientinnen');
      }
      setOpen(false);
      setBriefData({
        Empfaenger: '',
        Briefvorlage: 'none',
      });
      reset();
    } catch (error) {
      handleApiError(error, router);
    }
  };

  const onSubmit = () => {
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

  const options = () => {
    return (
      <>
        <div
          className="flex items-center mt-5 cursor-pointer"
          onClick={() => handleBriefAction(1)}
        >
          <svg
            className="mr-2"
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M16 3.99951V22.9995"
              stroke="#2B86FC"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M7 13.9995L16 22.9995L25 13.9995"
              stroke="#2B86FC"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M5 26.9995H27"
              stroke="#2B86FC"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          <span className="text-[#2B86FC] interFonts text-base font-medium">
            Download als PDF
          </span>
        </div>
        <div
          className="flex items-center mt-2 cursor-pointer"
          onClick={() => handleBriefAction(2)}
        >
          <svg
            className="mr-2"
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M28 7L16 18L4 7"
              stroke="#2B86FC"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M4 7H28V24C28 24.2652 27.8946 24.5196 27.7071 24.7071C27.5196 24.8946 27.2652 25 27 25H5C4.73478 25 4.48043 24.8946 4.29289 24.7071C4.10536 24.5196 4 24.2652 4 24V7Z"
              stroke="#2B86FC"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M13.8184 16L4.30859 24.7174"
              stroke="#2B86FC"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M27.6916 24.7175L18.1816 16"
              stroke="#2B86FC"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          <span className="text-[#2B86FC] interFonts text-base font-medium">
            Versand per Email
          </span>
        </div>
        <div
          className="flex items-center mt-2 cursor-pointer"
          onClick={() => handleBriefAction(3)}
        >
          <svg
            className="mr-2"
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M16.5514 23.8416L22.8558 27.8358C23.6617 28.3464 24.6622 27.587 24.4231 26.6463L22.6016 19.481C22.5503 19.2815 22.5564 19.0715 22.6191 18.8752C22.6819 18.6789 22.7987 18.5044 22.9563 18.3715L28.6097 13.6661C29.3525 13.0478 28.9691 11.815 28.0147 11.7531L20.6318 11.2739C20.4329 11.2597 20.2422 11.1893 20.0818 11.0709C19.9214 10.9525 19.7979 10.791 19.7258 10.6051L16.9722 3.67097C16.8974 3.4737 16.7643 3.30387 16.5906 3.18403C16.417 3.06418 16.211 3 16 3C15.789 3 15.583 3.06418 15.4094 3.18403C15.2357 3.30387 15.1026 3.4737 15.0278 3.67097L12.2742 10.6051C12.2021 10.791 12.0786 10.9525 11.9182 11.0709C11.7578 11.1893 11.5671 11.2597 11.3682 11.2739L3.98525 11.7531C3.03087 11.815 2.64746 13.0478 3.3903 13.6661L9.04371 18.3715C9.20126 18.5044 9.31813 18.6789 9.38088 18.8752C9.44362 19.0715 9.4497 19.2815 9.39841 19.481L7.70918 26.126C7.42222 27.2549 8.62287 28.1661 9.58991 27.5534L15.4486 23.8416C15.6134 23.7367 15.8047 23.681 16 23.681C16.1953 23.681 16.3866 23.7367 16.5514 23.8416V23.8416Z"
              stroke="#2B86FC"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          <span className="text-[#2B86FC] interFonts text-base font-medium">
            Download als PDF & Versand per Email
          </span>
        </div>
      </>
    );
  };

  return (
    <AppLayout>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container sx={{ mb: 4 }}>
          <Grid item xs={12}>
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: 36,
                lineHeight: 1.6,
                color: '#363F4A',
                fontFamily: 'inter Tight',
              }}
            >
              Brief
            </Typography>
          </Grid>
        </Grid>

        <Grid container spacing={spacing}>
          <Grid item xs={12} sm={12} md={6} xl={6}>
            <FormControl sx={{ mt: 4 }} fullWidth>
              <InputLabel
                id="Empfaenger"
                className="text-md"
                sx={{
                  fontStyle: 'normal',
                  fontWeight: 400,
                }}
              >
                Empfänger
              </InputLabel>
              <Controller
                name="Empfaenger"
                control={control}
                {...register('Empfaenger', { required: true })}
                render={({ field }) => (
                  <Select
                    labelId="Empfaenger"
                    label="Empfaenger"
                    fullWidth
                    {...field}
                    error={!!errors.Empfaenger}
                    onChange={(e) => handleEmpfaenger(e?.target?.value)}
                    value={field.value || ''}
                  >
                    <MenuItem value={'klient'} key={`klient`}>
                      Klient:in
                    </MenuItem>
                    <MenuItem value={'arzt'} key={`arzt`}>
                      Betreuender Arzt
                    </MenuItem>
                  </Select>
                )}
              />
              {errors?.Empfaenger && (
                <span className="validationErr">
                  Dieses Feld ist ein Pflichtfeld
                </span>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={12} md={6} xl={6}>
            <FormControl sx={{ mt: 4 }} fullWidth>
              <InputLabel
                id="Briefvorlage"
                className="text-md"
                sx={{
                  fontStyle: 'normal',
                  fontWeight: 400,
                }}
              >
                Briefvorlage
              </InputLabel>
              <Controller
                name="Briefvorlage"
                control={control}
                {...register('Briefvorlage')}
                render={({ field }) => (
                  <Select
                    labelId="Briefvorlage"
                    label="Briefvorlage"
                    fullWidth
                    {...field}
                    error={!!errors.Briefvorlage}
                    onChange={(e) => {
                      handleBriefvorlageChange(e?.target?.value);
                    }}
                    value={field.value || ''}
                  >
                    {briefData?.Empfaenger && (
                      <MenuItem value={'none'}>None</MenuItem>
                    )}
                    {templates?.map((item) => {
                      return (
                        <MenuItem value={item?.templateId}>
                          {item?.name}
                        </MenuItem>
                      );
                    })}
                  </Select>
                )}
              />
            </FormControl>
          </Grid>
        </Grid>

        <Grid container spacing={spacing}>
          <Grid item xs={12} sm={12} md={12} xl={12}>
            <CssTextField
              name="Betreff"
              sx={{ mt: [2, 0, 2] }}
              type="text"
              focusColor="#3C3C3C"
              id="Betreff"
              fullWidth
              label="Betreff"
              variant="outlined"
              {...register('Betreff', { required: true })}
              error={!!errors.Betreff}
              inputProps={{
                className: 'interFonts',
              }}
              value={briefData?.Betreff || ''}
              onChange={(e) => handleChange('Betreff', e?.target?.value)}
            />

            {errors?.Betreff && (
              <span className="validationErr">
                Dieses Feld ist ein Pflichtfeld
              </span>
            )}
          </Grid>
        </Grid>

        <Grid container spacing={spacing}>
          <Grid item xs={12} sx={{ mt: [2, 0, 2] }}>
            <Controller
              name="Inhalt"
              control={control}
              {...register('Inhalt', { required: true })}
              render={({ field }) => (
                <DynamicJoditEditor
                  ref={editor}
                  config={{
                    placeholder: 'Inhalt',
                    readonly: false,
                    toolbarAdaptive: false,
                    buttons: [
                      'bold',
                      'italic',
                      'underline',
                      '|',
                      'ul',
                      'ol',
                      'align',
                      '|',
                    ],
                    statusbar: false,
                  }}
                  onBlur={(text) => {
                    field.onChange(text);
                    handleChange('Inhalt', text);
                  }}
                  value={field.value || ''}
                />
              )}
            />

            {errors?.Inhalt && (
              <span className="validationErr">
                Dieses Feld ist ein Pflichtfeld
              </span>
            )}
          </Grid>
        </Grid>

        <Grid container spacing={spacing}>
          <Grid item xs={12} sm={12} md={12} xl={12}>
            <CssTextField
              name="Unterschriftsfeld1"
              sx={{ mt: [2, 0, 2] }}
              type="text"
              focusColor="#3C3C3C"
              id="Unterschriftsfeld1"
              fullWidth
              label="Unterschriftsfeld 1"
              variant="outlined"
              {...register('Unterschriftsfeld1', { required: true })}
              error={!!errors.Unterschriftsfeld1}
              inputProps={{
                className: 'interFonts',
              }}
              value={briefData?.Unterschriftsfeld1 || ''}
              onChange={(e) =>
                handleChange('Unterschriftsfeld1', e?.target?.value)
              }
            />

            {errors?.Unterschriftsfeld1 && (
              <span className="validationErr">
                Dieses Feld ist ein Pflichtfeld
              </span>
            )}
          </Grid>
        </Grid>

        <Grid container spacing={spacing}>
          <Grid item xs={12} sm={12} md={12} xl={12}>
            <CssTextField
              name="Unterschriftsfeld2"
              sx={{ mt: [2, 0, 2] }}
              type="text"
              focusColor="#3C3C3C"
              id="Unterschriftsfeld2"
              fullWidth
              label="Unterschriftsfeld 2"
              variant="outlined"
              {...register('Unterschriftsfeld2', { required: true })}
              error={!!errors.Unterschriftsfeld2}
              inputProps={{
                className: 'interFonts',
              }}
              value={briefData?.Unterschriftsfeld2 || ''}
              onChange={(e) =>
                handleChange('Unterschriftsfeld2', e?.target?.value)
              }
            />

            {errors?.Unterschriftsfeld2 && (
              <span className="validationErr">
                Dieses Feld ist ein Pflichtfeld
              </span>
            )}
          </Grid>
        </Grid>

        <Grid container spacing={spacing} sx={{ mt: 6 }}>
          <Grid item xs={6} sm={6} md={6} xl={6} style={{ textAlign: 'left' }}>
            <button
              type="button"
              className="w-107 h-[42px] bg-[#FBD6D8] text-[#E30C40] hover:bg-[#E30C40] hover:text-[#fff] px-5 py-2 rounded-[4px] justify-center items-center gap-2.5 inline-flex text-center text-sm font-medium interFonts"
              onClick={() => router.back()}
            >
              Abbrechen
            </button>
          </Grid>
          <Grid item xs={6} sm={6} md={6} xl={6} style={{ textAlign: 'right' }}>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-107 h-[42px] bg-[#EEE] text-[#0E0E0E] hover:bg-[#2B86FC] hover:text-[#FFFFFF]  px-5 py-2 rounded-[4px] justify-center items-center gap-2.5 inline-flex text-center text-sm font-medium interFonts"
            >
              Bestätigen
            </button>
          </Grid>
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
        options={options()}
        cancelHide={false}
        submitHide={true}
      />
    </AppLayout>
  );
});
export default PrivateRoute(Brief);
