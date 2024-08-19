import HeaderBox from "@/components/HeaderBox";
import RecentTransactions from "@/components/RecentTransactions";
import RightSidebar from "@/components/RightSidebar";
import TotalBalanceBox from "@/components/TotalBalanceBox";
import { getAccount, getAccounts } from "@/lib/actions/bank.actions";
import { getBank, getLoggedInUser } from "@/lib/actions/user.actions";

const Home = async ({ searchParams: { id, page } }: SearchParamProps) => {
  const currentPage = Number(page as string) || 1;
  const loggedIn = await getLoggedInUser();
  const accounts = await getAccounts({ userId: loggedIn.$id });
  if (!accounts) return;

  const accountData = accounts.data;
  const appwriteItemId = (id as string) || accountData[0]?.appwriteItemId;
  const account = await getAccount({ appwriteItemId });
  return (
    <section className="home">
      <div className="home-content">
        <header className="home-header">
          <HeaderBox type="greeting" title={`Wellcome`} user={`${loggedIn.firstName}` || "Guest"} subtext="Access & manage your account and transactions efficiently." />
        </header>
        <TotalBalanceBox accounts={accountData} totalBanks={accounts?.totalBanks} totalCurrentBalance={accounts?.totalCurrentBalance} />
        <RecentTransactions transactions={account?.allTransactions} accounts={accountData} appwriteItemId={appwriteItemId} page={currentPage} />
      </div>
      <RightSidebar transactions={account.allTransactions} user={loggedIn} banks={accountData.slice(0, 2)} />
    </section>
  );
};

export default Home;
