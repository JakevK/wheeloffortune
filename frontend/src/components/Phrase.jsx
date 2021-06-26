import { useContext } from "react";
import { ThemeContext } from "../ThemeContext";
import "../index.css";

const PhraseCharacter = ({ character }) => {
  const theme = useContext(ThemeContext);

  return (
    <div
      style={{
        display: "inline-block",
        width: "60px",
        textAlign: "center",
        height: "60px",
        fontFamily: "Roboto Mono",
        fontSize: "45px",
        boxShadow:
          character ||
          `10px 10px 20px ${theme.shadowDark}, -10px -10px 20px ${theme.shadowLight}`,
        margin: "10px",
        borderRadius: "10px",
      }}
    >
      {character || " "}
    </div>
  );
};

const Phrase = ({ phrase }) => {
  const theme = useContext(ThemeContext);
  return (
    <div
      style={{
        boxShadow: `5px 5px 10px ${theme.shadowDark}, -5px -5px 10px ${theme.shadowLight}`,
        marginTop: "50px",
        padding: "10px",
      }}
    >
      {phrase.map((character, i) => (
        <PhraseCharacter key={i} character={character} />
      ))}
    </div>
  );
};

export default Phrase;
