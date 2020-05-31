import React, { useState, useEffect } from "react";
import { Button, Modal, Image, Form, Icon } from "semantic-ui-react";
import { useHistory } from "react-router";

import moment from "moment";
import { Statement } from "../../../model/statement.model";
import { useFirebase } from "../../../context/firebase.context";

export const ModalCreateStatement = ({
  open,
  setOpen,
  statements,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  statements: Statement[] | null;
}) => {
  const now = moment();

  const { createStatement, statementOfMonthCreated } = useFirebase();
  const { push } = useHistory();

  const [value, setValue] = useState<string>(
    `Mon relevé de compte du moi de ${now
      .format("MMM")[0]
      .toUpperCase()}${now.format("MMM").substring(1)}`
  );
  const [statementDuplicatedId, setStatementDuplicatedId] = useState<
    string | null
  >(null);
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
    if (statements && statementDuplicatedId !== null) {
      const statementFind = statements.find(
        (statement) => statement.id === statementDuplicatedId
      );
      if (statementFind) {
        statement.payments = statementFind.payments;
      }
    }
    createStatement(statement).then((val) =>
      push(`statements/statement/${statement.id}`)
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
          src="https://firebasestorage.googleapis.com/v0/b/faire-mes-comptes-en-ligne.appspot.com/o/statement-image.jpg?alt=media&token=b833d1e6-6cc3-435f-a9a8-d7f98b1f147a"
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
                required
              />
            </Form.Field>
            {statements !== null && statements.length > 0 && (
              <Form.Field>
                <Form.Dropdown
                  label="Dupliquer à partir du relevé"
                  fluid
                  selection
                  clearable
                  options={statements.map((statement) => ({
                    key: statement.id,
                    value: statement.id,
                    text: statement.label,
                  }))}
                  onChange={(_event, data) =>
                    setStatementDuplicatedId(
                      data.value === "" ? null : (data.value as string)
                    )
                  }
                />
              </Form.Field>
            )}
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
