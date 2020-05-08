import React, { useState, useEffect } from "react";
import { Header, Button, Modal, Image, Form } from "semantic-ui-react";
import moment from "moment";
import { Statement } from "../../../model/statement.model";
import { useFirebase } from "../../../context/firebase.context";

export const ModalCreateStatement = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) => {
  let now = moment();

  const { createStatement } = useFirebase();

  const [value, setValue] = useState<string>(
    `Mon relevé de compte du moi de ${now
      .format("MMM")[0]
      .toUpperCase()}${now.format("MMM").substring(1)}`
  );

  const [loading, setLoading] = useState(false);

  useEffect(() => {}, [loading]);

  const preapreCreateStatement = () => {
    setLoading(true);
    const createDate = now.toDate().toString();
    const statement: Statement = {
      id: moment(createDate).format("DDMMYYYY"),
      label: value,
      createDate,
    };
    createStatement(statement).then((val) => console.log(val));
  };

  return (
    <Modal open={open} closeOnEscape={true} closeOnDimmerClick={true}>
      <Modal.Header>Nouveau relevé de compte</Modal.Header>
      <Modal.Content image>
        <Image
          wrapped
          size="medium"
          src="https://firebasestorage.googleapis.com/v0/b/faire-mes-comptes-en-ligne.appspot.com/o/safe-piggy-bank-1237063-1599x1070.jpg?alt=media&token=765a92eb-fafe-4fad-82a4-e0a724a0ca56"
        />
        <Modal.Description>
          <Header>Default Profile Image</Header>
          <p>
            We've found the following gravatar image associated with your e-mail
            address.
          </p>
          <Form onSubmit={preapreCreateStatement}>
            <Form.Field>
              <Form.Input
                label="Intitulé"
                placeholder={value}
                value={value}
                onChange={(_event, data) => setValue(data.value)}
              />
            </Form.Field>{" "}
          </Form>
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button
          secondary
          icon="angle left"
          labelPosition="left"
          content="Annuler"
          onClick={() => setOpen(false)}
          loading={loading}
        />
        <Button
          primary
          icon="angle right"
          labelPosition="right"
          content="Créer"
          disabled={value === ""}
          loading={loading}
          onClick={preapreCreateStatement}
        />
      </Modal.Actions>
    </Modal>
  );
};
