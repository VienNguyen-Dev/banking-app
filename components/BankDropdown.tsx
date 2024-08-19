"use client";
import React, { useState } from "react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger } from "@/components/ui/select";
import { formatAmount, formUrlQuery } from "@/lib/utils";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";

const BankDropdown = ({ accounts, setValue, otherStyles }: BankDropdownProps) => {
  const [selected, setSelected] = useState(accounts[0]);
  const searchPrams = useSearchParams();
  const router = useRouter();
  const handleBankChange = (id: string) => {
    const account = accounts.find((a) => a.appwriteItemId === id)!;
    setSelected(account);
    const newUrl = formUrlQuery({
      params: searchPrams.toString(),
      key: "id",
      value: id,
    });
    router.push(newUrl, { scroll: false });
    if (setValue) {
      setValue("senderBank", id);
    }
  };

  return (
    <Select onValueChange={(value) => handleBankChange(value)} defaultValue={selected.id}>
      <SelectTrigger className={`w-full md:w-[300px] bg-white ${otherStyles}`}>
        <div className="flex gap-4 items-center">
          <Image src={"/icons/credit-card.svg"} width={24} height={24} alt="credit-card" color="green" />
          <p className="font-medium text-left line-clamp-1">{selected.name}</p>
        </div>
      </SelectTrigger>
      <SelectContent className={`bg-white w-full md:w-[300px] ${otherStyles}`} align="end">
        <SelectGroup>
          <SelectLabel className=" font-normal text-gray-500 py-2">Select a bank to display</SelectLabel>
          {accounts.map((a: Account) => (
            <SelectItem key={a.id} value={a.appwriteItemId} className=" cursor-pointer border-t border-gray-200 px-[16px] py-[18px]">
              <div className="flex flex-col ml-4">
                <h2 className="font-bold text-[16px]">{a.name}</h2>
                <p className="text-[#0179FE] font-medium text-[14px]">{formatAmount(a.currentBalance)}</p>
              </div>
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default BankDropdown;
