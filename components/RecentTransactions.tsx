import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BankTabItem from "./BankTabItem";
import BankInfo from "./BankInfo";
import TransactionTable from "./TransactionTable";

const RecentTransactions = ({ accounts = [], transactions = [], appwriteItemId, page }: RecentTransactionsProps) => {
  return (
    <div className="recent-transactions">
      <header className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h1 className="font-semibold text-[24px]">Recent Transactions</h1>
          <Link href={`/transaction-history/?id=${appwriteItemId}`}>
            <Button className="view-all-btn hover:bg-bankGradient hover:text-white" variant={"outline"}>
              View alls
            </Button>
          </Link>
        </div>
        <Tabs defaultValue={appwriteItemId} className="w-full">
          <TabsList className="recent-transactions-tablist">
            {accounts.map((a: Account) => {
              return (
                <TabsTrigger key={a.id} value={a.appwriteItemId}>
                  <BankTabItem account={a} appwriteItemId={appwriteItemId} />
                </TabsTrigger>
              );
            })}
          </TabsList>
          {accounts.map((a: Account) => (
            <div className="flex flex-col gap-4" key={a.id}>
              <TabsContent value={a.appwriteItemId}>
                <BankInfo account={a} appwriteItemId={a.appwriteItemId} type="full" />
                <TransactionTable transactions={transactions} />
              </TabsContent>
            </div>
          ))}
        </Tabs>
      </header>
    </div>
  );
};

export default RecentTransactions;
