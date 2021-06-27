import { React, useState, useContext } from "react";
import { ThemeContext } from "../ThemeContext";
import { Button } from "../components";

const TextInput = ({ onSubmit, validation, placeholder = "", width = 200 }) => {
  const theme = useContext(ThemeContext);
  const [text, setText] = useState("");
  const [clicked, setClicked] = useState(false);

  const onKeyUp = (e) => {
    if (e.keyCode === 13) {
      submitText();
    }
  };
  const submitText = () => {
    const isValidInput =
      text.length &&
      (validation ? validation.every((rule) => rule(text)) : true);
    if (isValidInput) {
      onSubmit(text);
    }
  };

  const height = 30;
  const shadowSize = height / 6;
  return (
    <div>
      <input
        style={{
          backgroundColor: theme.background,
          border: "none",
          height: `${height}px`,
          boxShadow: `${shadowSize / 2}px ${
            shadowSize / 2
          }px ${shadowSize}px inset ${theme.shadowDark}, -${
            shadowSize / 2
          }px -${shadowSize / 2}px ${shadowSize}px inset ${theme.shadowLight}`,
          borderRadius: `${height / 2}px`,
          width: `${width}px`,
          padding: `0 ${height / 2}px`,
          outline: "none",
          fontSize: `${height / 2}px`,
          marginRight: `${height / 2}px`,
        }}
        placeholder={placeholder}
        type="text"
        onKeyUp={(e) => onKeyUp(e)}
        onChange={(e) => setText(e.target.value)}
      />
      <Button onClick={submitText}>submit</Button>
    </div>
  );
};

export default TextInput;
