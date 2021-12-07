import { Heading } from "../components";

const LoadingPage = () => (
  <div style={{ textAlign: "center", margin: "100px" }}>
    <Heading>connecting to the server...</Heading>
    <p style={{ margin: "30px" }}>
      this website runs on free hosting, so it may take a minute to start up
    </p>
  </div>
);

export default LoadingPage;
