import React, { useState, useEffect } from "react";
import { useParams, Redirect } from "react-router";
import {
  Container,
  Grid,
  Button,
  Checkbox,
  Header,
  Icon,
  Input,
} from "semantic-ui-react";
import { Subscription } from "rxjs";

import { useFirebase } from "../../context/firebase.context";
import { ModalCreatePayment, FooterStatement } from "./components";
import {
  Statement,
  Payment,
  getLabelOfType,
} from "../../model/statement.model";
import { ListContent, LoadingComponent } from "../../component";

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
  const [filterString, setFilterString] = useState<string>("");
  const [editPayment, setEditPayment] = useState<Payment | null>(null);
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
  }, [statement, authenticated, id, subscriptionStatement, listenStatement]);

  if (loadingUser || statement === null) {
    return <LoadingComponent />;
  }
  if (!authenticated) return <Redirect to="/" />;

  const getPayments = () => {
    const v = statement.payments;
    if (v === undefined) {
      return [];
    }
    const payments: Payment[] = Object.values(v);
    if (filterString !== "") {
      return payments.filter((payment: Payment) =>
        payment.label.includes(filterString)
      );
    }
    return payments;
  };

  return (
    <Container>
      <Grid>
        <Grid.Row>
          <Header as="h1">
            <Icon name="file alternate outline" /> {statement.label}
            {statement.payments === undefined && (
              <Header.Subheader>
                Cliquez sur "Ajouter un paiement" en bas à gauche afin d'ajouter
                votre premier renter ou débit d'argent.
              </Header.Subheader>
            )}
          </Header>
        </Grid.Row>
        {statement.payments !== undefined && (
          <Grid.Row>
            <Grid.Column width="16">
              <Input
                icon="search"
                placeholder="Rechercher par intitulé"
                fluid
                onChange={(_event, data) =>
                  setFilterString(data.value as string)
                }
              />
            </Grid.Column>
          </Grid.Row>
        )}
        <Grid.Row>
          <Grid.Column>
            <ListContent>
              {statement.payments &&
                getPayments().map((v) => {
                  const payment: Payment = v as Payment;
                  return (
                    <div
                      className="hizmet-buton"
                      onClick={() => {
                        setEditPayment(payment);
                        setOpenModal(true);
                      }}
                    >
                      <Checkbox
                        checked={payment.active}
                        onChange={(event, data) => {
                          event.stopPropagation();
                          setPaymentActive(
                            statement,
                            payment,
                            data.checked || false
                          );
                        }}
                        style={{
                          position: "relative",
                          top: "5px",
                        }}
                      />
                      &nbsp;&nbsp;&nbsp;
                      <span className="hizmet-title">{payment.label}</span>
                      <span className="hizmet-small">
                        {getLabelOfType(payment.type)}
                      </span>
                      <Button
                        className={
                          payment.debit ? "hizmet-fiyat-delete" : "hizmet-fiyat"
                        }
                      >
                        {`${payment.debit ? "-" : "+"} ${payment.amount} euros`}
                      </Button>
                    </div>
                  );
                })}
            </ListContent>
          </Grid.Column>
        </Grid.Row>
      </Grid>
      {openModal && (
        <ModalCreatePayment
          open={true}
          setOpen={() => {
            setEditPayment(null);
            setOpenModal(false);
          }}
          statement={statement}
          paymentEdit={editPayment}
        />
      )}
      <FooterStatement
        openModalAddPaiement={setOpenModal}
        total={total.toFixed(2)}
      />
    </Container>
  );
};

export default StatementPage;
