import React, { useState, useEffect } from "react";
import { useParams, Redirect } from "react-router";
import {
  Container,
  Grid,
  Button,
  Checkbox,
  Header,
  Icon,
} from "semantic-ui-react";
import { Subscription } from "rxjs";

import { useFirebase } from "../../context/firebase.context";
import { ModalCreatePayment, FooterStatement } from "./components";
import {
  Statement,
  Payment,
  getLabelOfType,
} from "../../model/statement.model";
import { ListContent } from "../../component";

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
        <Grid.Row>
          <Grid.Column>
            <ListContent>
              {statement.payments &&
                Object.values(statement.payments).map((v) => {
                  const payment: Payment = v as Payment;
                  return (
                    <div className="hizmet-buton">
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
      <FooterStatement
        openModalAddPaiement={setOpenModal}
        total={total.toFixed(2)}
      />
      {openModal && (
        <ModalCreatePayment
          open={openModal}
          setOpen={setOpenModal}
          statement={statement}
        />
      )}
    </Container>
  );

  // return (
  //   <Container>
  //     <Grid>
  //       <Grid.Row>
  //         <Button secondary onClick={() => setOpenModal(true)}>
  //           Ouvrir modal
  //         </Button>
  //       </Grid.Row>
  //       <Grid.Row>
  //         <Table compact celled definition>
  //           <Table.Header>
  //             <Table.Row>
  //               <Table.HeaderCell />
  //               <Table.HeaderCell>Intitulé</Table.HeaderCell>
  //               <Table.HeaderCell>Montant</Table.HeaderCell>
  //             </Table.Row>
  //           </Table.Header>

  //           <Table.Body>
  //             {statement.payments &&
  //               Object.values(statement.payments).map((v) => {
  //                 const payment: Payment = v as Payment;
  //                 return (
  //                   <Table.Row>
  //                     <Table.Cell collapsing>
  //                       <Checkbox
  //                         toggle
  //                         checked={payment.active}
  //                         onChange={(_event, data) =>
  //                           setPaymentActive(
  //                             statement,
  //                             payment,
  //                             data.checked || false
  //                           )
  //                         }
  //                       />
  //                     </Table.Cell>
  //                     <Table.Cell>{payment.label}</Table.Cell>
  //                     <Table.Cell>{`${payment.debit ? "-" : "+"} ${
  //                       payment.amount
  //                     }`}</Table.Cell>
  //                   </Table.Row>
  //                 );
  //               })}
  //           </Table.Body>

  //           <Table.Footer fullWidth>
  //             <Table.Row>
  //               <Table.HeaderCell />
  //               <Table.HeaderCell colSpan="10">
  //                 Total : {total.toFixed(2)}
  //               </Table.HeaderCell>
  //             </Table.Row>
  //           </Table.Footer>
  //         </Table>
  //       </Grid.Row>
  //     </Grid>
  //     {openModal && (
  //       <ModalCreatePayment
  //         open={openModal}
  //         setOpen={setOpenModal}
  //         statement={statement}
  //       />
  //     )}
  //   </Container>
  // );
};

export default StatementPage;
