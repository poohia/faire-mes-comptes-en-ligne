import React from "react";
import { Menu, Sidebar, Icon } from "semantic-ui-react";
import { useFirebase } from "../context/firebase.context";
import { Link } from "react-router-dom";

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
      <Link to="/dashboard">
        <Menu.Item as="a" active={pathname.includes("/dashboard")}>
          <Icon name="dashboard" />
          Tableau de bord
        </Menu.Item>
      </Link>
      <Link to="/statistics">
        <Menu.Item as="a">
          <Icon name="chart area" />
          Stastiques
        </Menu.Item>
      </Link>
      <Menu.Item as="a" onClick={() => signOut()}>
        <Icon name="sign-out" />
        Déconnexion
      </Menu.Item>
    </Sidebar>
  );
};
