import { React, useContext } from "react";
import { SocketContext } from "../context/socket";

const GamePage = () => {
  const socket = useContext(SocketContext);

  return <div>play</div>;
};

export default GamePage;
