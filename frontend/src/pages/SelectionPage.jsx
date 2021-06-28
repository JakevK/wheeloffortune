import { TextInput, Form, Heading, Button } from "../components";

// page where the user can submit a name to create a new game
// or select from a list of existing games to join one of them
// - self explanatory, with some extra inline styling
const SelectionPage = ({ send, data }) => (
  <div
    style={{
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "center",
      gap: "100px",
      width: "1100px",
      maxWidth: "90vw",
      margin: "100px auto",
    }}
  >
    <Form>
      <Heading>create a game</Heading>
      <TextInput
        placeholder="game name"
        validation={[
          (name) => (name ? false : "please enter a game name"),
          (name) =>
            name.length <= 20
              ? false
              : "the game name can't be longer than 20 characters",
        ]}
        onSubmit={
          /* send the game name to the server to create the game */ (
            gameName
          ) => send("create game", { name: gameName })
        }
      />
    </Form>
    <Form>
      <Heading>join a game</Heading>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "20px",
          textAlign: "center",
          width: "90%",
          margin: "0 auto",
        }}
      >
        {/* iterate though games and display a clickable summary */}
        {data.games.map((game) => (
          <Button
            height={35}
            key={game.name}
            onClick={
              /* send the game name to the server to join the game */ () =>
                send("join game", { name: game.name })
            }
          >
            <span style={{ fontWeight: "bold" }}>{game.name}</span> -{" "}
            {/* gotta have that good grammar */}
            {game.size} player{game.size !== 1 && "s"}
            {game.begun && <div>in progress</div>}
          </Button>
        ))}
      </div>
    </Form>
  </div>
);

export default SelectionPage;
