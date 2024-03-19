'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useContext } from 'react';
import axiosInstance from '../../utils/axios';
import PrivateRoute from '../../components/PrivateRoute';
import vaultContext from '@/context/vault.context';
import { deriveAllKeys, encryptData } from '@/utils/utilityFn';

const LogoutPage = () => {
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        let fileVault = localStorage.getItem('fileVault');
        let clientVault = localStorage.getItem('clientVault');
        let serverVault = localStorage.getItem('serverVault');
        let updateFileVault = localStorage.getItem('updateFileVault');
        let updateClientVault = localStorage.getItem('updateClientVault');
        let userData = localStorage.getItem('psymax-user-data');

        if (
          fileVault &&
          clientVault &&
          serverVault &&
          updateFileVault &&
          updateClientVault &&
          userData
        ) {
          fileVault = JSON.parse(fileVault);
          clientVault = JSON.parse(clientVault);
          serverVault = JSON.parse(serverVault);
          updateFileVault = JSON.parse(updateFileVault);
          updateClientVault = JSON.parse(updateClientVault);
          userData = JSON.parse(userData);

          console.log(fileVault);
          console.log(clientVault);
          console.log(serverVault);
          console.log(updateFileVault);
          console.log(updateClientVault);
          console.log(userData);

          // TODO: encrypt update vault.
          const operations = window.crypto.subtle || window.crypto.webkitSubtle;
          let pass = userData.password;
          let ePass = userData.emergencyPassword;
          let dualKeySalt = serverVault.dualKeySalt;
          let masterKeySalt = serverVault.masterKeySalt;

          let allKeys = await deriveAllKeys(
            pass,
            ePass,
            dualKeySalt,
            masterKeySalt,
            window
          );
          let keysLength = Object.keys(allKeys).length;
          if (keysLength > 0) {
            const {
              masterKey,
              iv,
              dualKeyOne,
              dualKeyTwo,
              dualMasterKey,
              backUpIv,
              recoveryKeyEnc,
            } = allKeys;

            const fileUpdateEnc = await encryptData(
              operations,
              masterKey,
              iv,
              updateFileVault
            );
            let fileUpdateUint = new Uint8Array(fileUpdateEnc);

            const clientUpdateEnc = await encryptData(
              operations,
              masterKey,
              iv,
              updateClientVault
            );
            let clientUpdateUint = new Uint8Array(clientUpdateEnc);

            console.log(fileUpdateUint, clientUpdateUint);

            // TODO: send update vault to DB.
            await axiosInstance.post(`/vault/user/update/main`, {
              userId: userData._id,
              type: 'update',
              passwords: Array.from(fileUpdateUint),
              vault: 'file',
            });
            await axiosInstance.post(`/vault/user/update/main`, {
              userId: userData._id,
              type: 'update',
              passwords: Array.from(clientUpdateUint),
              vault: 'client',
            });
          }
        }

        const response = await axiosInstance.delete(`/logout`);
        if (response?.status === 200) {
          localStorage.removeItem('psymax-token');
          localStorage.removeItem('psymax-user-data');
          localStorage.removeItem('psymax-is-admin');
          localStorage.removeItem('psymax-loggedin');
          localStorage.removeItem('fileVault');
          localStorage.removeItem('clientVault');
          localStorage.removeItem('serverVault');
          localStorage.removeItem('updateFileVault');
          localStorage.removeItem('updateClientVault');
          router.push('/login');
        }
      } catch (error) {
        console.error('Logout error:', error);
        router.push('/login');
      }
    };

    fetchData(); // Call the async function immediately
  }, []);

  return <></>;
};

export default PrivateRoute(LogoutPage);
