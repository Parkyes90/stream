import React, { useState } from "react";
import Private from "../routes/private";
import Public from "../routes/public";
import AppContext from "./context";

const App: React.FC = () => {
  const [logged, setLogged] = useState(true);
  return (
    <AppContext.Provider value={{ logged, setLogged }}>
      {logged ? <Private /> : <Public />}
    </AppContext.Provider>
  );
};

export default App;
