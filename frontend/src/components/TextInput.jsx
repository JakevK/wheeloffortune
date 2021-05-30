import { React, useState } from "react";

const TextInput = ({ onSubmit, validation }) => {
  const [text, setText] = useState("");

  const onKeyUp = (e) => {
    if (e.keyCode === 13) {
      submitText();
    }
  };
  const submitText = () => {
    const isValidInput = validation.every((rule) => rule(text));
    if (isValidInput) {
      onSubmit(text);
    }
  };

  return (
    <div>
      <input
        type="text"
        onKeyUp={(e) => onKeyUp(e)}
        onChange={(e) => setText(e.target.value)}
      />
      <button onClick={() => submitText()}>submit</button>
    </div>
  );
};

export default TextInput;
