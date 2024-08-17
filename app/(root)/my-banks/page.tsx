import BankCard from "@/components/BankCard";
import HeaderBox from "@/components/HeaderBox";
import { getAccounts } from "@/lib/actions/bank.actions";
import { getLoggedInUser } from "@/lib/actions/user.actions";
import React from "react";

const MyBanks = async () => {
  const loggedIn = await getLoggedInUser();
  const accounts = await getAccounts({ userId: loggedIn.$id });
  return (
    <div className="my-banks">
      <HeaderBox type="title" title="My Bank Accounts" subtext="Effortlessly Manage Your Banking Activities" />
      <div className=" space-y-2">
        <h1 className="font-semibold tex-[18px]">Your cards</h1>
        <div className="flex flex-wrap gap-6">
          {accounts.data.map((a: Account) => (
            <BankCard key={a.id} account={a} userName={`${loggedIn.firstName} ${loggedIn.lastName}`} showBalance={true} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyBanks;
