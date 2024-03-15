import { createContext, useState } from 'react';

const kontoContext = createContext();

const ProviderKonto = ({ children }) => {
  const [kontoData, setKontoData] = useState({});

  const [fileVault, setFileVault] = useState({});
  const [clientVault, setClientVault] = useState({});
  const [serverVault, setServerVault] = useState({});
  const [updateFileVault, setUpdateFileVault] = useState({});
  const [updateClientVault, setUpdateClientVault] = useState({});

  let state = {
    menuState: { kontoData, setKontoData },
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
    },
  };

  return (
    <kontoContext.Provider value={state}>{children}</kontoContext.Provider>
  );
};

export { ProviderKonto };

export default kontoContext;
