import React, { useState } from "react";
import { Table, Button, Icon, Popup } from "semantic-ui-react";
import moment from "moment";

import { Statement } from "../../../model/statement.model";
import { useHistory } from "react-router";
import { useFirebase } from "../../../context/firebase.context";

export const StatementList = ({ statements }: { statements: Statement[] }) => {
  const { push } = useHistory();
  const { deleteStatement } = useFirebase();
  const [openPopup, setOpenPopup] = useState<string>("");

  return (
    <Table color="blue">
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell colSpan="2">Liste de vos relevé</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {statements.map((statement) => (
          <Table.Row>
            <Table.Cell>
              {statement.label} <br />
              <i>Fait le {moment(statement.createDate).format("DD/MM/YYYY")}</i>
            </Table.Cell>
            <Table.Cell textAlign="right">
              <Button.Group>
                <Button
                  icon
                  title="Ouvrir"
                  color="blue"
                  onClick={() => push(`dashboard/statement/${statement.id}`)}
                >
                  <Icon name="external" />
                </Button>
                <Popup
                  on="click"
                  pinned
                  trigger={
                    <Button icon title="Supprimer" color="red">
                      <Icon name="delete" />
                    </Button>
                  }
                  open={openPopup === statement.id}
                  onOpen={() => setOpenPopup(statement.id)}
                  onClose={() => setOpenPopup("")}
                >
                  <Popup.Content>
                    Êtes-vous sur de vouloir supprimer ce relevé? <br />
                    <Button
                      icon
                      color="green"
                      size="mini"
                      onClick={() => deleteStatement(statement.id)}
                    >
                      <Icon name="check" />
                    </Button>
                    <Button
                      icon
                      color="red"
                      size="mini"
                      onClick={() => setOpenPopup("")}
                    >
                      <Icon name="close" />
                    </Button>
                  </Popup.Content>
                </Popup>
              </Button.Group>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
};
