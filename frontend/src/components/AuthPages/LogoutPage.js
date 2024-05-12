'use client';

import Worker from 'worker-loader!./AuthUtils/authWorker';
import { useRouter } from 'next/navigation';
import { useEffect, useContext } from 'react';
import PrivateRoute from '../../components/PrivateRoute';
import vaultContext from '@/context/vault.context';

const LogoutPage = () => {
  const router = useRouter();
  const { vaultState } = useContext(vaultContext);
  const {
    fileVault,
    clientVault,
    serverVault,
    updateFileVault,
    updateClientVault,
    storeFile,
  } = vaultState;

  useEffect(() => {
    let userData = localStorage.getItem('psymax-user-data');
    userData = JSON.parse(userData);
    const psymaxToken = localStorage.getItem('psymax-token');
    const authWorker = new Worker();

    authWorker.postMessage({
      type: 'encryptOnLogout',
      data: JSON.stringify({
        clientVault,
        fileVault,
        serverVault,
        updateFileVault,
        updateClientVault,
        storeFile,
        userData,
        psymaxToken,
      }),
    });
    authWorker.onmessage = (message) => {
      if (message.data === 'clearData') {
        localStorage.removeItem('psymax-token');
        localStorage.removeItem('psymax-user-data');
        localStorage.removeItem('psymax-is-admin');
        localStorage.removeItem('psymax-loggedin');
        router.push('/login');
      } else {
        router.push('/login');
      }
    };
  }, []);

  return <></>;
};

export default PrivateRoute(LogoutPage);
