import {
  Wheel,
  Phrase,
  PlayerList,
  GuessInput,
  LeaderBoard,
} from "../components";

const GamePage = ({ send, data }) => {
  const makeGuess = (guess) => {
    send("guess", { guess: guess });
  };

  if (data.complete)
    return (
      <div>
        <Phrase phrase={data.phrase} />
        <LeaderBoard players={data.players} />
        {data.is_admin && (
          <button onClick={() => send("next round", {})}>
            start a new round
          </button>
        )}
      </div>
    );

  return (
    <div>
      <Wheel
        position={data.wheel_position}
        possibleValues={data.possible_wheel_values}
        turnCount={data.turn_counter}
      />
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
