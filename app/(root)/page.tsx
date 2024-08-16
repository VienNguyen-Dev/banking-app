import HeaderBox from "@/components/HeaderBox";
import RightSidebar from "@/components/RightSidebar";
import TotalBalanceBox from "@/components/TotalBalanceBox";
import { getAccount, getAccounts } from "@/lib/actions/bank.actions";
import { getLoggedInUser } from "@/lib/actions/user.actions";

const Home = async ({ searchParams: { id, page } }: SearchParamProps) => {
  const loggedIn = await getLoggedInUser();
  const accounts = await getAccounts({ userId: loggedIn?.$id });
  if (!accounts) return;

  const accountData = accounts.data;

  const appwriteItemId = (id as string) || accountData;
  // const account = await getAccount(appwriteItemId);
  return (
    <section className="home">
      <div className="home-content">
        <header className="home-header">
          <HeaderBox type="greeting" title={`Wellcome`} user={`${loggedIn.firstName}` || "Guest"} subtext="Access & manage your account and transactions efficiently." />
        </header>
        <TotalBalanceBox accounts={accountData} totalBanks={accounts?.totalBanks} totalCurrentBalance={accounts?.totalCurrentBalance} />
        Recent transcaction
      </div>
      <RightSidebar transactions={[]} user={loggedIn} banks={accountData.slice(0, 2)} />
    </section>
  );
};

export default Home;
