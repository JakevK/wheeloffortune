import { useContext } from "react";
import { ThemeContext } from "../ThemeContext";

// visual representation of a wheel of fortune spinning wheel
// prize values based on given possibleValues
// rotation based on a given position
// this is a bit complex - probably would've been easier to just use an image
const Wheel = ({ position, possibleValues, turnCount, size }) => {
  // styling consistency
  const theme = useContext(ThemeContext);

  const actualSize = size; // total size of wheel + spacing
  size = size * 0.7; // size of only spinning part

  // calculate some dimensions to keep scaling consistent with varying size
  const border = 0;
  const outsideSize = size * 1.05 + border * 2;
  const outsideBorder = size / 20;
  const outsideShadow = size / 10;
  const insideShadow = size / 150;
  const triangleSize = size / 6;
  const centerSize = size / 3.5;
  const centerShadow = centerSize / 8;

  // use given prize values and theme colors
  const values = possibleValues;
  const colors = theme.highlights;

  const segment = 360 / values.length; // degrees in each segment
  // rotation of the wheel in degrees
  const rotation =
    (turnCount + 1) * 360 +
    720 -
    segment * (position + 1) +
    (Math.random() * 0.9 + 0.05) * segment;

  // generate parameters to use with a css conic gradient
  // these give the wheel its desired colorful segmented effect
  const gradientParams = values
    .map((value, i, values) => {
      const color = colors[i % colors.length];
      const percentage = (100 / values.length) * (i + 1);
      return `${color} 0 ${percentage}%`;
    })
    .join(", ");

  // map each prize value to a piece of text
  // rotate and scale each of these to fit to a segment of the wheel
  const text = values.map((value, i) => {
    // rotation of the wheel in degrees
    const rotation = segment * i + segment / 2;
    // scale font to fit in segment
    const fontSize = ((size * Math.PI) / values.length) * 0.35;

    // render each character in a prize label vertically one by one
    const characters = `$${value.toString()}`.split("").map((char, j) => {
      // scale font to be smaller towards the center of the wheel
      const currFontSize = fontSize * (1 - 0.15 * j);

      // render scaled character
      return (
        <div
          key={j}
          style={{
            fontSize: `${currFontSize}px`,
            textAlign: "center",
            width: `${fontSize}px`,
            color: theme.foreground,
          }}
        >
          {char}
        </div>
      );
    });

    // render rotated label
    return (
      <div
        key={i}
        style={{
          transform: `rotate(${rotation}deg)`,
          transformOrigin: "50% 100%",
          fontFamily: "Roboto Mono",
          fontSize: `${fontSize}px`,
          position: "absolute",
          left: size * 0.5 - 0.5 * fontSize + "px",
          height: size * 0.5,
        }}
      >
        {characters}
      </div>
    );
  });

  return (
    // container around the wheel
    <div
      style={{
        width: `${actualSize}px`,
        height: `${actualSize}px`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* outside circle of the wheel - this a the border-like effect */}
      <div
        style={{
          width: `${outsideSize}px`,
          height: `${outsideSize}px`,
          borderRadius: "50%",
          backgroundColor: theme.background,
          boxShadow: `${outsideShadow}px ${outsideShadow}px ${
            outsideShadow * 2
          }px ${theme.shadowDark}, -${outsideShadow}px -${outsideShadow}px ${
            outsideShadow * 2
          }px ${theme.shadowLight},${insideShadow}px ${insideShadow}px ${
            insideShadow * 3
          }px inset ${
            theme.shadowDark
          }, -${insideShadow}px -${insideShadow}px ${
            insideShadow * 3
          }px inset ${theme.shadowLight}`,
          border: `${outsideBorder}px solid ${theme.background}`,
          position: "relative",
        }}
      >
        {/* triangle for pointing to selected segment of wheel - thanks ascii*/}
        <div
          style={{
            color: theme.highlights[4],
            width: `${triangleSize}px`,
            height: `${triangleSize}px`,
            position: "absolute",
            fontSize: `${triangleSize}px`,
            textAlign: "center",
            left: `${(outsideSize - triangleSize) / 2}px`,
            top: `-${triangleSize / 2}px`,
            zIndex: "10",
            textShadow: `${triangleSize / 8}px ${triangleSize / 8}px ${
              triangleSize / 4
            }px ${theme.foreground}`,
          }}
        >
          ▼
        </div>
        {/* the spinning part of the wheel! */}
        <div
          style={{
            background: `conic-gradient(${gradientParams})`,
            display: "block",
            width: `${size}px`,
            height: `${size}px`,
            borderRadius: "50%",
            transition: "transform 5s",
            transitionTimingFunction: "cubic-bezier(0.19, 0.57, 0.26)",
            transform: `rotate(${rotation}deg)`,
            position: "relative",
            border: `${border}px solid ${theme.background}`,
            boxShadow: `2px 2px 5px ${theme.shadowDark}`,
            margin: "0 auto",
            top: `${(outsideSize - (size + 2 * border)) / 2}px`,
          }}
        >
          {/* wheel labels */}
          {text}
        </div>
        {/* central circle - rendered outside to avoid spinning shadows */}
        <div
          style={{
            background: theme.highlights[1],
            width: `${centerSize}px`,
            height: `${centerSize}px`,
            borderRadius: "50%",
            position: "absolute",
            left: `${(outsideSize - centerSize) / 2}px`,
            top: `${(outsideSize - centerSize) / 2}px`,
            boxShadow: `${centerShadow}px ${centerShadow}px ${centerShadow}px inset #149c7a, -${centerShadow}px -${centerShadow}px ${centerShadow}px inset #1ad4a6`,
          }}
        ></div>
      </div>
    </div>
  );
};

export default Wheel;
