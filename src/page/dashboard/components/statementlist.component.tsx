import React, { useState } from "react";
import { Button, Icon, Modal, Header } from "semantic-ui-react";
import moment from "moment";

import { Statement } from "../../../model/statement.model";
import { useHistory } from "react-router";
import { useFirebase } from "../../../context/firebase.context";
import { ListContent } from "../../../component";

export const StatementList = ({ statements }: { statements: Statement[] }) => {
  const { push } = useHistory();
  const { deleteStatement } = useFirebase();
  const [statementDelete, setStatementDelete] = useState<Statement | null>(
    null
  );

  return (
    <React.Fragment>
      <ListContent>
        {statements.map((statement) => (
          <div
            className="hizmet-buton"
            onClick={() => push(`statements/statement/${statement.id}`)}
            key={statement.id}
          >
            <span className="hizmet-title">{statement.label}</span>
            <span className="hizmet-small">
              Fait le {moment(statement.createDate).format("DD/MM/YYYY")}
            </span>
            <Button
              className="hizmet-fiyat-secondary"
              onClick={(event) => {
                event.stopPropagation();
                setStatementDelete(statement);
              }}
            >
              Supprimer
            </Button>
            <Button className="hizmet-fiyat"> Ouvrir</Button>
          </div>
        ))}
      </ListContent>
      <Modal
        open={statementDelete !== null}
        basic
        size="small"
        onClose={() => setStatementDelete(null)}
        closeOnEscape
        closeOnTriggerClick
      >
        <Header icon="archive" content="Suppression d'un relevé" />
        <Modal.Content>
          <p>
            Êtes-vous sûr de vouloir supprimer votre relevé de compte{" "}
            {statementDelete?.label}
          </p>
        </Modal.Content>
        <Modal.Actions>
          <Button primary onClick={() => setStatementDelete(null)}>
            <Icon name="remove" /> Non
          </Button>
          <Button
            negative
            onClick={() =>
              statementDelete &&
              deleteStatement(statementDelete.id).then(() =>
                setStatementDelete(null)
              )
            }
          >
            Oui &nbsp; <Icon name="checkmark" />
          </Button>
        </Modal.Actions>
      </Modal>
    </React.Fragment>
  );
};
