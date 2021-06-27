import { TextInput, Heading, Form } from "../components";

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
        placeholder="your name"
        onSubmit={(name) => send("register", { name: name })}
      />
    </Form>
  </div>
);

export default RegistrationPage;
