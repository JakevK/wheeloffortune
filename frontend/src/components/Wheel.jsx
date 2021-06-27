import { useContext } from "react";
import { ThemeContext } from "../ThemeContext";

const Wheel = ({ position, possibleValues, turnCount, size }) => {
  const theme = useContext(ThemeContext);

  const actualSize = size;
  size = size * 0.7;
  const border = 0; //size / 100;
  const outsideSize = size * 1.05 + border * 2;
  const outsideBorder = size / 20;
  const outsideShadow = size / 10;
  const insideShadow = size / 150;
  const triangleSize = size / 6;
  const centerSize = size / 3.5;
  const centerShadow = centerSize / 8;

  const values = possibleValues;
  const colors = theme.highlights;
  const segment = 360 / values.length;
  const rotation =
    (turnCount + 1) * 360 +
    720 -
    segment * (position + 1) +
    (Math.random() * 0.9 + 0.05) * segment;

  const gradientParams = values
    .map((value, i, values) => {
      const color = colors[i % colors.length];
      const percentage = (100 / values.length) * (i + 1);
      return `${color} 0 ${percentage}%`;
    })
    .join(", ");

  const text = values.map((value, i) => {
    const rotation = (360 / values.length) * i + 360 / values.length / 2;
    const fontSize = ((size * Math.PI) / values.length) * 0.35;

    const characters = `$${value.toString()}`.split("").map((char, j) => {
      const currFontSize = fontSize * (1 - 0.15 * j);
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
    <div
      style={{
        width: `${actualSize}px`,
        height: `${actualSize}px`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
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
          {text}
        </div>
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
