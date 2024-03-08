'use client';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

import useSWR from 'swr';
import { Stack, TextField, Typography } from '@mui/material';
import {
  DataGrid,
  GridColDef,
  GridRowSelectionModel,
  GridRowSpacingParams,
} from '@mui/x-data-grid';
import { LoadingButton } from '@mui/lab';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import toast from 'react-hot-toast';

import axiosInstance from '../../../../utils/axios';
import AppLayout from '../../../../components/AppLayout';
import { SOMETHING_WRONG } from '../../../../utils/constants';
import formatDate from '../../../../components/questionnaire/shared/FormatDate';
import gridStyling from '../../../../components/questionnaire/shared/DataGridCustomStyling';

export interface QuestionnaireStatus {
  _id: string;
  questionnaireName: string;
  klientCipher: string;
  questionnaireCreationDate: string;
  evaluation: string;
  Vorname: string;
  Nachname: string;
}

interface QuestionnaireResponse {
  _id: string;
  questionnaire: {
    _id: string;
    name: string;
    creationDate: Date;
  };
  klient: {
    _id: string;
    Vorname: string;
    Nachname: string;
    Chiffre: string;
  };
  user: string;
  accessCode: string;
  isCompleted: boolean;
  responses: [
    {
      questionId: number;
      answer: string;
    },
  ];
  dateSubmitted: Date;
}

const columns: GridColDef[] = [
  {
    field: 'klientCipher',
    headerName: 'Chiffre',
    width: 80,
    renderCell: (params) => (
      <Typography color={'#2B86FC'} className="interFonts">
        {params.value}
      </Typography>
    ),
  },
  {
    field: 'Vorname',
    headerName: 'Vorname',
    width: 130,
    editable: true,
    renderCell: (params) => (
      <Typography className="interFonts text-gray-600">
        {params.value}
      </Typography>
    ),
  },
  {
    field: 'Nachname',
    headerName: 'Nachname',
    width: 130,
    renderCell: (params) => (
      <Typography className="interFonts text-gray-600">
        {params.value}
      </Typography>
    ),
  },
  {
    field: 'questionnaireCreationDate',
    headerName: 'Datum',
    width: 120,
    renderCell: (params) => (
      <Typography className="interFonts text-gray-600">
        {formatDate(params.value)}
      </Typography>
    ),
  },
  {
    field: 'questionnaireName',
    headerName: 'Fragebogen',
    width: 200,
    renderCell: (params) => (
      <Typography color={'#2B86FC'} className="interFonts">
        {params.value}
      </Typography>
    ),
  },
  {
    field: 'evaluation',
    headerName: 'Auswertung',
    width: 200,
    renderCell: (params) => {
      // Get the cell value
      const value = params.value;
      const IsCompleted = params?.row?.isCompleted;

      let color = 'inherit';
      // color = IsCompleted ? '#4caf50' : '#f44336';
      color = IsCompleted ? '#555' : '#f44336';

      return (
        <Typography color={color} className="font-medium text-sm interFonts">
          {value}
        </Typography>
      );
    },
  },
];

const fetchQuestionnaireResponses = async (url: string) => {
  const response = await axiosInstance.get(url);
  return response.data;
};

const QuestionnairesEvaluation: React.FC = () => {
  const router = useRouter();
  const [questionnaireStatuses, setQuestionnaireStatuses] = useState<
    QuestionnaireStatus[]
  >([]);
  const [cipherSearchValue, setCipherSearchValue] = useState('');
  const [dateSearch, setDateSearch] = useState('');
  const [universalSearchTerm, setUniversalSearchTerm] = useState('');
  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>(
    []
  );
  const [isExporting, setIsExporting] = useState(false);

  const searchResults: QuestionnaireStatus[] = questionnaireStatuses.filter(
    (response) => {
      // boolean - whether the current response cipher matches the input in cipher search box
      const cipherSearchResults =
        response.klientCipher.includes(cipherSearchValue);

      // boolean - whether the questionnaire name OR fullName of clients assigned to that questionnaire OR the cipher input matches the text entered in the universal search box => UNION
      const universalSearchResults =
        response.questionnaireName
          .toLowerCase()
          .includes(universalSearchTerm) ||
        `${response.Vorname} ${response.Nachname}`
          .toLowerCase()
          .includes(universalSearchTerm) ||
        response.klientCipher.includes(universalSearchTerm);

      // in form yyyy-mm-dd
      const formattedQuestionnaireCreationDate = new Date(
        response.questionnaireCreationDate
      ).toDateString();

      const formattedDateSearch = new Date(dateSearch).toDateString();

      // compares the questionnaire creation date and the date chosen. If not chosen, just return true
      const dateSearchResults = dateSearch
        ? formattedQuestionnaireCreationDate === formattedDateSearch
        : true;

      // bool - true when all of the above are met (all search boxes must yield a value) => INTERSECTION
      return cipherSearchResults && universalSearchResults && dateSearchResults;
    }
  );

  const { data, error, isLoading } = useSWR(
    '/questionnaire-responses',
    fetchQuestionnaireResponses
  );

  const handleSelectionModelChange = (
    newSelectionModel: GridRowSelectionModel
  ) => {
    setSelectionModel(newSelectionModel);
  };

  useEffect(() => {
    if (data) {
      const responses: QuestionnaireResponse[] = data.responses;
      // form the questionnaire statuses
      const statuses = responses.map((response, index) => {
        const { klient, questionnaire, isCompleted } = response;

        if (klient && questionnaire) {
          return {
            id: index,
            _id: response._id,
            questionnaireName: questionnaire.name,
            klientCipher: klient.Chiffre,
            questionnaireCreationDate: new Date(
              questionnaire.creationDate
            ).toString(),
            // questionnaireCreationDate: formatDate(questionnaire.creationDate),
            evaluation: isCompleted ? 'Abgeschlossen' : 'Nicht abgeschlossen',
            isCompleted,
            Vorname: klient.Vorname,
            Nachname: klient.Nachname,
          };
        }
      });

      setQuestionnaireStatuses(() => statuses);
    }
  }, [data]);

  const downloadResponsePDFs = async () => {
    // get the _id for selected responses
    const clientIds: string[] = selectionModel.map(
      (index) => questionnaireStatuses[index]._id
    );

    try {
      if (clientIds.length === 0) return;
      setIsExporting(() => true);

      const res = await axiosInstance.post(
        '/questionnaire-responses/download',
        {
          clientIds,
        }
      );

      const responseData = res?.data?.data;
      if (responseData) {
        // create a new JSZip instance
        let zip = new JSZip();

        // loop through the pdf data array
        for (let i = 0; i < responseData.length; i++) {
          // get the base64 encoded pdf and the file name
          let base64Pdf = responseData[i].base64Pdf;
          let fileName = responseData[i].fileName;

          // add the pdf file to the zip
          zip.file(fileName, base64Pdf, { base64: true });
        }

        // generate the zip file as a blob
        zip.generateAsync({ type: 'blob' }).then(function (content) {
          // save the zip file using FileSaver.js
          saveAs(content, 'fragebogenAntworten.zip');
        });

        // reset the selection model
        setSelectionModel(() => []);
        toast.success('Anlagen erfolgreich exportiert');
      }
    } catch (error) {
      console.log(error);
      toast.error(SOMETHING_WRONG);
    }

    setIsExporting(() => false);
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

  if (!questionnaireStatuses)
    return (
      <AppLayout>
        <div>Please wait...</div>
      </AppLayout>
    );

  return (
    <AppLayout>
      <div className="w-[90vw] sm:w-auto mb-28">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col lg:flex-row justify-between gap-8 lg:gap-10 lg:items-center">
            <h4 className="text-2xl md:text-3xl w-fit flex-none font-bold leading-3 text-[#3C3C3C] interFonts">
              Fragebogenauswertung
            </h4>
            <div className="flex justify-end gap-4 flex-col md:flex-row w-full md:w-fit">
              <TextField
                id={'search-cipher'}
                label={'Chiffre'}
                variant={'outlined'}
                type="search"
                size="medium"
                value={cipherSearchValue}
                onChange={(e) => setCipherSearchValue(() => e.target.value)}
              />
              <TextField
                id={'search-date'}
                variant={'outlined'}
                type="date"
                size="medium"
                value={dateSearch}
                onChange={(e) => setDateSearch(() => e.target.value)}
                className="flex-none"
              />
              <TextField
                id={'universal-search'}
                label={'Suche'}
                variant={'outlined'}
                type="search"
                size="medium"
                value={universalSearchTerm}
                onChange={(e) =>
                  setUniversalSearchTerm(() => e.target.value.toLowerCase())
                }
              />
            </div>
          </div>

          <Stack direction={'column'} width={'inherit'} gap={4}>
            <Stack direction={'row'} width={'inherit'}>
              <LoadingButton
                variant={'text'}
                size="large"
                className="flex-none px-4 border md:px-8 md:py-4"
                startIcon={<FileDownloadIcon />}
                loadingPosition="start"
                loading={isExporting}
                disabled={selectionModel.length === 0}
                color="primary"
                sx={{
                  color: '#2B86FC',
                  border: '1px solid #EEE',
                  '&:hover': {
                    borderColor: '#2B86FC',
                    bgcolor: 'transparent',
                  },
                }}
                onClick={downloadResponsePDFs}
              >
                Anlage(n) exportieren
              </LoadingButton>
            </Stack>

            <div className="">
              <DataGrid
                rows={searchResults}
                columns={columns}
                rowHeight={60}
                getRowSpacing={(params: GridRowSpacingParams) => {
                  return {
                    top: params.isFirstVisible ? 15 : 10,
                    bottom: params.isLastVisible ? 10 : 10,
                  };
                }}
                showColumnVerticalBorder={false}
                showCellVerticalBorder={false}
                sx={{
                  '&, [class^=MuiDataGrid]': {
                    border: 'none',
                    fontFamily: 'Inter Tight, sans-serif',
                    fontWeight: 400,
                    fontSize: '0.975rem',
                  },
                  '& .MuiDataGrid-columnHeaders': {
                    borderRadius: 1,
                    backgroundColor: '#f5f5f6',
                    border: '1px solid #CCC',
                  },
                  '& .MuiDataGrid-row': {
                    border: '1px solid #CCC',
                    borderRadius: 1,
                    width: '99.8%',
                  },
                  '& .MuiCheckbox-colorPrimary.Mui-checked': {
                    color: '#2B86FC',
                  },
                  '& .MuiCheckbox-colorPrimary': {
                    color: '#CCC',
                  },
                  '& .MuiDataGrid-row.Mui-hovered': {
                    backgroundColor: 'transparent',
                  },
                  '& .MuiDataGrid-row:hover': {
                    backgroundColor: 'transparent',
                  },
                  '& .MuiDataGrid-row.Mui-selected': {
                    backgroundColor: 'transparent',
                  },
                  '& .MuiDataGrid-row.Mui-selected.Mui-hovered': {
                    backgroundColor: 'transparent',
                  },
                  '& .MuiDataGrid-cell.MuiDataGrid-withBorderColor': {
                    borderColor: 'transparent',
                    outline: 'none',
                  },
                }}
                checkboxSelection
                autoHeight
                onRowSelectionModelChange={handleSelectionModelChange}
                rowSelectionModel={selectionModel}
              />
            </div>
          </Stack>
        </div>
      </div>
    </AppLayout>
  );
};

export default QuestionnairesEvaluation;
