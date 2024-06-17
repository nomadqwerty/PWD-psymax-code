'use client';

import Worker from 'worker-loader!./AuthUtils/authWorker';
import { useRouter } from 'next/navigation';
import { useEffect, useContext } from 'react';
import PrivateRoute from '../../components/PrivateRoute';
import vaultContext from '../../context/vault.context';
import toast from 'react-hot-toast';

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
    toast('Aktualisieren von Kontoverzeichnissen');
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
        toast.success('Die Kontoverzeichnisse wurden aktualisiert');
        localStorage.removeItem('psymax-token');
        localStorage.removeItem('psymax-user-data');
        localStorage.removeItem('psymax-is-admin');
        localStorage.removeItem('psymax-loggedin');
        sessionStorage.removeItem('vaultState');
        // TODO: add url to env
        window.location.replace(`${process.env.NEXT_PUBLIC_CLIENT_HOST}/login`);
      } else {
        window.location.replace(`${process.env.NEXT_PUBLIC_CLIENT_HOST}/login`);
      }
    };
  }, []);

  return <></>;
};

export default PrivateRoute(LogoutPage);
