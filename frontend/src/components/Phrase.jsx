import { useContext } from "react";
import { ThemeContext } from "../ThemeContext";
import "../index.css";

// divide a phrase up into lines of no more than 14 letters
// only splitting at spaces
const wrapPhrase = (phrase) => {
  // iterate from the right of the first row until a space is reached
  let i = 14;
  for (; phrase[i] !== " " && i >= 0; i--) {}

  if (i < 0) {
    // there were no spaces - use the end of the row
    i = phrase.length;
  }

  if (phrase.length > 14) {
    // our work here is not done - there are more lines
    // use recursion to wrap all lines until done
    return [
      phrase.slice(0, i),
      ...wrapPhrase(phrase.slice(i + 1, phrase.length)),
    ];
  }
  // base case - this is the last line
  return [phrase];
};

// return a visual representation of the wheel of fortune phrase board
// displaying the given phrase
const Phrase = ({ phrase, width }) => {
  let lines = wrapPhrase(phrase);

  // work out the length of the longest line
  const maxLineLength = lines.reduce((max, current) =>
    current.length > max.length ? current : max
  ).length;
  // use this line length to determine where the padding should go
  const paddingStart = Math.floor((14 - maxLineLength) / 2);

  // apply padding to each line
  lines = lines.map((line) => [
    ...Array(paddingStart).fill(" "),
    ...line,
    ...Array(14 - line.length - paddingStart).fill(" "),
  ]);
  // pad with extra lines on each side until all 4 rows have been filled
  lines = [
    ...Array(Math.floor((4 - lines.length) / 2)).fill(Array(14).fill(" ")),
    ...lines,
    ...Array(Math.ceil((4 - lines.length) / 2)).fill(Array(14).fill(" ")),
  ];

  // flatten this row representation to get an array of chars we need to render
  phrase = lines.flat();

  // theming
  const theme = useContext(ThemeContext);

  // calculate measurements to keep ui scaling consistent with varying width
  const charWidth = (width / 14) * 0.9;
  const margin = (width - 14 * charWidth) / 15;
  const height = charWidth * 4 + margin * 5;

  return (
    // outter wrapper
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
      {/*iterate through the phrase to render each character one by one */}
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
