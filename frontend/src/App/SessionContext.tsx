import React, { createContext, useContext, useReducer } from "react";
import { StartSessionResponse } from "./API";

type State =
  | {
      state: "initial";
    }
  | {
      state: "sessionEstablished";
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
    }
  | {
      state: "readAccess";
      token: string;
      entrySecrets: {
        write: {
          public: string;
          secretEncrypted: string;
          secretPasswordSalt: string;
        };
        read: {
          public: string;
          secretDecrypted_SENSITIVE: string;
          secretEncrypted: string;
          secretPasswordSalt: string;
        };
      };
    }
  | {
      state: "writeAccess";
      token: string;
      entrySecrets: {
        write: {
          public: string;
          secretDecrypted_SENSITIVE: string;
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

const initialState: State = {
  state: "initial"
};

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
        state: "sessionEstablished",
        ...action.sessionData
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
