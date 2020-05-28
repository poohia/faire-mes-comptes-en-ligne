import styled from "styled-components";

import { MenuConnected } from "./menu.component";
import { TemplateConnected } from "./templates.compent";

export { MenuConnected, TemplateConnected };

export const FooterContent = styled.div`
  height: 65px;
  background: white;
  border-top: 1px rgba(34, 36, 38, 0.15) solid;
  position: fixed;
  bottom: 0;
  width: 100%;
  left: 0;
  padding: 10px;
  text-align: center;
  box-shadow: 0 0 5px 1px lightgrey;
`;

export const ListContent = styled.div`
  border: 1px solid #ddd;
  background: white;
  cursor: pointer;
  .hizmet-buton {
    padding: 15px;
    border-bottom: 1px solid #ddd;
    position: relative;
    font-size: 13px;
    display: block;
    color: #333;
    .hizmet-title {
      font-weight: bold;
    }
    &:hover {
      background: #11c1ab;
    }
    .hizmet-small {
      font-size: 12px;
      color: grey;
      margin-left: 3px;
      display: inline-block;
    }
    .hizmet-fiyat {
      position: absolute;
      right: 10px;
      top: 10px;
      padding: 6px 0;
      background: #11d3bb;
      color: white;
      width: 100px;
      border-radius: 3px;
      text-align: center;
    }
    .hizmet-fiyat-secondary {
      position: absolute;
      right: 120px;
      top: 10px;
      padding: 6px 0;
      background: #ff5e57;
      color: white;
      width: 100px;
      border-radius: 3px;
      text-align: center;
    }
    .hizmet-fiyat-delete {
      position: absolute;
      right: 10px;
      top: 10px;
      padding: 6px 0;
      background: #ff5e57;
      color: white;
      width: 100px;
      border-radius: 3px;
      text-align: center;
    }
  }
`;
