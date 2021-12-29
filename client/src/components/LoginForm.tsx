import { observer } from "mobx-react-lite";
import { FC, useContext, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { Context } from "../index";

const LoginForm: FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const { store } = useContext(Context);

  return (
    <Form className="mx-2">
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Email address</Form.Label>
        <Form.Control
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter email"
        />
      </Form.Group>
      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
      </Form.Group>
      <Button
        variant="primary"
        type="submit"
        onClick={() => store.login(email, password)}
      >
        Логин
      </Button>
      <Button
        variant="primary"
        type="submit"
        onClick={() => store.registration(email, password)}
      >
        Регистрация
      </Button>
    </Form>
  );
};

export default observer(LoginForm);
