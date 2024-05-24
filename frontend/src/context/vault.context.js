import { createContext, useState } from 'react';

const vaultContext = createContext();

const VaultProvider = ({ children }) => {
  const [fileVault, setFileVault] = useState({});
  const [clientVault, setClientVault] = useState({});
  const [serverVault, setServerVault] = useState({});
  const [updateFileVault, setUpdateFileVault] = useState({});
  const [updateClientVault, setUpdateClientVault] = useState({});
  const [storeFile, setStoreFile] = useState([]);

  let state = {
    vaultState: {
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
      storeFile,
      setStoreFile,
    },
  };

  return (
    <vaultContext.Provider value={state}>{children}</vaultContext.Provider>
  );
};

export { VaultProvider };

export default vaultContext;
