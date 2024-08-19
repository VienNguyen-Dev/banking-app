"use client";

import Image from "next/image";
import { Button } from "./ui/button";
import { formUrlQuery } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

const Pagination = ({ page, totalPages }: PaginationProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const handleNagigation = (type: "prev" | "next") => {
    const pageCurrent = type === "prev" ? page - 1 : page + 1;

    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: "page",
      value: pageCurrent.toString(),
    });
    router.push(newUrl, { scroll: false });
  };

  return (
    <div className="flex justify-between">
      <Button disabled={Number(page) <= 1} variant={"outline"} className="flex gap-2" onClick={() => handleNagigation("prev")}>
        <Image src={"/icons/arrow-left.svg"} width={24} height={24} alt="arrow" />
        Prev
      </Button>
      <p>
        {page}/{totalPages}
      </p>
      <Button disabled={Number(page) >= totalPages} variant={"outline"} className="flex gap-2" onClick={() => handleNagigation("next")}>
        Next
        <Image src={"/icons/arrow-right.svg"} width={24} height={24} alt="arrow" />
      </Button>
    </div>
  );
};

export default Pagination;
