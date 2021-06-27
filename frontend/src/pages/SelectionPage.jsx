import { TextInput, Form, Heading, Button } from "../components";

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
        onSubmit={(gameName) => send("create game", { name: gameName })}
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
        {data.games.map((game) => (
          <Button
            height={35}
            key={game.name}
            onClick={() => send("join game", { name: game.name })}
          >
            <span style={{ fontWeight: "bold" }}>{game.name}</span> -{" "}
            {game.size} player{game.size !== 1 && "s"}
            {game.begun && <div>in progress</div>}
          </Button>
        ))}
      </div>
    </Form>
  </div>
);

export default SelectionPage;
