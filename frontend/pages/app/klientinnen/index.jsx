import React, { useContext, useEffect, useState } from 'react';
import Button from '../../../components/common/Button';
import AppLayout from '../../../components/AppLayout';
import { Grid, TablePagination, Typography } from '@mui/material';
import CssTextField from '../../../components/CssTextField';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import axiosInstance from '../../../utils/axios';
import ModelDialogue from '../../../components/Dialog/ModelDialogue';
import { handleApiError } from '../../../utils/apiHelpers';
import { KlientContext } from '../../../context/klient.context';
import PrivateRoute from '../../../components/PrivateRoute';

const Klientinnen = () => {
  const [search, setSearch] = useState(null);
  const [activeKlients, setActiveKlients] = useState([]);
  const [archivedKlients, setArchivedKlients] = useState([]);
  const [newKlients, setNewKlients] = useState([]);
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
    router.push(`/app/brief/${klients[0]}`);
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
    router.push(`/app/email/${klients[0]}`);
  };

  async function fetchActiveKlient(pagenum) {
    try {
      const getActive = await axiosInstance.get(
        `/klient/getActive?page=${pagenum}&pageSize=${process.env.NEXT_PUBLIC_PAGINATION_LIMIT}`
      );
      setActiveKlients(getActive?.data?.data?.list);
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
    const userData = JSON.parse(localStorage.getItem('psymax-user-data'));

    if (!userData?.Chiffre) {
      router.push('/app/kontoeinstellungen');
    } else {
      fetchActiveKlient(activePage?.pagenum);
      fetchArchivedKlient(archivedPage?.pagenum);
      fetchNewKlient(newPage?.pagenum);
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

  const kontaktData = (router) => {
    return (
      <>
        <div
          className="flex items-center mt-5 cursor-pointer"
          onClick={handleEmail}
          // onClick={() =>
          //   activeSelectedKlients?.length === 1 &&
          //   router.push(`/app/email/${activeSelectedKlients[0]}`)
          // }
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
            Email schreiben
          </span>
        </div>
        <div
          className="flex items-center mt-2 cursor-pointer"
          onClick={handleBrief}
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
              d="M8.94786 18L4 22V6C4 5.73478 4.10536 5.48043 4.29289 5.29289C4.48043 5.10536 4.73478 5 5 5H21C21.2652 5 21.5196 5.10536 21.7071 5.29289C21.8946 5.48043 22 5.73478 22 6V17C22 17.2652 21.8946 17.5196 21.7071 17.7071C21.5196 17.8946 21.2652 18 21 18H8.94786Z"
              stroke="#2B86FC"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M10 18V23C10 23.2652 10.1054 23.5196 10.2929 23.7071C10.4804 23.8946 10.7348 24 11 24H23.0521L28 28V12C28 11.7348 27.8946 11.4804 27.7071 11.2929C27.5196 11.1054 27.2652 11 27 11H22"
              stroke="#2B86FC"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          <span className="text-[#2B86FC] interFonts text-base font-medium">
            Brief schreiben
          </span>
        </div>
        <div className="flex items-center mt-2 cursor-pointer">
          <svg
            className="mr-2"
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19.9272 5C21.6225 5.45592 23.1682 6.34928 24.4095 7.59059C25.6508 8.8319 26.5441 10.3776 27.0001 12.0728"
              stroke="#2B86FC"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M18.8916 8.86475C19.9087 9.1383 20.8362 9.67431 21.5809 10.4191C22.3257 11.1639 22.8617 12.0913 23.1353 13.1084"
              stroke="#2B86FC"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M11.5595 15.6018C12.5968 17.7225 14.3158 19.4336 16.4412 20.4613C16.5967 20.535 16.7687 20.5669 16.9403 20.5539C17.1119 20.5409 17.2771 20.4835 17.4198 20.3872L20.5492 18.3004C20.6877 18.2082 20.8469 18.1518 21.0126 18.1366C21.1782 18.1214 21.3451 18.1478 21.498 18.2133L27.3526 20.7224C27.5515 20.8069 27.7175 20.9537 27.8257 21.1408C27.9339 21.3278 27.9783 21.545 27.9524 21.7595C27.7673 23.2075 27.0608 24.5384 25.9652 25.503C24.8695 26.4676 23.4598 26.9998 22 26.9999C17.4913 26.9999 13.1673 25.2088 9.97919 22.0207C6.79107 18.8326 5 14.5086 5 9.99988C5.00008 8.5401 5.53224 7.13039 6.49685 6.03472C7.46146 4.93905 8.79237 4.23255 10.2404 4.0475C10.4549 4.02154 10.672 4.066 10.8591 4.17418C11.0461 4.28236 11.193 4.4484 11.2775 4.64728L13.7888 10.507C13.8537 10.6586 13.8802 10.8239 13.8658 10.9881C13.8514 11.1524 13.7967 11.3106 13.7064 11.4485L11.6268 14.626C11.5322 14.769 11.4762 14.934 11.4644 15.105C11.4526 15.2761 11.4854 15.4472 11.5595 15.6018V15.6018Z"
              stroke="#2B86FC"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          <span className="text-[#2B86FC] interFonts text-base font-medium">
            Anrufen
          </span>
        </div>
      </>
    );
  };

  const DokumentationData = () => {
    return (
      <>
        <div className="flex items-center mt-5 cursor-pointer">
          <svg
            className="mr-2"
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M26 5H6C5.44772 5 5 5.44772 5 6V26C5 26.5523 5.44772 27 6 27H26C26.5523 27 27 26.5523 27 26V6C27 5.44772 26.5523 5 26 5Z"
              stroke="#2B86FC"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M4.99902 20H9.58481C9.71613 20 9.84617 20.0259 9.96749 20.0761C10.0888 20.1264 10.1991 20.2 10.2919 20.2929L12.7061 22.7071C12.799 22.8 12.9092 22.8736 13.0306 22.9239C13.1519 22.9741 13.2819 23 13.4132 23H18.5848C18.7161 23 18.8462 22.9741 18.9675 22.9239C19.0888 22.8736 19.1991 22.8 19.2919 22.7071L21.7061 20.2929C21.799 20.2 21.9092 20.1264 22.0306 20.0761C22.1519 20.0259 22.2819 20 22.4132 20H26.999"
              stroke="#2B86FC"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          <span className="text-[#2B86FC] interFonts text-base font-medium">
            Dokumentation eintragen
          </span>
        </div>
        <div className="flex items-center mt-2 cursor-pointer">
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
            Brief schreiben
          </span>
        </div>
      </>
    );
  };

  const BehandlungData = () => {
    return (
      <>
        <div className="flex items-center mt-5 cursor-pointer">
          <svg
            className="mr-2"
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M26 5H6C5.44772 5 5 5.44772 5 6V26C5 26.5523 5.44772 27 6 27H26C26.5523 27 27 26.5523 27 26V6C27 5.44772 26.5523 5 26 5Z"
              stroke="#2B86FC"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M22 3V7"
              stroke="#2B86FC"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M10 3V7"
              stroke="#2B86FC"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M5 11H27"
              stroke="#2B86FC"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M20.4995 15.9993L14.6661 21.4993L11.4995 18.4993"
              stroke="#2B86FC"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          <span className="text-[#2B86FC] interFonts text-base font-medium">
            Termin planen
          </span>
        </div>
        <div className="flex items-center mt-2 cursor-pointer">
          <svg
            className="mr-2"
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M16.0002 20L22 27H10L16.0002 20Z"
              stroke="#2B86FC"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M8 24H6C5.46957 24 4.96086 23.7893 4.58579 23.4142C4.21071 23.0391 4 22.5304 4 22V8C4 7.46957 4.21071 6.96086 4.58579 6.58579C4.96086 6.21071 5.46957 6 6 6H26C26.5304 6 27.0391 6.21071 27.4142 6.58579C27.7893 6.96086 28 7.46957 28 8V22C28 22.5304 27.7893 23.0391 27.4142 23.4142C27.0391 23.7893 26.5304 24 26 24H24"
              stroke="#2B86FC"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          <span className="text-[#2B86FC] interFonts text-base font-medium">
            Videosprechstunde planen
          </span>
        </div>
        <div className="flex items-center mt-2 cursor-pointer">
          <svg
            className="mr-2"
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10 18C12.7614 18 15 15.7614 15 13C15 10.2386 12.7614 8 10 8C7.23858 8 5 10.2386 5 13C5 15.7614 7.23858 18 10 18Z"
              stroke="#2B86FC"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M19 10H31"
              stroke="#2B86FC"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M19 16H31"
              stroke="#2B86FC"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M22 22H31"
              stroke="#2B86FC"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M2.25195 24C2.69583 22.2826 3.6977 20.7614 5.10015 19.6754C6.50259 18.5893 8.22612 18 9.99992 18C11.7737 18 13.4972 18.5893 14.8997 19.6754C16.3021 20.7614 17.304 22.2826 17.7479 24"
              stroke="#2B86FC"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          <span className="text-[#2B86FC] interFonts text-base font-medium">
            Fragebogen zuweisen
          </span>
        </div>
        <div className="flex items-center mt-2 cursor-pointer">
          <svg
            className="mr-2"
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M25 17H31"
              stroke="#2B86FC"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M28 14V20"
              stroke="#2B86FC"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M13.5 20C17.6421 20 21 16.6421 21 12.5C21 8.35786 17.6421 5 13.5 5C9.35786 5 6 8.35786 6 12.5C6 16.6421 9.35786 20 13.5 20Z"
              stroke="#2B86FC"
              strokeWidth="2"
              strokeMiterlimit="10"
            />
            <path
              d="M2.77588 24.9997C4.09005 23.434 5.73112 22.1751 7.58379 21.3113C9.43647 20.4476 11.4558 20 13.4999 20C15.5441 20 17.5634 20.4476 19.4161 21.3114C21.2687 22.1751 22.9098 23.4341 24.224 24.9998"
              stroke="#2B86FC"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          <span className="text-[#2B86FC] interFonts text-base font-medium">
            Fragebogen auswerten
          </span>
        </div>
        <div className="flex items-center mt-2 cursor-pointer">
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
            Ergebnisübersicht exportieren
          </span>
        </div>
      </>
    );
  };

  const AbrechnungData = () => {
    return (
      <>
        <div className="flex items-center mt-5 cursor-pointer">
          <svg
            className="mr-2"
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M25 28H6.99995C6.73474 28 6.4804 27.8946 6.29287 27.7071C6.10534 27.5196 5.99999 27.2652 6 27V5C5.99999 4.73479 6.10534 4.48044 6.29287 4.2929C6.4804 4.10537 6.73474 4.00001 6.99995 4H19.0003L26 11V27C26 27.2652 25.8947 27.5196 25.7071 27.7071C25.5196 27.8946 25.2653 28 25 28V28Z"
              stroke="#2B86FC"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M19 4V11H26.001"
              stroke="#2B86FC"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12 17H20"
              stroke="#2B86FC"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12 21H20"
              stroke="#2B86FC"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          <span className="text-[#2B86FC] interFonts text-base font-medium">
            Abrechnung starten
          </span>
        </div>
        <div className="flex items-center mt-2 cursor-pointer">
          <svg
            className="mr-2"
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M16 10V16"
              stroke="#2B86FC"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M21.1962 19L16 16"
              stroke="#2B86FC"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M8.979 12.4646H3.979V7.4646"
              stroke="#2B86FC"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M8.22164 23.7782C9.76002 25.3166 11.72 26.3642 13.8538 26.7886C15.9876 27.2131 18.1993 26.9952 20.2093 26.1627C22.2193 25.3301 23.9373 23.9202 25.146 22.1113C26.3547 20.3023 26.9998 18.1756 26.9998 16C26.9998 13.8244 26.3547 11.6977 25.146 9.88873C23.9373 8.07979 22.2193 6.66989 20.2093 5.83733C18.1993 5.00477 15.9876 4.78693 13.8538 5.21137C11.72 5.6358 9.76002 6.68345 8.22164 8.22183L3.979 12.4645"
              stroke="#2B86FC"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          <span className="text-[#2B86FC] interFonts text-base font-medium">
            Abrechnungsverlauf einsehen
          </span>
        </div>
        <div className="flex items-center mt-2 cursor-pointer">
          <svg
            className="mr-2"
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M21 28H7C6.73478 28 6.48043 27.8946 6.29289 27.7071C6.10536 27.5196 6 27.2652 6 27V9C6 8.73478 6.10536 8.48043 6.29289 8.29289C6.48043 8.10536 6.73478 8 7 8H17L22 13V27C22 27.2652 21.8946 27.5196 21.7071 27.7071C21.5196 27.8946 21.2652 28 21 28Z"
              stroke="#2B86FC"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M10 8V5C10 4.73478 10.1054 4.48043 10.2929 4.29289C10.4804 4.10536 10.7348 4 11 4H21L26 9V23C26 23.2652 25.8946 23.5196 25.7071 23.7071C25.5196 23.8946 25.2652 24 25 24H22"
              stroke="#2B86FC"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M11 19H17"
              stroke="#2B86FC"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M11 23H17"
              stroke="#2B86FC"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          <span className="text-[#2B86FC] interFonts text-base font-medium">
            Abrechnungen exportieren
          </span>
        </div>
      </>
    );
  };

  const StatusData = () => {
    return (
      <>
        <div
          className="flex items-center mt-5 cursor-pointer"
          onClick={() => archivedKlients?.length > 0 && changeStatus(1)}
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
              d="M17 18C19.2091 18 21 16.2091 21 14C21 11.7909 19.2091 10 17 10C14.7909 10 13 11.7909 13 14C13 16.2091 14.7909 18 17 18Z"
              stroke="#2B86FC"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M4 13.5H7"
              stroke="#2B86FC"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M4 8.5H7"
              stroke="#2B86FC"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M4 18.5H7"
              stroke="#2B86FC"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M4 23.5H7"
              stroke="#2B86FC"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M10.9995 20.9997C11.6982 20.0684 12.6042 19.3124 13.6456 18.7918C14.687 18.2711 15.8354 18 16.9997 18C18.164 18 19.3124 18.271 20.3538 18.7916C21.3953 19.3122 22.3013 20.0681 23 20.9995"
              stroke="#2B86FC"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M27 27V5C27 4.44772 26.5523 4 26 4L8 4C7.44772 4 7 4.44772 7 5V27C7 27.5523 7.44772 28 8 28H26C26.5523 28 27 27.5523 27 27Z"
              stroke="#2B86FC"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          <span className="text-[#2B86FC] interFonts text-base font-medium">
            Klient:in zur aktiven Liste hinzufügen
          </span>
        </div>
        <div
          className="flex items-center mt-2 cursor-pointer"
          onClick={() => activeSelectedKlients?.length > 0 && changeStatus(2)}
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
              d="M26 5H6C5.44772 5 5 5.44772 5 6V26C5 26.5523 5.44772 27 6 27H26C26.5523 27 27 26.5523 27 26V6C27 5.44772 26.5523 5 26 5Z"
              stroke="#2B86FC"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M4.99902 20H9.58481C9.71613 20 9.84617 20.0259 9.96749 20.0761C10.0888 20.1264 10.1991 20.2 10.2919 20.2929L12.7061 22.7071C12.799 22.8 12.9092 22.8736 13.0306 22.9239C13.1519 22.9741 13.2819 23 13.4132 23H18.5848C18.7161 23 18.8462 22.9741 18.9675 22.9239C19.0888 22.8736 19.1991 22.8 19.2919 22.7071L21.7061 20.2929C21.799 20.2 21.9092 20.1264 22.0306 20.0761C22.1519 20.0259 22.2819 20 22.4132 20H26.999"
              stroke="#2B86FC"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          <span className="text-[#2B86FC] interFonts text-base font-medium">
            Klient:in archivieren
          </span>
        </div>
      </>
    );
  };

  return (
    <AppLayout>
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
            Klient:innen
          </Typography>
        </Grid>
        <Grid item xs={6} sm={6} md={6} lg={3} className="newJustificationBtn">
          <button
            type="button"
            className="h-[59px] bg-[#EEE] px-5 py-2 rounded-[4px] justify-center items-center gap-2.5 inline-flex text-center text-[#0E0E0E] text-sm font-medium interFonts"
            onClick={() => router.push('/app/klientinnen/add')}
          >
            Neue Klient:in hinzufügen
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
            value={search || ''}
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

      <Grid container>
        <Grid
          item
          xs={6}
          sm={4.5}
          md={3}
          lg={2}
          xl={1.5}
          className="flex items-center pb-4"
          onClick={() => {
            handleAction('Dokumentation', DokumentationData);
          }}
        >
          <svg
            className="mr-1.5"
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M26 5H6C5.44772 5 5 5.44772 5 6V26C5 26.5523 5.44772 27 6 27H26C26.5523 27 27 26.5523 27 26V6C27 5.44772 26.5523 5 26 5Z"
              stroke="#2B86FC"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M22 3V7"
              stroke="#2B86FC"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M10 3V7"
              stroke="#2B86FC"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M5 11H27"
              stroke="#2B86FC"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="text-[#2B86FC] interFonts font-medium text-base">
            Dokumentation
          </span>
        </Grid>

        <Grid
          item
          xs={6}
          sm={3}
          md={2}
          lg={1.4}
          xl={1.1}
          className="flex items-center pb-4"
          onClick={() => {
            handleAction('Kontakt', kontaktData(router));
          }}
        >
          <svg
            className="mr-1.5"
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8.94786 18L4 22V6C4 5.73478 4.10536 5.48043 4.29289 5.29289C4.48043 5.10536 4.73478 5 5 5H21C21.2652 5 21.5196 5.10536 21.7071 5.29289C21.8946 5.48043 22 5.73478 22 6V17C22 17.2652 21.8946 17.5196 21.7071 17.7071C21.5196 17.8946 21.2652 18 21 18H8.94786Z"
              stroke="#2B86FC"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M10 18V23C10 23.2652 10.1054 23.5196 10.2929 23.7071C10.4804 23.8946 10.7348 24 11 24H23.0521L28 28V12C28 11.7348 27.8946 11.4804 27.7071 11.2929C27.5196 11.1054 27.2652 11 27 11H22"
              stroke="#2B86FC"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          <span className="text-[#2B86FC] interFonts font-medium text-base">
            Kontakt
          </span>
        </Grid>

        <Grid
          item
          xs={6}
          sm={3}
          md={2.5}
          lg={1.8}
          xl={1.3}
          className="flex items-center pb-4"
          onClick={() => {
            handleAction('Behandlung', BehandlungData);
          }}
        >
          <svg
            className="mr-1.5"
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 20H5C4.73478 20 4.48043 19.8946 4.29289 19.7071C4.10536 19.5196 4 19.2652 4 19V13C4 12.7348 4.10536 12.4804 4.29289 12.2929C4.48043 12.1054 4.73478 12 5 12H12V5C12 4.73478 12.1054 4.48043 12.2929 4.29289C12.4804 4.10536 12.7348 4 13 4H19C19.2652 4 19.5196 4.10536 19.7071 4.29289C19.8946 4.48043 20 4.73478 20 5V12H27C27.2652 12 27.5196 12.1054 27.7071 12.2929C27.8946 12.4804 28 12.7348 28 13V19C28 19.2652 27.8946 19.5196 27.7071 19.7071C27.5196 19.8946 27.2652 20 27 20H20V27C20 27.2652 19.8946 27.5196 19.7071 27.7071C19.5196 27.8946 19.2652 28 19 28H13C12.7348 28 12.4804 27.8946 12.2929 27.7071C12.1054 27.5196 12 27.2652 12 27V20Z"
              stroke="#2B86FC"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          <span className="text-[#2B86FC] interFonts font-medium text-base">
            Behandlung
          </span>
        </Grid>

        <Grid
          item
          xs={6}
          sm={4.5}
          md={2.5}
          lg={1.8}
          xl={1.3}
          className="flex items-center pb-4"
          onClick={() => {
            handleAction('Abrechnung', AbrechnungData);
          }}
        >
          <svg
            className="mr-1.5"
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5.5 17.9091V6.5C5.5 6.23478 5.60536 5.98043 5.79289 5.79289C5.98043 5.60536 6.23478 5.5 6.5 5.5H25.5C25.7652 5.5 26.0196 5.60536 26.2071 5.79289C26.3946 5.98043 26.5 6.23478 26.5 6.5V25.5C26.5 25.7652 26.3946 26.0196 26.2071 26.2071C26.0196 26.3946 25.7652 26.5 25.5 26.5H16.9545"
              stroke="#2B86FC"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M16 19L8 27L4 23"
              stroke="#2B86FC"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          <span className="text-[#2B86FC] interFonts font-medium text-base">
            Abrechnung
          </span>
        </Grid>

        <Grid
          item
          xs={6}
          sm={4}
          md={2}
          lg={2}
          xl={1.3}
          className="flex items-center pb-4"
          onClick={() => {
            handleAction('Status', StatusData);
          }}
        >
          <svg
            className="mr-1.5"
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M18 20.9993L23 25.9993L27.9999 21"
              stroke="#2B86FC"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M23 13.9993V25.9993"
              stroke="#2B86FC"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M6 15.9993H14.9999"
              stroke="#2B86FC"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M6 7.99927H22.9999"
              stroke="#2B86FC"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M6 23.9993H13"
              stroke="#2B86FC"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          <span className="text-[#2B86FC] interFonts font-medium text-base">
            Status
          </span>
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
            Aktive Klient:innen
          </Typography>
        </Grid>
      </Grid>

      <div className="flex flex-col gap-3">
        <div className="flex items-center w-full border-[1px] border-[#D6D8DC] radius4 bg-[#d6d8dc40]">
          <div
            className="text-[#707070]  font-normal leading-[26px] text-base xs:w-[20%] sm:w-[10%] md:w-[15%] lg:w-[10%] xl:w-[7%] cursor-pointer"
            onClick={() => handleChiffreAll(1)}
          >
            <svg
              className="m-4"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                width="24"
                height="24"
                rx="3"
                fill={`${activeSelectedAll ? '#2B86FC' : 'white'}`}
              />
              {activeSelectedAll && (
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M17.5614 8.97526L12.0774 16.1753C11.8509 16.4696 11.5008 16.6424 11.1294 16.6433C10.7601 16.6452 10.4104 16.477 10.1814 16.1873L7.25341 12.4553C6.98974 12.1166 6.9268 11.6629 7.08828 11.2653C7.24976 10.8676 7.61114 10.5863 8.03628 10.5273C8.46142 10.4683 8.88574 10.6406 9.14941 10.9793L11.1054 13.4753L15.6414 7.47526C15.9029 7.13228 16.3276 6.95488 16.7553 7.00987C17.1831 7.06487 17.5491 7.3439 17.7153 7.74187C17.8816 8.13984 17.8229 8.59628 17.5614 8.93926V8.97526Z"
                  fill="white"
                />
              )}
            </svg>
          </div>
          <span className="text-[#3C3C3C] font-normal text-base leading-[26px] xs:w-[60%] sm:w-[20%] md:w-[30%] lg:w-[25%] xl:w-[18%]">
            Chiffre
          </span>
          <div className=" text-[#3C3C3C] font-normal leading-[26px] text-base xs:w-[50%] sm:w-[30%] md:w-[30%] lg:w-[25%] xl:w-[20%]">
            Erstellungsdatum
          </div>
          <div className="xs:w-[50%] sm:w-[50%] md:w-[30%] lg:w-[40%] xl:w-[50%] xs:text-left sm:text-right"></div>
        </div>
        {activeKlients?.map((activeKlient, index) => {
          const checkExist = activeSelectedKlients.includes(activeKlient?._id);
          return (
            <div
              className="flex items-center w-full border-[1px] border-[#D6D8DC] radius4"
              key={`1${index}`}
            >
              <div
                className="text-[#707070]  font-normal leading-[26px] text-base xs:w-[20%] sm:w-[10%] md:w-[15%] lg:w-[10%] xl:w-[7%] cursor-pointer"
                onClick={() =>
                  checkExist
                    ? removeSelected(activeKlient?._id, 1)
                    : addSelected(activeKlient?._id, 1)
                }
              >
                <svg
                  className="m-4"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    width="24"
                    height="24"
                    rx="3"
                    fill={`${checkExist ? '#2B86FC' : '#EEEEEE'}`}
                  />
                  {checkExist && (
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M17.5614 8.97526L12.0774 16.1753C11.8509 16.4696 11.5008 16.6424 11.1294 16.6433C10.7601 16.6452 10.4104 16.477 10.1814 16.1873L7.25341 12.4553C6.98974 12.1166 6.9268 11.6629 7.08828 11.2653C7.24976 10.8676 7.61114 10.5863 8.03628 10.5273C8.46142 10.4683 8.88574 10.6406 9.14941 10.9793L11.1054 13.4753L15.6414 7.47526C15.9029 7.13228 16.3276 6.95488 16.7553 7.00987C17.1831 7.06487 17.5491 7.3439 17.7153 7.74187C17.8816 8.13984 17.8229 8.59628 17.5614 8.93926V8.97526Z"
                      fill="white"
                    />
                  )}
                </svg>
              </div>
              <div
                className="text-[#2B86FC] font-normal text-base leading-[26px] xs:w-[60%] sm:w-[20%] md:w-[30%] lg:w-[25%] xl:w-[18%] cursor-pointer"
                onClick={() =>
                  router.push(`/app/klientinnen/${activeKlient?._id}`)
                }
              >
                {activeKlient?.Chiffre}
              </div>
              <div className="text-[#707070] font-normal leading-[26px] text-base xs:w-[50%] sm:w-[30%] md:w-[30%] lg:w-[25%] xl:w-[20%]">
                {formatDate(activeKlient?.createdAt)}
              </div>
              <div className="xs:w-[50%] sm:w-[50%] md:w-[30%] lg:w-[40%] xl:w-[50%] xs:text-left sm:text-left md:text-left lg:text-right">
                <Button
                  size="xm"
                  varient="primary"
                  className="radius4 xs:mr-1 sm:mr-5 xs:my-2 md:mb-1 sm:mb-0"
                  onClick={() =>
                    router.push(`/app/klientinnen/${activeKlient?._id}`)
                  }
                >
                  Bearbeiten
                </Button>
                <Button
                  size="xm"
                  varient="destructive"
                  className="radius4 xs:my-2 md:mb-1 sm:mb-0"
                  onClick={() => {
                    setModelOption('Entfernen');
                    setOpen(true);
                    setDeleteData({
                      isActive: 1,
                      index: index,
                      id: activeKlient?._id,
                    });
                    setActionTitle('Aktion überprüfen');
                    setConfirmTxt(
                      'Bitte überprüfen Sie Ihre Aktion. Die von Ihnen beabsichtigte Aktion kann nicht rückgängig gemacht werden.'
                    );
                  }}
                >
                  Entfernen
                </Button>
              </div>
            </div>
          );
        })}
        <Button
          className="w-full flex font-normal items-center justify-center border-[1px] border-dashed bg-transparent"
          varient="secondary"
          size="md"
          onClick={() => router.push('/app/klientinnen/add')}
        >
          Bitte klicken, um eine neue Klient:in hinzuzufügen.
        </Button>
        <Grid container sx={{ alignItems: 'center' }}>
          <Grid item xs={12}>
            <TablePagination
              component="div"
              count={activePage?.total}
              page={activePage?.pagenum - 1}
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
                fetchActiveKlient(newPage + 1);
              }}
            />
          </Grid>
        </Grid>
      </div>

      <Grid container sx={{ mb: 4, mt: 1, alignItems: 'center' }} spacing={2}>
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
            Neuaufzunehmende Klient:innen
          </Typography>
        </Grid>
      </Grid>

      <div className="flex flex-col gap-3">
        <div className="flex items-center w-full border-[1px] border-[#D6D8DC] radius4 bg-[#d6d8dc40]">
          <div
            className="text-[#707070]  font-normal leading-[26px] text-base xs:w-[20%] sm:w-[10%] md:w-[15%] lg:w-[10%] xl:w-[7%] cursor-pointer"
            onClick={() => handleChiffreAll(3)}
          >
            <svg
              className="m-4"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                width="24"
                height="24"
                rx="3"
                fill={`${newSelectedAll ? '#2B86FC' : 'white'}`}
              />
              {newSelectedAll && (
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M17.5614 8.97526L12.0774 16.1753C11.8509 16.4696 11.5008 16.6424 11.1294 16.6433C10.7601 16.6452 10.4104 16.477 10.1814 16.1873L7.25341 12.4553C6.98974 12.1166 6.9268 11.6629 7.08828 11.2653C7.24976 10.8676 7.61114 10.5863 8.03628 10.5273C8.46142 10.4683 8.88574 10.6406 9.14941 10.9793L11.1054 13.4753L15.6414 7.47526C15.9029 7.13228 16.3276 6.95488 16.7553 7.00987C17.1831 7.06487 17.5491 7.3439 17.7153 7.74187C17.8816 8.13984 17.8229 8.59628 17.5614 8.93926V8.97526Z"
                  fill="white"
                />
              )}
            </svg>
          </div>
          <span className="text-[#3C3C3C] font-normal text-base leading-[26px] xs:w-[60%] sm:w-[20%] md:w-[30%] lg:w-[25%] xl:w-[18%]">
            Chiffre
          </span>
          <div className=" text-[#3C3C3C] font-normal leading-[26px] text-base xs:w-[50%] sm:w-[30%] md:w-[30%] lg:w-[25%] xl:w-[20%]">
            Erstellungsdatum
          </div>
          <div className="xs:w-[50%] sm:w-[50%] md:w-[30%] lg:w-[40%] xl:w-[50%] xs:text-left sm:text-right"></div>
        </div>
        {newKlients?.map((newKlient, index) => {
          const checkExist = newSelectedKlients.includes(newKlient?._id);
          return (
            <div
              className="flex items-center w-full border-[1px] border-[#D6D8DC] radius4"
              key={`2${index}`}
            >
              <div
                className="text-[#707070]  font-normal leading-[26px] text-base xs:w-[20%] sm:w-[10%] md:w-[15%] lg:w-[10%] xl:w-[7%]"
                onClick={() =>
                  checkExist
                    ? removeSelected(newKlient?._id, 3)
                    : addSelected(newKlient?._id, 3)
                }
              >
                <svg
                  className="m-4"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    width="24"
                    height="24"
                    rx="3"
                    fill={`${checkExist ? '#2B86FC' : '#EEEEEE'}`}
                  />
                  {checkExist && (
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M17.5614 8.97526L12.0774 16.1753C11.8509 16.4696 11.5008 16.6424 11.1294 16.6433C10.7601 16.6452 10.4104 16.477 10.1814 16.1873L7.25341 12.4553C6.98974 12.1166 6.9268 11.6629 7.08828 11.2653C7.24976 10.8676 7.61114 10.5863 8.03628 10.5273C8.46142 10.4683 8.88574 10.6406 9.14941 10.9793L11.1054 13.4753L15.6414 7.47526C15.9029 7.13228 16.3276 6.95488 16.7553 7.00987C17.1831 7.06487 17.5491 7.3439 17.7153 7.74187C17.8816 8.13984 17.8229 8.59628 17.5614 8.93926V8.97526Z"
                      fill="white"
                    />
                  )}
                </svg>
              </div>
              <div
                className="text-[#2B86FC] font-normal text-base leading-[26px] xs:w-[60%] sm:w-[20%] md:w-[30%] lg:w-[25%] xl:w-[18%] cursor-pointer"
                onClick={() =>
                  router.push(`/app/klientinnen/${newKlient?._id}`)
                }
              >
                {newKlient?.Chiffre}
              </div>
              <div className="text-[#707070] font-normal leading-[26px] text-base xs:w-[50%] sm:w-[30%] md:w-[30%] lg:w-[25%] xl:w-[20%]">
                {formatDate(newKlient?.createdAt)}
              </div>
              <div className="xs:w-[50%] sm:w-[50%] md:w-[30%] lg:w-[40%] xl:w-[50%] xs:text-left sm:text-left md:text-left lg:text-right">
                <Button
                  size="xm"
                  varient="primary"
                  className="radius4 xs:mr-1 sm:mr-5 xs:my-2 md:mb-1 sm:mb-0"
                  onClick={() =>
                    router.push(`/app/klientinnen/${newKlient?._id}`)
                  }
                >
                  Bearbeiten
                </Button>
                <Button
                  size="xm"
                  varient="destructive"
                  className="radius4 xs:my-2 md:mb-1 sm:mb-0"
                  onClick={() => {
                    setModelOption('Entfernen');
                    setOpen(true);
                    setDeleteData({
                      isActive: 0,
                      index: index,
                      id: newKlient?._id,
                    });
                    setActionTitle('Aktion überprüfen');
                    setConfirmTxt(
                      'Bitte überprüfen Sie Ihre Aktion. Die von Ihnen beabsichtigte Aktion kann nicht rückgängig gemacht werden.'
                    );
                  }}
                >
                  Entfernen
                </Button>
              </div>
            </div>
          );
        })}
        <Grid container sx={{ alignItems: 'center' }}>
          <Grid item xs={12}>
            <TablePagination
              component="div"
              count={newPage?.total}
              page={newPage?.pagenum - 1}
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
              onPageChange={(_, newPage) => fetchNewKlient(newPage + 1)}
            />
          </Grid>
        </Grid>
      </div>

      <Grid container sx={{ mb: 4, mt: 1, alignItems: 'center' }} spacing={2}>
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
            Archivierte Klient:innen
          </Typography>
        </Grid>
      </Grid>

      <div className="flex flex-col gap-3">
        <div className="flex items-center w-full border-[1px] border-[#D6D8DC] radius4 bg-[#d6d8dc40]">
          <div
            className="text-[#707070]  font-normal leading-[26px] text-base xs:w-[20%] sm:w-[10%] md:w-[15%] lg:w-[10%] xl:w-[7%] cursor-pointer"
            onClick={() => handleChiffreAll(2)}
          >
            <svg
              className="m-4"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                width="24"
                height="24"
                rx="3"
                fill={`${archivedSelectedAll ? '#2B86FC' : 'white'}`}
              />
              {archivedSelectedAll && (
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M17.5614 8.97526L12.0774 16.1753C11.8509 16.4696 11.5008 16.6424 11.1294 16.6433C10.7601 16.6452 10.4104 16.477 10.1814 16.1873L7.25341 12.4553C6.98974 12.1166 6.9268 11.6629 7.08828 11.2653C7.24976 10.8676 7.61114 10.5863 8.03628 10.5273C8.46142 10.4683 8.88574 10.6406 9.14941 10.9793L11.1054 13.4753L15.6414 7.47526C15.9029 7.13228 16.3276 6.95488 16.7553 7.00987C17.1831 7.06487 17.5491 7.3439 17.7153 7.74187C17.8816 8.13984 17.8229 8.59628 17.5614 8.93926V8.97526Z"
                  fill="white"
                />
              )}
            </svg>
          </div>
          <span className="text-[#3C3C3C] font-normal text-base leading-[26px] xs:w-[60%] sm:w-[20%] md:w-[30%] lg:w-[25%] xl:w-[18%]">
            Chiffre
          </span>
          <div className=" text-[#3C3C3C] font-normal leading-[26px] text-base xs:w-[50%] sm:w-[30%] md:w-[30%] lg:w-[25%] xl:w-[20%]">
            Erstellungsdatum
          </div>
          <div className="xs:w-[50%] sm:w-[50%] md:w-[30%] lg:w-[40%] xl:w-[50%] xs:text-left sm:text-right"></div>
        </div>
        {archivedKlients?.map((archiveKlient, index) => {
          const checkExist = archivedSelectedKlients.includes(
            archiveKlient?._id
          );
          return (
            <div
              className="flex items-center w-full border-[1px] border-[#D6D8DC] radius4"
              key={`2${index}`}
            >
              <div
                className="text-[#707070]  font-normal leading-[26px] text-base xs:w-[20%] sm:w-[10%] md:w-[15%] lg:w-[10%] xl:w-[7%]"
                onClick={() =>
                  checkExist
                    ? removeSelected(archiveKlient?._id, 2)
                    : addSelected(archiveKlient?._id, 2)
                }
              >
                <svg
                  className="m-4"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    width="24"
                    height="24"
                    rx="3"
                    fill={`${checkExist ? '#2B86FC' : '#EEEEEE'}`}
                  />
                  {checkExist && (
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M17.5614 8.97526L12.0774 16.1753C11.8509 16.4696 11.5008 16.6424 11.1294 16.6433C10.7601 16.6452 10.4104 16.477 10.1814 16.1873L7.25341 12.4553C6.98974 12.1166 6.9268 11.6629 7.08828 11.2653C7.24976 10.8676 7.61114 10.5863 8.03628 10.5273C8.46142 10.4683 8.88574 10.6406 9.14941 10.9793L11.1054 13.4753L15.6414 7.47526C15.9029 7.13228 16.3276 6.95488 16.7553 7.00987C17.1831 7.06487 17.5491 7.3439 17.7153 7.74187C17.8816 8.13984 17.8229 8.59628 17.5614 8.93926V8.97526Z"
                      fill="white"
                    />
                  )}
                </svg>
              </div>
              <div
                className="text-[#2B86FC] font-normal text-base leading-[26px] xs:w-[60%] sm:w-[20%] md:w-[30%] lg:w-[25%] xl:w-[18%] cursor-pointer"
                onClick={() =>
                  router.push(`/app/klientinnen/${archiveKlient?._id}`)
                }
              >
                {archiveKlient?.Chiffre}
              </div>
              <div className="text-[#707070] font-normal leading-[26px] text-base xs:w-[50%] sm:w-[30%] md:w-[30%] lg:w-[25%] xl:w-[20%]">
                {formatDate(archiveKlient?.createdAt)}
              </div>
              <div className="xs:w-[50%] sm:w-[50%] md:w-[30%] lg:w-[40%] xl:w-[50%] xs:text-left sm:text-left md:text-left lg:text-right">
                <Button
                  size="xm"
                  varient="primary"
                  className="radius4 xs:mr-1 sm:mr-5 xs:my-2 md:mb-1 sm:mb-0"
                  onClick={() =>
                    router.push(`/app/klientinnen/${archiveKlient?._id}`)
                  }
                >
                  Bearbeiten
                </Button>
                <Button
                  size="xm"
                  varient="destructive"
                  className="radius4 xs:my-2 md:mb-1 sm:mb-0"
                  onClick={() => {
                    setModelOption('Entfernen');
                    setOpen(true);
                    setDeleteData({
                      isActive: 0,
                      index: index,
                      id: archiveKlient?._id,
                    });
                    setActionTitle('Aktion überprüfen');
                    setConfirmTxt(
                      'Bitte überprüfen Sie Ihre Aktion. Die von Ihnen beabsichtigte Aktion kann nicht rückgängig gemacht werden.'
                    );
                  }}
                >
                  Entfernen
                </Button>
              </div>
            </div>
          );
        })}
        <Grid container sx={{ alignItems: 'center' }}>
          <Grid item xs={12}>
            <TablePagination
              component="div"
              count={archivedPage?.total}
              page={archivedPage?.pagenum - 1}
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
              onPageChange={(_, newPage) => fetchArchivedKlient(newPage + 1)}
            />
          </Grid>
        </Grid>
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

export default PrivateRoute(Klientinnen);
