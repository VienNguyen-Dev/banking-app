import { Configuration, PlaidApi, PlaidEnvironments } from "plaid";
const { PLAID_CLIENT_ID, PLAID_SECRET } = process.env;

const configuration = new Configuration({
  basePath: PlaidEnvironments.sandbox,
  baseOptions: {
    headers: {
      "PLAID-CLIENT-ID": PLAID_CLIENT_ID,
      "PLAID-SECRET": PLAID_SECRET,
    },
  },
});

export const plaidClient = new PlaidApi(configuration);
