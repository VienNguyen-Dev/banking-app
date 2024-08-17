"use client";
import React, { useCallback, useEffect, useState } from "react";
import { Button } from "./ui/button";
import { PlaidLinkOnSuccess, PlaidLinkOptions, usePlaidLink } from "react-plaid-link";
import { useRouter } from "next/navigation";
import { createLinkToken, exChangePublicToken } from "@/lib/actions/user.actions";
import Image from "next/image";

const PlaidLink = ({ user, variant }: PlaidLinkProps) => {
  const router = useRouter();
  const [token, setToken] = useState("");
  useEffect(() => {
    const getLinkToken = async () => {
      const data = await createLinkToken(user);
      setToken(data?.linkToken);
    };
    getLinkToken();
  }, [user]);
  const onSuccess = useCallback<PlaidLinkOnSuccess>(
    async (public_token: string) => {
      await exChangePublicToken({
        publicToken: public_token,
        user,
      });
      router.push("/");
    },
    [user]
  );

  const config: PlaidLinkOptions = {
    token,
    onSuccess,
  };
  const { open, ready } = usePlaidLink(config);
  return (
    <div>
      {variant === "primary" ? (
        <Button className="plaidlink-primary" onClick={() => open()} disabled={!ready}>
          Connect a bank account
        </Button>
      ) : variant === "ghost" ? (
        <Button onClick={() => open()} variant={"ghost"} className="flex gap-3 items-center plaidlink-ghost w-full">
          <Image src={"icons/connect-bank.svg"} alt="connect-bank" width={24} height={24} />
          <p className="font-semibold text-[16px] max-lg:hidden text-[#344054]">Connect Bank</p>
        </Button>
      ) : (
        <Button onClick={() => open()} className="flex gap-3 items-center plaidlink-default">
          <Image src={"icons/connect-bank.svg"} alt="connect-bank" width={24} height={24} />
          <p className="font-semibold text-[16px] max-lg:hidden text-[#344054]">Connect Bank</p>
        </Button>
      )}
    </div>
  );
};

export default PlaidLink;
