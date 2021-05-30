import { React, useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import { SocketContext } from "../context/socket";
import { TextInput } from "../components";

const NewGamePage = () => {
  const history = useHistory();
  const socket = useContext(SocketContext);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    socket.on("create", (data) => {
      if (data.error) {
        return setErrorMsg(data.error);
      }
      history.push("/play");
    });
  }, [socket, history]);

  const createGame = (gameName) => {
    socket.emit("create", { game_name: gameName });
  };

  return (
    <div>
      <h3>Please enter a name for your game</h3>
      <TextInput
        onSubmit={(gameName) => createGame(gameName)}
        validation={[(gameName) => gameName.length]}
      />
      {errorMsg ? <div>{errorMsg}</div> : ""}
    </div>
  );
};

export default NewGamePage;
