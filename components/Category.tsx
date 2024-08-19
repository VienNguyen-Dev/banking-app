import React from "react";
import { topCategoryStyles } from "@/constants";
import { cn, formatAmount } from "@/lib/utils";
import Image from "next/image";
import { Progress } from "./ui/progress";

const Category = ({ category }: CategoryProps) => {
  const { bg, circleBg, text, progress, icon } = topCategoryStyles[category.name as keyof typeof topCategoryStyles] || topCategoryStyles.default;
  return (
    <div className={cn("flex items-center gap-4 rounded-[18px] p-4", bg)}>
      <figure className={cn("rounded-full p-2", circleBg)}>
        <Image src={icon} alt={category.name} width={20} height={20} />
      </figure>
      <div className="flex-1 flex-col gap-2 w-full">
        <div className="flex justify-between text-[14px] gap-4">
          <h2 className={cn("font-medium", text.main)}>{category.name}</h2>
          <p className={cn("font-normal", text.count)}>${category.count} left</p>
        </div>
        <Progress className={cn("w-full h-2", progress.bg)} value={(category.count / category.totalCount) * 100} indicatorClassName={cn("w-full h-2", progress.indicator)} />
      </div>
    </div>
  );
};

export default Category;
