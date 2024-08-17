import { CountryCode } from "plaid";
import { plaidClient } from "../plaid";
import { parseStringify } from "../utils";
import { getBank, getBanks } from "./user.actions";
import { getTransactionByBankId } from "./transaction.action";

///witre endpoint get mutiple accounts and a account
export const getAccounts = async ({ userId }: getAccountsProps) => {
  try {
    //Get mutilple banks
    const banks = await getBanks({ userId });
    //Get bank accounts in the plaid

    const accounts = await Promise.all(
      banks?.map(async (bank: Bank) => {
        const accountResponse = await plaidClient.accountsGet({
          access_token: bank.accessToken,
        });
        const accountData = accountResponse.data.accounts[0];
        const institution = await getInstitution({ institutionId: accountResponse.data.item.institution_id! });
        const account = {
          id: accountData.account_id,
          availableBalance: accountData.balances.available!,
          currentBalance: accountData.balances.current!,
          officialName: accountData.name,
          mask: accountData.mask,
          institutionId: institution.institution_id,
          name: accountData.name as string,
          type: accountData.type as string,
          subtype: accountData.subtype as string,
          appwriteItemId: bank.$id,
          sharableId: bank.sharableId,
        };
        return account;
      })
    );
    const totalBanks = banks.length;
    const totalCurrentBalance = accounts.reduce((total, account) => (total = total + account.currentBalance), 0);

    return parseStringify({
      data: accounts,
      totalCurrentBalance,
      totalBanks,
    });
  } catch (error) {
    console.log("Erro while get accounts", error);
  }
};
//Get a bank account
export const getAccount = async ({ appwriteItemId }: getAccountProps) => {
  try {
    const bank = await getBank({ documentId: appwriteItemId });
    const accountResponse = await plaidClient.accountsGet({ access_token: bank.accessToken });
    const accountData = accountResponse.data.accounts[0];
    //Get all tranfer transaction of a bank account
    const tranferTransactionData = await getTransactionByBankId({ bankId: bank.$id });

    const tranferTransaction = tranferTransactionData.documents.map((transaction: Transaction) => ({
      id: transaction.$id,
      name: transaction.name,
      paymentChannel: transaction.channel,
      amount: transaction.amount,
      category: transaction.category,
      date: transaction.$createdAt,
      type: transaction.senderBankId === bank.$id ? "debit" : "credit",
    }));
    const institution = await getInstitution({ institutionId: accountResponse.data.item.institution_id! });

    //Get transaction from Plaid
    const getTranferTransactionFromPlaid = await getTransactions({ accessToken: bank.accessToken });
    //Take account infor
    const account = {
      id: accountData.account_id,
      availableBalance: accountData.balances.available!,
      currentBalance: accountData.balances.current!,
      officialName: accountData.name,
      mask: accountData.mask!,
      institutionId: institution.institution_id,
      name: accountData.name as string,
      type: accountData.type as string,
      subtype: accountData.subtype as string,
      appwriteItemId: bank.$id,
      sharableId: bank.sharableId,
    };
    const allTransactions = [...tranferTransaction, ...getTranferTransactionFromPlaid].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
    return parseStringify({ data: account, allTransactions });
  } catch (error) {
    console.log("Error while get a bank account", error);
  }
};

export const getInstitution = async ({ institutionId }: getInstitutionProps) => {
  try {
    const institutionData = await plaidClient.institutionsGetById({ institution_id: institutionId, country_codes: ["US"] as CountryCode[] });
    const institution = institutionData.data.institution;
    return parseStringify(institution);
  } catch (error) {
    console.log("Error while get institution", error);
  }
};

//Get transaction from Plaid
export const getTransactions = async ({ accessToken }: getTransactionsProps) => {
  try {
    let hasMore = true;
    let transactions: any = [];
    while (hasMore) {
      const response = await plaidClient.transactionsSync({ access_token: accessToken });
      const transactionData = response.data;
      transactions = transactionData.added.map(
        (transaction) => ({
          id: transaction.transaction_id,
          name: transaction.name,
          paymentChannel: transaction.payment_channel,
          amount: transaction.amount,
          pending: transaction.pending,
          date: transaction.date,
          type: transaction.payment_channel,
          category: transaction.category ? transaction.category[0] : "",
          image: transaction.logo_url,
        }),
        (hasMore = transactionData.has_more)
      );
    }
    return parseStringify(transactions);
  } catch (error) {
    console.log("Error while get transaction from plaid", error);
  }
};
