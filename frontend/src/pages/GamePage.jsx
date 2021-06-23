import { Wheel, Phrase, PlayerList, GuessInput } from "../components";

const GamePage = ({ send, data }) => {
  const makeGuess = (guess) => {
    send("guess", { guess: guess });
  };

  return (
    <div>
      <Wheel value={data.wheel_value} />
      <Phrase phrase={data.phrase} />
      <PlayerList players={data.players} turn={data.turn} />
      <GuessInput
        enabled={data.is_own_turn}
        guessed={data.guessed}
        onGuess={(guess) => makeGuess(guess)}
      />
    </div>
  );
};

export default GamePage;
