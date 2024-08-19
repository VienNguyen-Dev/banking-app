"use client";
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import BankDropdown from "./BankDropdown";
import { Textarea } from "./ui/textarea";
import { createTransfer } from "@/lib/actions/dwolla.actions";
import { decryptId } from "@/lib/utils";
import { getBank, getBankByAccountId } from "@/lib/actions/user.actions";
import { createTransaction } from "@/lib/actions/transaction.action";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  name: z.string().min(4, "Transfer note is too short"),
  amount: z.string().min(4, "Amount is too short"),
  senderBank: z.string().min(4, "Please select a valid bank account"),
  sharableId: z.string().min(8, "Please select a valid sharable Id"),
});

const PaymentTransferForm = ({ accounts }: PaymentTransferFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      amount: "",
      senderBank: "",
      sharableId: "",
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const receiverAccountId = decryptId(data.sharableId);
      const receiverBank = await getBankByAccountId({ accountId: receiverAccountId });
      const senderBank = await getBank({ documentId: data.senderBank });
      const transferParams = {
        sourceFundingSourceUrl: senderBank.fundingSourceUrl,
        destinationFundingSourceUrl: receiverBank.fundingSourceUrl,
        amount: data.amount,
      };
      const transfer = await createTransfer(transferParams);
      if (transfer) {
        const transactionData = {
          name: data.name,
          email: data.email,
          senderId: senderBank.userId.$id,
          senderBankId: senderBank.$id,
          receiverId: receiverBank.userId.$id,
          receiverBankId: receiverBank.$id,
          amount: data.amount,
        };
        const transaction = await createTransaction(transactionData);
        if (transaction) {
          form.reset();
          router.push("/");
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="payment-transfer_form-details">
        <div className="flex flex-col gap-2 mt-6 mb-5">
          <h1 className="font-bold text-[18px]">Transfer deatails</h1>
          <p className="font-medium text-[14px]">Enter the details of the recipient</p>
        </div>
        <FormField
          control={form.control}
          name="senderBank"
          render={() => (
            <FormItem className="border-t border-gray-200">
              <div className="payment-transfer_form-item pb-6 pt-5">
                <div className="payment-transfer_form-content ">
                  <FormLabel className="font-medium text-[18px] capitalize">Select source bank</FormLabel>
                  <FormDescription className="font-medium text-[14px] text-[#475467]">Select the bank account you want to transfer</FormDescription>
                </div>
                <div className="flex flex-col w-full">
                  <FormControl>
                    <BankDropdown accounts={accounts} setValue={form.setValue} otherStyles="!w-full" />
                  </FormControl>
                  <FormMessage className="text-red-600 mt-2" />
                </div>
              </div>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="border-t border-gray-200">
              <div className="payment-transfer_form-item pb-6 pt-5">
                <div className="payment-transfer_form-content ">
                  <FormLabel className="font-medium text-[18px] capitalize">Transfer note (optional)</FormLabel>
                  <FormDescription className="font-medium text-[14px] text-[#475467]">SPlease provide any additional informantion or instructions related to the transfer</FormDescription>
                </div>
                <div className="flex flex-col w-full">
                  <FormControl>
                    <Textarea placeholder="Write a short note here" className="input-class" {...field} />
                  </FormControl>
                  <FormMessage className="text-red-600 mt-2" />
                </div>
              </div>
            </FormItem>
          )}
        />

        <div className="flex flex-col gap-2 mt-6 mb-5">
          <h1 className="font-bold text-[18px]">Bank account details</h1>
          <p className="font-medium text-[14px]">Enter the bank account details of the recipient</p>
        </div>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="border-t border-gray-200">
              <div className="payment-transfer_form-item pb-6 pt-5">
                <div className="payment-transfer_form-content ">
                  <FormLabel className="font-medium text-[18px] capitalize">Recipient's email address</FormLabel>
                </div>
                <div className="flex flex-col w-full">
                  <FormControl>
                    <Input type="email" placeholder="Enter your email here" className="input-class" {...field} />
                  </FormControl>
                  <FormMessage className="text-red-600 mt-2" />
                </div>
              </div>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="sharableId"
          render={({ field }) => (
            <FormItem className="border-t border-gray-200">
              <div className="payment-transfer_form-item pb-6 pt-5">
                <div className="payment-transfer_form-content ">
                  <FormLabel className="font-medium text-[18px] capitalize">Recipient's bank account number</FormLabel>
                </div>
                <div className="flex flex-col w-full">
                  <FormControl>
                    <Input type="text" placeholder="Enter the account number" className="input-class" {...field} />
                  </FormControl>
                  <FormMessage className="text-red-600 mt-2" />
                </div>
              </div>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem className="border-t border-gray-200">
              <div className="payment-transfer_form-item pb-6 pt-5">
                <div className="payment-transfer_form-content ">
                  <FormLabel className="font-medium text-[18px] capitalize">Amount</FormLabel>
                </div>
                <div className="flex flex-col w-full">
                  <FormControl>
                    <Input type="text" placeholder="Enter the account number" className="input-class" {...field} />
                  </FormControl>
                  <FormMessage className="text-red-600 mt-2" />
                </div>
              </div>
            </FormItem>
          )}
        />
        <div className="payment-transfer_btn-box">
          <Button disabled={isLoading} type="submit" className="payment-transfer_btn">
            {isLoading ? (
              <>
                <Loader2 size={14} className=" animate-spin" />
                <p className="ml-2">Sending...</p>
              </>
            ) : (
              "Transfer Fund"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PaymentTransferForm;
