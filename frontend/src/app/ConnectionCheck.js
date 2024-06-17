'use client';
import vaultContext from '../context/vault.context';
import { useContext, useEffect, useState } from 'react';
import axiosInstance from '../utils/axios';
import { deriveAllKeys, encryptData } from '../utils/utilityFn';
import { createStore, addToIdb } from '../utils/pwaUtils';
import { usePathname } from 'next/navigation';
import toast from 'react-hot-toast';
const ConnectionChecker = ({
  Component,
  pageProps,
  children,
  registeredServiceWorker,
}) => {
  const [intervalId, setIntervalId] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const { vaultState } = useContext(vaultContext);
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
  let path = usePathname();

  useEffect(() => {
    let statusChecker;
    if (registeredServiceWorker === true) {
      statusChecker = setInterval(async () => {
        let networkStatus;
        // console.log('check');
        if (navigator.onLine === true) {
          networkStatus = true;
          if (isOffline === true) {
            setIsOffline(false);
            toast.success('Verbindung wiederhergestellt');
          }
        } else if (navigator.onLine === false) {
          networkStatus = false;
          if (isOffline === false) {
            setIsOffline(true);
            toast('Verbindung unterbrochen');
          }
        } else if (navigator.onLine === undefined) {
          axiosInstance
            .get(`/vault/user/status`, {
              headers: { reqType: 'vaultUpdate' },
            })
            .then((res) => {
              if (res.status.startsWith('40')) {
                networkStatus = false;
                if (isOffline === false) {
                  setIsOffline(true);
                }
              }
            });
        }
      }, 1000);
    }

    return () => {
      if (statusChecker) {
        clearInterval(statusChecker);
      }
    };
  });

  useEffect(() => {
    const syncManager = window.SyncManager;
    let indexDB = window.idb;
    console.log(indexDB, syncManager, isOffline);
    if (
      isOffline === true &&
      syncManager !== undefined &&
      indexDB !== undefined &&
      !path.includes('/login') &&
      !path.includes('/logout')
    ) {
      (async () => {
        if (isOffline === true) {
          // TODO: encrypt data and register BG sync task.
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
            const operations =
              window.crypto.subtle || window.crypto.webkitSubtle;
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
                updateFileVault.data
              );
              let fileUpdateUint = new Uint8Array(fileUpdateEnc);

              const clientUpdateEnc = await encryptData(
                operations,
                masterKey,
                iv,
                updateClientVault.data
              );
              let clientUpdateUint = new Uint8Array(clientUpdateEnc);

              // TODO: send update store enc vault, use bgSync to schedule the request.

              if (fileUpdateUint && clientUpdateUint) {
                let readySw = await window.navigator.serviceWorker.ready;
                if (readySw) {
                  let updateVaultData = {
                    userId: userData._id,
                    files: Array.from(fileUpdateUint),
                    clients: Array.from(clientUpdateUint),
                  };

                  if (indexDB) {
                    let storeName = 'updateVault';
                    let db = createStore(indexDB, storeName, 'bgSync-store');

                    if (db) {
                      await addToIdb(
                        storeName,
                        'updateVault',
                        updateVaultData,
                        'bgSync',
                        db
                      );

                      readySw.sync.register('updateVaultRequest');
                      toast.success(
                        'Verzeichnisse stehen zur Aktualisierung in der Warteschlange'
                      );
                      // console.log('set bg task');
                    }
                  }
                }
              }
            }
          }
        }
      })();
    }
  }, [isOffline]);
  return <>{children}</>;
};

export default ConnectionChecker;
