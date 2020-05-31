import React from "react";
import styled from "styled-components";
import Logo from "./loading.svg";

const LoadingComponentContent = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  background: transparant;
  width: 100%;
  height: 100%;
  display: flex;
  z-index: -1;
  div.loading-content-veritcalAlign {
    margin: auto;
    text-align: center;
    p {
      margin-bottom: 0;
      font-weight: bold;
    }
  }
`;

export const LoadingComponent = () => (
  <LoadingComponentContent>
    <div className="loading-content-veritcalAlign">
      <p>Chargement....</p>
      <img src={Logo} className="App-logo" alt="logo" />
    </div>
  </LoadingComponentContent>
);
