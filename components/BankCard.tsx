import { formatAmount } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import Copy from "./Copy";

const BankCard = ({ account, userName, showBalance }: CreditCardProps) => {
  return (
    <div className="flex flex-col gap-4">
      <Link href={"/"} className="bank-card">
        <div className="bank-card_content">
          <div className="">
            <h1 className=" font-semibold text-16 text-white">{userName}</h1>
            {showBalance && <p className=" font-ibm-plex-serifs font-black text-white">{formatAmount(account.currentBalance)}</p>}
          </div>
          <article className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h2 className="text-12 font-semibold text-white">{userName}</h2>
              <p className="text-white">&#9679;&#9679; / &#9679;&#9679;</p>
            </div>
            <p className="text-white font-semibold text-14 tracking-[1.8px]">
              &#9679;&#9679;&#9679;&#9679; &#9679;&#9679;&#9679;&#9679; &#9679;&#9679;&#9679;&#9679; <span>{account.mask}</span>
            </p>
          </article>
        </div>
        <div className="bank-card_icon">
          <Image src={"/icons/Paypass.svg"} width={24} height={24} alt="payPass" />
          <Image src={"/icons/mastercard.svg"} width={24} height={24} alt="mastercard" />
        </div>
        <Image src={"/icons/lines.png"} alt="lines" width={360} height={190} className="top-0 left-0 absolute" />
      </Link>
      {showBalance && <Copy title={account.sharableId} />}
    </div>
  );
};

export default BankCard;
