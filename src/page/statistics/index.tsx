import React, { useState, useEffect } from "react";
import { Container, Grid, Dropdown, Header } from "semantic-ui-react";
import { Redirect, Link } from "react-router-dom";
import { Subscription } from "rxjs";
import styled from "styled-components";
import moment from "moment";

import { useFirebase } from "../../context/firebase.context";
import {
  Statement,
  PaymentOptions,
  getLabelOfType,
} from "../../model/statement.model";
import { ChartMonth, ChartMonthType, ChartCompareMonths } from "./components";
import { LoadingComponent } from "../../component";

const ChartContent = styled.div`
  width: 100%;
  overflow-y: auto;
  background: white;
  padding: 10px;
  margin: 2px;
  border-radius: 8px;
  box-shadow: 0 0 5px 1px lightgrey;
  .ui.dropdown.icon.button > .dropdown.icon {
    padding: 0 !important;
  }
`;

const StatisticsPage = () => {
  const [statements, setStatements] = useState<Statement[] | null>(null);
  const [statementSelected] = useState<string>(moment().format("MMYYYY"));
  const [typeSelected, setTypeSelected] = useState<string>("other");
  const [
    subscriptionStatements,
    setSubscriptionStatements,
  ] = useState<Subscription | null>(null);
  const [loadingStatements, setLoadingStatements] = useState<boolean>(true);
  const { authenticated, loadingUser, listenStatements } = useFirebase();

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
  }, [
    statementSelected,
    statements,
    authenticated,
    loadingStatements,
    subscriptionStatements,
    listenStatements,
  ]);

  if (loadingUser || loadingStatements) return <LoadingComponent />;
  if (!authenticated) return <Redirect to="/" />;
  if (statements === null) {
    return (
      <Container>
        <Grid>
          <Grid.Row>
            <Header as="h1">
              Bonjour,
              <Header.Subheader>
                Vous n'avez encore fait aucun relevé de compte, allez sur
                l'onglet <Link to="/statements">"Mes relévé"</Link> pour créer
                votre premier relevé.
              </Header.Subheader>
            </Header>
          </Grid.Row>
        </Grid>
      </Container>
    );
  }

  const statementSelectedObject = statements.find(
    (statement) => statement.id === statementSelected
  );

  const currStatement = statements.find(
    (statement) => statement.id === moment().format("MMYYYY")
  );

  const lastStatement = statements.find(
    (statement) =>
      statement.id === moment().subtract(1, "months").format("MMYYYY")
  );

  if (statementSelectedObject?.payments === undefined) {
    return (
      <Container>
        <Grid>
          <Grid.Row>
            <Header>
              Bonjour,{" "}
              <Header.Subheader>
                Il n'y a aucun paiement pour le relevé{" "}
                {statementSelectedObject?.label}. Cliquez sur ce{" "}
                <Link
                  to={`statements/statement/${statementSelectedObject?.id}`}
                >
                  lien
                </Link>{" "}
                afin d'ajouter des paiements à se relevé.
              </Header.Subheader>
            </Header>
          </Grid.Row>
        </Grid>
      </Container>
    );
  }

  return (
    <Container fluid>
      <Grid>
        <Grid.Row columns={1}>
          <Grid.Column>
            <ChartContent>
              {/* <Dropdown
                fluid
                selection
                options={statements.map((statement) => ({
                  key: statement.id,
                  text: statement.label,
                  value: statement.id,
                }))}
                defaultValue={statementSelected}
                onChange={(_event, data) =>
                  setStatementSelected(data.value as string)
                }
              /> */}
              <Header as="h1">{statementSelectedObject?.label}</Header>
              {statementSelectedObject && (
                <ChartMonth statement={statementSelectedObject} />
              )}
            </ChartContent>
          </Grid.Column>
        </Grid.Row>
        {currStatement && statementSelectedObject && (
          <Grid.Row>
            <Grid.Column
              computer={lastStatement === undefined ? "16" : "8"}
              tablet={"16"}
            >
              <ChartContent>
                {/* <Dropdown
                  className="button icon"
                  placeholder="Selection du type de facturation"
                  options={PaymentOptions}
                  label="Type de facture"
                  onChange={(_event, data) =>
                    setTypeSelected(data.value as string)
                  }
                  defaultValue={typeSelected}
                  fluid
                  selection
                  search
                /> */}
                <Header as="h1">
                  {statementSelectedObject?.label} par catégorie{" "}
                  {getLabelOfType(typeSelected)}
                </Header>
                <Dropdown
                  className="button icon"
                  placeholder="Selection du type de facturation"
                  options={PaymentOptions}
                  label="Type de facture"
                  onChange={(_event, data) =>
                    setTypeSelected(data.value as string)
                  }
                  defaultValue={typeSelected}
                  selection
                />
                <br />
                <br />
                {statementSelectedObject && (
                  <ChartMonthType
                    statement={statementSelectedObject}
                    type={typeSelected}
                  />
                )}
              </ChartContent>
            </Grid.Column>
            {lastStatement && (
              <Grid.Column computer={"8"} tablet={"16"}>
                <ChartContent>
                  <Header as="h1">
                    Comparaison du relevé du moi de{" "}
                    {moment(currStatement.createDate).format("MMM")} avec le
                    relevé du moi de{" "}
                    {moment(lastStatement.createDate).format("MMM")}
                  </Header>
                  {statementSelectedObject.label}
                  <ChartCompareMonths
                    currStatement={statementSelectedObject}
                    lastStatement={lastStatement}
                  />
                </ChartContent>
              </Grid.Column>
            )}
          </Grid.Row>
        )}
      </Grid>
    </Container>
  );
};

export default StatisticsPage;
