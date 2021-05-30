import { React, useContext } from "react";
import { SocketContext } from "../../context/socket";

const Play = () => {
  const socket = useContext(SocketContext);

  return <div>play</div>;
};

export default Play;
