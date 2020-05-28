import React, { useState, useEffect } from "react";
import { Header, Button, Modal, Image, Form, Icon } from "semantic-ui-react";
import { useHistory } from "react-router";

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
  const now = moment();

  const { createStatement, statementOfMonthCreated } = useFirebase();
  const { push } = useHistory();

  const [value, setValue] = useState<string>(
    `Mon relevé de compte du moi de ${now
      .format("MMM")[0]
      .toUpperCase()}${now.format("MMM").substring(1)}`
  );

  const [loading, setLoading] = useState(false);

  useEffect(() => {}, [loading, statementOfMonthCreated]);
  const preapreCreateStatement = () => {
    setLoading(true);
    const createDate = now.toDate().toString();
    const statement: Statement = {
      id: moment(createDate).format("MMYYYY"),
      label: value,
      createDate,
    };
    createStatement(statement).then((val) =>
      push(`dashboard/statement/${statement.id}`)
    );
  };
  return (
    <Modal
      open={open}
      closeOnEscape={true}
      closeOnDimmerClick={true}
      onClose={() => setOpen(false)}
    >
      <Modal.Header>
        <Icon name="file alternate outline" /> Nouveau relevé de compte
      </Modal.Header>
      <Modal.Content image>
        <Image
          wrapped
          size="medium"
          rounded
          src="https://firebasestorage.googleapis.com/v0/b/faire-mes-comptes-en-ligne.appspot.com/o/safe-piggy-bank-1237063-1599x1070.jpg?alt=media&token=765a92eb-fafe-4fad-82a4-e0a724a0ca56"
        />
        <Modal.Description>
          <p>
            Afin de créer votre rélever de compte du moins, il est necessaire de
            lui donner un intitulé puis cliquer sur "Créer"
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
          disabled={value === "" || statementOfMonthCreated === true}
          loading={loading}
          onClick={preapreCreateStatement}
        />
      </Modal.Actions>
    </Modal>
  );
};
