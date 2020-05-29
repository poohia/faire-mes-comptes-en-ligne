import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { Statement, Payment } from "../../../model/statement.model";

export const ChartMonthType = ({
  statement,
  type,
}: {
  statement: Statement;
  type: string;
}) => {
  if (statement.payments === undefined) {
    return <div>error</div>;
  }
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={Object.values(statement.payments)
          .filter((v) => {
            const payment: Payment = v as Payment;
            return payment.type === type && payment.active;
          })
          .map((v) => {
            const payment: Payment = v as Payment;
            return {
              name: payment.label,
              montant: payment.debit ? payment.amount * -1 : payment.amount,
            };
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
    </ResponsiveContainer>
  );
};
