'use client';
import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';

import { DataGrid, GridColDef, GridRowSpacingParams } from '@mui/x-data-grid';
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  Stack,
  TextField,
  Typography,
  Autocomplete,
  checkboxClasses,
} from '@mui/material';
import useSwr from 'swr';
import toast from 'react-hot-toast';

import AppLayout from '../../../../../components/AppLayout';
import QuestionnaireModel, {
  QuestionnaireQuestion,
} from '../../../../../components/questionnaire/shared/QuestionnaireModel';
import axiosInstance from '../../../../../utils/axios';
import { SOMETHING_WRONG } from '../../../../../utils/constants';
import gridStyling from '../../../../../components/questionnaire/shared/DataGridCustomStyling';

const fetchQuestionnaire = async (url: string) => {
  const response = await axiosInstance.get(url);
  return response.data;
};

const EditSVG = ({ onClick }) => {
  return (
    <svg
      className="editBtn cursor-pointer"
      onClick={onClick}
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
  );
};

const QuestionnaireEditDetail: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const params = useParams<{ questionnaireId: string }>();
  const router = useRouter();
  let editQuestionnaire = new QuestionnaireModel();
  const currentEditRef = useRef(null);

  useEffect(() => {
    console.log(currentEditRef);
  }, [currentEditRef]);

  const [questionnaireState, setQuestionnaireState] = useState({
    name: editQuestionnaire.name,
    questions: [...editQuestionnaire.questions],
    randomizeQuestions: editQuestionnaire.randomizeQuestions,
    scale: [...editQuestionnaire.scale],
  });

  const searchResults = questionnaireState.questions.filter((q) =>
    q.question.toLowerCase().includes(searchTerm)
  );

  const cleanEditState = {
    activeEditName: false,
    activeEditQuestion: null,
    activeEditFragetext: null,
    activeEditScaleName: null,
    activeEditScaleValue: null,
    activeEditQuestionType: null,
  };

  const [editState, setEditState] = useState(cleanEditState);

  const questionColumns: GridColDef[] = [
    {
      field: 'id',
      headerName: 'ID',
      width: 70,
      renderCell: (params) => {
        return (
          <Typography
            variant={'body2'}
            sx={{
              fontFamily: 'Inter Tight',
              letterSpacing: '0.5px',
              opacity: 0.9,
              fontSize: '0.9rem',
            }}
          >
            #{params.value.toString().padStart(3, '0')}
          </Typography>
        );
      },
    },
    {
      field: 'isRating',
      headerName: 'Type',
      width: 120,
      renderCell: (rowParams) => {
        return (
          <>
            {editState.activeEditQuestionType !== rowParams.row.id ? (
              <div className="flex items-center gap-2 text-gray-500">
                <span className="pr-1">
                  {rowParams.value ? 'Rating' : 'Eingabe'}
                </span>
                <EditSVG
                  onClick={() =>
                    activeEditQuestionTypeClickHandler(rowParams.row.id)
                  }
                />
              </div>
            ) : (
              <Autocomplete
                id="question-type"
                options={['Rating', 'Eingabe']}
                size="small"
                getOptionLabel={(option) => option}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Art der Frage"
                    variant="standard"
                    size="small"
                    onBlur={() => setEditState(() => cleanEditState)}
                    autoFocus={
                      editState.activeEditQuestionType === rowParams.row.id
                    }
                    style={{ outline: 'none' }}
                  />
                )}
                value={rowParams.value ? 'Rating' : 'Eingabe'}
                onChange={(_, newValue) =>
                  updateQuestionIsRating(newValue, rowParams.row.id)
                }
              />
            )}
          </>
        );
      },
    },
    {
      field: 'question',
      headerName: 'Question',
      flex: 1,
      minWidth: 450,
      maxWidth: 550,
      renderCell: (rowParams) => {
        return (
          <div className="h-fit w-full grid gap-4">
            {/* show fragetext only if the question is not a rating question */}
            {!rowParams.row.isRating && (
              <div>
                {editState.activeEditFragetext !== rowParams.row.id ? (
                  <div>
                    <Typography className="pr-2 text-gray-500 break-all">
                      {rowParams.row.fragetext}{' '}
                      <span className="d inline-block">
                        <EditSVG
                          onClick={() =>
                            activeEditQuestionFragetextClickHandler(
                              rowParams.row.id
                            )
                          }
                        />
                      </span>
                    </Typography>
                  </div>
                ) : (
                  <input
                    name="question-fragetext"
                    type="text"
                    id="question-fragetext"
                    className="interFonts text-md w-full outline-none interFonts"
                    placeholder="Fragetext"
                    autoFocus={
                      editState.activeEditFragetext === rowParams.row.id
                    }
                    // with mui data grid, space bar is used for cell navigation, so we need to stop propagation of the space bar keydown event
                    onKeyDown={(e) => e.stopPropagation()}
                    value={rowParams.row.fragetext}
                    onChange={(e) =>
                      editQuestionFrageTextChangeHandler(
                        rowParams.row.id,
                        e.target.value
                      )
                    }
                    onBlur={() =>
                      activeEditQuestionFragetextClickHandler(rowParams.row.id)
                    }
                  />
                )}
              </div>
            )}
            <div>
              {editState.activeEditQuestion !== rowParams.row.id ? (
                <div className="">
                  <Typography className="pr-2 text-gray-500 break-all">
                    {rowParams.value}{' '}
                    <span className="d inline-block">
                      <EditSVG
                        onClick={() =>
                          activeEditQuestionClickHandler(rowParams.row.id)
                        }
                      />
                    </span>
                  </Typography>
                </div>
              ) : (
                <input
                  name="questionnaire-question"
                  type="text"
                  id="questionnaire-question"
                  className="interFonts text-md w-full outline-none interFonts"
                  placeholder="Artikelname"
                  autoFocus={editState.activeEditQuestion === rowParams.row.id}
                  onKeyDown={(e) => e.stopPropagation()}
                  value={rowParams.value}
                  onChange={(e) =>
                    editQuestionChangeHandler(rowParams.row.id, e.target.value)
                  }
                  onBlur={() => {
                    activeEditQuestionClickHandler(rowParams.row.id);
                  }}
                />
              )}
            </div>
          </div>
        );
      },
    },
    {
      field: 'isRecoded',
      headerName: 'Recoded',
      align: 'center',
      width: 200,
      renderCell: (rowParams) => {
        return (
          <>
            {rowParams.row.isRating ? (
              <FormControl variant="standard">
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={rowParams.value}
                      onChange={(event) =>
                        updateQuestionisRecoded(event, rowParams.row.id)
                      }
                      sx={{
                        color: '#EEE',
                        [`&.${checkboxClasses.checked}`]: {
                          color: '#2B86FC',
                        },
                      }}
                    />
                  }
                  label="Recoding"
                />
              </FormControl>
            ) : (
              ''
            )}
          </>
        );
      },
    },
    {
      field: 'actions',
      headerName: '',
      width: 120,
      align: 'center',
      renderCell: (rowParams) => {
        return (
          <Button
            color="error"
            className="interFonts"
            onClick={() => removeQuestion(rowParams.row.id)}
          >
            Entfernen
          </Button>
        );
      },
    },
  ];

  const questionRows = searchResults.map((question, index) => {
    return {
      id: index + 1,
      _id: question.id,
      isRating: question.isRating,
      question: question.question,
      fragetext: question.fragetext,
      isRecoded: question.isRecoded,
      actions: '',
    };
  });

  const scaleColumns: GridColDef[] = [
    {
      field: 'id',
      headerName: 'ID',
      width: 70,
      renderCell: (params) => {
        return (
          <Typography
            variant={'body2'}
            sx={{
              fontFamily: 'Inter Tight',
              letterSpacing: '0.5px',
              opacity: 0.9,
              fontSize: '0.9rem',
            }}
          >
            #{params.value.toString().padStart(3, '0')}
          </Typography>
        );
      },
    },
    {
      field: 'name',
      headerName: 'Name',
      flex: 1,
      minWidth: 200,
      maxWidth: 650,
      renderCell: (rowParams) => {
        return (
          <>
            {editState.activeEditScaleName !== rowParams.row.id ? (
              <div className="flex items-center gap-2 w-auto text-gray-500 break-all">
                <span className="pr-1">{rowParams.value}</span>
                <EditSVG
                  onClick={() =>
                    activeEditScaleNameClickHandler(rowParams.row.id)
                  }
                />
              </div>
            ) : (
              <input
                name="item-name"
                type="text"
                id="item-name"
                className="interFonts text-md outline-none interFonts"
                placeholder="Skalenname"
                autoFocus={editState.activeEditScaleName === rowParams.row.id}
                value={rowParams.value}
                onChange={(e) =>
                  editScaleNameChangeHandler(rowParams.row.id, e.target.value)
                }
                onBlur={() => activeEditScaleNameClickHandler(rowParams.row.id)}
              />
            )}
          </>
        );
      },
    },
    {
      field: 'value',
      headerName: 'Wert',
      minWidth: 150,
      flex: 1,
      maxWidth: 240,
      renderCell: (rowParams) => {
        return (
          <div className="w-full flex items-center ml-auto">
            <span className=" mr-4 interFonts">Wert</span>
            {editState.activeEditScaleValue !== rowParams.row.id ? (
              <div className="flex gap-4 justify-end p-0 items-center w-14 text-gray-500">
                <span className="pr-1">{rowParams.value}</span>
                <EditSVG
                  onClick={() =>
                    activeEditScaleValueClickHandler(rowParams.row.id)
                  }
                />
              </div>
            ) : (
              <input
                name="skala-value"
                type="number"
                id="skala-value"
                className="interFonts text-md w-14 text-left outline-none"
                autoFocus={editState.activeEditScaleValue === rowParams.row.id}
                value={rowParams.value}
                onChange={(e) =>
                  editScaleValueChangeHandler(rowParams.row.id, e.target.value)
                }
                onBlur={() =>
                  activeEditScaleValueClickHandler(rowParams.row.id)
                }
              />
            )}
          </div>
        );
      },
    },
    {
      field: 'actions',
      headerName: '',
      width: 120,
      align: 'center',
      renderCell: (rowParams) => {
        return (
          <Button
            color="error"
            className="interFonts"
            onClick={() => removeScale(rowParams.row.id)}
          >
            Entfernen
          </Button>
        );
      },
    },
  ];

  const scaleRows = questionnaireState.scale.map((item, index) => {
    return {
      id: index + 1,
      name: item.name,
      value: item.value,
      actions: '',
    };
  });

  const { data, error, isLoading } = useSwr(
    `/questionnaires/${params?.questionnaireId}`,
    fetchQuestionnaire
  );

  useEffect(() => {
    if (data && data.questionnaire) {
      editQuestionnaire = new QuestionnaireModel(data.questionnaire);
    }

    setQuestionnaireState((prevState) => ({
      ...prevState,
      name: editQuestionnaire.name,
      questions: [...editQuestionnaire.questions],
      randomizeQuestions: editQuestionnaire.randomizeQuestions,
      scale: [...editQuestionnaire.scale],
    }));
  }, [data]);

  // autoupdate backend data every 2 seconds if there are changes. Newer changes reset the timer
  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        saveQuestionnaire();
      } catch (error) {
        console.log(error);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [questionnaireState]);

  const saveQuestionnaire = async () => {
    const hasRatingQuestions = questionnaireState.questions.some(
      (question) => question.isRating
    );

    // user cannot have rating questions and not provide any scale
    if (hasRatingQuestions && questionnaireState.scale.length < 2) {
      return toast.error(
        'Sie müssen mindestens 2 Bewertungsmöglichkeiten angeben!'
      );
    }

    // questionnaire name must be provided
    if (questionnaireState.name === '')
      return toast.error('Sie müssen einen Namen für den Fragebogen angeben!');

    // questions cannot be empty
    if (questionnaireState.questions.length < 1) return;

    const scaleValues = questionnaireState.scale.map(
      (scaleItem) => scaleItem.value
    );
    const scaleValueSet = new Set(scaleValues);

    // scale values have to be unique
    if (scaleValueSet.size !== scaleValues.length)
      return toast.error('Sie müssen eindeutige Skalenwerte haben!');

    // select only questions with text
    const filledQuestions = questionnaireState.questions.filter(
      (question) => question.question !== ''
    );

    const filledScales = questionnaireState.scale.filter(
      (scaleItem) => scaleItem.name !== ''
    );

    // if no questions or scales are filled, return
    if (filledQuestions.length < 1 || filledScales.length < 1) return;

    const updatedQuestionnaire = {
      name: questionnaireState.name,
      questions: filledQuestions,
      randomizeQuestions: questionnaireState.randomizeQuestions,
      scale: filledScales,
    };

    try {
      setIsSubmitting(() => true);
      const res = await axiosInstance.put(
        `/questionnaires/${params?.questionnaireId}`,
        updatedQuestionnaire
      );

      // if questionnaireId is 'new', push new questionnaire id to the url
      if (params?.questionnaireId === 'new') {
        router.replace(
          `/app/questionnaire/edit/${res.data?.questionnaire?._id}`
        );
      }

      // toast.success(res.data.message);
      // router.push('/app/questionnaire/edit');
    } catch (error) {
      console.log(error);
      if (error?.response?.status === 401) {
        return router.push('/login');
      }
      toast.error(SOMETHING_WRONG);
    }

    setIsSubmitting(() => false);
  };

  const editQuestionChangeHandler = (index: number, value: string) => {
    const newQuestions = [...questionnaireState.questions];
    newQuestions[index - 1].question = value;
    setQuestionnaireState((prevState) => ({
      ...prevState,
      questions: newQuestions,
    }));
  };

  const editQuestionFrageTextChangeHandler = (index: number, value: string) => {
    const newQuestions = [...questionnaireState.questions];
    newQuestions[index - 1].fragetext = value;
    setQuestionnaireState((prevState) => ({
      ...prevState,
      questions: newQuestions,
    }));
  };

  const editScaleNameChangeHandler = (index: number, value: string) => {
    const newScale = [...questionnaireState.scale];
    newScale[index - 1].name = value;
    setQuestionnaireState((prevState) => ({
      ...prevState,
      scale: newScale,
    }));
  };

  const editScaleValueChangeHandler = (index: number, value: string) => {
    const newScale = [...questionnaireState.scale];
    newScale[index - 1].value = +value;
    setQuestionnaireState((prevState) => ({
      ...prevState,
      scale: newScale,
    }));
  };

  const activeEditQuestionNameClickHandler = () => {
    setEditState(() => ({
      ...cleanEditState,
      activeEditName: true,
    }));
  };

  const activeEditQuestionClickHandler = (index: number) => {
    setEditState(() => ({
      ...cleanEditState,
      activeEditQuestion: editState.activeEditQuestion === index ? null : index,
    }));
  };

  const activeEditQuestionFragetextClickHandler = (index: number) => {
    setEditState(() => ({
      ...cleanEditState,
      activeEditFragetext:
        editState.activeEditFragetext === index ? null : index,
    }));
  };

  const activeEditScaleNameClickHandler = (index: number) => {
    setEditState(() => ({
      ...cleanEditState,
      activeEditScaleName:
        editState.activeEditScaleName === index ? null : index,
    }));
  };

  const activeEditScaleValueClickHandler = (index: number) => {
    setEditState(() => ({
      ...cleanEditState,
      activeEditScaleValue:
        editState.activeEditScaleValue === index ? null : index,
    }));
  };

  const activeEditQuestionTypeClickHandler = (index: number) => {
    setEditState(() => ({
      ...cleanEditState,
      activeEditQuestionType:
        editState.activeEditQuestionType === index ? null : index,
    }));
  };

  const addNewQuestion = () => {
    const newQuestions = [...questionnaireState.questions];
    const emptyQuestion: QuestionnaireQuestion = {
      question: '',
      isRecoded: false,
      id: newQuestions.length,
      isRating: true,
      fragetext: 'Fragetext',
    };
    newQuestions.push(emptyQuestion);
    setQuestionnaireState((prevState) => ({
      ...prevState,
      questions: newQuestions,
    }));

    setEditState(() => ({
      ...cleanEditState,
      activeEditQuestion: newQuestions.length,
    }));
  };

  const removeQuestion = (index: number) => {
    const newQuestions = [...questionnaireState.questions];
    newQuestions.splice(index - 1, 1);
    setQuestionnaireState((prevState) => ({
      ...prevState,
      questions: newQuestions,
    }));
  };

  const addNewScale = () => {
    const newScale = [...questionnaireState.scale];
    newScale.push({ name: '', value: 0 });
    setQuestionnaireState((prevState) => ({
      ...prevState,
      scale: newScale,
    }));

    setEditState(() => ({
      ...cleanEditState,
      activeEditScaleName: newScale.length,
    }));
  };

  const removeScale = (index: number) => {
    const newScale = [...questionnaireState.scale];
    newScale.splice(index - 1, 1);
    setQuestionnaireState((prevState) => ({
      ...prevState,
      scale: newScale,
    }));
  };

  const updateQuestionRandomization = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setQuestionnaireState((prevState) => ({
      ...prevState,
      randomizeQuestions: event.target.checked,
    }));
  };

  const updateQuestionisRecoded = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const newQuestions = [...questionnaireState.questions];
    const checkedStatus = event.target.checked;

    newQuestions[index - 1].isRecoded = checkedStatus;

    setQuestionnaireState((prevState) => ({
      ...prevState,
      questions: newQuestions,
    }));
  };

  const updateQuestionIsRating = (newValue: string | null, index: number) => {
    const newQuestions = [...questionnaireState.questions];
    newQuestions[index - 1].isRating = newValue === 'Rating' ? true : false;
    setQuestionnaireState((prevState) => ({
      ...prevState,
      questions: newQuestions,
    }));
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

    if (error.response?.status === 404) {
      router.push('/404');
    }

    return (
      <AppLayout>
        <div>Error...</div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="w-[90vw] sm:w-auto mx-auto md:px-0 px-0 py-4 mb-28">
        <Box display={'flex'} flexDirection={'column'} gap={4}>
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-0 mb-2 justify-between items-start">
            <div className="flex items-center  interFonts text-[#3C3C3C] font-bold text-4xl">
              {!editState.activeEditName ? (
                <>
                  <span className="pr-2">{questionnaireState.name}</span>
                  <EditSVG onClick={activeEditQuestionNameClickHandler} />
                </>
              ) : (
                <input
                  name="questionnaire-name"
                  type="text"
                  placeholder="FragebogenName"
                  autoFocus={editState.activeEditName}
                  id="questionnaire-name"
                  className="interFonts text-[#3C3C3C] font-bold text-4xl outline-none"
                  value={questionnaireState.name}
                  onChange={(e) => {
                    if (!editState.activeEditName) return;
                    setQuestionnaireState({
                      ...questionnaireState,
                      name: e.target.value,
                    });
                  }}
                  onBlur={() => setEditState(() => cleanEditState)}
                />
              )}
            </div>

            <div className="flex items-end gap-8 lg:items-start">
              <Button
                variant={'text'}
                size="medium"
                className="px-2 py-4 md:px-4 hover:bg-gray-200 hover:border-slate-200 border w-60 md:w-70 md:py-4 bg-[#EEE] font-semibold"
                sx={{ border: '1px solid #DDD' }}
                onClick={addNewQuestion}
              >
                Neues Item hinzufügen
              </Button>
              <TextField
                id={'search'}
                label={'Suche'}
                variant={'outlined'}
                type="search"
                size="medium"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
              />
            </div>
          </div>

          <Box display={'flex'} flexDirection={'column'} gap={10}>
            <Stack direction={'column'} width={'inherit'} gap={4}>
              <div className="flex md:flex-row flex-col items-start gap-4 interFonts">
                <h5 className="font-semibold text-md md:text-xl w-fit flex-none">
                  Items
                </h5>

                <Grid container justifyContent={'flex-end'}>
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={questionnaireState.randomizeQuestions}
                          onChange={updateQuestionRandomization}
                          sx={{
                            color: '#EEE',
                            [`&.${checkboxClasses.checked}`]: {
                              color: '#2B86FC',
                            },
                          }}
                        />
                      }
                      label="Möchten Sie die Fragebogenitems randomisieren?"
                      sx={{
                        color: '#999',
                      }}
                    />
                  </FormGroup>
                </Grid>
              </div>

              <DataGrid
                rows={questionRows}
                columns={questionColumns}
                // give row height based on the length of the question
                getRowHeight={(params) => {
                  if (!params.model.isRating) return 'auto';
                  return params.model.question.split(' ').join('').length > 50
                    ? 'auto'
                    : 68;
                }}
                hideFooter
                getRowSpacing={(params: GridRowSpacingParams) => {
                  return {
                    top: params.isFirstVisible ? 15 : 10,
                    bottom: params.isLastVisible ? 10 : 10,
                  };
                }}
                sx={gridStyling}
              />

              <Grid container justifyContent={'center'}>
                <Button
                  className="w-full flex font-normal items-center justify-center md:py-4 border-dashed hover:bg-[#d6d8dc] hover:border-transparent"
                  variant="outlined"
                  size="large"
                  onClick={addNewQuestion}
                >
                  Bitte klicken, um ein neues Item hinzuzufügen.
                </Button>
              </Grid>
            </Stack>

            <Stack direction={'column'} width={'inherit'} gap={4}>
              <Typography variant={'h6'} width={'50%'} fontWeight={600}>
                Skala
              </Typography>

              <DataGrid
                rows={scaleRows}
                columns={scaleColumns}
                rowHeight={68}
                hideFooter
                getRowSpacing={(params: GridRowSpacingParams) => {
                  return {
                    top: params.isFirstVisible ? 15 : 10,
                    bottom: params.isLastVisible ? 10 : 10,
                  };
                }}
                sx={gridStyling}
              />

              <Grid container justifyContent={'center'}>
                <Button
                  className="w-full flex font-normal items-center justify-center md:py-4 border-dashed hover:bg-[#d6d8dc] hover:border-transparent"
                  variant="outlined"
                  size="large"
                  onClick={addNewScale}
                >
                  Bitte klicken, um einen neuen Skalenwert hinzuzufügen.
                </Button>
              </Grid>
            </Stack>
          </Box>
        </Box>
      </div>
    </AppLayout>
  );
};

export default QuestionnaireEditDetail;
