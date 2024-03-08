'use client';
import Typography from '@mui/material/Typography';
import { Grid } from '@mui/material';
import { AuthContext } from '../../context/auth.context';
import { useRouter } from 'next/navigation';
import PrivateRoute from '../../components/PrivateRoute';
import { useContext, useEffect } from 'react';
import AppLayout from '../../components/AppLayout';
import {
  WelcomeHeader,
  ReferralProgram,
  Treatment,
  JustificationAndServices,
  Account,
} from '../../components/dashboard/HeadersAndInfo';

import {
  DocumentAndService,
  Scheduling,
  VideoConsultation,
  DocumentTemplate,
  Client,
} from '../../components/dashboard/DashBoardOptions';

import {
  JustificationText,
  Services,
  QuestionnaireEditor,
} from '../../components/dashboard/JustificationOptions';

import {
  PaymentDetailsAndSubscription,
  AccountSetting,
} from '../../components/dashboard/AccountOptions';

const DashboardPage = () => {
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
      <WelcomeHeader state={state} />

      <ReferralProgram />

      <Treatment />

      <Grid container>
        <DocumentAndService router={router} />
        <Client router={router} />
      </Grid>

      <Grid container>
        <Scheduling router={router} />
        <VideoConsultation router={router} />
      </Grid>

      <Grid container>
        <DocumentTemplate router={router} />
      </Grid>

      <JustificationAndServices />

      <Grid container>
        <JustificationText router={router} />
        <Services router={router} />
      </Grid>

      <Grid container>
        <QuestionnaireEditor router={router} />
      </Grid>

      <Account />

      <Grid container>
        <PaymentDetailsAndSubscription router={router} />
        <AccountSetting router={router} />
      </Grid>
    </AppLayout>
  );
};
export default PrivateRoute(DashboardPage);
