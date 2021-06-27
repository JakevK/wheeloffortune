import { Button, TextInput } from "../components";
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
        <TextInput
          placeholder="guess the whole phrase"
          onSubmit={(phrase) => onGuess(phrase)}
        />
      </div>
    </div>
  );
};
export default GuessInput;
