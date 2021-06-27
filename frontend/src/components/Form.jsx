import { useContext } from "react";
import { ThemeContext } from "../ThemeContext";

// ui container with neumorphic styling and large spacing between its elements
// uses theme context to stay consistent with app theme
const Form = ({ children }) => {
  const theme = useContext(ThemeContext);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "60px",
        boxShadow: `10px 10px 20px ${theme.shadowDark}, -10px -10px 20px ${theme.shadowLight} `,
        paddingTop: "60px",
        paddingBottom: "100px",
        maxWidth: "90vw",
        width: "500px",
        borderRadius: "20px",
        textAlign: "center",
        marginBottom: "40px",
      }}
    >
      {children}
    </div>
  );
};

export default Form;
