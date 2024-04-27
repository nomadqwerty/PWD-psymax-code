'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useContext } from 'react';
import PrivateRoute from '../../components/PrivateRoute';
import vaultContext from '@/context/vault.context';
import { fetchData_encrypyOnLogout } from './AuthUtils/AuthUtils';

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
    fetchData_encrypyOnLogout(
      fileVault,
      clientVault,
      serverVault,
      updateFileVault,
      updateClientVault,
      storeFile,
      router
    )
      .then((res) => console.log('done'))
      .catch((err) => console.log(err));
    // Call the async function immediately
  }, []);

  return <></>;
};

export default PrivateRoute(LogoutPage);
