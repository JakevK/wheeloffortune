import { React, useContext } from "react";
import { SocketContext } from "../../context/socket";

const Lobby = () => {
  const socket = useContext(SocketContext);

  return <div>lobby</div>;
};

export default Lobby;
