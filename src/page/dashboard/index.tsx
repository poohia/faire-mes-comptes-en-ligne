import React, { useState, useEffect } from "react";
import moment from "moment";
import { Container, Grid, Button, Header, Icon } from "semantic-ui-react";
import { Redirect, Link } from "react-router-dom";
import { Subscription } from "rxjs";

import { useFirebase } from "../../context/firebase.context";
import { Statement } from "../../model/statement.model";
import {
  NewUserComponent,
  StatementList,
  ModalCreateStatement,
  FooterDashboard,
} from "./components";

const DashboardPage = () => {
  const [statements, setStatements] = useState<Statement[] | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [
    subscriptionStatements,
    setSubscriptionStatements,
  ] = useState<Subscription | null>(null);
  const [loadingStatements, setLoadingStatements] = useState<boolean>(true);
  const {
    authenticated,
    loadingUser,
    listenStatements,
    statementOfMonthCreated,
  } = useFirebase();

  useEffect(() => {
    if (subscriptionStatements === null && authenticated) {
      setSubscriptionStatements(
        listenStatements().subscribe((val) => {
          if (loadingStatements) setLoadingStatements(false);

          if (val !== null) {
            setStatements(Object.values(val));
          } else {
            setStatements(val);
          }
        })
      );
    }
  }, [openModal, statements, statementOfMonthCreated, authenticated]);

  if (loadingUser || loadingStatements) return <div>Loading ....</div>;
  if (!authenticated) return <Redirect to="/" />;
  if (statements === null) {
    return <NewUserComponent></NewUserComponent>;
  }
  return (
    <Container>
      <Grid>
        <Grid.Row>
          <Header as="h1" style={{ paddingLeft: "10px" }}>
            <Icon name="file alternate outline" /> Ma liste des relevés de
            comptes
          </Header>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <StatementList statements={statements} />
          </Grid.Column>
        </Grid.Row>
      </Grid>

      {openModal && (
        <ModalCreateStatement
          open={openModal}
          setOpen={setOpenModal}
          statements={statements.filter(
            (statement) => statement.payments !== undefined
          )}
        />
      )}
      <FooterDashboard
        statementOfMonthCreated={statementOfMonthCreated}
        statements={statements}
        openModalCreateStatment={setOpenModal}
      />
    </Container>
  );
};

export default DashboardPage;
