"use client";

import { cn, formUrlQuery } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";

const BankTabItem = ({ account, appwriteItemId }: BankTabItemProps) => {
  const isActive = account.appwriteItemId === appwriteItemId;
  const searchParams = useSearchParams();
  const router = useRouter();

  const handleBankChange = () => {
    const searchParamsUrl = new URLSearchParams(searchParams.toString());
    searchParamsUrl.set("id", account.appwriteItemId);
    searchParamsUrl.set("page", "1");
    const newUrl = formUrlQuery({
      params: searchParamsUrl.toString(),
      key: "id",
      value: account.appwriteItemId,
    });

    router.push(newUrl);
  };
  return (
    <div
      onClick={handleBankChange}
      className={cn(" banktab-item ", {
        " border-blue-600": isActive,
      })}
    >
      <p
        className={cn("text-[#667085] font-medium text-[16px] line-clamp-1 fle-1", {
          "text-blue-600": isActive,
        })}
      >
        {" "}
        {account.officialName}
      </p>
    </div>
  );
};

export default BankTabItem;
