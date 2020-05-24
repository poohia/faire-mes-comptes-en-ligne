import React, { useState, useEffect } from "react";
import { useParams, Redirect } from "react-router";
import { Container, Grid, Button, Table, Checkbox } from "semantic-ui-react";
import { Subscription } from "rxjs";

import { useFirebase } from "../../context/firebase.context";
import { ModalCreatePayment } from "./components";
import { Statement, Payment } from "../../model/statement.model";

export const getTotal = (payments: Payment[]): number => {
  let total: number = 0;
  payments.forEach((payment) =>
    payment.active
      ? payment.debit
        ? (total -= payment.amount)
        : (total += payment.amount)
      : ""
  );
  return total;
};

const StatementPage = () => {
  const { id } = useParams();
  const {
    authenticated,
    loadingUser,
    listenStatement,
    setPaymentActive,
  } = useFirebase();
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [statement, setStatement] = useState<Statement | null>(null);
  const [total, setTotal] = useState<number>(0);
  const [
    subscriptionStatement,
    setSubscriptionStatement,
  ] = useState<Subscription | null>(null);
  useEffect(() => {
    if (subscriptionStatement === null && authenticated)
      setSubscriptionStatement(
        listenStatement(id).subscribe((val) => {
          setStatement(val);
        })
      );
    if (statement && statement.payments)
      setTotal(getTotal(Object.values(statement.payments) as Payment[]));
  }, [statement, authenticated]);

  if (loadingUser || statement === null) {
    return <div>Loading...</div>;
  }
  if (!authenticated) return <Redirect to="/" />;

  return (
    <Container>
      <Grid>
        <Grid.Row>
          <Button secondary onClick={() => setOpenModal(true)}>
            Ouvrir modal
          </Button>
        </Grid.Row>
        <Grid.Row>
          <Table compact celled definition>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell />
                <Table.HeaderCell>Intitulé</Table.HeaderCell>
                <Table.HeaderCell>Montant</Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {statement.payments &&
                Object.values(statement.payments).map((v) => {
                  const payment: Payment = v as Payment;
                  return (
                    <Table.Row>
                      <Table.Cell collapsing>
                        <Checkbox
                          toggle
                          checked={payment.active}
                          onChange={(_event, data) =>
                            setPaymentActive(
                              statement,
                              payment,
                              data.checked || false
                            )
                          }
                        />
                      </Table.Cell>
                      <Table.Cell>{payment.label}</Table.Cell>
                      <Table.Cell>{`${payment.debit ? "-" : "+"} ${
                        payment.amount
                      }`}</Table.Cell>
                    </Table.Row>
                  );
                })}
            </Table.Body>

            <Table.Footer fullWidth>
              <Table.Row>
                <Table.HeaderCell />
                <Table.HeaderCell colSpan="10">
                  Total : {total.toFixed(2)}
                </Table.HeaderCell>
              </Table.Row>
            </Table.Footer>
          </Table>
        </Grid.Row>
      </Grid>
      {openModal && (
        <ModalCreatePayment
          open={openModal}
          setOpen={setOpenModal}
          statement={statement}
        />
      )}
    </Container>
  );
};

export default StatementPage;