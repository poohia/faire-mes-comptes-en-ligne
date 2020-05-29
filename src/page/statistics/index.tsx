import React, { useState, useEffect } from "react";
import moment from "moment";
import { Container, Grid, Dropdown, Header } from "semantic-ui-react";
import { Redirect } from "react-router-dom";
import { Subscription } from "rxjs";
import styled from "styled-components";

import { useFirebase } from "../../context/firebase.context";
import {
  Statement,
  PaymentOptions,
  getLabelOfType,
} from "../../model/statement.model";
import { ChartMonth, ChartMonthType, ChartCompareMonths } from "./components";

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
  const [statementSelected, setStatementSelected] = useState<string>(
    moment().format("MMYYYY")
  );
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
  }, [statementSelected, statements, authenticated]);

  if (loadingUser || loadingStatements) return <div>Loading ....</div>;
  if (!authenticated) return <Redirect to="/" />;
  if (statements === null) {
    return <div>empty</div>;
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
              <Header as="h1">{lastStatement?.label}</Header>
              {statementSelectedObject && (
                <ChartMonth statement={statementSelectedObject} />
              )}
            </ChartContent>
          </Grid.Column>
        </Grid.Row>
        {currStatement && lastStatement && (
          <Grid.Row>
            <Grid.Column computer={"8"} tablet={"16"}>
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
                  {lastStatement?.label} par catégorie{" "}
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
            <Grid.Column computer={"8"} tablet={"16"}>
              <ChartContent>
                <Header as="h1">
                  Comparaison du relevé {currStatement.label} avec le relevé{" "}
                </Header>
                {lastStatement.label}
                <ChartCompareMonths
                  currStatement={currStatement}
                  lastStatement={lastStatement}
                />
              </ChartContent>
            </Grid.Column>
          </Grid.Row>
        )}
      </Grid>
    </Container>
  );
};

export default StatisticsPage;
