import React, { useState } from "react";
import { Grid, Header, Button } from "semantic-ui-react";
import { ModalCreateStatement } from "./modalcreatestatement.component";

export const NewUserComponent = () => {
  const [openModal, setOpenModal] = useState(false);
  return (
    <React.Fragment>
      <Grid.Row>
        <Grid.Column>
          <Header as="h1">Nouveau utilisateur</Header>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column>
          <Button secondary onClick={() => setOpenModal(true)}>
            Faire mon premier relever
          </Button>
        </Grid.Column>
      </Grid.Row>
      <ModalCreateStatement open={openModal} setOpen={setOpenModal} />
    </React.Fragment>
  );
};
