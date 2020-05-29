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

import {
  Statement,
  Payment,
  getLabelOfType,
} from "../../../model/statement.model";

export const ChartMonth = ({ statement }: { statement: Statement }) => {
  if (statement.payments === undefined) {
    return <div>error</div>;
  }
  console.log(
    Object.values(statement.payments)
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
      })
  );
  if (statement.payments === undefined) return <div />;

  const cleanData = (): { name: string; montant: number }[] => {
    if (statement.payments === undefined) return [];
    const defVal: { name: string; montant: number }[] = [];
    const val: { name: string; montant: number }[] = Object.values(
      statement.payments
    )
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
      }) as { name: string; montant: number }[];
    val.forEach((v) => {
      const defValFind = defVal.find((vF) => vF.name === v.name);
      if (defValFind === undefined) {
        defVal.push({
          name: v.name,
          montant: v.montant,
        });
      } else {
        defValFind.montant += v.montant;
      }
    });
    return defVal;
  };
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart
        width={1200}
        height={300}
        data={cleanData()}
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
            return `${value} €`;
          }}
        />
        <Bar dataKey="montant" fill="#11c1ab" />
      </BarChart>
    </ResponsiveContainer>
  );
};
