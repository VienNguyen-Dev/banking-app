import HeaderBox from "@/components/HeaderBox";
import TransactionTable from "@/components/TransactionTable";
import { getAccount, getAccounts } from "@/lib/actions/bank.actions";
import { getLoggedInUser } from "@/lib/actions/user.actions";
import { formatAmount } from "@/lib/utils";
import React from "react";

const TransactionHistory = async ({ searchParams: { id } }: SearchParamProps) => {
  const loggedIn = await getLoggedInUser();
  const accounts = await getAccounts({ userId: loggedIn.$id });
  const appwriteItemId = (id as string) || accounts.data[0].appwriteItemId;
  const account = await getAccount({ appwriteItemId });
  //Handle change bank here

  return (
    <div className="flex flex-col gap-4 transactions">
      <div className="flex justify-between">
        <HeaderBox type="title" title="Transaction history" subtext="Gain insights and track your transactions over time" />
        {/* Select Account */}
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
        <TransactionTable transactions={account.allTransactions} />
      </div>
    </div>
  );
};

export default TransactionHistory;
