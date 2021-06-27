import {
  Wheel,
  Phrase,
  PlayerList,
  GuessInput,
  LeaderBoard,
  Button,
  TurnInstructions,
  Card,
  Form,
} from "../components";

const GamePage = ({ send, data }) => {
  const makeGuess = (guess) => {
    send("guess", { guess: guess });
  };

  if (data.complete)
    return (
      <div
        style={{
          marginTop: "40px",
          display: "flex",
          flexDirection: "column",
          gap: "40px",
          alignItems: "center",
        }}
      >
        <Phrase phrase={data.phrase} width={1000} />
        <Form>
          <LeaderBoard players={data.players} />
          {data.is_admin ? (
            <div>
              <Button height={40} onClick={() => send("next round", {})}>
                start a new round
              </Button>
            </div>
          ) : (
            <div>waiting for {data.admin} to start a new round</div>
          )}
        </Form>
      </div>
    );

  const wheelSize = 400;
  const phraseSize = 800;
  const spacing = 50;

  return (
    <div>
      {" "}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexWrap: "wrap",
          gap: `${spacing}px`,
          width: `${wheelSize + spacing + phraseSize}px`,
          margin: "0 auto",
        }}
      >
        <Wheel
          position={data.wheel_position}
          possibleValues={data.possible_wheel_values}
          turnCount={data.turn_counter}
          size={wheelSize}
        />
        <Phrase phrase={data.phrase} width={800} />
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: `${spacing}px`,
          gap: `${spacing}px`,
          alignItems: "stretch",
        }}
      >
        <PlayerList players={data.players} turn={data.turn} />
        <Card>
          <TurnInstructions turn={data.players[data.turn]} />
          <GuessInput
            enabled={data.is_own_turn}
            guessed={data.guessed}
            onGuess={(guess) => makeGuess(guess)}
          />
        </Card>
      </div>
    </div>
  );
};

export default GamePage;
