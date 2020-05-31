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
import { toast } from "react-toastify";

import { useFirebase } from "../../context/firebase.context";

const InscriptionComponentContent = styled(Grid)`
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
  .password-info,
  .password-not-same {
    text-align: left;
    color: #34495e;
    font-size: 0.85em;
  }
  .password-not-same {
    color: #ff5e57;
  }
`;

const InscriptionComponent = () => {
  const {
    authenticated,
    loadingUser,
    connectWithGoogle,
    createUserWithEmailAndPassword,
  } = useFirebase();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  if (authenticated) return <Redirect to="/statements" />;

  const submit = () => {
    if (password !== confirmPassword || password === "") return;
    setLoading(true);
    createUserWithEmailAndPassword(email, password)
      .then(() => {
        toast.success(
          <p>
            <Icon name="check" /> Votre compte a été créé. Un mail de
            confirmation est en cours d'envoie.
          </p>
        );
        setLoading(false);
      })
      .catch(() => {
        toast.error(
          <p>
            <Icon name="close" /> Une erreur est survenue veuillez recommencer
          </p>
        );
        setLoading(false);
      });
  };

  return (
    <React.Fragment>
      <InscriptionComponentContent textAlign="center" verticalAlign="middle">
        <Grid.Column className="form-content">
          <Header as="h2" textAlign="center">
            <Image src="/logotmp.png" /> Création de votre compte
          </Header>
          <Form size="large" onSubmit={submit}>
            <Segment stacked>
              <Form.Input
                fluid
                icon="user"
                iconPosition="left"
                placeholder="Adresse email"
                onChange={(_event, data) => setEmail(data.value as string)}
                required
                type="email"
              />
              <Form.Input
                fluid
                icon="lock"
                iconPosition="left"
                placeholder="Mot de passe"
                type="password"
                onChange={(_event, data) => setPassword(data.value as string)}
                required
                pattern="(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$"
              />
              <p className="password-info">
                Minimum de 8 caractères, un caractère miniscule et miniscule
                avec un chiffre.
              </p>
              <Form.Input
                fluid
                icon="lock"
                iconPosition="left"
                placeholder="Confirmation du mot de passe"
                type="password"
                onChange={(_event, data) =>
                  setConfirmPassword(data.value as string)
                }
                required
                pattern="(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$"
              />
              {confirmPassword !== "" && password !== confirmPassword && (
                <p className="password-not-same">
                  Les mots de passe ne sont pas identique.
                </p>
              )}

              <Button
                primary
                fluid
                size="large"
                type="submit"
                disabled={loadingUser}
                loading={loading}
              >
                Inscription
              </Button>
            </Segment>
          </Form>
          <Message className="google-content">
            <p>
              Ou connectez vous avec{" "}
              <span className="color-google">Google</span>
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
            Vous avez déjà un compte? <Link to="/connection">Connexion</Link>
          </Message>
        </Grid.Column>
      </InscriptionComponentContent>
    </React.Fragment>
  );
};

export default InscriptionComponent;
