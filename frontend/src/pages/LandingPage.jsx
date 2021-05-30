import React from "react";
import { Link } from "react-router-dom";

const LandingPage = () => (
  <div>
    <div>Wheel of Fortune</div>
    <Link to="/join">Join a game</Link>
    <Link to="/create">create a new game</Link>
  </div>
);

export default LandingPage;
