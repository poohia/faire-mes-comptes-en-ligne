import React from "react";
import { Menu, Icon } from "semantic-ui-react";
import { useFirebase } from "../context/firebase.context";
import { Link } from "react-router-dom";

export const MenuConnected = () => {
  const { signOut, user } = useFirebase();
  const { pathname } = window.location;
  return (
    <Menu stackable size="massive" color="blue" style={{ borderRadius: "0px" }}>
      <Link to="/statements">
        <Menu.Item style={{ padding: "8px" }}>
          <img src={"/logotmp.png"} alt="Logo du site" />
        </Menu.Item>
      </Link>

      <Link to="/statements">
        <Menu.Item active={pathname.includes("/statements")}>
          <Icon name="file alternate outline" /> Mes relévés
        </Menu.Item>
      </Link>
      <Link to="/statistics">
        <Menu.Item active={pathname.includes("/statistics")}>
          <Icon name="chart area" /> Stastiques
        </Menu.Item>
      </Link>
      <Menu.Menu position="right">
        {user?.email && <Menu.Item as="span">{user.email}</Menu.Item>}

        <Menu.Item onClick={() => signOut()}>
          <Icon name="sign-out" /> Déconnexion
        </Menu.Item>
      </Menu.Menu>
    </Menu>
  );
};
