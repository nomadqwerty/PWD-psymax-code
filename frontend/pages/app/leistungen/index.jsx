import React, { useEffect, useState } from 'react';
import Button from '../../../components/common/Button';
import {
  Grid,
  InputAdornment,
  TablePagination,
  Typography,
} from '@mui/material';
import AppLayout from '../../../components/AppLayout';
import { useRouter } from 'next/router';
import axiosInstance from '../../../utils/axios';
import CssTextField from '../../../components/CssTextField';
import ModelDialogue from '../../../components/Dialog/ModelDialogue';
import { handleApiError } from '../../../utils/apiHelpers';
import PrivateRoute from '../../../components/PrivateRoute';
import toast from 'react-hot-toast';

const Leistungen = () => {
  const [leistungenAbrechnung, setLeistungenAbrechnung] = useState([]);
  const [leistungenTerminplanung, setLeistungenTerminplanung] = useState([]);
  const [globalPoint, setGlobalPoint] = useState('');
  const [open, setOpen] = useState(false);
  const [deleteData, setDeleteData] = useState({});
  const [search, setSearch] = useState('');
  const [abrechnungPage, setAbrechnungPage] = useState({
    pagenum: 1,
    total: 0,
  });
  const [terminplanungPage, setTerminplanungPage] = useState({
    pagenum: 1,
    total: 0,
  });
  const router = useRouter();

  const agreeModel = async () => {
    try {
      setOpen(!open);
      if (deleteData?.flag === 1) {
        const response = await axiosInstance.delete(
          `/leistungen/abrechnungRemove/${deleteData?.id}`
        );
        if (response?.status === 200) {
          await getLeistungenAbrechnung(abrechnungPage?.pagenum);
          toast.success(response?.data?.message);
        }
      } else if (deleteData?.flag === 2) {
        const response = await axiosInstance.delete(
          `/leistungen/terminplanungRemove/${deleteData?.id}`
        );
        if (response?.status === 200) {
          await getLeistungenTerminplanung(abrechnungPage?.pagenum);
          toast.success(response?.data?.message);
        }
      }

      setDeleteData('');
    } catch (error) {
      setOpen(!open);
      handleApiError(error, router);
    }
  };

  const closeModel = () => {
    setOpen(false);
    setDeleteData('');
  };

  const getGlobalPointValue = async () => {
    try {
      const response = await axiosInstance.get(
        '/leistungen/getGlobalPointValue/'
      );
      setGlobalPoint(response?.data?.data);
    } catch (error) {
      handleApiError(error, router);
    }
  };

  const handleGlobalPointBlur = async (event) => {
    try {
      await axiosInstance.put('/leistungen/updateGlobalPointValue', {
        value: event?.target?.value,
      });
    } catch (error) {
      handleApiError(error, router);
    }
  };

  const getLeistungenAbrechnung = async (pagenum) => {
    try {
      const response = await axiosInstance.get(
        `leistungen/getAllAbrechnung?page=${pagenum}&pageSize=${process.env.NEXT_PUBLIC_PAGINATION_LIMIT}&search=${search}`
      );
      const responseData = response?.data?.data;
      setAbrechnungPage({
        ...abrechnungPage,
        pagenum: pagenum,
        total: responseData?.totalCount,
      });
      setLeistungenAbrechnung(responseData?.list);
    } catch (error) {
      handleApiError(error, router);
    }
  };

  const getLeistungenTerminplanung = async (pagenum) => {
    try {
      const response = await axiosInstance.get(
        `leistungen/getAllTerminplanung?page=${pagenum}&pageSize=${process.env.NEXT_PUBLIC_PAGINATION_LIMIT}&search=${search}`
      );
      const responseData = response?.data?.data;
      setTerminplanungPage({
        ...terminplanungPage,
        pagenum: pagenum,
        total: responseData?.totalCount,
      });
      setLeistungenTerminplanung(responseData?.list);
    } catch (error) {
      handleApiError(error, router);
    }
  };

  useEffect(() => {
    getGlobalPointValue();
  }, []);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('psymax-user-data'));
    if (!userData?.Chiffre) {
      return router.push('/app/kontoeinstellungen');
    }
    setAbrechnungPage({ ...abrechnungPage, pagenum: 1, total: 0 });
    setTerminplanungPage({ ...terminplanungPage, pagenum: 1, total: 0 });
    getLeistungenAbrechnung(1);
    getLeistungenTerminplanung(1);
  }, [search]);

  return (
    <AppLayout>
      <Grid container sx={{ mb: 4, alignItems: 'center' }} spacing={2}>
        <Grid item xs={12} sm={12} md={12} lg={6}>
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: 36,
              lineHeight: 1.6,
              color: '#363F4A',
              fontFamily: 'inter Tight',
            }}
          >
            Leistungen
          </Typography>
        </Grid>
        <Grid item xs={6} sm={6} md={6} lg={3} className="newJustificationBtn">
          <CssTextField
            name="GlobalerPunktwert"
            type="number"
            focusColor="#3C3C3C"
            id="GlobalerPunktwert"
            fullWidth
            label="Globaler Punktwert"
            variant="outlined"
            inputProps={{
              className: 'interFonts',
            }}
            value={parseFloat(globalPoint)}
            InputProps={{
              endAdornment: <InputAdornment position="end">€</InputAdornment>,
            }}
            onChange={(event) => {
              const newValue = parseFloat(event.target.value) || 0;
              setGlobalPoint(newValue);
            }}
            onBlur={handleGlobalPointBlur}
          />
        </Grid>
        <Grid item xs={6} sm={6} md={6} lg={3}>
          <CssTextField
            name="Suche"
            type="text"
            focusColor="#3C3C3C"
            id="Suche"
            fullWidth
            label="Suche"
            variant="outlined"
            inputProps={{
              className: 'interFonts',
            }}
            value={search}
            onChange={(event) => {
              const inputValue = event.target.value;
              const alphanumericRegex = /^[a-zA-Z0-9]*$/;
              if (alphanumericRegex.test(inputValue)) {
                setSearch(inputValue);
              }
            }}
          />
        </Grid>
      </Grid>

      <Grid container sx={{ mb: 4, mt: 2, alignItems: 'center' }} spacing={2}>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: 28,
              lineHeight: 1.6,
              color: '#3C3C3C',
              fontFamily: 'inter Tight',
            }}
          >
            Leistungsspezifikation für die Abrechnung
          </Typography>
        </Grid>
      </Grid>

      <div className="bg-[#F3F3F3] px-4 py-4">
        <Typography className="text-[#0E0E0E] text-[18px] font-bold interFonts leading-[30px]">
          Hinweis
        </Typography>
        <Typography className="text-[#707070] text-[18px] font-normal interFonts pt-[12px] leading-[30px]">
          Die hier erstellten Leistungen können Sie in Ihrer Abrechnung
          auswählen.
        </Typography>
      </div>

      <div className="flex flex-col gap-[24px] mt-8">
        {leistungenAbrechnung?.map((leistungen, index) => {
          return (
            <div
              key={index}
              className="flex items-baseline w-full border-[1px] p-[16px] border-[#D6D8DC] radius4"
            >
              <div
                className="text-[#2B86FC] font-normal text-base leading-[26px] xs:w-[60%] sm:w-[20%] md:w-[30%] lg:w-[25%] xl:w-[18%] cursor-pointer"
                onClick={() =>
                  router.push(`/app/leistungen/abrechnung/${leistungen?._id}`)
                }
              >
                {leistungen?.Leistung}
              </div>

              <div className="text-[#707070] font-normal text-base leading-[26px] xs:w-[60%] sm:w-[20%] md:w-[30%] lg:w-[25%] xl:w-[18%] cursor-pointer">
                {leistungen?.GopNr}
              </div>

              <div className="text-[#707070] font-normal text-base leading-[26px] xs:w-[60%] sm:w-[20%] md:w-[30%] lg:w-[25%] xl:w-[18%] cursor-pointer">
                {leistungen?.Betrag}
              </div>

              <div className="xs:w-[50%] sm:w-[50%] md:w-[30%] lg:w-[40%] xl:w-[50%] xs:text-left sm:text-left md:text-left lg:text-right">
                <Button
                  size="xm"
                  varient="primary"
                  className="radius4 xs:mr-1 sm:mr-5 xs:my-2 md:mb-1 sm:mb-0"
                  onClick={() =>
                    router.push(`/app/leistungen/abrechnung/${leistungen?._id}`)
                  }
                >
                  Bearbeiten
                </Button>
                <Button
                  size="xm"
                  varient="destructive"
                  className="radius4 xs:my-2 md:mb-1 sm:mb-0"
                  onClick={() => {
                    setOpen(true);
                    setDeleteData({
                      id: leistungen?._id,
                      flag: 1,
                    });
                  }}
                >
                  Entfernen
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      <Button
        className="mt-[24px] w-full flex font-normal items-center justify-center border-[1px] border-dashed bg-transparent"
        varient="secondary"
        size="md"
        onClick={() => router.push('/app/leistungen/abrechnung/add')}
      >
        Bitte klicken, um eine neue Leistung hinzuzufügen
      </Button>

      <Grid container sx={{ alignItems: 'center' }}>
        <Grid item xs={12}>
          <TablePagination
            component="div"
            count={abrechnungPage?.total}
            page={abrechnungPage?.pagenum - 1}
            rowsPerPage={process.env.NEXT_PUBLIC_PAGINATION_LIMIT}
            labelRowsPerPage=""
            sx={{
              '& .MuiTablePagination-input': {
                marginRight: '5px !important',
                display: 'none',
              },
              '& .MuiTablePagination-actions': {
                marginLeft: '5px !important',
              },
              '& .MuiTablePagination-toolbar': {
                justifyContent: 'center',
                paddingLeft: '0px',
                paddingRight: '0px',
              },
              '@media (min-width: 600px)': {
                '& .MuiTablePagination-toolbar': {
                  justifyContent: 'flex-end',
                },
              },
            }}
            onPageChange={(_, newPage) => {
              getLeistungenAbrechnung(newPage + 1);
            }}
          />
        </Grid>
      </Grid>

      <Grid container sx={{ mb: 4, mt: 2, alignItems: 'center' }} spacing={2}>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: 28,
              lineHeight: 1.6,
              color: '#3C3C3C',
              fontFamily: 'inter Tight',
            }}
          >
            Leistungsspezifikation für Ihre Terminplanung
          </Typography>
        </Grid>
      </Grid>

      <div className="bg-[#F3F3F3] px-4 py-4">
        <Typography className="text-[#0E0E0E] text-[18px] font-bold interFonts leading-[30px]">
          Hinweis
        </Typography>
        <Typography className="text-[#707070] text-[18px] font-normal interFonts pt-[12px] leading-[30px]">
          Die hier erstellten Leistungen können Sie in Ihrer Terminplanung mit
          Zeiteinheiten ausweisen.
        </Typography>
      </div>

      <div className="flex flex-col gap-[24px] mt-8">
        {leistungenTerminplanung?.map((leistungen, index) => {
          return (
            <div
              key={index}
              className="flex items-baseline w-full border-[1px] p-[16px] border-[#D6D8DC] radius4"
            >
              <div
                className="text-[#2B86FC] font-normal text-base leading-[26px] xs:w-[50%] sm:w-[50%] md:w-[70%] lg:w-[60%] xl:w-[50%] cursor-pointer"
                onClick={() =>
                  router.push(
                    `/app/leistungen/terminplanung/${leistungen?._id}`
                  )
                }
              >
                {leistungen?.Leistung}
              </div>

              <div className="xs:w-[50%] sm:w-[50%] md:w-[30%] lg:w-[40%] xl:w-[50%] xs:text-left sm:text-left md:text-left lg:text-right">
                <Button
                  size="xm"
                  varient="primary"
                  className="radius4 xs:mr-1 sm:mr-5 xs:my-2 md:mb-1 sm:mb-0"
                  onClick={() =>
                    router.push(
                      `/app/leistungen/terminplanung/${leistungen?._id}`
                    )
                  }
                >
                  Bearbeiten
                </Button>
                <Button
                  size="xm"
                  varient="destructive"
                  className="radius4 xs:my-2 md:mb-1 sm:mb-0"
                  onClick={() => {
                    setOpen(true);
                    setDeleteData({
                      id: leistungen?._id,
                      flag: 2,
                    });
                  }}
                >
                  Entfernen
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      <Button
        className="mt-[24px] w-full flex font-normal items-center justify-center border-[1px] border-dashed bg-transparent"
        varient="secondary"
        size="md"
        onClick={() => router.push('/app/leistungen/terminplanung/add')}
      >
        Bitte klicken, um eine neue Leistung hinzuzufügen
      </Button>

      <Grid container sx={{ alignItems: 'center' }}>
        <Grid item xs={12}>
          <TablePagination
            component="div"
            count={terminplanungPage?.total}
            page={terminplanungPage?.pagenum - 1}
            rowsPerPage={process.env.NEXT_PUBLIC_PAGINATION_LIMIT}
            labelRowsPerPage=""
            sx={{
              '& .MuiTablePagination-input': {
                marginRight: '5px !important',
                display: 'none',
              },
              '& .MuiTablePagination-actions': {
                marginLeft: '5px !important',
              },
              '& .MuiTablePagination-toolbar': {
                justifyContent: 'center',
                paddingLeft: '0px',
                paddingRight: '0px',
              },
              '@media (min-width: 600px)': {
                '& .MuiTablePagination-toolbar': {
                  justifyContent: 'flex-end',
                },
              },
            }}
            onPageChange={(_, newPage) => {
              getLeistungenTerminplanung(newPage + 1);
            }}
          />
        </Grid>
      </Grid>

      <ModelDialogue
        open={open}
        setOpen={setOpen}
        actionTitle={'Aktion überprüfen'}
        confirmationText={
          'Bitte überprüfen Sie Ihre Aktion. Die von Ihnen beabsichtigte Aktion kann nicht rückgängig gemacht werden.'
        }
        agreeModel={agreeModel}
        closeModel={closeModel}
        options={''}
        cancelHide={false}
        submitHide={false}
      />
    </AppLayout>
  );
};

export default PrivateRoute(Leistungen);
