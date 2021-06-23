const GuessInput = ({ onGuess, guessed, enabled }) =>
  "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((letter) => {
    const alreadyGuessed = guessed.includes(letter);
    return (
      <button
        key={letter}
        disabled={!enabled || alreadyGuessed}
        style={{ backgroundColor: alreadyGuessed ? "white" : "grey" }}
        onClick={() => onGuess(letter)}
      >
        {letter}
      </button>
    );
  });

export default GuessInput;
