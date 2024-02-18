import { createContext, useState } from 'react';

const kontoContext = createContext();

const ProviderKonto = ({ children }) => {
  const [kontoData, setKontoData] = useState({});

  let state = {
    menuState: { kontoData, setKontoData },
  };

  return (
    <kontoContext.Provider value={state}>{children}</kontoContext.Provider>
  );
};

export { ProviderKonto };

export default kontoContext;
