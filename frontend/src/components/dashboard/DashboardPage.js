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

import { deriveAllKeys, decryptData } from '@/utils/utilityFn';

const DashboardPage = () => {
  const { state } = useContext(AuthContext);
  const { vaultState } = useContext(vaultContext);
  const [userData, setUserData] = useState();
  const [credentials, setCredentials] = useState();
  const [operations, setOperations] = useState();

  const { userVault, setUserVault, serverVault, setServerVault } = vaultState;

  const router = useRouter();
  useEffect(() => {
    const crypto = window.crypto.subtle || window.crypto.webkitSubtle;
    const userLocalStorageData = localStorage.getItem('psymax-user-data');
    let userPasswordVault = localStorage.getItem('userVault');
    let userLoginData = localStorage.getItem('userData');

    if (userLoginData !== undefined) {
      userLoginData = JSON.parse(userLoginData);
    }

    if (userPasswordVault !== 'undefined') {
      userPasswordVault = JSON.parse(userPasswordVault);
    }
    axiosInstance
      .get(`/vault/server`)
      .then((res) => {
        if (res.status === 200) {
          let vault = res.data.data;
          setServerVault(vault);
        }
      })
      .catch((err) => {});

    if (userPasswordVault && userLoginData && crypto) {
      if (typeof userLoginData === 'string') {
        userLoginData = JSON.parse(userLoginData);
        setUserData(userLoginData);
      }

      setOperations(crypto);
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
    if (serverVault && userVault && userData) {
      console.log(userVault);
      let { password, emergencyPassword } = userData;
      let { dualKeySalt, masterKeySalt } = serverVault;
      if (password && emergencyPassword && dualKeySalt && masterKeySalt) {
        console.log('dashboard');
        deriveAllKeys(
          password,
          emergencyPassword,
          dualKeySalt,
          masterKeySalt,
          window
        )
          .then((res) => {
            console.log(res);
            setCredentials(res);
          })
          .catch((err) => {});
      }
    }
  }, [serverVault, userVault, userData]);

  useEffect(() => {
    if (credentials && operations && userVault?.passwords) {
      const { masterKey, iv, backUpMasterKey } = credentials;
      let passwordDirectory = userVault.passwords.data;
      passwordDirectory = new Uint8Array(passwordDirectory);
      console.log(passwordDirectory);

      decryptData(operations, backUpMasterKey, iv, passwordDirectory)
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err.message);
        });
    }
  }, [credentials, operations, userVault]);
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
