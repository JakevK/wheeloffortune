import { useContext } from "react";
import { ThemeContext } from "../ThemeContext";

const Card = ({ style, children }) => {
  const theme = useContext(ThemeContext);
  return (
    <div
      style={{
        boxShadow: `10px 10px 20px ${theme.shadowDark}, -10px -10px 20px ${theme.shadowLight} `,
        borderRadius: "10px",
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export default Card;
