import React, { createContext, useContext, useReducer } from "react";
import { StartSessionResponse } from "./API";

type State = {
  sessionData?: {
    token: string;
    entrySecrets: {
      write: {
        public: string;
        secretEncrypted: string;
        secretPasswordSalt: string;
      };
      read: {
        public: string;
        secretEncrypted: string;
        secretPasswordSalt: string;
      };
    };
  };
};

const initialState: State = {};

type Action = { type: "startSession"; sessionData: StartSessionResponse };

interface actions {
  startSession: (sessionData: StartSessionResponse) => void;
}

const SessionContext = createContext<[State, actions]>([
  initialState,
  {
    startSession: (sessionData: StartSessionResponse) => {}
  }
]);

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "startSession":
      return {
        ...state,
        sessionData: action.sessionData
      };
    default:
      return state;
  }
};

export const SessionProvider: React.ComponentType = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const actions = React.useMemo(() => {
    return {
      startSession: async (sessionData: StartSessionResponse) => {
        dispatch({ type: "startSession", sessionData });
      }
    };
  }, [dispatch]);

  return (
    <SessionContext.Provider value={[state, actions]}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSessionState = () => {
  return useContext(SessionContext);
};
