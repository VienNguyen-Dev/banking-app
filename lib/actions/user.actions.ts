"use server";

import { cookies } from "next/headers";
import { createAdminClient, createSessionClient } from "./appwrite";
import { ID, Query } from "node-appwrite";
import { encryptId, extractCustomerIdFromUrl, parseStringify } from "../utils";
import { CountryCode, ProcessorTokenCreateRequest, ProcessorTokenCreateRequestProcessorEnum, Products } from "plaid";
import { addFundingSource, createDwollaCustomer } from "./dwolla.actions";
import { revalidatePath } from "next/cache";
import { plaidClient } from "../plaid";

const { APPWRITE_DATABASE_ID: DATABASE_ID, APPWRITE_USER_COLLECTION_ID: USER_COLLECTION_ID, APPWRITE_BANK_COLLECTION_ID: BANK_COLLECTION_ID } = process.env;

const getUserInfo = async ({ userId }: getUserInfoProps) => {
  try {
    const { database } = await createAdminClient();
    const user = await database.listDocuments(DATABASE_ID!, USER_COLLECTION_ID!, [Query.equal("userId", [userId])]);
    return parseStringify(user.documents[0]);
  } catch (error) {
    console.log("Error while get user info", error);
  }
};

export const signUp = async ({ password, ...userData }: SignUpParams) => {
  const { email, firstName, lastName } = userData;
  let newUserAccount;
  try {
    const { account, database } = await createAdminClient();
    newUserAccount = await account.create(ID.unique(), email, password, `${firstName} ${lastName}`);
    if (!newUserAccount) {
      throw new Error("Error while create new user account");
    }
    const dwollaCustomerUrl = await createDwollaCustomer({ ...userData, type: "personal" });
    if (!dwollaCustomerUrl) {
      throw new Error("Error while create dwolla customer URL");
    }
    const dwollaCustomerId = extractCustomerIdFromUrl(dwollaCustomerUrl);
    const newUser = await database.createDocument(DATABASE_ID!, USER_COLLECTION_ID!, ID.unique(), {
      ...userData,
      userId: newUserAccount.$id,
      dwollaCustomerUrl,
      dwollaCustomerId,
    });
    const session = await account.createEmailPasswordSession(email, password);
    cookies().set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    return parseStringify(newUser);
  } catch (error) {
    console.log("Error while create new user", error);
  }
};

export const signIn = async ({ email, password }: signInProps) => {
  try {
    const { account } = await createAdminClient();
    const session = await account.createEmailPasswordSession(email, password);
    cookies().set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });
    const user = await getUserInfo({ userId: session.userId });
    return parseStringify(user);
  } catch (error) {
    console.log("Error while you try login your account", error);
  }
};

// ... your initilization functions

export async function getLoggedInUser() {
  try {
    const { account } = await createSessionClient();
    const user = await account.get();
    const userInfo = await getUserInfo({ userId: user.$id });
    return parseStringify(userInfo);
  } catch (error) {
    return null;
  }
}
export async function signOut() {
  try {
    const { account } = await createSessionClient();
    cookies().delete("appwrite-session");

    await account.deleteSession("current");
  } catch (error) {
    return null;
  }
}

export const createLinkToken = async (user: User) => {
  try {
    const tokenParams = {
      user: {
        client_user_id: user.$id,
      },
      client_name: `${user.firstName} ${user.lastName}`,
      products: ["auth"] as Products[],
      language: "en",
      country_codes: ["US"] as CountryCode[],
    };
    const createTokenResponse = await plaidClient.linkTokenCreate(tokenParams);
    return parseStringify({ linkToken: createTokenResponse.data.link_token });
  } catch (error) {
    console.log("Error while creating link token", error);
  }
};

export const createBankAccount = async ({ userId, accountId, bankId, fundingSourceUrl, sharableId, accessToken }: createBankAccountProps) => {
  try {
    const { database } = await createAdminClient();
    const bankAccount = await database.createDocument(DATABASE_ID!, BANK_COLLECTION_ID!, ID.unique(), {
      userId,
      accountId,
      bankId,
      fundingSourceUrl,
      sharableId,
      accessToken,
    });
    return parseStringify(bankAccount);
  } catch (error) {
    console.log("Error while creating bank account", error);
  }
};

export const exChangePublicToken = async ({ publicToken, user }: exchangePublicTokenProps) => {
  try {
    const response = await plaidClient.itemPublicTokenExchange({
      public_token: publicToken,
    });
    const accessToken = response.data.access_token;
    const itemID = response.data.item_id;
    const accountResponse = await plaidClient.accountsGet({
      access_token: accessToken,
    });

    const accountData = accountResponse.data.accounts[0];

    const request: ProcessorTokenCreateRequest = {
      access_token: accessToken,
      account_id: accountData.account_id,
      processor: "dwolla" as ProcessorTokenCreateRequestProcessorEnum,
    };

    const processorTokenResponse = await plaidClient.processorTokenCreate(request);
    const processorToken = processorTokenResponse.data.processor_token;

    const fundingSourceUrl = await addFundingSource({
      dwollaCustomerId: user.dwollaCustomerId,
      processorToken,
      bankName: accountData.name,
    });
    if (!fundingSourceUrl) throw Error;
    await createBankAccount({
      userId: user.$id,
      bankId: itemID,
      accountId: accountData.account_id,
      accessToken,
      fundingSourceUrl,
      sharableId: encryptId(accountData.account_id),
    });
    revalidatePath("/");
    return parseStringify({ public_token_exchange: "complete" });
  } catch (error) {
    console.log("Error while exChange token", error);
  }
};

//get banks and bank
export const getBanks = async ({ userId }: getBanksProps) => {
  try {
    const { database } = await createAdminClient();
    const banks = await database.listDocuments(DATABASE_ID!, BANK_COLLECTION_ID!, [Query.equal("userId", [userId])]);
    return parseStringify(banks.documents);
  } catch (error) {
    console.log("Error while get banks", error);
  }
};
export const getBank = async ({ documentId }: getBankProps) => {
  try {
    const { database } = await createAdminClient();
    const bank = await database.listDocuments(DATABASE_ID!, BANK_COLLECTION_ID!, [Query.equal("$id", [documentId])]);
    return parseStringify(bank.documents[0]);
  } catch (error) {
    console.log("Erro while get bank", error);
  }
};
