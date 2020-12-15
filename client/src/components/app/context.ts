import { createContext, Dispatch, SetStateAction } from "react";

type AppContextValue = {
  logged: boolean;
  setLogged: Dispatch<SetStateAction<boolean>>;
};

const AppContext = createContext<AppContextValue>({
  logged: false,
  setLogged: () => {},
});

export default AppContext;
