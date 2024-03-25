'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useContext } from 'react';
import axiosInstance from '../../utils/axios';
import PrivateRoute from '../../components/PrivateRoute';
import vaultContext from '@/context/vault.context';
import { deriveAllKeys, encryptData } from '@/utils/utilityFn';

const LogoutPage = () => {
  const router = useRouter();
  const { vaultState } = useContext(vaultContext);
  const {
    fileVault,
    clientVault,
    serverVault,
    updateFileVault,
    updateClientVault,
  } = vaultState;

  useEffect(() => {
    const fetchData = async () => {
      try {
        let fileVaultLength = Object.keys(fileVault).length;
        let clientVaultLength = Object.keys(clientVault).length;
        let serverVaultLength = Object.keys(serverVault).length;
        let updateFileVaultLength = Object.keys(updateFileVault).length;
        let updateClientVaultLength = Object.keys(updateClientVault).length;
        let userData = localStorage.getItem('psymax-user-data');

        if (
          fileVaultLength > 0 &&
          clientVaultLength > 0 &&
          serverVaultLength > 0 &&
          updateFileVaultLength > 0 &&
          updateClientVaultLength > 0 &&
          userData
        ) {
          userData = JSON.parse(userData);

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
              clients: Array.from(clientUpdateUint),
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
