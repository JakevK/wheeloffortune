import { React, useEffect, useContext } from "react";
import { SocketContext } from "../context/socket";
import { TextInput } from "../components";

const RegisterPage = ({ setClientID }) => {
  const socket = useContext(SocketContext);

  useEffect(() => {
    socket.on("register", (data) => {
      if (!data.error) {
        setClientID(data.client_id);
      }
    });
  }, [socket, setClientID]);

  const register = (name) => {
    socket.emit("register", { name: name });
  };

  return (
    <div>
      <h3>What's your name?</h3>
      <TextInput
        onSubmit={(name) => register(name)}
        validation={[(name) => name.length]}
      />
    </div>
  );
};

export default RegisterPage;
