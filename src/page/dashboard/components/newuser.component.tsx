import React, { useState } from "react";
import { Grid, Header, Container } from "semantic-ui-react";
import { ModalCreateStatement } from "./modalcreatestatement.component";
import { FooterDashboard } from "./footerdashboard.component";

export const NewUserComponent = () => {
  const [openModal, setOpenModal] = useState(false);
  return (
    <Container>
      <Grid.Row>
        <Grid.Column>
          <Header as="h1">Bienvenu,</Header>
          <p>
            vous n'avez pas encore créé de revelé, passez le pas et cliquez sur
            "Faire mon premier relever de compte" en bas à droite.
          </p>
        </Grid.Column>
      </Grid.Row>
      {openModal && (
        <ModalCreateStatement
          open={openModal}
          setOpen={setOpenModal}
          statements={null}
        />
      )}
      <FooterDashboard openModalCreateStatment={setOpenModal} />
    </Container>
  );
};
