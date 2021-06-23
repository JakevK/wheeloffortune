const LobbyPage = ({ send, data }) => (
  <div>
    <div>game: {data.game}</div>
    <div>
      <div>players:</div>
      {Object.keys(data.players).map((player) => (
        <div key={player}>
          {data.players[player].is_self ? "You: " : ""}
          {player}
        </div>
      ))}
    </div>
    {data.is_admin ? (
      <button onClick={() => send("start game", {})}>start game</button>
    ) : (
      <div>waiting for the game to start...</div>
    )}
  </div>
);

export default LobbyPage;
