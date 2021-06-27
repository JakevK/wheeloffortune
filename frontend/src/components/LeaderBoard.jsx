import { Form, Heading } from "../components";
const LeaderBoard = ({ players }) => {
  const rankings = players.sort((a, b) => b.score - a.score);
  const listOfRankings = rankings.map((player, i) => (
    <div key={i}>
      {i + 1}. <span style={{ fontWeight: "bold" }}>{player.name}</span> -{" $"}
      {player.score.toLocaleString()}
    </div>
  ));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
      <Heading>current standings</Heading>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {listOfRankings}
      </div>
    </div>
  );
};

export default LeaderBoard;
