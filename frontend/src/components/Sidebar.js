import { AppBar, Box, Drawer, Grid, IconButton, Toolbar } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  getRemainingTime,
  resetInactivityTimer,
} from '../utils/inactivityTimer';
import MenuIcon from '@mui/icons-material/Menu';
import { AuthContext } from '../context/auth.context';

const Sidebar = () => {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const { state } = useContext(AuthContext);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const drawerWidth = 240;

  const router = useRouter();
  const pathname = usePathname();
  const [remainingTimeString, setRemainingTimeString] = useState('10:00');

  useEffect(() => {
    const updateRemainingTime = () => {
      let remainingTime = getRemainingTime();

      if (remainingTime <= 0) {
        // Redirect to login route when time is up
        router.push('/logout');
        return;
      }

      const minutes = Math.floor(remainingTime / 60000);
      const seconds = Math.floor((remainingTime % 60000) / 1000);
      setRemainingTimeString(
        `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(
          2,
          '0'
        )}`
      );
    };

    // Initialize the inactivity timer and remaining time
    resetInactivityTimer();

    // Update remaining time every second
    const intervalId = setInterval(updateRemainingTime, 1000);

    // Cleanup: Remove event listener when the component unmounts
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const drawer = (
    <>
      <Grid container sx={{ margin: 1 }} spacing={2}>
        <Grid item xs={3.3}>
          <div className="flex justify-center items-center w-14 h-14 rounded-full bg-[#D9D9D9]">
            <span className="text-[#2B86FC] text-xl font-semibold interFonts leading-normal">
              {state?.userData?.Vorname?.slice(0, 1)}
              {state?.userData?.Nachname?.slice(0, 1)}
            </span>
          </div>
        </Grid>
        <Grid item xs={7.5}>
          <p className="ml-0.5 text-[#0E0E0E] interFonts font-semibold text-xs">
            {state?.userData?.Vorname} {state?.userData?.Nachname}
          </p>
          <p className="ml-0.5 text-[#707070] text-xs font-normal interFonts leading-normal mt-0.5 mb-0.5">
            {state?.userData?.Chiffre}
          </p>
          <p className="flex items-center mb-0.5">
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="mr-1"
            >
              <path
                d="M8 8L4.2 5.15C4.1379 5.10343 4.0875 5.04303 4.05279 4.97361C4.01807 4.90418 4 4.82762 4 4.75V2.5C4 2.36739 4.05268 2.24021 4.14645 2.14645C4.24021 2.05268 4.36739 2 4.5 2H11.5C11.6326 2 11.7598 2.05268 11.8536 2.14645C11.9473 2.24021 12 2.36739 12 2.5V4.72757C12 4.80488 11.9821 4.88113 11.9476 4.95034C11.9132 5.01955 11.8632 5.07983 11.8015 5.12644L8 8Z"
                stroke="#E30C40"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M8 8L4.2 10.85C4.1379 10.8966 4.0875 10.957 4.05279 11.0264C4.01807 11.0958 4 11.1724 4 11.25V13.5C4 13.6326 4.05268 13.7598 4.14645 13.8536C4.24021 13.9473 4.36739 14 4.5 14H11.5C11.6326 14 11.7598 13.9473 11.8536 13.8536C11.9473 13.7598 12 13.6326 12 13.5V11.2724C12 11.1951 11.9821 11.1189 11.9476 11.0497C11.9132 10.9805 11.8632 10.9202 11.8015 10.8736L8 8Z"
                stroke="#E30C40"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M4 3.99976H12"
                stroke="#E30C40"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-[#E30C40] interFonts text-xs font-normal leading-[18px]">
              {remainingTimeString}
            </span>
          </p>
          <p
            className="flex items-center cursor-pointer"
            onClick={() => router.push('/logout')}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="mr-1"
            >
              <path
                d="M5.12402 5.375L2.49971 8L5.12402 10.625"
                stroke="#E30C40"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M9.5 8H2.50184"
                stroke="#E30C40"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M9.5 13.5H13C13.1326 13.5 13.2598 13.4473 13.3536 13.3536C13.4473 13.2598 13.5 13.1326 13.5 13V3C13.5 2.86739 13.4473 2.74021 13.3536 2.64645C13.2598 2.55268 13.1326 2.5 13 2.5H9.5"
                stroke="#E30C40"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            <span className="text-[#E30C40] interFonts text-xs font-normal leading-[18px]">
              Abmelden
            </span>
          </p>
        </Grid>
      </Grid>

      <div
        className={`${
          pathname.startsWith('/dashboard') ? 'isActive' : 'sidebar-svg'
        } flex items-center mt-8 pt-2.5 pb-2.5 pl-6 cursor-pointer bg-[#fff] hover:bg-[#2b86fc1a]`}
        onClick={() => router.push('/dashboard')}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M20.25 20.2501V10.8319C20.25 10.7274 20.2282 10.624 20.1859 10.5284C20.1436 10.4329 20.0818 10.3472 20.0045 10.2769L12.504 3.45799C12.3659 3.33248 12.186 3.26293 11.9995 3.26294C11.8129 3.26295 11.633 3.3325 11.4949 3.45803L3.99545 10.2769C3.91814 10.3472 3.85637 10.4329 3.8141 10.5284C3.77183 10.624 3.75 10.7273 3.75 10.8318V20.2501"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M14.249 20.2493V14.9993C14.249 14.8004 14.17 14.6096 14.0294 14.4689C13.8887 14.3283 13.6979 14.2493 13.499 14.2493H10.499C10.3001 14.2493 10.1093 14.3283 9.96869 14.4689C9.82804 14.6096 9.74902 14.8004 9.74902 14.9993V20.2493"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M1.5 20.25H22.5"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        <span className="text-[#3C3C3C] interFonts text-base font-medium leading-4 pl-1.5">
          Übersicht
        </span>
      </div>

      <div className="treatmentGrp">
        <div className="flex items-center pt-6 pb-2.5 pl-6">
          <span className="text-[#707070] interFonts text-sm font-normal leading-6 pl-1 uppercase">
            BEHANDLUNG
          </span>
        </div>

        <div className="sidebar-svg flex items-center pt-2.5 pb-2.5 pl-6 cursor-pointer bg-[#fff] hover:bg-[#2b86fc1a]">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 7.5V12"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M15.8971 14.25L12 12"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M17.2656 9.34839H21.0156V5.59839"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M17.8336 17.8336C16.6798 18.9874 15.2098 19.7732 13.6095 20.0915C12.0092 20.4098 10.3504 20.2464 8.84286 19.622C7.33537 18.9976 6.0469 17.9402 5.14038 16.5835C4.23385 15.2268 3.75 13.6317 3.75 12C3.75 10.3683 4.23385 8.77325 5.14038 7.41655C6.0469 6.05984 7.33537 5.00242 8.84286 4.378C10.3504 3.75357 12.0092 3.5902 13.6095 3.90853C15.2098 4.22685 16.6798 5.01259 17.8336 6.16637L21.0156 9.34835"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="interFonts text-base font-medium leading-4 pl-1.5">
            Dokumentation
          </span>
        </div>

        <div
          className={`${
            pathname.startsWith('/dashboard/klientinnen')
              ? 'isActive'
              : 'sidebar-svg'
          } sidebar-svg flex items-center pt-2.5 pb-2.5  pl-6 cursor-pointer bg-[#fff] hover:bg-[#2b86fc1a]`}
          onClick={() => router.push('/dashboard/klientinnen')}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12.75 13.5C14.4069 13.5 15.75 12.1569 15.75 10.5C15.75 8.84315 14.4069 7.5 12.75 7.5C11.0931 7.5 9.75 8.84315 9.75 10.5C9.75 12.1569 11.0931 13.5 12.75 13.5Z"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M3 10.125H5.25"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M3 6.375H5.25"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M3 13.875H5.25"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M3 17.625H5.25"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M8.25 15.7498C8.77403 15.0513 9.45348 14.4843 10.2346 14.0938C11.0156 13.7033 11.8769 13.5 12.7501 13.5C13.6234 13.5 14.4846 13.7032 15.2657 14.0937C16.0468 14.4842 16.7263 15.0511 17.2504 15.7496"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M20.25 20.25V3.75C20.25 3.33579 19.9142 3 19.5 3L6 3C5.58579 3 5.25 3.33579 5.25 3.75L5.25 20.25C5.25 20.6642 5.58579 21 6 21H19.5C19.9142 21 20.25 20.6642 20.25 20.25Z"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          <span className="interFonts text-base font-medium leading-4 pl-1.5">
            Klient:innen
          </span>
        </div>

        <div className="sidebar-svg flex items-center pt-2.5 pb-2.5  pl-6 cursor-pointer bg-[#fff] hover:bg-[#2b86fc1a]">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19.5 3.75H4.5C4.08579 3.75 3.75 4.08579 3.75 4.5V19.5C3.75 19.9142 4.08579 20.25 4.5 20.25H19.5C19.9142 20.25 20.25 19.9142 20.25 19.5V4.5C20.25 4.08579 19.9142 3.75 19.5 3.75Z"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M16.5 2.25V5.25"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M7.5 2.25V5.25"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M3.75 8.25H20.25"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          <span className="interFonts text-base font-medium leading-4 pl-1.5">
            Terminplanung
          </span>
        </div>

        <div
          className="sidebar-svg flex items-center pt-2.5 pb-2.5  pl-6 cursor-pointer bg-[#fff] hover:bg-[#2b86fc1a]"
          onClick={() => router.push('/dashboard/videosprechstunde')}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12.0002 15L16.5 20.25H7.5L12.0002 15Z"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M6 18H4.5C4.10218 18 3.72064 17.842 3.43934 17.5607C3.15804 17.2794 3 16.8978 3 16.5V6C3 5.60218 3.15804 5.22064 3.43934 4.93934C3.72064 4.65804 4.10218 4.5 4.5 4.5H19.5C19.8978 4.5 20.2794 4.65804 20.5607 4.93934C20.842 5.22064 21 5.60218 21 6V16.5C21 16.8978 20.842 17.2794 20.5607 17.5607C20.2794 17.842 19.8978 18 19.5 18H18"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          <span className="interFonts text-base font-medium leading-4 pl-1.5">
            Videosprechstunde
          </span>
        </div>

        <div
          className={`${
            pathname.startsWith('/dashboard/dokumentenvorlage')
              ? 'isActive'
              : 'sidebar-svg'
          } sidebar-svg flex items-center pt-2.5 pb-2.5  pl-6 cursor-pointer bg-[#fff] hover:bg-[#2b86fc1a]`}
          onClick={() => router.push('/dashboard/dokumentenvorlage')}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3 19.5V6C3 5.80109 3.07902 5.61032 3.21967 5.46967C3.36032 5.32902 3.55109 5.25 3.75 5.25H8.75C8.91228 5.25 9.07018 5.30263 9.2 5.4L11.8 7.35C11.9298 7.44737 12.0877 7.5 12.25 7.5H18.75C18.9489 7.5 19.1397 7.57902 19.2803 7.71967C19.421 7.86032 19.5 8.05109 19.5 8.25V10.5"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M3 19.5L5.82906 11.0128C5.87884 10.8635 5.97434 10.7336 6.10204 10.6416C6.22974 10.5495 6.38316 10.5 6.54057 10.5H21.4594C21.5783 10.5 21.6954 10.5282 21.8012 10.5824C21.907 10.6365 21.9984 10.7151 22.0679 10.8115C22.1373 10.9079 22.1829 11.0194 22.2009 11.1369C22.2188 11.2544 22.2085 11.3744 22.1709 11.4872L19.5 19.5H3Z"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          <span className="interFonts text-base font-medium leading-4 pl-1.5">
            Dokumentenvorlagen
          </span>
        </div>
      </div>

      <div className="treatmentGrp">
        <div className="flex items-center pt-6 pb-2.5 pl-6">
          <span className="text-[#707070] interFonts text-sm font-normal leading-6 pl-1 uppercase">
            Einstellungen
          </span>
        </div>

        <div
          className={`${
            pathname.startsWith('/dashboard/begruendungstexte')
              ? 'isActive'
              : 'sidebar-svg'
          } sidebar-svg flex items-center pt-2.5 pb-2.5  pl-6 cursor-pointer bg-[#fff] hover:bg-[#2b86fc1a]`}
          onClick={() => router.push('/dashboard/begruendungstexte')}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8.25 15.75L4.5 19.5"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M14.4699 2.78022L8.62519 8.62489C8.62519 8.62489 6.02419 7.32439 3.24405 9.56712C3.16196 9.6332 3.09468 9.71583 3.0466 9.80962C2.99852 9.9034 2.97071 10.0063 2.96498 10.1115C2.95925 10.2167 2.97572 10.322 3.01333 10.4205C3.05093 10.5189 3.10884 10.6084 3.18327 10.683L13.2986 20.7983C13.3743 20.8742 13.4655 20.933 13.5659 20.9707C13.6664 21.0083 13.7737 21.024 13.8807 21.0166C13.9877 21.0092 14.0919 20.9789 14.1862 20.9278C14.2805 20.8767 14.3628 20.8059 14.4273 20.7203C15.2142 19.6744 16.4501 17.5247 15.3752 15.3749L21.2199 9.53022C21.3605 9.38956 21.4395 9.1988 21.4395 8.99989C21.4395 8.80098 21.3605 8.61021 21.2199 8.46956L15.5305 2.78022C15.3899 2.63956 15.1991 2.56055 15.0002 2.56055C14.8013 2.56055 14.6105 2.63956 14.4699 2.78022V2.78022Z"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          <span className="interFonts text-base font-medium leading-4 pl-1.5">
            Begründungstexte
          </span>
        </div>

        <div
          className={`${
            pathname.startsWith('/dashboard/leistungen')
              ? 'isActive'
              : 'sidebar-svg'
          } sidebar-svg flex items-center pt-2.5 pb-2.5  pl-6 cursor-pointer bg-[#fff] hover:bg-[#2b86fc1a]`}
          onClick={() => router.push('/dashboard/leistungen')}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 15H9V12L18 3L21 6L12 15Z"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M15.75 5.25L18.75 8.25"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M20.25 11.25V19.5C20.25 19.6989 20.171 19.8897 20.0303 20.0303C19.8897 20.171 19.6989 20.25 19.5 20.25H4.5C4.30109 20.25 4.11032 20.171 3.96967 20.0303C3.82902 19.8897 3.75 19.6989 3.75 19.5V4.5C3.75 4.30109 3.82902 4.11032 3.96967 3.96967C4.11032 3.82902 4.30109 3.75 4.5 3.75H12.75"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          <span className="interFonts text-base font-medium leading-4 pl-1.5">
            Leistungen
          </span>
        </div>

        <div
          className="sidebar-svg flex items-center pt-2.5 pb-2.5 pl-6 cursor-pointer bg-[#fff] hover:bg-[#2b86fc1a]"
          onClick={() => router.push('/dashboard/questionnaire/edit')}
        >
          <svg
            width="25"
            height="24"
            viewBox="0 0 25 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7.5 13.5C9.57107 13.5 11.25 11.8211 11.25 9.75C11.25 7.67893 9.57107 6 7.5 6C5.42893 6 3.75 7.67893 3.75 9.75C3.75 11.8211 5.42893 13.5 7.5 13.5Z"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M14.25 7.5H23.25"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M14.25 12H23.25"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M16.5 16.5H23.25"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M1.68945 18C2.02236 16.712 2.77377 15.5711 3.8256 14.7565C4.87743 13.942 6.17008 13.5 7.50043 13.5C8.83077 13.5 10.1234 13.942 11.1753 14.7565C12.2271 15.5711 12.9785 16.712 13.3114 18"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          <span className="interFonts text-base font-medium leading-4 pl-1.5">
            Fragebogeneditor
          </span>
        </div>
      </div>

      <div className="treatmentGrp">
        <div className="flex items-center pt-6 pb-2.5 pl-6">
          <span className="text-[#707070] interFonts text-sm font-normal leading-6 pl-1 uppercase">
            Konto
          </span>
        </div>

        <div
          className={`${
            pathname.startsWith('/dashboard/subscription')
              ? 'isActive'
              : 'sidebar-svg'
          } sidebar-svg flex items-center pt-2.5 pb-2.5  pl-6 cursor-pointer bg-[#fff] hover:bg-[#2b86fc1a]`}
          onClick={() => router.push('/dashboard/subscription')}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7.5 21.75C8.32843 21.75 9 21.0784 9 20.25C9 19.4216 8.32843 18.75 7.5 18.75C6.67157 18.75 6 19.4216 6 20.25C6 21.0784 6.67157 21.75 7.5 21.75Z"
              fill="#0E0E0E"
            />
            <path
              d="M17.25 21.75C18.0784 21.75 18.75 21.0784 18.75 20.25C18.75 19.4216 18.0784 18.75 17.25 18.75C16.4216 18.75 15.75 19.4216 15.75 20.25C15.75 21.0784 16.4216 21.75 17.25 21.75Z"
              fill="#0E0E0E"
            />
            <path
              d="M3.96429 6.75H20.7857L18.3108 15.4121C18.2213 15.7255 18.0321 16.0012 17.7718 16.1975C17.5116 16.3938 17.1945 16.5 16.8685 16.5H7.88145C7.55549 16.5 7.23839 16.3938 6.97816 16.1975C6.71792 16.0012 6.52872 15.7255 6.43917 15.4121L3.04827 3.54396C3.0035 3.38725 2.90889 3.24939 2.77878 3.15124C2.64866 3.05309 2.49011 3 2.32713 3H0.75"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          <span className="interFonts text-base font-medium leading-4 pl-1.5">
            Zahlungsdaten & Abonnement
          </span>
        </div>
        <div
          className={`${
            pathname.startsWith('/dashboard/kontoeinstellungen')
              ? 'isActive'
              : 'sidebar-svg'
          } sidebar-svg flex items-center pt-2.5 pb-2.5  pl-6 cursor-pointer bg-[#fff] hover:bg-[#2b86fc1a]`}
          onClick={() => router.push('/dashboard/kontoeinstellungen')}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 16.5C14.4853 16.5 16.5 14.4853 16.5 12C16.5 9.51472 14.4853 7.5 12 7.5C9.51472 7.5 7.5 9.51472 7.5 12C7.5 14.4853 9.51472 16.5 12 16.5Z"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M17.2181 6.10177C17.4583 6.31443 17.6854 6.54148 17.898 6.78166L20.4595 7.14743C20.8749 7.87075 21.1951 8.64467 21.4123 9.45001L19.8604 11.5192C19.8604 11.5192 19.8799 12.1604 19.8604 12.4806L21.413 14.5505C21.1953 15.3557 20.8745 16.1294 20.4586 16.8524L17.898 17.2182C17.898 17.2182 17.4584 17.6854 17.2183 17.898L16.8525 20.4595C16.1292 20.8749 15.3552 21.1951 14.5499 21.4123L12.4808 19.8604C12.1606 19.8799 11.8395 19.8799 11.5193 19.8604L9.44944 21.413C8.64425 21.1953 7.87054 20.8745 7.1475 20.4586L6.7818 17.8981C6.54162 17.6855 6.31457 17.4584 6.10191 17.2183L3.54044 16.8525C3.12505 16.1292 2.80479 15.3552 2.58759 14.5499L4.13957 12.4807C4.13957 12.4807 4.12005 11.8395 4.13951 11.5193L2.58691 9.44944C2.80466 8.64425 3.12545 7.87054 3.54132 7.1475L6.10177 6.7818C6.31443 6.54161 6.54148 6.31457 6.78166 6.10191L7.14743 3.54044C7.87075 3.12505 8.64467 2.80479 9.45001 2.58759L11.5191 4.13951C11.8393 4.12005 12.1604 4.12005 12.4806 4.13951L14.5505 2.58691C15.3557 2.80466 16.1294 3.12545 16.8524 3.54132L17.2181 6.10177Z"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          <span className="interFonts text-base font-medium leading-4 pl-1.5">
            Kontoeinstellungen
          </span>
        </div>
      </div>

      <div className="app-bottom-logo pl-6">
        <svg
          className="mb-2"
          width="110"
          height="22"
          viewBox="0 0 110 22"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M31.717 10.0883C31.2285 9.41101 30.605 8.88999 29.8657 8.5383C29.12 8.1801 28.3036 7.84143 27.4294 7.52882C26.5552 7.21621 25.7324 6.96221 24.9931 6.77985C24.2474 6.5975 23.611 6.36304 23.1096 6.09601C22.5954 5.82248 22.3382 5.50987 22.3382 5.17121C22.3382 4.55249 22.6789 4.07055 23.3539 3.72538C24.016 3.38671 24.7553 3.21738 25.5524 3.21738C26.343 3.21738 27.0823 3.38671 27.7508 3.72538C28.4129 4.05753 28.7536 4.53295 28.7665 5.13864H31.9163C31.9099 3.80353 31.3056 2.60518 30.1293 1.58267C28.94 0.553658 27.4037 0.026123 25.5588 0.026123C23.7139 0.026123 22.1775 0.547146 20.9883 1.58267C19.8055 2.61169 19.2013 3.81655 19.2013 5.17121C19.2013 6.20022 19.5484 7.09247 20.2362 7.83493C20.924 8.57738 21.7726 9.14399 22.7625 9.52173C23.7525 9.89947 24.7488 10.2251 25.7324 10.4986C26.7159 10.7722 27.5644 11.0522 28.2587 11.3453C28.9658 11.6449 29.3193 11.9966 29.3193 12.4004C29.3193 13.0386 28.9208 13.5336 28.1429 13.8592C27.3716 14.1849 26.5037 14.3477 25.5588 14.3477C24.6138 14.3477 23.746 14.1849 22.9746 13.8592C22.2097 13.5336 21.8111 13.0516 21.7983 12.4329H18.6484C18.6613 13.7485 19.3041 14.9404 20.5641 15.9694C21.8368 17.0114 23.5146 17.5389 25.5524 17.5389C27.5901 17.5389 29.2679 17.0114 30.5407 15.9694C31.8135 14.9273 32.4563 13.729 32.4563 12.4004C32.4499 11.5407 32.1992 10.7657 31.717 10.0883Z"
            fill="#0E0E0E"
          />
          <path
            d="M8.67812 0C6.29967 0 4.23621 0.866196 2.54558 2.57905C0.854954 4.29191 0 6.38251 0 8.79223V21.3944H3.34911V15.7544C4.87903 16.9657 6.66608 17.5845 8.65883 17.5845C11.0437 17.5845 13.1072 16.7183 14.7978 15.0054C16.4884 13.2926 17.3498 11.202 17.3498 8.79223C17.3498 6.38251 16.4949 4.29191 14.8042 2.57905C13.12 0.872709 11.0566 0 8.67812 0ZM14.0071 8.79223C14.0071 10.2902 13.4993 11.5341 12.4451 12.5892C11.3973 13.6508 10.163 14.1653 8.67812 14.1653C7.1932 14.1653 5.95898 13.6508 4.91117 12.5892C3.86337 11.5276 3.34911 10.2902 3.34911 8.79223C3.34911 7.29429 3.85694 6.05036 4.91117 4.99529C5.95898 3.93371 7.1932 3.4192 8.67812 3.4192C10.163 3.4192 11.3973 3.93371 12.4451 4.99529C13.4993 6.05687 14.0071 7.29429 14.0071 8.79223Z"
            fill="#0E0E0E"
          />
          <path
            d="M66.4809 0C64.141 0 62.3346 0.937839 61.1133 2.79398C59.8855 0.944352 58.0856 0 55.7457 0C53.7658 0 52.0752 0.690353 50.7252 2.05152C49.3753 3.41269 48.6875 5.13206 48.6875 7.15753V17.3109H52.0366V7.15753C52.0366 6.11549 52.3902 5.2558 53.123 4.51986C53.8558 3.78392 54.7108 3.42571 55.7393 3.42571C56.7678 3.42571 57.6227 3.78392 58.3556 4.51986C59.0884 5.2558 59.4419 6.122 59.4419 7.15753V17.3109H62.791V7.15753C62.791 6.11549 63.1446 5.2558 63.8774 4.51986C64.6102 3.78392 65.4652 3.42571 66.4937 3.42571C67.5222 3.42571 68.3772 3.78392 69.11 4.51986C69.8428 5.2558 70.1964 6.122 70.1964 7.15753V17.3109H73.5455V7.15753C73.5455 5.12555 72.8641 3.41269 71.5077 2.05152C70.1514 0.690353 68.4608 0 66.4809 0Z"
            fill="#0E0E0E"
          />
          <path
            d="M83.7152 0C81.3368 0 79.2733 0.866196 77.5827 2.57905C75.8921 4.29191 75.0371 6.38251 75.0371 8.79223C75.0371 11.202 75.8985 13.2925 77.5891 15.0054C79.2797 16.7183 81.3496 17.5845 83.7281 17.5845C85.7208 17.5845 87.5079 16.9723 89.0378 15.7544V17.3109H92.3869V8.79223C92.3869 6.38251 91.532 4.29191 89.8413 2.57905C88.1571 0.872708 86.0937 0 83.7152 0ZM89.0442 8.79223C89.0442 10.2902 88.5364 11.5341 87.4822 12.5892C86.4344 13.6508 85.2002 14.1653 83.7152 14.1653C82.2303 14.1653 80.9961 13.6508 79.9483 12.5892C78.9005 11.5276 78.3862 10.2902 78.3862 8.79223C78.3862 7.29429 78.8941 6.05036 79.9483 4.99529C80.9961 3.93371 82.2303 3.4192 83.7152 3.4192C85.2002 3.4192 86.4344 3.93371 87.4822 4.99529C88.5364 6.05687 89.0442 7.29429 89.0442 8.79223Z"
            fill="#0E0E0E"
          />
          <path
            d="M40.7488 11.358C40.7488 11.3515 40.7424 11.3515 40.7424 11.345L36.3326 0.462158H32.3535L38.936 15.1354L35.8119 21.9999H39.611L48.9127 0.462158H45.1586L40.7488 11.358Z"
            fill="#0E0E0E"
          />
          <path
            d="M97.1756 0.273682H92.8301L98.7183 8.81842L100.885 5.65322L97.1756 0.273682Z"
            fill="#0E0E0E"
          />
          <path
            d="M105.654 11.0067L104.144 8.81842L105.654 6.61059L110 0.273682H105.744L99.8945 8.84447L105.776 17.3111H110L105.654 11.0067Z"
            fill="#0E0E0E"
          />
          <path
            d="M92.8301 17.311H97.1756L100.891 11.9705L98.7183 8.81836L92.8301 17.311Z"
            fill="#0E0E0E"
          />
        </svg>
        <span className="pb-4">© 2023 psymax</span>
      </div>
    </>
  );

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          bgcolor: 'white',
          color: '#3C3C3C',
          boxShadow: 'unset',
        }}
        className="xs:block sm:hidden"
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{
              mr: 2,
              display: { sm: 'none' },
              '&:hover': {
                color: '#2b86fc',
              },
            }}
          >
            <MenuIcon />
          </IconButton>
          <div className="xs:block sm:hidden w-full flex">
            <div className="float-left pt-1">
              <svg
                width="90"
                height="18"
                viewBox="0 0 90 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M25.9503 8.25423C25.5506 7.70005 25.0404 7.27376 24.4356 6.98601C23.8255 6.69293 23.1575 6.41585 22.4423 6.16007C21.727 5.9043 21.0538 5.69648 20.4489 5.54728C19.8388 5.39808 19.3181 5.20625 18.9079 4.98777C18.4871 4.76397 18.2768 4.5082 18.2768 4.23111C18.2768 3.72489 18.5555 3.33057 19.1077 3.04815C19.6495 2.77106 20.2543 2.63252 20.9065 2.63252C21.5534 2.63252 22.1582 2.77106 22.7052 3.04815C23.247 3.31991 23.5257 3.7089 23.5362 4.20446H26.1134C26.1081 3.11209 25.6137 2.13163 24.6512 1.29503C23.6782 0.453105 22.4212 0.0214844 20.9118 0.0214844C19.4023 0.0214844 18.1453 0.447777 17.1723 1.29503C16.2045 2.13695 15.7101 3.12275 15.7101 4.23111C15.7101 5.07303 15.9941 5.80306 16.5569 6.41052C17.1197 7.01799 17.8139 7.48158 18.6239 7.79064C19.4338 8.0997 20.2491 8.36613 21.0538 8.58993C21.8585 8.81374 22.5527 9.04287 23.1207 9.28266C23.6993 9.52777 23.9885 9.81552 23.9885 10.1459C23.9885 10.6681 23.6625 11.0731 23.0261 11.3395C22.3949 11.6059 21.6849 11.7392 20.9118 11.7392C20.1386 11.7392 19.4286 11.6059 18.7974 11.3395C18.1716 11.0731 17.8455 10.6788 17.835 10.1725H15.2578C15.2683 11.2489 15.7943 12.2241 16.8251 13.066C17.8665 13.9186 19.2392 14.3502 20.9065 14.3502C22.5737 14.3502 23.9465 13.9186 24.9878 13.066C26.0292 12.2134 26.5552 11.2329 26.5552 10.1459C26.5499 9.44251 26.3448 8.80841 25.9503 8.25423Z"
                  fill="#2B86FC"
                />
                <path
                  d="M7.1003 0C5.15429 0 3.466 0.708707 2.08275 2.11014C0.69951 3.51157 0 5.22206 0 7.19366V17.5046H2.74019V12.89C3.99194 13.8811 5.45408 14.3873 7.08452 14.3873C9.03578 14.3873 10.7241 13.6786 12.1073 12.2772C13.4906 10.8757 14.1953 9.16525 14.1953 7.19366C14.1953 5.22206 13.4958 3.51157 12.1126 2.11014C10.7346 0.714036 9.0463 0 7.1003 0ZM11.4604 7.19366C11.4604 8.41925 11.0449 9.43702 10.1824 10.3003C9.32506 11.1688 8.31524 11.5898 7.1003 11.5898C5.88536 11.5898 4.87554 11.1688 4.01824 10.3003C3.16095 9.43169 2.74019 8.41925 2.74019 7.19366C2.74019 5.96807 3.15569 4.95031 4.01824 4.08707C4.87554 3.2185 5.88536 2.79753 7.1003 2.79753C8.31524 2.79753 9.32506 3.2185 10.1824 4.08707C11.0449 4.95564 11.4604 5.96807 11.4604 7.19366Z"
                  fill="#2B86FC"
                />
                <path
                  d="M54.3932 0C52.4788 0 51.0008 0.767325 50.0015 2.28599C48.997 0.772654 47.5243 0 45.6099 0C43.99 0 42.6067 0.564835 41.5022 1.67852C40.3977 2.79221 39.835 4.19897 39.835 5.85617V14.1635H42.5751V5.85617C42.5751 5.00359 42.8644 4.30021 43.464 3.69808C44.0636 3.09594 44.7631 2.80286 45.6046 2.80286C46.4461 2.80286 47.1456 3.09594 47.7452 3.69808C48.3448 4.30021 48.6341 5.00892 48.6341 5.85617V14.1635H51.3743V5.85617C51.3743 5.00359 51.6635 4.30021 52.2631 3.69808C52.8627 3.09594 53.5622 2.80286 54.4037 2.80286C55.2452 2.80286 55.9447 3.09594 56.5443 3.69808C57.1439 4.30021 57.4332 5.00892 57.4332 5.85617V14.1635H60.1734V5.85617C60.1734 4.19364 59.6159 2.79221 58.5061 1.67852C57.3964 0.564835 56.0131 0 54.3932 0Z"
                  fill="#2B86FC"
                />
                <path
                  d="M68.4948 0C66.5488 0 64.8605 0.708707 63.4773 2.11014C62.094 3.51157 61.3945 5.22206 61.3945 7.19366C61.3945 9.16525 62.0993 10.8757 63.4825 12.2772C64.8658 13.6786 66.5593 14.3873 68.5053 14.3873C70.1358 14.3873 71.5979 13.8864 72.8497 12.89V14.1635H75.5899V7.19366C75.5899 5.22206 74.8904 3.51157 73.5071 2.11014C72.1291 0.714036 70.4408 0 68.4948 0ZM72.8549 7.19366C72.8549 8.41925 72.4394 9.43702 71.5769 10.3003C70.7196 11.1688 69.7098 11.5898 68.4948 11.5898C67.2799 11.5898 66.2701 11.1688 65.4128 10.3003C64.5555 9.43169 64.1347 8.41925 64.1347 7.19366C64.1347 5.96807 64.5502 4.95031 65.4128 4.08707C66.2701 3.2185 67.2799 2.79753 68.4948 2.79753C69.7098 2.79753 70.7196 3.2185 71.5769 4.08707C72.4394 4.95564 72.8549 5.96807 72.8549 7.19366Z"
                  fill="#2B86FC"
                />
                <path
                  d="M33.3396 9.29274C33.3396 9.28741 33.3343 9.28742 33.3343 9.28209L29.7263 0.37793H26.4707L31.8564 12.3834L29.3003 17.9997H32.4087L40.0191 0.37793H36.9476L33.3396 9.29274Z"
                  fill="#2B86FC"
                />
                <path
                  d="M79.5076 0.223633H75.9521L80.7698 7.2148L82.5423 4.62509L79.5076 0.223633Z"
                  fill="#2B86FC"
                />
                <path
                  d="M86.4449 9.00522L85.2089 7.2148L86.4449 5.40839L90.0003 0.223633H86.5185L81.7324 7.23612L86.5448 14.1633H90.0003L86.4449 9.00522Z"
                  fill="#2B86FC"
                />
                <path
                  d="M75.9521 14.1636H79.5076L82.5475 9.79415L80.7698 7.21509L75.9521 14.1636Z"
                  fill="#2B86FC"
                />
              </svg>
            </div>
            <div
              className="float-right flex cursor-pointer"
              onClick={() => router.push('/login')}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 15C15.3137 15 18 12.3137 18 9C18 5.68629 15.3137 3 12 3C8.68629 3 6 5.68629 6 9C6 12.3137 8.68629 15 12 15Z"
                  stroke="#0E0E0E"
                  strokeWidth="1.5"
                  strokeMiterlimit="10"
                />
                <path
                  d="M2.90527 20.2491C3.82736 18.6531 5.15322 17.3278 6.74966 16.4064C8.34611 15.485 10.1569 15 12.0002 15C13.8434 15 15.6542 15.4851 17.2506 16.4065C18.8471 17.3279 20.1729 18.6533 21.0949 20.2493"
                  stroke="#0E0E0E"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="interFonts text-center logintxt">Anmelden</span>
            </div>
          </div>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
    </>
  );
};

export default Sidebar;
