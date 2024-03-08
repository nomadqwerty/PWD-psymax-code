'use client';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

import useSWR from 'swr';
import toast from 'react-hot-toast';
import {
  Collapse,
  List,
  Button,
  Grid,
  ListItem,
  TextField,
  Typography,
} from '@mui/material';
import { TransitionGroup } from 'react-transition-group';
import { GridColDef } from '@mui/x-data-grid';

import axiosInstance from '../../../../utils/axios';
import QuestionnaireModel from '../../../../components/questionnaire/shared/QuestionnaireModel';
import { SOMETHING_WRONG } from '../../../../utils/constants';
import AppLayout from '../../../../components/AppLayout';
import formatDate from '../../../../components/questionnaire/shared/FormatDate';

const fetchQuestionnaires = async (url: string) => {
  const response = await axiosInstance.get(url);
  return response.data;
};

const QuestionnaireEditOverview: React.FC = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [questionnaires, setQuestionnaires] = React.useState<
    QuestionnaireModel[]
  >([]);

  const { data, error, isLoading } = useSWR(
    '/questionnaires',
    fetchQuestionnaires
  );

  useEffect(() => {
    if (data?.questionnaires) {
      setQuestionnaires(data.questionnaires);
    }
  }, [data]);

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Name', width: 200 },
    { field: 'questions', headerName: '#Items', width: 200 },
    { field: 'scale', headerName: 'Skala', width: 200 },
    { field: 'creationDate', headerName: 'Erstelldatum', width: 200 },
    { field: 'actions', headerName: 'Aktionen', width: 200 },
  ];

  const rows = questionnaires.map((questionnaire) => {
    return {
      id: questionnaire._id,
      name: questionnaire.name,
      questions: questionnaire.questions.length,
      scale: `${questionnaire.scale[0].name} - ${
        questionnaire.scale[questionnaire.scale.length - 1].name
      }`,
      creationDate: formatDate(questionnaire.creationDate),
      actions: '',
    };
  });

  const deleteQuestionnaire = async (id: string) => {
    try {
      const res = await axiosInstance.delete(`/questionnaires/${id}`);
      setQuestionnaires(questionnaires.filter((q) => q._id !== id));
      toast.success(res.data.message);
    } catch (error) {
      toast.error(SOMETHING_WRONG);
    }
  };

  if (isLoading)
    return (
      <AppLayout>
        <span></span>
      </AppLayout>
    );

  if (error) {
    // if the user is not authenticated, redirect to login page
    if (error.response?.status === 401) {
      router.push('/login');
    }

    return (
      <AppLayout>
        <div>Error...</div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className=" mb-28">
        <Grid container sx={{ mb: 4, alignItems: 'center' }} spacing={2}>
          <Grid item xs={12} sm={12} md={12} lg={6}>
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: 36,
                lineHeight: 1.6,
                color: '#3C3C3C',
                fontFamily: 'inter Tight',
              }}
            >
              Fragebogeneditor
            </Typography>
          </Grid>
          <Grid
            item
            xs={6}
            sm={6}
            md={6}
            lg={3}
            className="newJustificationBtn"
          >
            <Button
              variant={'text'}
              size="medium"
              className="px-0 sm:px-1 py-4 lg:px-4 hover:bg-gray-200 hover:border-slate-200 border interFonts md:py-4 bg-[#EEE] font-semibold w-full"
              sx={{ border: '1px solid #DDD' }}
              onClick={() => router.push('/dashboard/questionnaire/edit/new')}
            >
              Neuen Fragebogen hinzufügen
            </Button>
          </Grid>
          <Grid item xs={6} sm={6} md={6} lg={3}>
            <TextField
              name="Suche"
              type="text"
              id="Suche"
              fullWidth
              label="Suche"
              variant="outlined"
              inputProps={{
                className: 'interFonts',
              }}
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(() => event.target.value.toLowerCase())
              }
            />
          </Grid>
        </Grid>

        <Grid container sx={{ mb: 4, mt: 2, alignItems: 'center' }} spacing={2}>
          <Grid item xs={12} sm={12} md={12} lg={6}>
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: 28,
                lineHeight: 1.6,
                color: '#3C3C3C',
                fontFamily: 'inter Tight',
              }}
            >
              Fragebögen
            </Typography>
          </Grid>
        </Grid>

        <div className="flex flex-col gap-1 ">
          <div className="flex items-center w-full border-[1px] border-[#D6D8DC] radius4 bg-[#f3f3f3] px-2 py-3 lg:px-6 lg:py-4 interFonts">
            <span className="text-[#3C3C3C] font-normal text-base leading-[26px] w-[40%] sm:w-[20%] md:w-[30%] lg:w-[25%] xl:w-[20%]">
              Name
            </span>
            <div className="text-[#3C3C3C] font-normal leading-[26px] text-base w-[20%] sm:w-[10%] md:w-[10%] lg:w-[10%] xl:w-[10%]">
              #Items
            </div>
            <div className="text-[#3C3C3C] font-normal leading-[26px] text-base w-[20%] sm:w-[20%] md:w-[30%] lg:w-[25%] xl:w-[30%]">
              Skala
            </div>
            <div className="text-[#3C3C3C] font-normal leading-[26px] text-base w-[20%] sm:w-[20%] md:w-[30%] lg:w-[25%] xl:w-[10%]">
              Erstelldatum
            </div>
            <div className="w-[40%] sm:w-[50%] md:w-[30%] lg:w-[40%] xl:w-auto ml-auto text-left sm:text-right"></div>
          </div>

          <List>
            <TransitionGroup>
              {questionnaires
                ?.filter((questionnaire) =>
                  questionnaire.name.toLowerCase().includes(searchTerm)
                )
                .map((questionnaire, index) => {
                  return (
                    <Collapse key={index}>
                      <ListItem />
                      <div
                        className="flex items-center w-full border-[1px] border-[#D6D8DC] radius4 px-2 py-2 lg:px-6"
                        key={`${index}`}
                      >
                        <div className="text-[#2B86FC] font-normal text-base leading-[26px] w-[40%] sm:w-[20%] md:w-[30%] lg:w-[25%] xl:w-[20%] cursor-pointer">
                          {questionnaire?.name}
                        </div>
                        <div className="text-[#707070] font-normal leading-[26px] text-base w-[20%] sm:w-[10%] md:w-[10%] lg:w-[10%] xl:w-[10%]">
                          {questionnaire?.questions.length}
                        </div>
                        <div className="text-[#707070] font-normal leading-[26px] text-base w-[20%] sm:w-[20%] md:w-[30%] lg:w-[25%] xl:w-[30%]">
                          {questionnaire.scale.length > 0 ? (
                            <>
                              <span>{`${questionnaire?.scale[0].name} - `}</span>
                              <span>{`${
                                questionnaire?.scale[
                                  questionnaire?.scale.length - 1
                                ].name
                              }`}</span>
                            </>
                          ) : (
                            ''
                          )}
                        </div>
                        <div className="text-[#707070] font-normal leading-[26px] text-base w-[20%] sm:w-[20%] md:w-[30%] lg:w-[25%] xl:w-[10%]">
                          {formatDate(questionnaire?.creationDate)}
                        </div>
                        <div className="w-[40%] sm:w-[50%] md:w-[30%] lg:w-[40%] xl:w-auto ml-auto text-left sm:text-left md:text-left lg:text-right">
                          <Button
                            size="medium"
                            className="radius4 sm:mr-5 my-2 md:mb-1 sm:mb-0 bg-[#EEE] hover:bg-[#d6d8dc] interFonts"
                            onClick={() =>
                              router.push(
                                `/dashboard/questionnaire/edit/${questionnaire?._id}`
                              )
                            }
                          >
                            Bearbeiten
                          </Button>
                          <Button
                            size="medium"
                            color="error"
                            className="radius4 my-2 md:mb-1 sm:mb-0"
                            onClick={() =>
                              deleteQuestionnaire(questionnaire?._id)
                            }
                          >
                            Entfernen
                          </Button>
                        </div>
                      </div>
                      <ListItem />
                    </Collapse>
                  );
                })}
            </TransitionGroup>
          </List>
          <Button
            className="w-full flex font-normal items-center justify-center border-[1px] border-dashed bg-transparent md:py-4 hover:bg-[#d6d8dc] hover:border-transparent interFonts"
            size="large"
            onClick={() => router.push('/dashboard/questionnaire/edit/new')}
          >
            Bitte klicken, um einen neuen Fragebogen zu erstellen.
          </Button>
        </div>
      </div>
    </AppLayout>
  );
};

export default QuestionnaireEditOverview;
