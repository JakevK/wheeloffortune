import { createContext } from "react";

// theme rules used for styling throughout the app
export const theme = {
  background: "#e0e0e0",
  shadowLight: "#ffffff",
  shadowDark: "#bebebe",
  foreground: "#002233",
  highlights: [
    "#4059ad",
    "#17b890",
    "#42cafd",
    "#cfbcdf",
    "#d44d5c",
    "#f6efa6",
    "#fc7a57",
    "#89608e",
  ],
};

// export the theme as a context
export const ThemeContext = createContext();
