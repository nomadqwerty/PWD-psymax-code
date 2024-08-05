import React, { createContext, useReducer, useEffect } from 'react';

const AuthContext = createContext();
const { Provider } = AuthContext;

const initialState = {
  isLoggedin: false,
  drawer: false,
  userData: {},
};

const authReducer = (state = initialState, action) => {
  switch (action?.type) {
    case 'LOGIN':
      return {
        ...state,
        isLoggedin: action?.payload?.isLoggedin,
        userData: action?.payload?.userData,
      };
    case 'UPDATE_DRAWER':
      return { ...state, drawer: action?.payload?.drawer };
    case 'INITIAL_STATE':
      return { ...initialState };
    default:
      return state;
  }
};

const AuthProvider = ({ children }) => {
  var [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const isLoggedin = localStorage.getItem('psymax-loggedin');
    if (isLoggedin === 'true') {
      const userDataString = localStorage.getItem('psymax-user-data');
      if (userDataString !== 'undefined') {
        const userData = JSON.parse(userDataString);
        dispatch({
          type: 'LOGIN',
          payload: { isLoggedin: true, userData: userData },
        });
      }
    }
  }, []);

  return <Provider value={{ state, dispatch }}>{children}</Provider>;
};

export { AuthProvider, AuthContext };
