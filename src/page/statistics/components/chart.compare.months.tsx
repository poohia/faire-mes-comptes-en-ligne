import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

import { Statement, Payment } from "../../../model/statement.model";
import { getTotal } from "../../statement";

export const ChartCompareMonths = ({
  currStatement,
  lastStatement,
}: {
  currStatement: Statement;
  lastStatement: Statement;
}) => {
  if (
    currStatement.payments === undefined ||
    lastStatement.payments === undefined
  ) {
    return <div>error</div>;
  }
  return (
    <BarChart
      width={1200}
      height={300}
      data={[
        {
          name: lastStatement.label,
          total: getTotal(Object.values(lastStatement.payments) as Payment[]),
        },
        {
          name: currStatement.label,
          total: getTotal(Object.values(currStatement.payments) as Payment[]),
        },
      ]}
      margin={{
        top: 5,
        right: 30,
        left: 20,
        bottom: 5,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip
        formatter={(value) => {
          return `${value} euros`;
        }}
      />
      <Bar dataKey="total" fill="#8884d8" />
    </BarChart>
  );
};
