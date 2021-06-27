import { useState, useContext } from "react";
import { ThemeContext } from "../ThemeContext";

const Button = ({
  onClick,
  height = 30,
  children,
  depressed = false,
  disabled = false,
}) => {
  const theme = useContext(ThemeContext);

  const [clicked, setClicked] = useState(false);

  const shadowSize = height / 6;

  depressed = clicked || depressed;

  return (
    <button
      onMouseDown={() => (disabled ? "" : setClicked(true))}
      onMouseOut={() => setClicked(false)}
      style={{
        height: `${height}px`,
        backgroundColor: theme.background,
        color: theme.foreground,
        border: "none",
        boxShadow: `${shadowSize / 2}px ${shadowSize / 2}px ${shadowSize}px ${
          depressed ? "inset" : ""
        } ${theme.shadowDark}, -${shadowSize / 2}px -${
          shadowSize / 2
        }px ${shadowSize}px ${depressed ? "inset" : ""} ${theme.shadowLight}`,
        borderRadius: `${height / 2}px`,
        fontSize: `${height / 2}px`,
        padding: `0 ${height / 2}px`,
      }}
      onClick={() => (disabled ? "" : onClick())}
    >
      {children}
    </button>
  );
};

export default Button;
