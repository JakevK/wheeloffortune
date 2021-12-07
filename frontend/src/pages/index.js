// gather together all page components
import RegistrationPage from "./RegistrationPage";
import SelectionPage from "./SelectionPage";
import LobbyPage from "./LobbyPage";
import ErrorPage from "./ErrorPage";
import GamePage from "./GamePage";
import LoadingPage from "./LoadingPage";

// construct hash map of page components for O(1) accessibility lol
const pages = {
  registration: RegistrationPage,
  selection: SelectionPage,
  lobby: LobbyPage,
  error: ErrorPage,
  game: GamePage,
  loading: LoadingPage,
};

// export as this object for ease of use elsewhere
export default pages;
