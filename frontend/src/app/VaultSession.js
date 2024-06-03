'use client';
import { useContext, useEffect, useState } from 'react';
import vaultContext from '../context/vault.context';
import { usePathname } from 'next/navigation';

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
            // console.log('loaded state from session storage');
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
        !path.includes('/logout')
      ) {
        if (vaultStatus === true) {
          setVaultStatus(false);
          // console.log('vault is empty');
        }
      }
    }, 1000);

    return () => {
      if (vaultChecker) {
        clearInterval(vaultChecker);
      }
    };
  });

  return <>{children}</>;
};

export default VaultSession;
