// text ui component which styles children with a large, bold, centered font
const Heading = ({ children }) => (
  <div
    style={{
      fontSize: "30px",
      fontWeight: "bold",
      textAlign: "center",
    }}
  >
    {children}
  </div>
);

export default Heading;
