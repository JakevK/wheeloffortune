const LeaderBoard = ({ players }) => {
  const rankings = players.sort((a, b) => b.score - a.score);
  const listOfRankings = rankings.map((player, i) => (
    <li key={i}>
      {player.name} - {player.score.toLocaleString()}
    </li>
  ));

  return (
    <div>
      <div>current standings:</div>
      <ol>{listOfRankings}</ol>
    </div>
  );
};

export default LeaderBoard;
