import React from "react";
import { Container } from "semantic-ui-react";
import { MenuConnected } from "./menu.component";

export const TemplateConnected = ({
  children,
}: {
  children: React.ReactNode;
}) => (
  <Container fluid>
    <MenuConnected />
    <Container style={{ padding: "10px" }} fluid>
      {children}
    </Container>
  </Container>
);
