'use client';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

import useSWR from 'swr';
import toast from 'react-hot-toast';
import {
  TextField,
  Button,
  Autocomplete,
  Chip,
  Typography,
} from '@mui/material';
import { DataGrid, GridColDef, GridRowSpacingParams } from '@mui/x-data-grid';

import QuestionnaireModel from '../../../../components/questionnaire/shared/QuestionnaireModel';
import axiosInstance from '../../../../utils/axios';
import AppLayout from '../../../../components/AppLayout';

import { SOMETHING_WRONG } from '../../../../utils/constants';

const EditSVG = ({ onClick }) => {
  return (
    <svg
      className="editBtn cursor-pointer"
      onClick={onClick}
      width="24"
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

const allocationOptions = [
  {
    value: 'allClients',
    label: 'Aktive Klient:innen',
  },
  {
    value: 'newClients',
    label: 'Neuklient:innen',
  },
  {
    value: 'manual',
    label: 'Manuell',
  },
  {
    value: 'unallocated',
    label: 'Nicht zugewiesen',
  },
];

const fillingFreqOptions = [
  {
    value: 'daily',
    label: 'Täglich',
  },
  {
    value: 'weekly',
    label: 'Wöchtenlich',
  },
  {
    value: 'biWeekly',
    label: 'Zweiwöchentlich',
  },
  {
    value: 'monthly',
    label: 'Monatlich',
  },
  {
    value: 'quarterly',
    label: 'Quartalsweise',
  },
];

const fetchQuestionnaires = async (url: string) => {
  const response = await axiosInstance.get(url);
  return response.data;
};

const QuestionnaireAssignment: React.FC = () => {
  const [questionnaires, setQuestionnaires] = useState<QuestionnaireModel[]>(
    []
  );
  const [clientOptions, setClientOptions] = useState<
    QuestionnaireModel['clientsAssigned']
  >([]);
  const [clientExcludeList, setClientExcludeList] = useState([]);
  const [questionnaireSearchTerm, setQuestionnaireSearchTerm] = useState('');
  const [universalSearchTerm, setUniversalSearchTerm] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();

  const cleanEditState = {
    activeEditFrequency: null,
    activeEditAllocation: null,
    activeEditAssignedTo: null,
    activeEditExclude: false,
  };

  const [editState, setEditState] = useState(cleanEditState);

  const activeEditFrequencyChangeHandler = (id: string) => {
    setEditState(() => ({
      ...cleanEditState,
      activeEditFrequency: id,
    }));
  };

  const activeEditAllocationChangeHandler = (id: string) => {
    setEditState(() => ({
      ...cleanEditState,
      activeEditAllocation: id,
    }));
  };

  const activeEditAssignedToChangeHandler = (id: string) => {
    setEditState(() => ({
      ...cleanEditState,
      activeEditAssignedTo: id,
    }));
  };

  const activeEditExcludeChangeHandler = () => {
    setEditState(() => ({
      ...cleanEditState,
      activeEditExclude: true,
    }));
  };

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: 'Fragebogen',
      minWidth: 170,
      renderCell: (params) => (
        <Typography color={'#2B86FC'}>{params.row.name}</Typography>
      ),
    },
    {
      field: 'frequency',
      headerName: 'Wiederholung',
      minWidth: 150,
      editable: true,
      renderCell: (rowParams) => {
        return (
          <>
            {editState.activeEditFrequency === rowParams.row.id ? (
              <Autocomplete
                disablePortal
                fullWidth
                id="frequency"
                value={fillingFreqOptions.find(
                  (option) => option.value === rowParams.row.frequency
                )}
                onChange={(_, newValue) =>
                  frequencyChangeHandler(
                    newValue as any,
                    rowParams.row as QuestionnaireModel
                  )
                }
                options={fillingFreqOptions}
                autoFocus={editState.activeEditFrequency === rowParams.row.id}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    size="small"
                    variant="standard"
                    onBlur={() => setEditState({ ...cleanEditState })}
                    autoFocus={
                      editState.activeEditFrequency === rowParams.row.id
                    }
                  />
                )}
              />
            ) : (
              <>
                <div className="w-max mr-2 text-gray-600">
                  {
                    fillingFreqOptions.find(
                      (option) => option.value === rowParams.row.frequency
                    ).label
                  }
                </div>
                <EditSVG
                  onClick={() =>
                    activeEditFrequencyChangeHandler(rowParams.row.id)
                  }
                />
              </>
            )}
          </>
        );
      },
    },

    {
      field: 'allocation',
      headerName: 'Zuweisung',
      minWidth: 200,
      editable: true,
      renderCell: (rowParams) => {
        return (
          <>
            {editState.activeEditAllocation === rowParams.row.id ? (
              <Autocomplete
                disablePortal
                fullWidth
                id="allocation"
                value={allocationOptions.find(
                  (option) => option.value === rowParams.row.allocation
                )}
                isOptionEqualToValue={(option, value) =>
                  option.valueOf === value.valueOf
                }
                onChange={(_, newValue) =>
                  allocationChangeHandler(
                    newValue as any,
                    rowParams.row as QuestionnaireModel
                  )
                }
                options={allocationOptions}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    size="small"
                    variant="standard"
                    fullWidth
                    onBlur={() => setEditState({ ...cleanEditState })}
                    autoFocus={
                      editState.activeEditAllocation === rowParams.row.id
                    }
                  />
                )}
              />
            ) : (
              <>
                <div className="w-max mr-2 text-gray-600">
                  {
                    allocationOptions.find(
                      (option) => option.value === rowParams.row.allocation
                    ).label
                  }
                </div>
                <EditSVG
                  onClick={() =>
                    activeEditAllocationChangeHandler(rowParams.row.id)
                  }
                />
              </>
            )}
          </>
        );
      },
    },
    {
      field: 'assignedTo',
      headerName: 'Zugewiesen an',
      minWidth: 400,
      editable: true,
      renderCell: (rowParams) => {
        return (
          <>
            {editState.activeEditAssignedTo === rowParams.row.id ? (
              <Autocomplete
                multiple
                fullWidth
                id="clients-assigned"
                options={clientOptions}
                // limitTags={3}
                size="medium"
                getOptionLabel={(client) => {
                  return `${client.Vorname} ${client.Nachname}`;
                }}
                value={rowParams.row.assignedTo}
                onChange={(_, newValue) =>
                  manualAddClientHandler(
                    newValue as any,
                    rowParams.row as QuestionnaireModel
                  )
                }
                isOptionEqualToValue={(option, value) =>
                  option._id === value._id
                }
                // the assignedTo field is disabled unless questionnaire allocation is manual
                readOnly={rowParams.row.allocation !== 'manual'}
                disabled={rowParams.row.allocation !== 'manual'}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="standard"
                    maxRows={5}
                    onBlur={() => setEditState({ ...cleanEditState })}
                    autoFocus={
                      editState.activeEditAssignedTo === rowParams.row.id
                    }
                  />
                )}
              />
            ) : (
              <div className="flex justify-start items-center gap-3">
                {rowParams.row.assignedTo.length > 0 ? (
                  <div className="grid grid-cols-3 items-center grow-0 gap-x-1 gap-y-3 mr-6 w-auto h-fit">
                    {rowParams.row.assignedTo.map(
                      (client: { Vorname: string; Nachname: string }) => {
                        return (
                          <Chip
                            // className="w-fit"
                            label={`${client.Vorname} ${client.Nachname}`}
                          />
                        );
                      }
                    )}
                  </div>
                ) : (
                  <span className="f text-sm text-gray-600">
                    nicht zugewiesen
                  </span>
                )}
                {rowParams.row.allocation === 'manual' && (
                  <EditSVG
                    onClick={() =>
                      activeEditAssignedToChangeHandler(rowParams.row.id)
                    }
                  />
                )}
              </div>
            )}
          </>
        );
      },
    },

    {
      field: 'actions',
      headerName: '',
      align: 'right',
      width: 150,
      renderCell: (params) => {
        return (
          <Button
            size="medium"
            color="error"
            className="w-fit px-2 ml-auto interFonts"
            fullWidth
            onClick={() => deleteQuestionnaire(params.row._id)}
          >
            Entfernen
          </Button>
        );
      },
    },
  ];

  const searchResults: QuestionnaireModel[] = questionnaires.filter(
    (questionnaire) => {
      // boolean - whether the current questionnaire name matches the input in questionnaire search box
      const questionnaireSearchResults = questionnaire.name
        .toLowerCase()
        .includes(questionnaireSearchTerm);

      // boolean - whether the questionnaire name OR fullName of clients assigned to that questionnaire matches the text entered in the universal search box => UNION
      const universalSearchResults =
        questionnaire.name.toLowerCase().includes(universalSearchTerm) ||
        questionnaire.clientsAssigned.some((client) => {
          const fullName = `${client.Vorname} ${client.Nachname}`.toLowerCase();
          return fullName.includes(universalSearchTerm);
        });

      // bool - true when all of the above are met (all search boxes must yield a value) => INTERSECTION
      return questionnaireSearchResults && universalSearchResults;
    }
  );

  const searchResultsRows = searchResults.map((questionnaire) => {
    return {
      id: questionnaire._id,
      _id: questionnaire._id,
      name: questionnaire.name,
      frequency: questionnaire.fillingFrequency,
      allocation: questionnaire.allocatedTo,
      assignedTo: questionnaire.clientsAssigned,
    };
  });

  // autosave backend data after every 2 seconds if there is any change. Newer changes reset the timer.
  useEffect(() => {
    const timer = setTimeout(() => {
      if (questionnaires.length > 0) {
        updateQuestionnaires();
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [questionnaires, clientExcludeList]);

  const { data, error, isLoading } = useSWR(
    '/questionnaires',
    fetchQuestionnaires
  );

  // update the questionnaires in the database with their new allocation and clientsAssigned values
  const updateQuestionnaires = async () => {
    try {
      setIsSubmitting(() => true);
      // the backend expects the clientsAssigned field to be an array of client ids, so we need to format the clientsAssigned field before sending the request
      const formatedQuestionnaires = questionnaires.map((questionnaire) => {
        const formatedClientsAssigned = questionnaire.clientsAssigned.map(
          // return _id and excludeInQuestionnaire fields
          (client) => ({
            _id: client._id,
            excludeInQuestionnaire: clientExcludeList.some(
              (c) => c._id === client._id
            ),
          })
        );

        return {
          ...questionnaire,
          clientsAssigned: formatedClientsAssigned,
        };
      });

      const response = await axiosInstance.put('/questionnaires/updateMany', {
        questionnaires: formatedQuestionnaires,
      });

      // also send a request to update the excludeInQuestionnaire field for each client in the clientExcludeList
      const formattedClientExcludeList = clientOptions.map((client) => {
        return {
          id: client._id,
          excludeInQuestionnaire: client.excludeInQuestionnaire,
        };
      });

      await axiosInstance.put(
        '/klient/excludeInQuestionnaire',
        formattedClientExcludeList
      );

      // toast.success(response.data.message);
    } catch (error) {
      console.log(error);
      toast.error(SOMETHING_WRONG);
    }

    setIsSubmitting(() => false);
  };

  const deleteQuestionnaire = async (id: string) => {
    try {
      const response = await axiosInstance.delete(`/questionnaires/${id}`);
      // update the questionnaires state
      setQuestionnaires((prev) => prev.filter((q) => q._id !== id));

      toast.success(response.data.message);
    } catch (error) {
      console.log(error);
      toast.error(SOMETHING_WRONG);
    }
  };

  // fetch all clients or new clients depending on the requestType (allocation)
  const getUpdatedAssignedClients = async (
    requestType: 'getAll' | 'getNew'
  ) => {
    try {
      const response = await axiosInstance.get(`/klient/${requestType}`);

      // for some reason, the response.data.data is an object when requestType is getAll, and an array when requestType is getNew
      const clients =
        requestType === 'getAll'
          ? response.data.data
          : response.data.data?.list;

      // select only the required fields
      const requiredFields = [
        '_id',
        'Vorname',
        'Nachname',
        'excludeInQuestionnaire',
      ];
      const selectedClients = clients.map((client) => {
        const selectedClient = {};
        requiredFields.forEach((field) => {
          selectedClient[field] = client[field];
        });
        return selectedClient;
      });

      return selectedClients;
    } catch (error) {
      console.log(error);
      toast.error(SOMETHING_WRONG);
    }
  };

  // update questionnaire frequency filling option as selected
  const frequencyChangeHandler = (
    newValue: {
      value: QuestionnaireModel['fillingFrequency'];
      label: string;
    },
    questionnaire: QuestionnaireModel
  ) => {
    setQuestionnaires((prev) => {
      const index = prev.findIndex((q) => q._id === questionnaire._id);
      if (!newValue) {
        prev[index].fillingFrequency = 'monthly';
      } else {
        prev[index].fillingFrequency = newValue.value;
      }

      return [...prev];
    });
  };

  // update questionnaire allocation option as selected - also update the clientsAssigned field
  const allocationChangeHandler = (
    newValue: {
      value: QuestionnaireModel['allocatedTo'];
      label: string;
    },
    questionnaire: QuestionnaireModel
  ) => {
    if (!newValue) return;

    const index = questionnaires.findIndex((q) => q._id === questionnaire._id);
    const updatedQuestionnaire = { ...questionnaires[index] };

    // console.log(questionnaire);
    updatedQuestionnaire.allocatedTo = newValue.value;

    // if new allocation value is allClients, then fetch all clients and update the clientsAssigned field, else if new allocation value is newClients, then fetch new clients and update the clientsAssigned field
    if (newValue.value === 'allClients') {
      getUpdatedAssignedClients('getAll').then((clients) => {
        updatedQuestionnaire.clientsAssigned = clients;
        setQuestionnaires((prev) => {
          prev[index] = updatedQuestionnaire;
          return [...prev];
        });
      });
    } else if (newValue.value === 'newClients') {
      getUpdatedAssignedClients('getNew').then((clients) => {
        updatedQuestionnaire.clientsAssigned = clients;
        setQuestionnaires((prev) => {
          prev[index] = updatedQuestionnaire;
          return [...prev];
        });
      });
      // if new allocation value is unallocated or manual, then set the clientsAssigned field to an empty array
    } else if (newValue.value === 'manual') {
      updatedQuestionnaire.clientsAssigned = [];
      setQuestionnaires((prev) => {
        prev[index] = updatedQuestionnaire;
        return [...prev];
      });
    } else if (newValue.value === 'unallocated') {
      updatedQuestionnaire.clientsAssigned = [];
      setQuestionnaires((prev) => {
        prev[index] = updatedQuestionnaire;
        return [...prev];
      });
    }
  };

  // when the user manually adds a client to the clientsAssigned field
  const manualAddClientHandler = (
    clients: QuestionnaireModel['clientsAssigned'],
    questionnaire: QuestionnaireModel
  ) => {
    const index = questionnaires.findIndex((q) => q._id === questionnaire._id);
    const updatedQuestionnaire = { ...questionnaires[index] };

    updatedQuestionnaire.clientsAssigned = clients;
    setQuestionnaires((prev) => {
      prev[index] = updatedQuestionnaire;
      return [...prev];
    });
  };

  const excludedClientsChangeHandler = (
    clients: QuestionnaireModel['clientsAssigned']
  ) => {
    setClientExcludeList(() => clients);

    // find the client in the clientOptions array and update the excludeInQuestionnaire field
    const updatedClientOptions = clientOptions.map((client) => {
      const index = clients.findIndex((c) => c._id === client._id);
      if (index !== -1) {
        client.excludeInQuestionnaire = true;
      } else {
        client.excludeInQuestionnaire = false;
      }
      return client;
    });

    setClientOptions(() => updatedClientOptions);
  };

  useEffect(() => {
    if (data && data.questionnaires) {
      const questionnaires = data.questionnaires as QuestionnaireModel[];
      setQuestionnaires(() => questionnaires);
    }

    // get all clients for the manual allocation option
    getUpdatedAssignedClients('getAll').then((clients) => {
      setClientOptions(() => clients);

      const clientsToExclude = clients?.filter(
        (client) => client.excludeInQuestionnaire
      );

      setClientExcludeList(() => clientsToExclude);
    });
  }, [data]);

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
      <div className="w-[90vw] sm:w-auto  mb-28">
        <div className="flex flex-col gap-5">
          <div className="flex flex-col lg:flex-row justify-between gap-8 lg:gap-10 lg:items-center mb-10">
            <h4
              className="font-medium text-xl lg:text-3xl md:text-2xl w-fit flex-none text-gray-800 interFonts"
              style={{
                fontWeight: 700,
                fontSize: 36,
                lineHeight: 1.6,
                color: '#3C3C3C',
                fontFamily: 'inter Tight',
              }}
            >
              Fragebogenzuweisung
            </h4>
            <div className="flex justify-end gap-4 w-fit">
              <TextField
                id={'search-questionnaire'}
                label={'Fragebogen'}
                variant={'outlined'}
                type="search"
                size="medium"
                value={questionnaireSearchTerm}
                className=""
                onChange={(e) =>
                  setQuestionnaireSearchTerm(() => e.target.value.toLowerCase())
                }
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

          <div>
            <DataGrid
              rows={searchResultsRows}
              columns={columns}
              // give row height based on the length of the question
              getRowHeight={(params) => {
                if (params.model.assignedTo.length > 2) return 'auto';
                return params.model.assignedTo.reduce(
                  (acc, curr) =>
                    acc + curr.Vorname.length + curr.Nachname.length,
                  0
                ) > 25
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
              sx={{
                '&, [class^=MuiDataGrid]': {
                  fontWeight: 500,
                  fontSize: '0.975rem',
                  border: 'none',
                },
                '& .MuiDataGrid-columnHeaders': {
                  borderRadius: 1,
                  backgroundColor: '#f5f5f6',
                  padding: '0 0.5rem',
                  border: '1px solid #CCC',
                },
                '& .MuiDataGrid-row': {
                  border: '1px solid #CCC',
                  borderRadius: 1,
                  width: '98.4%',
                  padding: '0 0.5rem',
                  alignItems: 'start',
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
                '& .MuiDataGrid-cell': {
                  border: 'none',
                  fontFamily: 'Inter Tight, sans-serif',
                  fontWeight: 400,
                  fontSize: '0.975rem',
                  padding: '1rem 0.5rem',
                  height: 'auto',
                  backgroundColor: 'transparent',
                  outline: 'none',
                },
              }}
            />
          </div>

          <Button
            className="w-full flex font-normal items-center justify-center md:py-4 border-dashed hover:bg-[#d6d8dc] hover:border-transparent interFonts"
            variant="outlined"
            size="large"
            onClick={() => router.push('/app/questionnaire/edit/new')}
          >
            Bitte klicken, um einen neuen Fragebogen zu erstellen.
          </Button>

          <div className="grid gap-6 mt-14">
            <h4
              className="font-medium text-xl lg:text-3xl md:text-2xl w-fit flex-none text-gray-800 interFonts"
              style={{
                fontWeight: 700,
                fontSize: 36,
                lineHeight: 1.6,
                color: '#3C3C3C',
                fontFamily: 'inter Tight',
              }}
            >
              Ausgenommene Klient:innen
            </h4>
            <h5 className="px-6 py-4 rounded-md bg-[#f5f5f6]">
              Von der Fragebogentestung ausgeschlossen
            </h5>

            <div className="border border-gray-400 rounded-md px-3 py-3">
              {editState.activeEditExclude ? (
                <Autocomplete
                  multiple
                  id="clients-assigned"
                  options={clientOptions}
                  limitTags={10}
                  size="medium"
                  getOptionLabel={(client) =>
                    `${client.Vorname} ${client.Nachname}`
                  }
                  value={clientExcludeList}
                  onChange={(_, newValue) =>
                    excludedClientsChangeHandler(newValue)
                  }
                  isOptionEqualToValue={(option, value) =>
                    option._id === value._id
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="standard"
                      maxRows={2}
                      onBlur={() => setEditState({ ...cleanEditState })}
                      autoFocus={editState.activeEditExclude}
                    />
                  )}
                />
              ) : (
                <div className="flex gap-3 items-center">
                  <div className="flex items-center gap-3 mr-6 w-fit h-10 overflow-y-scroll">
                    {clientExcludeList.map((client) => {
                      return (
                        <Chip
                          className="w-fit"
                          label={`${client.Vorname} ${client.Nachname}`}
                        />
                      );
                    })}
                  </div>
                  <EditSVG onClick={() => activeEditExcludeChangeHandler()} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default QuestionnaireAssignment;
