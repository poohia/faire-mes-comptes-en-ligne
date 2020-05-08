import React from "react";
import { Menu, Sidebar, Icon } from "semantic-ui-react";
import { useFirebase } from "../context/firebase.context";

export const LeftMenu = () => {
  const { signOut } = useFirebase();
  const { pathname } = window.location;

  return (
    <Sidebar
      as={Menu}
      animation="push"
      direction="left"
      icon="labeled"
      vertical
      visible
      width="thin"
      color="blue"
      inverted
    >
      <Menu.Item as="a" active={pathname.includes("/dashboard")}>
        <Icon name="dashboard" />
        Tableau de bord
      </Menu.Item>
      <Menu.Item as="a" disabled>
        <Icon name="chart area" />
        Stastiques
      </Menu.Item>
      <Menu.Item as="a" onClick={() => signOut()}>
        <Icon name="sign-out" />
        Déconnexion
      </Menu.Item>
    </Sidebar>
  );
};
