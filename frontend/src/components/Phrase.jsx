import { useContext } from "react";
import { ThemeContext } from "../ThemeContext";
import "../index.css";

const wrapPhrase = (phrase) => {
  let i = 14;
  for (; phrase[i] !== " " && i >= 0; i--) {}
  if (i < 0) {
    i = phrase.length;
  }

  if (phrase.length > 14) {
    return [
      phrase.slice(0, i),
      ...wrapPhrase(phrase.slice(i + 1, phrase.length)),
    ];
  }
  return [phrase];
};

const Phrase = ({ phrase, width }) => {
  let lines = wrapPhrase(phrase);
  const maxLineLength = lines.reduce((max, current) =>
    current.length > max.length ? current : max
  ).length;
  const paddingStart = Math.floor((14 - maxLineLength) / 2);
  lines = lines.map((line) => [
    ...Array(paddingStart).fill(" "),
    ...line,
    ...Array(14 - line.length - paddingStart).fill(" "),
  ]);
  lines = [
    ...Array(Math.floor((4 - lines.length) / 2)).fill(Array(14).fill(" ")),
    ...lines,
    ...Array(Math.ceil((4 - lines.length) / 2)).fill(Array(14).fill(" ")),
  ];
  phrase = lines.flat();

  const theme = useContext(ThemeContext);
  const charWidth = (width / 14) * 0.9;
  const margin = (width - 14 * charWidth) / 15;
  const height = charWidth * 4 + margin * 5;
  return (
    <div
      style={{
        backgroundColor: theme.highlights[1],
        boxShadow: `${margin}px ${margin}px ${margin * 2}px ${
          theme.shadowDark
        }, -${margin}px -${margin}px ${margin * 2}px ${theme.shadowLight}`,
        width: `${width}px`,
        height: `${height}px`,
        display: "flex",
        flexWrap: "wrap",
        paddingBottom: `${margin}px`,
        borderRadius: `${margin}px`,
      }}
    >
      {phrase.map((character, i) => {
        const isLetter = character !== " ";
        return (
          <div
            key={i}
            style={{
              width: `${charWidth}px`,
              textAlign: "center",
              height: `${charWidth}px`,
              fontFamily: "Roboto Mono",
              fontSize: `${charWidth / 1.5}px`,
              margin: `${margin}px 0 0 ${margin}px`,
              boxShadow: `${margin / 2}px ${margin / 2}px ${margin}px inset ${
                isLetter ? theme.shadowDark : "#149c7a"
              }, -${margin / 2}px -${margin / 2}px ${margin}px inset ${
                isLetter ? theme.shadowLight : "#1ad4a6"
              }`,
              backgroundColor: isLetter
                ? theme.background
                : theme.highlights[1],
              borderRadius: `${margin}px`,
            }}
          >
            {character ? (
              <div className="fade-in-animation">{character}</div>
            ) : (
              " "
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Phrase;
