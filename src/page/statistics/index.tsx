import React, { useState, useEffect } from "react";
import moment from "moment";
import { Container, Grid, Dropdown } from "semantic-ui-react";
import { Redirect } from "react-router-dom";
import { Subscription } from "rxjs";

import { useFirebase } from "../../context/firebase.context";
import { Statement, PaymentOptions } from "../../model/statement.model";
import { ChartMonth, ChartMonthType, ChartCompareMonths } from "./components";

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
    <Container>
      <Grid>
        <Grid.Row>
          <Dropdown
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
          />
        </Grid.Row>
        <Grid.Row>
          {statementSelectedObject && (
            <ChartMonth statement={statementSelectedObject} />
          )}
        </Grid.Row>
        <Grid.Row>
          <Dropdown
            className="button icon"
            placeholder="Selection du type de facturation"
            options={PaymentOptions}
            label="Type de facture"
            onChange={(_event, data) => setTypeSelected(data.value as string)}
            defaultValue={typeSelected}
            fluid
            selection
            search
          />
        </Grid.Row>
        <Grid.Row>
          {statementSelectedObject && (
            <ChartMonthType
              statement={statementSelectedObject}
              type={typeSelected}
            />
          )}
        </Grid.Row>
        {currStatement && lastStatement && (
          <React.Fragment>
            <Grid.Row>
              Comparaison du relevé {currStatement.label} avec le relevé{" "}
              {lastStatement.label}
            </Grid.Row>
            <Grid.Row>
              <ChartCompareMonths
                currStatement={currStatement}
                lastStatement={lastStatement}
              />
            </Grid.Row>
          </React.Fragment>
        )}
      </Grid>
    </Container>
  );
};

export default StatisticsPage;
