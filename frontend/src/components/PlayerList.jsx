import { useContext } from "react";
import { ThemeContext } from "../ThemeContext";
import { Heading, Card } from "../components";

// returns a nice looking graphical representation of a given list of players
const PlayerList = ({ players, turn, width = 300 }) => {
  // use app theme
  const theme = useContext(ThemeContext);

  return (
    <Card
      style={{
        width: `${width}px`,
        display: "flex",
        gap: "30px",
        flexDirection: "column",
        paddingTop: "30px",
      }}
    >
      <Heading>players</Heading>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginBottom: "40px",
          gap: "10px",
        }}
      >
        {/* iterate through players and return relevant information for each */}
        {players.map((player, i) => (
          <div
            key={i}
            style={player.is_self ? { color: theme.highlights[0] } : {}}
          >
            {i === turn && <span style={{}}>▸</span>}
            <span style={{ fontWeight: "bold" }}> {player.name}</span> - $
            {player.score.toLocaleString()}
          </div>
        ))}
      </div>
    </Card>
  );
};

export default PlayerList;
