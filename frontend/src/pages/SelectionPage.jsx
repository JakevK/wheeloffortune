import { TextInput } from "../components";

const SelectionPage = ({ send, data }) => (
  <div>
    <p>create a new game:</p>
    <TextInput
      onSubmit={(gameName) => send("create game", { name: gameName })}
    />
    <p>or join an existing game:</p>
    {data.games.map((game) => (
      <button
        style={{ cursor: "pointer", border: "1px solid grey" }}
        key={game.name}
        onClick={() => send("join game", { name: game.name })}
      >
        <div>{game.name}</div>
        <div>
          {game.size} player{game.size !== 1 && "s"}
        </div>
        {game.begun && <div>in progress</div>}
      </button>
    ))}
  </div>
);

export default SelectionPage;
