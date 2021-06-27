import { Heading } from "../components";
const TurnInstructions = ({ turn }) => (
  <div
    style={{
      fontWeight: "bold",
      fontSize: "25px",
      textAlign: "center",
      marginTop: "30px",
    }}
  >
    {turn.is_self
      ? `It's your turn! Take a guess.`
      : `It's ${turn.name}'s turn. Wait for them to make a guess!`}
  </div>
);

export default TurnInstructions;
