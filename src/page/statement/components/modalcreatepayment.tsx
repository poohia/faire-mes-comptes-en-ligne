import React, { useState, useEffect } from "react";
import { Modal, Header, Form, Button, Icon } from "semantic-ui-react";
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
  paymentEdit?: Payment;
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
  const { appendPayment } = useFirebase();
  useEffect(() => {}, [statement, payment]);
  const submit = () => {
    setLoading(true);
    appendPayment(statement, payment).then((val) => {
      setOpen(false);
      // setLoading(false);
    });
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
                // trigger={<React.Fragment />}
                label="Type de facture"
                // value={AlgoTypePayment("test")}
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
                onChange={(_event, data) =>
                  setPayment({ ...payment, amount: Number(data.value) })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
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
        />
      </Modal.Actions>
    </Modal>
  );
};
