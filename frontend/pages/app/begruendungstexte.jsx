import React, { useEffect, useState } from 'react';
import Button from '../../components/common/Button';
import { Grid, TablePagination, Typography } from '@mui/material';
import AppLayout from '../../components/AppLayout';
import { useRouter } from 'next/router';
import axiosInstance from '../../utils/axios';
import { PAGINATION_LIMIT } from '../../utils/constants';
import CssTextField from '../../components/CssTextField';
import ModelDialogue from '../../components/Dialog/ModelDialogue';
import { handleApiError } from '../../utils/apiHelpers';
import PrivateRoute from '../../components/PrivateRoute';

const Begrundungstexte = () => {
  const [justificationDetails, setJustificationDetails] = useState([]);
  const [open, setOpen] = useState(false);
  const [deleteData, setDeleteData] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState({ pagenum: 1, total: 0 });
  const [activeInput, setActiveInput] = useState(null);
  const router = useRouter();

  const inputRefs = {};

  const handleFocus = (inputName) => {
    setActiveInput(inputName);
  };

  const agreeModel = async () => {
    setOpen(false);
    deletJustification(deleteData);
  };

  const closeModel = () => {
    setOpen(false);
    setDeleteData('');
  };

  const getJustifications = async (pagenum) => {
    try {
      const response = await axiosInstance.get(
        `begruendungstexte/getAll?page=${pagenum}&pageSize=${PAGINATION_LIMIT}&search=${search}`
      );
      const responseData = response?.data?.data;
      const finalData = [];
      if (responseData?.list?.length > 0) {
        responseData?.list?.map((item) => {
          finalData?.push({
            id: item?._id,
            begruendungstexte: item?.begruendungstexte,
          });
        });
      }
      setPage({
        ...page,
        pagenum: pagenum,
        total: responseData?.totalCount,
      });
      return finalData;
    } catch (error) {
      handleApiError(error, router);
    }
  };

  const setJustificationData = async (pagenum) => {
    let finalData = await getJustifications(pagenum);
    setJustificationDetails(finalData);
  };

  const handleChange = (e, index) => {
    const updatedDetails = [...justificationDetails];
    updatedDetails[index].begruendungstexte = e?.target?.value;
    setJustificationDetails(updatedDetails);
  };

  const handleBlur = (index) => {
    const updatedDetails = [...justificationDetails];
    updatedDetails[index].edit = false;
    setJustificationDetails(updatedDetails);
    setActiveInput(null);
  };

  const handleEdit = (index) => {
    const updatedDetails = [...justificationDetails];
    updatedDetails[index].edit = true;
    setJustificationDetails(updatedDetails);
    handleFocus(`begruendungstexte${index}`);
  };

  const handleSubmit = async () => {
    try {
      const newJustifications = justificationDetails.filter(
        (item) => item.id === '' && item?.begruendungstexte !== ''
      );
      const updatedJustifications = justificationDetails.filter(
        (item) => item.id !== '' && item?.begruendungstexte !== ''
      );

      if (newJustifications?.length > 0) {
        const payload = [];
        newJustifications?.map((item) => {
          payload.push({
            begruendungstexte: item?.begruendungstexte,
          });
        });
        await axiosInstance.post('/begruendungstexte/save', payload);
      }

      if (updatedJustifications?.length > 0) {
        const payload = [];
        updatedJustifications?.map((item) => {
          payload.push({
            id: item?.id,
            begruendungstexte: item?.begruendungstexte,
          });
        });
        await axiosInstance.put('/begruendungstexte/update', payload);
      }

      if (newJustifications?.length > 0 || updatedJustifications?.length > 0) {
        setJustificationData(page?.pagenum);
      }
    } catch (error) {
      handleApiError(error, router);
    }
  };

  const addJustification = async () => {
    const lastPage = Math.ceil(page?.total / PAGINATION_LIMIT);
    const finalData =
      page?.pagenum !== lastPage
        ? await getJustifications(lastPage)
        : justificationDetails;

    const updatedDetails = finalData.map((item) => ({ ...item, edit: false }));

    const newJustification = {
      begruendungstexte: '',
      id: '',
      edit: true,
    };

    setJustificationDetails([...updatedDetails, newJustification]);
    handleFocus(`begruendungstexte${updatedDetails.length}`);
  };

  const deletJustification = async (index) => {
    try {
      const id = justificationDetails[index]?.id;

      if (id) {
        await axiosInstance.delete(`begruendungstexte/remove/${id}`);
      } else {
        setJustificationDetails((prev) => prev.filter((_, i) => i !== index));
      }

      setJustificationData(page?.pagenum);
      setDeleteData('');
    } catch (error) {
      handleApiError(error, router);
    }
  };
  // Use useEffect to focus on the active input when it changes
  useEffect(() => {
    if (inputRefs[activeInput]) {
      inputRefs[activeInput].focus();
    }
  }, [activeInput]);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('psymax-user-data'));
    if (!userData?.Chiffre) {
      router.push('/app/kontoeinstellungen');
    }
    setPage({ ...page, pagenum: 1, total: 0 });
    setJustificationData(1);
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
            Begründungstexte
          </Typography>
        </Grid>
        <Grid item xs={6} sm={6} md={6} lg={3} className="newJustificationBtn">
          <button
            type="button"
            className="h-[59px] bg-[#EEE] px-5 py-2 rounded-[4px] justify-center items-center gap-2.5 inline-flex text-center text-[#0E0E0E] text-sm font-medium interFonts"
            onClick={() => addJustification()}
          >
            Neue Begründung hinzufügen
          </button>
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
                setSearch(event.target.value);
              }
            }}
          />
        </Grid>
      </Grid>

      <div className="flex flex-col gap-[24px]">
        {justificationDetails?.map((justification, index) => {
          const pagenumFinal = page?.pagenum > 0 ? page?.pagenum : 1;
          return (
            <div
              key={index}
              className="flex items-baseline w-full border-[1px] p-[16px] border-[#D6D8DC] radius4"
            >
              <span className="text-[#3C3C3C] font-normal text-base leading-[26px] xs:w-[20%] sm:w-[20%] md:w-[20%] lg:w-[15%] xl:w-[10%]">
                #{' '}
                {(index + 1 + PAGINATION_LIMIT * (pagenumFinal - 1))
                  .toString()
                  .padStart(3, '0')}
              </span>
              {!justification.edit ? (
                <div className="flex items-center  interFonts text-[#707070] font-normal leading-[26px] text-base xs:w-[70%] sm:w-[70%] md:w-[70%] lg:w-[75%] xl:w-[80%]">
                  <span className="pr-2">
                    {justification.begruendungstexte}
                  </span>
                  <svg
                    className="editBtn"
                    onClick={() => handleEdit(index)}
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
                </div>
              ) : (
                <input
                  ref={(input) =>
                    (inputRefs[`begruendungstexte${index}`] = input)
                  }
                  name="begruendungstexte"
                  type="text"
                  id="begruendungstexte"
                  className="interFonts text-[#707070] font-normal leading-[26px] text-base xs:w-[70%] sm:w-[70%] md:w-[70%] lg:w-[75%] xl:w-[80%]"
                  value={justification?.begruendungstexte}
                  onChange={(e) => handleChange(e, index)}
                  onBlur={() => handleBlur(index)}
                  style={{ outline: 'none' }}
                />
              )}
              <Button
                size="xm"
                varient="destructive"
                className="radius4"
                onClick={() => {
                  setOpen(true);
                  setDeleteData(index);
                }}
              >
                Entfernen
              </Button>
            </div>
          );
        })}
      </div>

      <Button
        className="mt-[24px] w-full flex font-normal items-center justify-center border-[1px] border-dashed bg-transparent"
        varient="secondary"
        size="md"
        onClick={() => addJustification()}
      >
        Bitte klicken, um eine neue Begründung hinzuzufügen.
      </Button>

      <Grid container sx={{ mt: 3, alignItems: 'center' }}>
        <Grid item xs={3} sm={3} md={2} lg={1} className="text-left ">
          <Button
            varient="primary"
            size="sm"
            className="px-4"
            onClick={() => router.back()}
          >
            Zurück
          </Button>
        </Grid>
        <Grid item xs={6} sm={6} md={8} lg={10}>
          <TablePagination
            component="div"
            count={page?.total}
            page={page?.pagenum - 1}
            rowsPerPage={PAGINATION_LIMIT}
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
            onPageChange={(_, newPage) => setJustificationData(newPage + 1)}
          />
        </Grid>
        <Grid item xs={3} sm={3} md={2} lg={1} className="text-right">
          <Button
            varient="primary"
            size="sm"
            className="px-4"
            onClick={handleSubmit}
          >
            Bestätigen
          </Button>
        </Grid>
      </Grid>
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
};

export default PrivateRoute(Begrundungstexte);
