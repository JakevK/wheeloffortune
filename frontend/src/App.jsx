import { useEffect, useState } from "react";
import { w3cwebsocket as W3CWebSocket } from "websocket";
import pages from "./pages";
import { ThemeContext, theme } from "./ThemeContext";

// for production
const socket = new W3CWebSocket("wss://jake-wof.herokuapp.com/");

// initialize websocket client
// const socket = new W3CWebSocket("ws://127.0.0.1:5555");

const App = () => {
  const [data, setData] = useState({ event: "loading" });

  useEffect(() => {
    // set up socket events

    socket.onopen = () => {
      console.log("connected");
      setData({ event: "registration" });
    };

    socket.onclose = () => {
      console.log("disconnected");
      setData({});
    };

    socket.onmessage = (message) => {
      // parse and update data as new data arrives from server
      const data = JSON.parse(message.data);
      console.log(data);
      setData(data);
    };
  }, []);

  const send = (action, data) => {
    // send data to the server through websocket connection
    socket.send(JSON.stringify({ action: action, ...data }));
  };

  // determine which page to render based on data from server
  const Page = data.event in pages ? pages[data.event] : pages.error;

  return (
    // let pages use the theme context
    <ThemeContext.Provider value={theme}>
      <div style={{ color: theme.foreground }}>
        <Page send={send} data={data.data} />
      </div>
    </ThemeContext.Provider>
  );
};

export default App;
