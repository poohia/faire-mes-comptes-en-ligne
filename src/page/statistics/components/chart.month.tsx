import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

import {
  Statement,
  Payment,
  getLabelOfType,
} from "../../../model/statement.model";

export const ChartMonth = ({ statement }: { statement: Statement }) => {
  if (statement.payments === undefined) {
    return <div>error</div>;
  }
  return (
    <BarChart
      width={1200}
      height={300}
      data={Object.values(statement.payments)
        .filter((v) => {
          const payment: Payment = v as Payment;
          return payment.active;
        })
        .map((v) => {
          const payment: Payment = v as Payment;
          if (payment.active)
            return {
              name: getLabelOfType(payment.type),
              montant: payment.debit ? payment.amount * -1 : payment.amount,
            };
          return {};
        })}
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
      <Bar dataKey="montant" fill="#11c1ab" />
    </BarChart>
  );
};
