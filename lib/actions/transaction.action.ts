import { Query } from "node-appwrite";
import { createAdminClient } from "./appwrite";
import { parseStringify } from "../utils";
const {
  APPWRITE_DATABASE_ID: DATABASE_ID,
  APPWRITE_USER_COLLECTION_ID: USER_COLLECTION_ID,
  APPWRITE_BANK_COLLECTION_ID: BANK_COLLECTION_ID,
  APPWRITE_TRANSACTION_COLLECTION_ID: TRANSACTION_COLLECTION_ID,
} = process.env;

export const getTransactionByBankId = async ({ bankId }: getTransactionsByBankIdProps) => {
  try {
    const { database } = await createAdminClient();
    const transaction = await database.listDocuments(DATABASE_ID!, TRANSACTION_COLLECTION_ID!, [Query.equal("bankId", [bankId])]);
    return parseStringify(transaction);
  } catch (error) {
    console.log("Error while get transaction of bank", error);
  }
};
