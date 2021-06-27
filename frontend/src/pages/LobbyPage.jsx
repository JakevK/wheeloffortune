import { useContext } from "react";
import { Heading, Form, Button } from "../components";
import { ThemeContext } from "../ThemeContext";

// the page the user sees when they are waiting for their game to start
const LobbyPage = ({ send, data }) => {
  // styling consistency
  const theme = useContext(ThemeContext);

  // render all the different pieces, with some additional styling
  // explains itself
  return (
    <div
      style={{
        position: "absolute",
        margin: "100px auto",
        left: "50%",
        transform: "TranslateX(-50%)",
      }}
    >
      <Form>
        <Heading>{data.game}</Heading>
        <div>
          <div
            style={{
              fontSize: "20px",
              fontWeight: "bold",
              marginBottom: "20px",
            }}
          >
            {/* have good grammar :) */}
            {data.players.length} player{data.players.length !== 1 && "s"}
          </div>
          {data.players.map((player, i) => (
            <div
              key={i}
              style={{
                marginTop: "5px",
                color: player.is_self ? theme.highlights[0] : theme.foreground,
              }}
            >
              {player.name}
            </div>
          ))}
        </div>
        {/* show start control only if player is admin */}
        {data.is_admin ? (
          <div>
            {data.players.length >= 3 ? (
              <Button height={40} onClick={() => send("start game", {})}>
                start game
              </Button>
            ) : (
              "you need at least 3 players to start the game"
            )}
          </div>
        ) : (
          <div>waiting for the game to start...</div>
        )}
      </Form>
    </div>
  );
};

export default LobbyPage;
