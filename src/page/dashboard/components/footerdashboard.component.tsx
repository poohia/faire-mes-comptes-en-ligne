import React from "react";
import { Container, Grid, Button, Icon } from "semantic-ui-react";
import { Link } from "react-router-dom";

import moment from "moment";

import { Statement } from "../../../model/statement.model";
import { FooterContent } from "../../../component";

type Props = {
  statements?: Statement[] | null;
  statementOfMonthCreated?: boolean;
  openModalCreateStatment: (open: boolean) => void;
};

export const FooterDashboard = ({
  statements,
  statementOfMonthCreated,
  openModalCreateStatment,
}: Props) => (
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
          ></Grid.Column>
          <Grid.Column
            widescreen="3"
            largeScreen="4"
            computer="6"
            tablet="6"
            mobile="11"
            style={{ textAlign: "right" }}
          >
            {statements === undefined && (
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
              statementOfMonthCreated && (
                <Link to={`statements/statement/${moment().format("MMYYYY")}`}>
                  <Button primary icon labelPosition="right">
                    Editer mon relever de compte du moi
                    <Icon name="arrow right" />
                  </Button>
                </Link>
              )}
            {statements !== undefined &&
              statements !== null &&
              !statementOfMonthCreated && (
                <Button
                  primary
                  icon
                  labelPosition="right"
                  onClick={() => openModalCreateStatment(true)}
                >
                  Faire mon relever de compte du moi
                  <Icon name="plus" />
                </Button>
              )}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Container>
  </FooterContent>
);
