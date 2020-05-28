import React from "react";
import { Container, Grid, Button, Icon } from "semantic-ui-react";
import styled from "styled-components";

import { FooterContent } from "../../../component";

const TotalContent = styled.div`
  float: right;
  padding: 10px;
  margin-right: 10px;
  min-width: 100px;
  border: 1px dashed #34495e;
  text-align: left;
  .total-label {
    font-weight: bold;
  }
`;

type Props = {
  openModalAddPaiement: (open: boolean) => void;
  total: string;
};

export const FooterStatement = ({ openModalAddPaiement, total }: Props) => (
  <FooterContent>
    <Container fluid>
      <Grid>
        <Grid.Row>
          <Grid.Column
            widescreen="13"
            largeScreen="12"
            computer="10"
            tablet="10"
            mobile="5"
            style={{ textAlign: "left" }}
          >
            <Button
              primary
              icon
              labelPosition="left"
              onClick={() => openModalAddPaiement(true)}
            >
              <Icon name="plus" />
              Ajouter un paiement
            </Button>
          </Grid.Column>
          <Grid.Column
            widescreen="3"
            largeScreen="4"
            computer="6"
            tablet="6"
            mobile="11"
            style={{ textAlign: "right" }}
          >
            <TotalContent>
              <span className="total-label">Total</span>: {"  "}
              <span
                style={{ color: Number(total) < 0 ? "#ff5e57" : "#11c1ab" }}
              >
                {total} €
              </span>
            </TotalContent>

            {/* {statements === undefined && (
              <Button
                primary
                icon
                labelPosition="right"
                onClick={() => openModalCreateStatment(true)}
              >
                Faire mon premier relever de compte
                <Icon name="plus" />
              </Button>
            )}
            {statements !== undefined &&
              statements !== null &&
              !statementOfMonthCreated && (
                <Link to={`dashboard/statement/${moment().format("MMYYYY")}`}>
                  <Button primary icon labelPosition="right">
                    Editer mon relever de compte du moi
                    <Icon name="arrow right" />
                  </Button>
                </Link>
              )}
            {statements !== undefined &&
              statements !== null &&
              statementOfMonthCreated && (
                <Button
                  primary
                  icon
                  labelPosition="right"
                  onClick={() => openModalCreateStatment(true)}
                >
                  Faire mon relever de compte du moi
                  <Icon name="plus" />
                </Button>
              )} */}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Container>
  </FooterContent>
);
