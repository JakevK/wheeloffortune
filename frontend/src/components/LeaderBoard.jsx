import { Form, Heading } from "../components";

// displays an ordered list of players based on their score
const LeaderBoard = ({ players }) => {
  // sort players based on their score
  const rankings = players.sort((a, b) => b.score - a.score);

  // map each player to a nicely formatted representation
  const listOfRankings = rankings.map((player, i) => (
    <div key={i}>
      {i + 1}. <span style={{ fontWeight: "bold" }}>{player.name}</span> -{" $"}
      {player.score.toLocaleString()}
    </div>
  ));

  // return ordered list of players with some extra styling
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
