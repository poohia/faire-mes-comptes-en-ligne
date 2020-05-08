import React from "react";
import { Container, Grid } from "semantic-ui-react";
import { LeftMenu } from "./menu.component";

export const TemplateConnected = ({
  children,
}: {
  children: React.ReactNode;
}) => (
  <Container fluid>
    <LeftMenu />
    <Grid>
      <Grid.Row>
        <Grid.Column
          largeScreen={2}
          computer={3}
          tablet={3}
          mobile={4}
        ></Grid.Column>
        <Grid.Column largeScreen={14} computer={13} tablet={13} mobile={12}>
          {children}
        </Grid.Column>
      </Grid.Row>
    </Grid>
  </Container>
);
