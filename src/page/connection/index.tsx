import React, { useState } from "react";
import {
  Button,
  Form,
  Grid,
  Header,
  Image,
  Message,
  Segment,
  Icon,
} from "semantic-ui-react";
import styled from "styled-components";
import { Redirect } from "react-router";
import { Link } from "react-router-dom";

import { useFirebase } from "../../context/firebase.context";
import { toast } from "react-toastify";

const ConnectionComponentContent = styled(Grid)`
  height: 100vh;
  .form-content {
    max-width: 450px;
  }
  .color-google {
    color: #dd4b39;
  }
  h2.ui.header {
    color: #11c1ab;
  }
  .google-content.ui.message {
    background-color: white;
  }
`;

// export const patternMail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
// export const patternPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/;
// export const patternPassword =
//   "(?=^.{8,}$)((?=.*d)|(?=.*W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$";

const ConnectionComponent = () => {
  const {
    authenticated,
    loadingUser,
    connectWithGoogle,
    connectWithEmailAndPassword,
  } = useFirebase();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  if (authenticated) return <Redirect to="/statements" />;

  const submit = () => {
    setLoading(true);
    connectWithEmailAndPassword(email, password).catch((error) => {
      if (error instanceof Error) {
        toast.warn(
          <p>
            <Icon name="warning circle" /> {error.message}
          </p>
        );
      }
      setLoading(false);
    });
  };
  return (
    <ConnectionComponentContent textAlign="center" verticalAlign="middle">
      <Grid.Column className="form-content">
        <Header as="h2" textAlign="center">
          <Image src="/logotmp.png" /> Connexion à votre compte
        </Header>
        <Form size="large" onSubmit={submit}>
          <Segment stacked>
            <Form.Input
              fluid
              icon="user"
              iconPosition="left"
              placeholder="Adresse email"
              required
              type="email"
              onChange={(_event, data) => setEmail(data.value as string)}
            />
            <Form.Input
              fluid
              icon="lock"
              iconPosition="left"
              placeholder="Mot de passe"
              type={showPassword ? "text" : "password"}
              required
              onChange={(_event, data) => setPassword(data.value as string)}
            />
            <Form.Field style={{ textAlign: "left" }}>
              <Form.Checkbox
                label="Afficher le mot de passe"
                checked={showPassword}
                onChange={(_event, data) =>
                  setShowPassword(data.checked as boolean)
                }
              />
            </Form.Field>

            <Button
              primary
              fluid
              size="large"
              type="submit"
              disabled={loadingUser}
              loading={loading}
            >
              Connexion
            </Button>
          </Segment>
        </Form>
        <Message className="google-content">
          <p>
            Ou connectez vous avec <span className="color-google">Google</span>
          </p>
          <Button
            basic
            disabled={loadingUser || loading}
            onClick={() => connectWithGoogle()}
          >
            <Icon name="google" className="color-google" /> Connexion avec
            Google
          </Button>
        </Message>
        <Message>
          Nouveau utilisateur? <Link to="/inscription">Inscription</Link>
        </Message>
      </Grid.Column>
    </ConnectionComponentContent>
  );
};

export default ConnectionComponent;
