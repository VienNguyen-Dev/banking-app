import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn, formatAmount, formatDateTime, getTransactionStatus, removeSpecialCharacters } from "@/lib/utils";
import { transactionCategoryStyles } from "@/constants";

const CategoryBadge = ({ category }: CategoryBadgeProps) => {
  const { borderColor, backgroundColor, textColor, chipBackgroundColor } = transactionCategoryStyles[category as keyof typeof transactionCategoryStyles] || transactionCategoryStyles.default;
  return (
    <div className={cn("category-badge", chipBackgroundColor, borderColor)}>
      <div className={cn("rounded-full size-2", backgroundColor)} />
      <p className={cn("text-[12px] font-medium", textColor)}>{category}</p>
    </div>
  );
};
const TransactionTable = ({ transactions }: TransactionTableProps) => {
  return (
    <Table className="mt-10">
      <TableHeader className="bg-[#EAECF0]">
        <TableRow className="text-[#475467] font-semibold text-[12px]">
          <TableHead className="px-2">Transactions</TableHead>
          <TableHead className="px-2">Amount</TableHead>
          <TableHead className="px-2">Status</TableHead>
          <TableHead className="px-2">Date</TableHead>
          <TableHead className="px-2 max-xl:hidden">Channel</TableHead>
          <TableHead className="px-2 max-xl:hidden">Category</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map((t: Transaction) => {
          const status = getTransactionStatus(new Date(t.date));
          const amount = formatAmount(t.amount);
          const isDebit = t.type === "debit";
          const isCredit = t.type === "credit";
          return (
            <TableRow key={t.$id} className={`${isDebit || amount[0] === "-" ? "bg-[#FFFBFA]" : "bg-[#F6FEF9]"} !over:bg-none !border-b-DEFAULT}`}>
              <TableCell className="max-w-250px pl-2">
                <div className=" flex items-center gap-3">
                  <h1 className="test-[14px] font-medium truncate text-[#101828]">{removeSpecialCharacters(t.name)}</h1>
                </div>
              </TableCell>
              <TableCell className={`${isDebit || amount[0] === "-" ? "text-[#F04438]" : "text-[#039855]"} text-[14px] font-semibold pl-2 pr-10`}>
                {isDebit ? `-${amount}` : isCredit ? `${amount}` : amount}
              </TableCell>
              <TableCell className="pl-2 pr-10">
                <CategoryBadge category={status} />
              </TableCell>
              <TableCell className="pl-2 pr-10 min-w-32 text-[14px]">{formatDateTime(new Date(t.date)).dateTime}</TableCell>
              <TableCell className="pl-2 pr-10 capitalize max-xl:hidden min-w-28">{t.paymentChannel}</TableCell>
              <TableCell className="pl-2 pr-10 max-xl:hidden">
                <CategoryBadge category={t.category} />
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default TransactionTable;
