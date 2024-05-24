'use client';
import React, { useContext, useEffect, useState } from 'react';
import AppLayout from '../../components/AppLayout';
import { Grid } from '@mui/material';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import axiosInstance from '../../utils/axios';
import ModelDialogue from '../../components/Dialog/ModelDialogue';
import { handleApiError } from '../../utils/apiHelpers';
import { KlientContext } from '../../context/klient.context';
import clientContext from '../../context/client.context';
import PrivateRoute from '../../components/PrivateRoute';
import vaultContext from '../../context/vault.context';
import {
  AddNewClient,
  Cipher,
  ClickToAddNew,
  Contact,
  Documentation,
  Invoice,
  SearchClients,
  Status,
  Treatment,
} from '../../components/client/InputsAndButtons';
import {
  ClientList,
  Pagination,
} from '../../components/client/ListsAndPagination';
import {
  ActiveClient,
  ArchivedClients,
  ClientHeader,
  NewlyAdded,
} from '../../components/client/HeadersAndInfo';

import {
  kontaktData,
  DokumentationData,
  BehandlungData,
  AbrechnungData,
  StatusData,
} from '../../components/client/Data';
import { update } from 'lodash';

const ClientPage = () => {
  // TODO: set client states to context.
  const { clientState } = useContext(clientContext);
  const { vaultState } = useContext(vaultContext);

  const {
    clientVault,
    serverVault,
    setClientVault,
    setUpdateClientVault,
    updateClientVault,
  } = vaultState;

  const {
    activeKlients,
    setActiveKlients,
    archivedKlients,
    setArchivedKlients,
    newKlients,
    setNewKlients,
  } = clientState;

  const [search, setSearch] = useState(null);

  const [open, setOpen] = useState(false);
  const [actionTitle, setActionTitle] = useState('');
  const [confirmTxt, setConfirmTxt] = useState('');
  const [options, setOptions] = useState('');
  const [submitHide, setSubmitHide] = useState(false);
  const [cancelHide, setCancelHide] = useState(false);
  const [modelOption, setModelOption] = useState('');
  const [deleteData, setDeleteData] = useState({});
  const [activePage, setActivePage] = useState({ pagenum: 1, total: 0 });
  const [archivedPage, setArchivedPage] = useState({ pagenum: 1, total: 0 });
  const [newPage, setNewPage] = useState({ pagenum: 1, total: 0 });
  const [activeSelectedKlients, setActiveSelectedKlients] = useState([]);
  const [activeSelectedAll, setActiveSelectedAll] = useState(false);
  const [archivedSelectedKlients, setArchivedSelectedKlients] = useState([]);
  const [archivedSelectedAll, setArchivedSelectedAll] = useState(false);
  const [newSelectedKlients, setNewSelectedKlients] = useState([]);
  const [newSelectedAll, setNewSelectedAll] = useState(false);

  const { dispatch: klientDispatch } = useContext(KlientContext);

  const router = useRouter();

  const agreeModel = async () => {
    if (modelOption === 'Entfernen') {
      try {
        setOpen(!open);
        const response = await axiosInstance.delete(
          `/klient/remove/${deleteData?.id}`
        );
        if (response?.status === 200) {
          if (deleteData?.isActive === 1) {
            setDeleteData({});
            fetchActiveKlient(activePage?.pagenum);
          }
          if (deleteData?.isActive === 0) {
            setDeleteData({});
            fetchArchivedKlient(archivedPage?.pagenum);
          }
          if (clientVault?.data) {
            // console.log(clientVault);
            let clientIdx;
            clientVault.data.forEach((e, i) => {
              if (e.clientId === deleteData?.id) {
                // console.log(e.clientId);
                // console.log(deleteData?.id);
                clientIdx = i;
              }
            });
            const clientVaultClone = { ...clientVault };
            clientVaultClone.data.splice(clientIdx, 1);
            // console.log(clientVaultClone);
            setClientVault(clientVaultClone);
            // setUpdateClientVault(clientVaultClone);
          }
          if (updateClientVault?.data) {
            // console.log(updateClientVault);
            let clientIdx;
            updateClientVault.data.forEach((e, i) => {
              if (e.clientId === deleteData?.id) {
                // console.log(e.clientId);
                // console.log(deleteData?.id);
                clientIdx = i;
              }
            });
            const clientVaultClone = { ...updateClientVault };
            clientVaultClone.data.splice(clientIdx, 1);
            // console.log(clientVaultClone);
            // setClientVault(clientVaultClone);
            setUpdateClientVault(clientVaultClone);
          }
          toast.success(response?.data?.message);
        }
      } catch (error) {
        setOpen(!open);
        handleApiError(error, router);
      }
    }
  };

  const closeModel = () => {
    if (modelOption === 'Entfernen') {
      setDeleteData({});
    }
    setOpen(false);
    setSubmitHide(false);
    setActionTitle('');
    setConfirmTxt('');
    setOptions('');
  };

  const formatDate = (inputDateString) => {
    const inputDate = new Date(inputDateString);

    const day = inputDate.getUTCDate();
    const month = inputDate.getUTCMonth() + 1; // Month is zero-based, so add 1
    const year = inputDate.getUTCFullYear();

    const formattedDate = `${day}.${month}.${year}`;

    return formattedDate;
  };

  const handleAction = (title, data) => {
    if (
      activeSelectedKlients?.length > 0 ||
      archivedSelectedKlients?.length > 0 ||
      (newSelectedKlients?.length > 0 && title !== 'Status')
    ) {
      setOpen(true);
      setSubmitHide(true);
      setActionTitle(title);
      setConfirmTxt('Was möchten Sie tun?');
      setOptions(data);
    }
  };

  const handleChiffreAll = (flag) => {
    if (flag === 1) {
      setArchivedSelectedKlients([]);
      const klientsId = activeKlients?.map((item) => item?._id);

      if (activeSelectedAll === true) {
        const updatedActiveSelectedKlients = activeSelectedKlients.filter(
          (clientId) => !klientsId.includes(clientId)
        );

        setActiveSelectedKlients(updatedActiveSelectedKlients);
      } else {
        const selectedSet = new Set([...activeSelectedKlients, ...klientsId]);
        const selected = Array.from(selectedSet);
        setActiveSelectedKlients(selected);
      }
    } else if (flag === 2) {
      setActiveSelectedKlients([]);
      const klientsId = archivedKlients?.map((item) => item?._id);

      if (archivedSelectedAll === true) {
        const updatedArchivedSelectedKlients = archivedSelectedKlients.filter(
          (clientId) => !klientsId.includes(clientId)
        );

        setArchivedSelectedKlients(updatedArchivedSelectedKlients);
      } else {
        const selectedSet = new Set([...archivedSelectedKlients, ...klientsId]);
        const selected = Array.from(selectedSet);
        setArchivedSelectedKlients(selected);
      }
    } else if (flag === 3) {
      setNewSelectedKlients([]);
      const klientsId = newKlients?.map((item) => item?._id);

      if (newSelectedAll === true) {
        const updatedNewSelectedKlients = newSelectedKlients.filter(
          (clientId) => !klientsId.includes(clientId)
        );

        setNewSelectedKlients(updatedNewSelectedKlients);
      } else {
        const selectedSet = new Set([...newSelectedKlients, ...klientsId]);
        const selected = Array.from(selectedSet);
        setNewSelectedKlients(selected);
      }
    }
  };

  const removeSelected = (id, flag) => {
    if (flag === 1) {
      const updatedActiveSelectedKlients = activeSelectedKlients.filter(
        (clientId) => clientId !== id
      );

      setActiveSelectedKlients(updatedActiveSelectedKlients);
    } else if (flag === 2) {
      const updatedArchivedSelectedKlients = archivedSelectedKlients.filter(
        (clientId) => clientId !== id
      );

      setArchivedSelectedKlients(updatedArchivedSelectedKlients);
    } else if (flag === 3) {
      const updatedNewSelectedKlients = newSelectedKlients.filter(
        (clientId) => clientId !== id
      );

      setNewSelectedKlients(updatedNewSelectedKlients);
    }
  };

  const addSelected = (id, flag) => {
    if (flag === 1) {
      setArchivedSelectedKlients([]);
      setNewSelectedKlients([]);
      setActiveSelectedKlients((prevSelected) => [...prevSelected, id]);
    } else if (flag === 2) {
      setActiveSelectedKlients([]);
      setNewSelectedKlients([]);
      setArchivedSelectedKlients((prevSelected) => [...prevSelected, id]);
    } else if (flag === 3) {
      setActiveSelectedKlients([]);
      setArchivedSelectedKlients([]);
      setNewSelectedKlients((prevSelected) => [...prevSelected, id]);
    }
  };

  const changeStatus = async (status) => {
    try {
      if (
        (status === 2 && activeSelectedKlients?.length > 0) ||
        (status === 1 && archivedSelectedKlients?.length > 0)
      ) {
        const res = await axiosInstance.put(`/klient/changeStatus`, {
          ids: status === 2 ? activeSelectedKlients : archivedSelectedKlients,
          status: status,
        });
        if (res?.status === 200) {
          setOpen(false);
          fetchActiveKlient(1);
          fetchArchivedKlient(1);
          setActiveSelectedKlients([]);
          setArchivedSelectedKlients([]);
          setActiveSelectedAll([]);
          setArchivedSelectedAll([]);
        }
      }
    } catch (error) {
      setOpen(false);
      handleApiError(error, router);
    }
  };

  const handleBrief = () => {
    const klients = [
      ...activeSelectedKlients,
      ...archivedSelectedKlients,
      ...newSelectedKlients,
    ];
    klientDispatch({
      type: 'BRIEF',
      payload: {
        brief: klients,
      },
    });
    router.push(`/dashboard/brief/${klients[0]}`);
  };

  const handleEmail = () => {
    const klients = [
      ...activeSelectedKlients,
      ...archivedSelectedKlients,
      ...newSelectedKlients,
    ];
    klientDispatch({
      type: 'EMAIL',
      payload: {
        email: klients,
      },
    });
    router.push(`/dashboard/email/${klients[0]}`);
  };

  async function fetchActiveKlient(pagenum) {
    try {
      const getActive = await axiosInstance.get(
        `/klient/getActive?page=${pagenum}&pageSize=${process.env.NEXT_PUBLIC_PAGINATION_LIMIT}`
      );
      const clientList = getActive?.data?.data?.list;

      setActiveKlients(clientList);
      setActivePage({
        ...activePage,
        pagenum: pagenum,
        total: getActive?.data?.data?.totalCount,
      });
    } catch (error) {
      handleApiError(error, router);
    }
  }

  async function fetchArchivedKlient(pagenum) {
    try {
      const getArchived = await axiosInstance.get(
        `/klient/getArchived?page=${pagenum}&pageSize=${process.env.NEXT_PUBLIC_PAGINATION_LIMIT}`
      );
      setArchivedKlients(getArchived?.data?.data?.list);
      setArchivedPage({
        ...archivedPage,
        pagenum: pagenum,
        total: getArchived?.data?.data?.totalCount,
      });
    } catch (error) {
      handleApiError(error, router);
    }
  }

  async function fetchNewKlient(pagenum) {
    try {
      const getNew = await axiosInstance.get(
        `/klient/getNew?page=${pagenum}&pageSize=${process.env.NEXT_PUBLIC_PAGINATION_LIMIT}`
      );
      setNewKlients(getNew?.data?.data?.list);
      setNewPage({
        ...newPage,
        pagenum: pagenum,
        total: getNew?.data?.data?.totalCount,
      });
    } catch (error) {
      handleApiError(error, router);
    }
  }

  useEffect(() => {
    const userLocalStorageData = localStorage.getItem('psymax-user-data');
    if (userLocalStorageData !== 'undefined') {
      const userData = JSON.parse(userLocalStorageData);
      if (!userData?.Chiffre) {
        router.push('/dashboard/kontoeinstellungen');
      } else {
        fetchActiveKlient(activePage?.pagenum);
        fetchArchivedKlient(archivedPage?.pagenum);
        fetchNewKlient(newPage?.pagenum);
      }
    }
  }, []);

  useEffect(() => {
    if (activeSelectedKlients?.length > 0) {
      const klientsId = activeKlients?.map((item) => item?._id);

      const allExist = klientsId.every((id) =>
        activeSelectedKlients.includes(id)
      );

      if (allExist) {
        setActiveSelectedAll(true);
      } else {
        setActiveSelectedAll(false);
      }
    } else {
      setActiveSelectedAll(false);
    }

    if (archivedSelectedKlients?.length > 0) {
      const klientsId = archivedKlients?.map((item) => item?._id);

      const allExist = klientsId.every((id) =>
        archivedSelectedKlients.includes(id)
      );

      if (allExist) {
        setArchivedSelectedAll(true);
      } else {
        setArchivedSelectedAll(false);
      }
    } else {
      setArchivedSelectedAll(false);
    }

    if (newSelectedKlients?.length > 0) {
      const klientsId = newKlients?.map((item) => item?._id);

      const allExist = klientsId.every((id) => newSelectedKlients.includes(id));

      if (allExist) {
        setNewSelectedAll(true);
      } else {
        setNewSelectedAll(false);
      }
    } else {
      setNewSelectedAll(false);
    }
  }, [
    activeSelectedKlients,
    activeKlients,
    archivedSelectedKlients,
    archivedKlients,
    newSelectedKlients,
    newKlients,
  ]);

  return (
    <AppLayout>
      <Grid container sx={{ mb: 4, alignItems: 'center' }} spacing={2}>
        <ClientHeader />

        <AddNewClient router={router} />
        {/* neue client */}

        <SearchClients search={search} setSearch={setSearch} />
        {/* suche */}
      </Grid>

      <Grid container>
        <Documentation
          handleAction={handleAction}
          DokumentationData={DokumentationData}
        />
        {/* dokumentation */}

        <Contact
          handleAction={handleAction}
          kontaktData={kontaktData}
          activeSelectedKlients={activeSelectedKlients}
          handleEmail={handleEmail}
          handleBrief={handleBrief}
          router={router}
        />
        {/* kontakt */}

        <Treatment
          handleAction={handleAction}
          BehandlungData={BehandlungData}
        />
        {/* behandlung */}

        <Invoice handleAction={handleAction} AbrechnungData={AbrechnungData} />
        {/* Abrechung */}

        <Status
          handleAction={handleAction}
          StatusData={StatusData}
          archivedKlients={archivedKlients}
          activeSelectedKlients={activeSelectedKlients}
          changeStatus={changeStatus}
        />
        {/* statusBar */}
      </Grid>

      <ActiveClient />
      {/* Aktive Klient */}
      {/* ////////////////////////////////////////////////// */}
      <div className="flex flex-col gap-3">
        <Cipher
          selectedAll={activeSelectedAll}
          handleChiffreAll={handleChiffreAll}
        />
        {/* chiffre */}

        <ClientList
          clientList={activeKlients}
          selectedClient={activeSelectedKlients}
          removeSelected={removeSelected}
          addSelected={addSelected}
          router={router}
          formatDate={formatDate}
          setModelOption={setModelOption}
          setOpen={setOpen}
          setDeleteData={setDeleteData}
          setActionTitle={setActionTitle}
          setConfirmTxt={setConfirmTxt}
          confirmTxt={confirmTxt}
        />
        {/* active client List */}

        <ClickToAddNew router={router} />
        {/* bitte klicken */}

        <Pagination pageObj={activePage} fetchClient={fetchActiveKlient} />
        {/* active client pagination */}
      </div>
      {/* /////////////////////////////////////////// */}

      <NewlyAdded />
      {/* neuaufzunehmende */}

      <div className="flex flex-col gap-3">
        <Cipher
          selectedAll={newSelectedAll}
          handleChiffreAll={handleChiffreAll}
        />
        {/* chiffre- new */}

        <ClientList
          clientList={newKlients}
          selectedClient={newSelectedKlients}
          removeSelected={removeSelected}
          addSelected={addSelected}
          router={router}
          formatDate={formatDate}
          setModelOption={setModelOption}
          setOpen={setOpen}
          setDeleteData={setDeleteData}
          setActionTitle={setActionTitle}
          setConfirmTxt={setConfirmTxt}
          confirmTxt={confirmTxt}
        />
        {/* newList */}

        <Pagination pageObj={newPage} fetchClient={fetchNewKlient} />
        {/* new pagin */}
      </div>

      <ArchivedClients />

      <div className="flex flex-col gap-3">
        <Cipher
          selectedAll={archivedSelectedAll}
          handleChiffreAll={handleChiffreAll}
        />
        {/* chifrre arch */}

        <ClientList
          clientList={archivedKlients}
          selectedClient={archivedSelectedKlients}
          removeSelected={removeSelected}
          addSelected={addSelected}
          router={router}
          formatDate={formatDate}
          setModelOption={setModelOption}
          setOpen={setOpen}
          setDeleteData={setDeleteData}
          setActionTitle={setActionTitle}
          setConfirmTxt={setConfirmTxt}
          confirmTxt={confirmTxt}
        />
        {/* Achive list */}

        <Pagination pageObj={archivedPage} fetchClient={fetchArchivedKlient} />
        {/* pagination archive */}
      </div>

      <ModelDialogue
        open={open}
        setOpen={setOpen}
        actionTitle={actionTitle}
        confirmationText={confirmTxt}
        agreeModel={agreeModel}
        closeModel={closeModel}
        options={options}
        cancelHide={cancelHide}
        submitHide={submitHide}
      />
    </AppLayout>
  );
};

export default PrivateRoute(ClientPage);
