import React, { useState, useEffect } from "react";
import { Modal, Form, Button, Icon } from "semantic-ui-react";
import {
  PaymentOptions,
  AlgoTypePayment,
  Payment,
  Statement,
} from "../../../model/statement.model";
import { useFirebase } from "../../../context/firebase.context";

const defaultPayment: Payment = {
  id: "",
  label: "",
  amount: 0,
  type: "other",
  debit: true,
  active: true,
};
type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  paymentEdit: Payment | null;
  statement: Statement;
};

export const ModalCreatePayment = ({
  open,
  paymentEdit,
  statement,
  setOpen,
}: Props) => {
  const [payment, setPayment] = useState<Payment>(
    paymentEdit ? paymentEdit : defaultPayment
  );

  const [loading, setLoading] = useState<boolean>(false);
  const { appendPayment, editPayment, deletePayment } = useFirebase();
  useEffect(() => {}, [statement, payment]);
  const submit = () => {
    setLoading(true);
    if (paymentEdit !== null) {
      editPayment(statement, payment).then(() => {
        setOpen(false);
      });
    } else {
      appendPayment(statement, payment).then(() => {
        setOpen(false);
      });
    }
  };
  const actionDeletePayment = () => {
    setLoading(true);
    deletePayment(statement, payment).then(() => setOpen(false));
  };
  const formIsValid = (): boolean => {
    if (payment.label === "" || payment.amount <= 0 || payment.type === "") {
      return true;
    }
    return false;
  };

  return (
    <Modal
      open={open}
      closeOnEscape={true}
      closeOnDimmerClick={true}
      onClose={() => setOpen(false)}
    >
      <Modal.Header>
        <Icon name="file text"></Icon>Ajout d'une facture
      </Modal.Header>
      <Modal.Content>
        <Modal.Description>
          <Form onSubmit={submit}>
            <Form.Group>
              <Button
                icon
                labelPosition="left"
                positive
                active={payment.debit === false}
                basic={payment.debit === true}
                type="button"
                size="huge"
                onClick={() => setPayment({ ...payment, debit: false })}
              >
                <Icon name="arrow up" />
                Rentrer d'argent
              </Button>
              <Button
                icon
                labelPosition="right"
                negative
                basic={payment.debit === false}
                active={payment.debit === true}
                type="button"
                size="huge"
                onClick={() => setPayment({ ...payment, debit: true })}
              >
                Débit d'argent
                <Icon name="arrow down" />
              </Button>
            </Form.Group>
            <Form.Group widths="equal">
              <Form.Input
                fluid
                label="Intitulé"
                placeholder="Forfait mobile"
                value={payment.label}
                required
                onChange={(_event, data) =>
                  setPayment({
                    ...payment,
                    label: data.value,
                    type: AlgoTypePayment(data.value, payment.type),
                  })
                }
              />
              <Form.Dropdown
                className="button icon"
                placeholder="Selection du type de facturation"
                options={PaymentOptions}
                required
                label="Type de facture"
                value={payment.type}
                defaultValue={payment.type}
                onChange={(_event, data) =>
                  setPayment({ ...payment, type: data.value as string })
                }
                fluid
                selection
                search
              />
            </Form.Group>
            <Form.Group widths="equal">
              <Form.Input
                icon="euro"
                iconPosition="left"
                placeholder="52.03"
                label="Montant"
                type="number"
                step="0.01"
                min="1"
                required
                defaultValue={payment.amount}
                onChange={(_event, data) =>
                  setPayment({ ...payment, amount: Number(data.value) })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        {paymentEdit !== null && (
          <React.Fragment>
            <Button
              onClick={actionDeletePayment}
              negative
              labelPosition="left"
              icon="trash"
              type="button"
              content="Supprimer"
              loading={loading}
            ></Button>
            <Button
              primary
              type="submit"
              labelPosition="right"
              icon="checkmark"
              content="Valider"
              onClick={submit}
              loading={loading}
              disabled={formIsValid()}
            />
          </React.Fragment>
        )}
        {paymentEdit === null && (
          <React.Fragment>
            <Button
              onClick={() => setOpen(false)}
              secondary
              labelPosition="left"
              icon="close"
              type="button"
              content="Annuler"
              loading={loading}
            ></Button>
            <Button
              primary
              type="submit"
              labelPosition="right"
              icon="checkmark"
              content="Valider"
              onClick={submit}
              loading={loading}
              disabled={formIsValid()}
            />
          </React.Fragment>
        )}
      </Modal.Actions>
    </Modal>
  );
};
