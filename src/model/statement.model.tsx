export type Statement = {
  id: string;
  label: string;
  createDate: string;
  payments?: Payment[];
};

export type Payment = {
  label: string;
  amount: number;
  type: string;
  debit: boolean;
};
