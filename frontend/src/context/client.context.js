import { createContext, useState } from 'react';

const clientContext = createContext();

const ClientProvider = ({ children }) => {
  const [activeKlients, setActiveKlients] = useState([]);
  const [archivedKlients, setArchivedKlients] = useState([]);
  const [newKlients, setNewKlients] = useState([]);

  let state = {
    clientState: {
      activeKlients,
      setActiveKlients,
      archivedKlients,
      setArchivedKlients,
      newKlients,
      setNewKlients,
    },
  };

  return (
    <clientContext.Provider value={state}>{children}</clientContext.Provider>
  );
};

export { ClientProvider };

export default clientContext;
