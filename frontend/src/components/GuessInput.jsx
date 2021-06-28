import { Button, TextInput } from "../components";

// interface for taking an input of either a single letter using an array of
// buttons, or a whole phrase using a text input
// - runs the onGuess parameter function on the input
const GuessInput = ({ onGuess, guessed, enabled }) => {
  return (
    <div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          width: "700px",
          alignItems: "center",
          justifyContent: "center",
          margin: "30px",
          gap: "10px",
        }}
      >
        {/* single letter inputs:
            map each letter of the alphabet to a button */}
        {"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((letter) => {
          const alreadyGuessed = guessed.includes(letter);
          return (
            <Button
              key={letter}
              disabled={!enabled || alreadyGuessed}
              depressed={alreadyGuessed}
              onClick={() => onGuess(letter)}
            >
              {letter}
            </Button>
          );
        })}
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "30px",
        }}
      >
        {/* input for whole phrase */}
        <TextInput
          validation={[
            (guess) =>
              guess ? false : "actually enter something if you want to guess",
            (guess) =>
              guess.length <= 56
                ? false
                : "that guess was too long - try something shorter",
          ]}
          placeholder="guess the whole phrase"
          onSubmit={(phrase) => onGuess(phrase)}
        />
      </div>
    </div>
  );
};

export default GuessInput;
