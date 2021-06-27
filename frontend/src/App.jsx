import { useEffect, useState } from "react";
import { w3cwebsocket as W3CWebSocket } from "websocket";
import pages from "./pages";
import { ThemeContext, theme } from "./ThemeContext";

//const socket = new W3CWebSocket("wss://jake-wof.herokuapp.com/");
const socket = new W3CWebSocket("ws://127.0.0.1:5555");

const App = () => {
  const [data, setData] = useState({ event: "registration" });

  useEffect(() => {
    socket.onopen = () => {
      console.log("connected");
    };

    socket.onclose = () => {
      console.log("disconnected");
    };

    socket.onmessage = (message) => {
      const data = JSON.parse(message.data);
      console.log(data);
      setData(data);
    };
  }, []);

  const send = (action, data) => {
    socket.send(JSON.stringify({ action: action, ...data }));
  };

  const Page = data.event in pages ? pages[data.event] : pages.error;

  return (
    <ThemeContext.Provider value={theme}>
      <div style={{ color: theme.foreground }}>
        <Page send={send} data={data.data} />
      </div>
    </ThemeContext.Provider>
  );
};

export default App;
