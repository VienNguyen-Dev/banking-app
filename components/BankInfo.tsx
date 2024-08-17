"use client";
import { cn, formatAmount, formUrlQuery, getAccountTypeColors } from "@/lib/utils";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";

const bankInfo = ({ account, appwriteItemId, type }: BankInfoProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const isActive = appwriteItemId === account.appwriteItemId;
  const handleBankChange = () => {
    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: "id",
      value: account.appwriteItemId,
    });
    router.push(newUrl, { scroll: false });
  };
  const colors = getAccountTypeColors(account.type as AccountTypes);
  return (
    <div
      onClick={handleBankChange}
      className={cn(`bank-info ${colors.bg}`, {
        "shadow-sm border-blue-700": type === "card" && isActive,
        "rounded-xl": type === "card",
        "hover:shadow-sm cursor-pointer": type === "card",
      })}
    >
      <figure className={cn(` rounded-full h-fit flex-center bg-blue-100 ${colors.lightBg}`)}>
        <Image src={"/icons/connect-bank.svg"} alt="connect-bank" width={24} height={24} className="min-w-5 m-2" />
      </figure>
      <div className=" flex flex-col gap-1 flex-1 w-full justify-center">
        <div className="bank-info_content">
          <h2 className={cn(`font-semibold text-16 text-[#194185] line-clamp-1 ${colors.title}`)}>{account.name}</h2>
          {type === "full" && <p className={cn(`font-medium rounded-full text-[#027A48] px-3 py-1 text-[14px] ${colors.lightBg} ${colors.subText} `)}>{account.subtype}</p>}
        </div>
        <p className={cn(`text-[18px] texr-[#1570EF] font-semibold ${colors.subText}`)}>{formatAmount(account.currentBalance)}</p>
      </div>
    </div>
  );
};

export default bankInfo;
