import { TextInput } from "../components";

const RegistrationPage = ({ send }) => (
  <div>
    <p>register</p>
    <TextInput onSubmit={(name) => send("register", { name: name })} />
  </div>
);

export default RegistrationPage;
