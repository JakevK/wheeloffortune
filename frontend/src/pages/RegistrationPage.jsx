import { TextInput, Heading, Form } from "../components";

// page for entering a user name and registering to be able to play
// renders some self explanatory components with some extra inline styling
const RegistrationPage = ({ send }) => (
  <div
    style={{
      position: "absolute",
      margin: "100px auto",
      left: "50%",
      transform: " TranslateX(-50%)",
    }}
  >
    <Form>
      <Heading>register</Heading>
      <TextInput
        validation={[
          (name) => (name ? false : "please enter a name"),
          (name) =>
            name.length <= 20
              ? false
              : "your name must not be longer than 20 characters",
        ]}
        placeholder="your name"
        onSubmit={
          /* communicate with the server to register user */ (name) =>
            send("register", { name: name })
        }
      />
    </Form>
  </div>
);

export default RegistrationPage;
