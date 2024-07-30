'use client';
import { useContext, useEffect, useState } from 'react';
import vaultContext from '../context/vault.context';
import { usePathname } from 'next/navigation';
import toast from 'react-hot-toast';

const VaultSession = ({ children }) => {
  const { vaultState } = useContext(vaultContext);
  const [vaultStatus, setVaultStatus] = useState(true);
  let path = usePathname();
  const {
    fileVault,
    setFileVault,
    clientVault,
    setClientVault,
    serverVault,
    setServerVault,
    updateFileVault,
    setUpdateFileVault,
    updateClientVault,
    setUpdateClientVault,
  } = vaultState;

  // update userState with sessionStorage if userState is lost.
  useEffect(() => {
    let fileVaultLength = Object.keys(fileVault).length;
    let clientVaultLength = Object.keys(clientVault).length;
    let serverVaultLength = Object.keys(serverVault).length;
    let updateFileVaultLength = Object.keys(updateFileVault).length;
    let updateClientVaultLength = Object.keys(updateClientVault).length;

    let userData = localStorage.getItem('psymax-user-data');

    if (
      fileVaultLength <= 0 &&
      clientVaultLength <= 0 &&
      serverVaultLength <= 0 &&
      updateFileVaultLength <= 0 &&
      updateClientVaultLength <= 0 &&
      userData &&
      !path.includes('/login') &&
      !path.includes('/logout')
    ) {
      let vaultStateJson = sessionStorage.getItem('vaultState');

      if (vaultStateJson) {
        vaultStateJson = JSON.parse(vaultStateJson);
        if (vaultStateJson) {
          const {
            fileVault,
            clientVault,
            serverVault,
            updateFileVault,
            updateClientVault,
          } = vaultStateJson;

          if (vaultStatus === false) {
            setFileVault(fileVault);
            setClientVault(clientVault);
            setServerVault(serverVault);
            setUpdateFileVault(updateFileVault);
            setUpdateClientVault(updateClientVault);
            toast.success('geladener Zustand aus dem Sitzungsspeicher');
          }
        }
      }
    }
  }, [
    fileVault,
    clientVault,
    serverVault,
    updateFileVault,
    updateClientVault,
    vaultStatus,
  ]);

  useEffect(() => {
    // check if userState is empty.
    let vaultChecker = setInterval(() => {
      // console.log('vault check');
      let fileVaultLength = Object.keys(fileVault).length;
      let clientVaultLength = Object.keys(clientVault).length;
      let serverVaultLength = Object.keys(serverVault).length;
      let updateFileVaultLength = Object.keys(updateFileVault).length;
      let updateClientVaultLength = Object.keys(updateClientVault).length;
      let userData = localStorage.getItem('psymax-user-data');
      if (
        fileVaultLength <= 0 &&
        clientVaultLength <= 0 &&
        serverVaultLength <= 0 &&
        updateFileVaultLength <= 0 &&
        updateClientVaultLength <= 0 &&
        userData &&
        !path.includes('/login') &&
        !path.includes('/logout') &&
        !path.includes('/accountrecovery') &&
        !path.includes('/register') &&
        !path.includes('/passwordreset') &&
        !path.includes('/twofactorauthentication') &&
        !path.includes('/recoveryphrase') &&
        !path.includes('/download')
      ) {
        if (vaultStatus === true) {
          setVaultStatus(false);
          toast('Der Tresor ist leer');
        }
      }
    }, 15000);

    // Check if userState changes and update session storage.
    let sessionStoreCheck = setInterval(() => {
      if (
        !path.includes('/login') &&
        !path.includes('/logout') &&
        !path.includes('/accountrecovery') &&
        !path.includes('/register') &&
        !path.includes('/passwordreset') &&
        !path.includes('/twofactorauthentication') &&
        !path.includes('/recoveryphrase') &&
        !path.includes('/download')
      ) {
        let fileVaultLength = Object.keys(fileVault).length;
        let clientVaultLength = Object.keys(clientVault).length;
        let serverVaultLength = Object.keys(serverVault).length;
        let updateFileVaultLength = Object.keys(updateFileVault).length;
        let updateClientVaultLength = Object.keys(updateClientVault).length;
        let vaultSessionStore = sessionStorage.getItem('vaultState');
        let vaultStateJson;

        // get session vault
        if (vaultSessionStore) {
          vaultStateJson = JSON.parse(vaultSessionStore);
        }
        let fileVaultSessionLength;
        let clientVaultSessionLength;
        let serverVaultSessionLength;
        let updateFileVaultSessionLength;
        let updateClientVaultSessionLength;
        if (vaultStateJson) {
          const {
            fileVault,
            clientVault,
            serverVault,
            updateFileVault,
            updateClientVault,
          } = vaultStateJson;

          if (
            fileVault?.data &&
            clientVault?.data &&
            updateFileVault?.data &&
            updateClientVault?.data
          ) {
            fileVaultSessionLength = vaultStateJson.fileVault?.data.length;
            clientVaultSessionLength = vaultStateJson.clientVault?.data.length;

            updateFileVaultSessionLength =
              vaultStateJson.updateFileVault?.data.length;
            updateClientVaultSessionLength =
              vaultStateJson.updateClientVault?.data.length;
          }
        }

        if (
          fileVaultLength > 0 &&
          clientVaultLength > 0 &&
          serverVaultLength > 0 &&
          updateFileVaultLength > 0 &&
          updateClientVaultLength > 0 &&
          vaultStateJson
        ) {
          if (
            fileVault?.data?.length !==
              vaultStateJson?.fileVault?.data?.length ||
            clientVault?.data?.length !==
              vaultStateJson?.clientVault?.data?.length ||
            updateFileVault?.data?.length !==
              vaultStateJson?.updateFileVault?.data?.length ||
            updateClientVault?.data?.length !==
              vaultStateJson?.updateClientVault?.data?.length
          ) {
            const vaultStateJsonNew = JSON.stringify(vaultState);
            sessionStorage.setItem('vaultState', vaultStateJsonNew);
            toast.success('aktualisierter Sitzungstresor');
          }
        }
      }
    }, 20000);

    return () => {
      if (vaultChecker && sessionStoreCheck) {
        clearInterval(vaultChecker);
        clearInterval(sessionStoreCheck);
      }
    };
  });

  return <>{children}</>;
};

export default VaultSession;
