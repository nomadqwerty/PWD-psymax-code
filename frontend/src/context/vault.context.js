import { createContext, useState } from 'react';

const vaultContext = createContext();

const VaultProvider = ({ children }) => {
  const [userVault, setUserVault] = useState({});
  const [serverVault, setServerVault] = useState({});

  let state = {
    vaultState: { userVault, setUserVault, serverVault, setServerVault },
  };

  return (
    <vaultContext.Provider value={state}>{children}</vaultContext.Provider>
  );
};

export { VaultProvider };

export default vaultContext;
