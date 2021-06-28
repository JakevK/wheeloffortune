import { React, useState, useContext } from "react";
import { ThemeContext } from "../ThemeContext";
import { Button } from "../components";

// gui input for text, similar to <input type="text" /> but with better styling
const TextInput = ({ onSubmit, validation, placeholder = "", width = 200 }) => {
  // theme consistency
  const theme = useContext(ThemeContext);
  // keep track of inputted text
  const [text, setText] = useState("");
  // keep track of errors
  const [error, setError] = useState("");

  // submit on enter
  const onKeyUp = (e) => {
    if (e.keyCode === 13) {
      submitText();
    }
  };

  // run onSubmit parameter function if text passes validation
  // otherwise display error message
  const submitText = () => {
    const errors = validation
      ? validation.map((rule) => rule(text)).filter((result) => result)
      : [];
    console.log(errors);
    setError(errors[0]);
    if (!errors.length) onSubmit(text);
  };

  // keep scaling consistent
  const height = 30;
  const shadowSize = height / 6;

  return (
    <div>
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
            }px -${shadowSize / 2}px ${shadowSize}px inset ${
              theme.shadowLight
            }`,
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
      <div style={{ marginTop: `${height / 2}px` }}>{error}</div>
    </div>
  );
};

export default TextInput;
