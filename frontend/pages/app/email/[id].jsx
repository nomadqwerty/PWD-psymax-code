import React, { useContext, useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
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
import FileUpload from '../../../components/FileUpload';
import { KlientContext } from '../../../context/klient.context';
import { MAXPDFSIZE } from '../../../utils/constants';
import PrivateRoute from '../../../components/PrivateRoute';

const Email = React.memo(() => {
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
      setKlient(responseData);
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
          router.push(`/app/email/${klientState?.email?.[0]}`);
        } else {
          router.push('/app/klientinnen');
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

  const DynamicJoditEditor = dynamic(() => import('jodit-react'), {
    ssr: false,
  });

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
              Email
            </Typography>
          </Grid>
        </Grid>

        <Grid container spacing={spacing}>
          <Grid item xs={12} sm={12} md={6} xl={6}>
            <CssTextField
              name="Betreff"
              sx={{ mt: [4, 0, 4] }}
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
              InputLabelProps={{
                shrink: !!getValues('Betreff'),
              }}
              onChange={(e) => handleChange('Betreff', e?.target?.value)}
            />

            {errors?.Betreff && (
              <span className="validationErr">
                Dieses Feld ist ein Pflichtfeld
              </span>
            )}
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
                      setSelectedBriefvorlage(e.target.value);
                      handleBriefvorlageChange(e?.target?.value);
                    }}
                    value={selectedBriefvorlage}
                  >
                    <MenuItem value={'none'}>None</MenuItem>
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
          <Grid item xs={12} sm={12} md={12} xl={12}></Grid>
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
                  value={getValues('Inhalt')}
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
          <Grid item xs={6} sx={{ mt: [2, 0, 2] }}>
            <FileUpload
              maxSize={MAXPDFSIZE}
              acceptExtensions={['application/pdf']}
              uploadedFiles={uploadedFiles}
              setUploadedFiles={setUploadedFiles}
            />
          </Grid>
          <Grid item xs={6} sx={{ mt: [2, 0, 2] }}>
            {uploadedFiles.map((file, index) => (
              <p
                className="flex items-center my-1 ml-3"
                style={{ overflowWrap: 'anywhere' }}
              >
                <svg
                  className="mr-2"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12.4995 6.24963L5.99112 12.8661C5.7567 13.1006 5.625 13.4185 5.625 13.75C5.625 14.0815 5.7567 14.3995 5.99112 14.6339C6.22554 14.8683 6.54348 15 6.875 15C7.20652 15 7.52446 14.8683 7.75888 14.6339L15.5173 6.7674C15.7495 6.53525 15.9336 6.25966 16.0592 5.95634C16.1849 5.65303 16.2495 5.32794 16.2495 4.99963C16.2495 4.67133 16.1849 4.34624 16.0592 4.04293C15.9336 3.73961 15.7495 3.46401 15.5173 3.23187C15.2852 2.99972 15.0096 2.81557 14.7063 2.68994C14.4029 2.5643 14.0778 2.49963 13.7495 2.49963C13.4212 2.49963 13.0961 2.5643 12.7928 2.68994C12.4895 2.81557 12.2139 2.99972 11.9818 3.23187L4.22335 11.0984C3.52009 11.8016 3.125 12.7555 3.125 13.75C3.125 14.7446 3.52009 15.6984 4.22335 16.4017C4.92661 17.1049 5.88044 17.5 6.875 17.5C7.86956 17.5 8.82339 17.1049 9.52665 16.4017L15.937 9.99964"
                    stroke="#2B86FC"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span
                  key={file.name}
                  className="text-[#2B86FC] interFonts text-base"
                >
                  {file.name}
                </span>
                <span
                  className="ml-3 cursor-pointer"
                  onClick={() => deleteFile(index)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="10"
                    height="10"
                    viewBox="0 0 10 10"
                    fill="none"
                  >
                    <path
                      d="M9 1L1 9"
                      stroke="#0E0E0E"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M9 9L1 1"
                      stroke="#0E0E0E"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </span>
              </p>
            ))}
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
              Email absenden
            </button>
          </Grid>
        </Grid>
      </form>
    </AppLayout>
  );
});
export default PrivateRoute(Email);
