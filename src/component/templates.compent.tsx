import React from "react";
import { Container } from "semantic-ui-react";
import { MenuConnected } from "./menu.component";

export const TemplateConnected = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { pathname } = window.location;
  return (
    <Container fluid>
      <MenuConnected />
      <Container
        style={{
          padding: "10px",
          marginBottom: pathname.includes("statistics") ? "0px" : "80px",
        }}
        fluid
      >
        {children}
      </Container>
    </Container>
  );
};
