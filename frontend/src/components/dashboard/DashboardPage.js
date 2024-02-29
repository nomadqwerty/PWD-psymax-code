'use client';
import Typography from '@mui/material/Typography';
import { Grid } from '@mui/material';
import { AuthContext } from '../../context/auth.context';
import vaultContext from '@/context/vault.context';
import { useRouter } from 'next/navigation';
import PrivateRoute from '../../components/PrivateRoute';
import { useContext, useEffect, useState } from 'react';
import AppLayout from '../../components/AppLayout';
import axiosInstance from '@/utils/axios';
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

import { deriveAllKeys } from '@/utils/utilityFn';

const DashboardPage = () => {
  const { state } = useContext(AuthContext);
  const { vaultState } = useContext(vaultContext);
  const [userData, setUserData] = useState();
  const [credentials, setCredentials] = useState();

  const { userVault, setUserVault, serverVault, setServerVault } = vaultState;

  const router = useRouter();
  useEffect(() => {
    const userLocalStorageData = localStorage.getItem('psymax-user-data');
    const userPasswordVault = JSON.parse(localStorage.getItem('userVault'));
    let userLoginData = JSON.parse(localStorage.getItem('userData'));

    axiosInstance
      .get(`/vault/server`)
      .then((res) => {
        if (res.status === 200) {
          let vault = res.data.data;
          setServerVault(vault);
        }
      })
      .catch((err) => {});

    if (userPasswordVault && userLoginData) {
      if (typeof userLoginData === 'string') {
        userLoginData = JSON.parse(userLoginData);
        setUserData(userLoginData);
      }
      setUserVault(userPasswordVault);
      // TODO: remove userVault and userData from localStorage.
    }

    if (userLocalStorageData !== 'undefined') {
      const userData = JSON.parse(userLocalStorageData);
      if (!userData?.Chiffre) {
        router.push('/dashboard/kontoeinstellungen');
      }
    }
  }, []);

  useEffect(() => {
    console.log(serverVault);
    console.log(userVault);
    console.log(userData);
    if (serverVault && userVault && userData) {
      let { password, emergencyPassword } = userData;
      let { dualKeySalt, masterKeySalt } = serverVault;
      if (password && emergencyPassword && dualKeySalt && masterKeySalt) {
        deriveAllKeys(
          password,
          emergencyPassword,
          dualKeySalt,
          masterKeySalt,
          window
        )
          .then((res) => {
            console.log(res);
          })
          .catch((err) => {});
      }
    }
  }, [serverVault, userVault, userData]);

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
