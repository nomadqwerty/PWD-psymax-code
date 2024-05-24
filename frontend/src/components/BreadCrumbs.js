import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { Breadcrumbs, Link, Typography } from '@mui/material';
import { useRouter, usePathname } from 'next/navigation';

const CustomBreadcrumbs = () => {
  const router = useRouter();
  const pathname = usePathname();

  const routeArray = pathname.split('/').filter((segment) => segment !== '');
  const segments = routeArray.slice(1, 2);

  const breadCrumbs = [
    <p
      className="cursor-pointer"
      key="1"
      color="inherit"
      onClick={() => router.push('/dashboard')}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M20.25 20.2501V10.8319C20.25 10.7274 20.2282 10.624 20.1859 10.5284C20.1436 10.4329 20.0818 10.3472 20.0045 10.2769L12.504 3.45799C12.3659 3.33248 12.186 3.26293 11.9995 3.26294C11.8129 3.26295 11.633 3.3325 11.4949 3.45803L3.99545 10.2769C3.91814 10.3472 3.85637 10.4329 3.8141 10.5284C3.77183 10.624 3.75 10.7273 3.75 10.8318V20.2501"
          stroke="#0E0E0E"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M14.249 20.2493V14.9993C14.249 14.8004 14.17 14.6096 14.0294 14.4689C13.8887 14.3283 13.6979 14.2493 13.499 14.2493H10.499C10.3001 14.2493 10.1093 14.3283 9.96869 14.4689C9.82804 14.6096 9.74902 14.8004 9.74902 14.9993V20.2493"
          stroke="#0E0E0E"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M1.5 20.25H22.5"
          stroke="#0E0E0E"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </p>,
  ];

  if (segments?.length > 0) {
    segments?.map((item, i) => {
      let val = 'Übersicht';
      if (item === 'klientinnen') {
        val = 'Klient:innen';
      } else if (item === 'dokumentenvorlage') {
        val = 'Dokumentenvorlage';
      } else if (item === 'begruendungstexte') {
        val = 'Begründungstexte';
      } else if (item === 'leistungen') {
        val = 'Leistungen';
      } else if (item === 'kontoeinstellungen') {
        val = 'Kontoeinstellungen';
      } else if (item === 'questionnaire') {
        val = 'Fragebogen';
      } else if (item === 'edit') {
        val = 'Editor';
      } else if (item === 'evaluation') {
        val = 'Auswertung';
      } else if (item === 'assignment') {
        val = 'Zuweisung';
      } else if (item === '[questionnaireId]') {
        val = 'Detail';
      } else if (item === 'subscription') {
        val = 'Subscription';
      } else if (item === 'videoconsultation') {
        val = 'Videosprechstunde';
      }
      breadCrumbs.push(
        <Typography
          key={i}
          className="text-[#3d3d3d] text-xs interFonts font-medium"
        >
          {val}
        </Typography>
      );
    });
  }
  return (
    <Breadcrumbs
      separator={
        <NavigateNextIcon fontSize="inherit" className="text-[#3d3d3d]" />
      }
      aria-label="breadcrumb"
    >
      {breadCrumbs}
    </Breadcrumbs>
  );
};

export default CustomBreadcrumbs;
