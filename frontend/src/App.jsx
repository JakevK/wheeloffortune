import { React, useState } from "react";
import { SocketContext, socket } from "./context/socket";
import Routes from "./Routes";
import { RegisterPage } from "./pages";

const App = () => {
  const [clientID, setClientID] = useState(null);

  return (
    <SocketContext.Provider value={socket}>
      {clientID ? <Routes /> : <RegisterPage setClientID={setClientID} />}
    </SocketContext.Provider>
  );
};

export default App;
