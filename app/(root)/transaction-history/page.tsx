import BankDropdown from "@/components/BankDropdown";
import HeaderBox from "@/components/HeaderBox";
import Pagination from "@/components/Pagination";
import TransactionTable from "@/components/TransactionTable";
import { getAccount, getAccounts } from "@/lib/actions/bank.actions";
import { getLoggedInUser } from "@/lib/actions/user.actions";
import { formatAmount } from "@/lib/utils";
import React from "react";

const TransactionHistory = async ({ searchParams: { id, page } }: SearchParamProps) => {
  const loggedIn = await getLoggedInUser();
  const accounts = await getAccounts({ userId: loggedIn.$id });
  const appwriteItemId = (id as string) || accounts.data[0].appwriteItemId;
  const account = await getAccount({ appwriteItemId });
  const currentPage = Number(page as string) || 1;
  const indexOfLastTransaction = currentPage * 10;
  const indexOfStartTransaction = (currentPage - 1) * 10;
  const currentTransactions = account.allTransactions.slice(indexOfStartTransaction, indexOfLastTransaction);
  const totalPages = Math.ceil(account.allTransactions.length / 10);
  //Handle change bank here

  return (
    <div className="flex flex-col gap-4 transactions">
      <div className="transactions-header">
        <HeaderBox type="title" title="Transaction history" subtext="Gain insights and track your transactions over time" />
        {/* Select Account */}
        <BankDropdown accounts={accounts.data} />
      </div>
      <div className=" space-y-4">
        <div className="transactions-account">
          <div className="flex flex-col gap-2 text-white">
            <h1 className="text-[24px] font-bold">{account.data.name}</h1>
            <p className="text-[16px]">{account.data.officialName}</p>
            <p className="text-white font-semibold text-14 tracking-[1.8px]">
              &#9679;&#9679;&#9679;&#9679; &#9679;&#9679;&#9679;&#9679; &#9679;&#9679;&#9679;&#9679; <span>{account.data.mask}</span>
            </p>
          </div>
          <div className="transactions-account-balance">
            <p className="text-[16px]">Current Balance</p>
            <p className="text-[24px] font-bold">{formatAmount(account.data.currentBalance)}</p>
          </div>
        </div>
        <TransactionTable transactions={currentTransactions} />
        {totalPages > 1 && <Pagination totalPages={totalPages} page={currentPage} />}
      </div>
    </div>
  );
};

export default TransactionHistory;
