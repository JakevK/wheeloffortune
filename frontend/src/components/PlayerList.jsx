const PlayerList = ({ players, turn }) =>
  players.map((player, i) => (
    <div key={i}>
      <div style={i === turn ? { color: "blue" } : {}}>{player.name}</div>
      <div>score: {player.score}</div>
    </div>
  ));

export default PlayerList;
