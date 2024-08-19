"use server";
import { ID, Query } from "node-appwrite";
import { createAdminClient } from "./appwrite";
import { parseStringify } from "../utils";
const { APPWRITE_DATABASE_ID: DATABASE_ID, APPWRITE_TRANSACTION_COLLECTION_ID: TRANSACTION_COLLECTION_ID } = process.env;

export const getTransactionByBankId = async ({ bankId }: getTransactionsByBankIdProps) => {
  try {
    const { database } = await createAdminClient();
    const senderTransactions = await database.listDocuments(DATABASE_ID!, TRANSACTION_COLLECTION_ID!, [Query.equal("senderBankId", [bankId])]);
    const receiverTransactions = await database.listDocuments(DATABASE_ID!, TRANSACTION_COLLECTION_ID!, [Query.equal("receiverBankId", [bankId])]);
    const transactions = {
      total: senderTransactions.total + receiverTransactions.total,
      documents: [...senderTransactions.documents, ...receiverTransactions.documents],
    };
    return parseStringify(transactions);
  } catch (error) {
    console.log("Error while get transaction of bank", error);
  }
};

export const createTransaction = async (transactionData: CreateTransactionProps) => {
  try {
    const { database } = await createAdminClient();
    const transaction = await database.createDocument(DATABASE_ID!, TRANSACTION_COLLECTION_ID!, ID.unique(), {
      channel: "online",
      category: "Transfer",
      ...transactionData,
    });
    return parseStringify(transaction);
  } catch (error) {
    console.log("Error while create transaction", error);
  }
};
