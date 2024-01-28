import React, { createContext, useReducer, useEffect } from 'react';

const KlientContext = createContext();
const { Provider } = KlientContext;

const initialState = {
  brief: [],
  email: [],
};

const klientReducer = (state = initialState, action) => {
  switch (action?.type) {
    case 'BRIEF':
      return {
        ...state,
        brief: action?.payload?.brief,
      };
    case 'EMAIL':
      return {
        ...state,
        email: action?.payload?.email,
      };
    case 'INITIAL_STATE':
      return { ...initialState };
    default:
      return state;
  }
};

const KlientProvider = ({ children }) => {
  var [state, dispatch] = useReducer(klientReducer, initialState);
  return <Provider value={{ state, dispatch }}>{children}</Provider>;
};

export { KlientProvider, KlientContext };
