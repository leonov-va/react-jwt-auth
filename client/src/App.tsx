import "bootstrap/dist/css/bootstrap.min.css";
import { observer } from "mobx-react-lite";
import { FC, useContext, useEffect, useState } from "react";
import { Button, ListGroup, Spinner } from "react-bootstrap";
import { Context } from ".";
import LoginForm from "./components/LoginForm";
import { IUser } from "./models/User";
import UserService from "./services/UserService";

const App: FC = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const { store } = useContext(Context);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      store.checkAuth();
    }
  }, []);

  async function getUsers() {
    try {
      const response = await UserService.fetchUsers();
      setUsers(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  if (store.isLoading) {
    return (
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Загрузка...</span>
      </Spinner>
    );
  }

  if (!store.isAuth) {
    return (
      <>
        <LoginForm />
        <hr />
        <Button variant="secondary" className="mx-2" onClick={getUsers}>
          Получить пользователей
        </Button>
      </>
    );
  }

  return (
    <>
      <h1>
        {store.isAuth
          ? `Пользователь авторизован ${store.user.email}`
          : "АВТОРИЗУЙТЕСЬ"}
      </h1>
      <h2>
        {store.user.isActivated
          ? "Аккаунт подтвержден по почте"
          : "ПОДТВЕРДИТЕ АККАУНТ!!!!"}
      </h2>
      <Button variant="primary" onClick={() => store.logout()}>
        Выйти
      </Button>
      <Button variant="secondary" className="mx-2" onClick={getUsers}>
        Получить пользователей
      </Button>
      <ListGroup>
        {users.map((user) => (
          <ListGroup.Item key={user.email}>{user.email}</ListGroup.Item>
        ))}
      </ListGroup>
    </>
  );
};

export default observer(App);
