import React, { useState, useEffect } from "react";
import { useFirebase } from "../../context/firebase.context";
import { Redirect } from "react-router-dom";
import { Container, Grid, Button } from "semantic-ui-react";
import { Statement } from "../../model/statement.model";
import { NewUserComponent } from "./components";
import { arrayEquals } from "../../App";
import { ModalCreateStatement } from "./components/modalcreatestatement.component";
import { StatementList } from "./components/statementlist.component";

const Dashboard = () => {
  const [statements, setStatements] = useState<Statement[] | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const { authenticated, listenStatement } = useFirebase();

  useEffect(() => {
    console.log("i'm here");
    listenStatement().subscribe((val) => {
      if (val !== null) {
        const currStatements: Statement[] = [];
        for (let key in val) {
          currStatements.push(val[key]);
        }
        if (!statements || !arrayEquals(currStatements, statements))
          setStatements(currStatements);
      } else {
        setStatements(val);
      }
    });
  }, [openModal, statements]);
  console.log(statements);
  if (!authenticated) return <Redirect to="/" />;
  if (statements === null) {
    return <NewUserComponent></NewUserComponent>;
  }
  return (
    <Container>
      <Grid.Row>
        <Grid.Column>
          <Button secondary onClick={() => setOpenModal(true)}>
            Faire mon relever de compte du moi
          </Button>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column>
          <StatementList statements={statements} />
        </Grid.Column>
      </Grid.Row>
      <ModalCreateStatement open={openModal} setOpen={setOpenModal} />
    </Container>
  );
};

export default Dashboard;
