'use client';
import Typography from '@mui/material/Typography';
import { Grid } from '@mui/material';
import { AuthContext } from '../../context/auth.context';
import { useRouter } from 'next/navigation';
import PrivateRoute from '../../components/PrivateRoute';
import { useContext, useEffect } from 'react';
import AppLayout from '../../components/AppLayout';
import Button from '../../components/common/Button';
import {
  Disclaimer,
  DocumentTemplate,
  Template,
} from '../../components/documentTemplate/HeadersAndInfo';
import {
  ConsentToExposure,
  GeneralTreatment,
  Return,
} from '../../components/documentTemplate/TemplateOptions';

const DocumentTemplatePage = () => {
  const { state } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    const userLocalStorageData = localStorage.getItem('psymax-user-data');
    if (userLocalStorageData !== 'undefined') {
      const userData = JSON.parse(userLocalStorageData);
      if (!userData?.Chiffre) {
        router.push('/dashboard/kontoeinstellungen');
      }
    }
  }, []);

  return (
    <AppLayout>
      <DocumentTemplate />
      <Disclaimer />
      <Template />

      <Grid container>
        <GeneralTreatment />
        <ConsentToExposure />
      </Grid>

      <Return router={router} />
    </AppLayout>
  );
};
export default PrivateRoute(DocumentTemplatePage);
