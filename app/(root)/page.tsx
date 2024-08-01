import HeaderBox from "@/components/HeaderBox";
import TotalBalanceBox from "@/components/TotalBalanceBox";
import { getLoggedInUser } from "@/lib/actions/user.actions";

const Home = async () => {
  const loggedIn = await getLoggedInUser();
  return (
    <section className="home">
      <div className="home-content">
        <header className="home-header">
          <HeaderBox type="greeting" title={`Wellcome`} user={loggedIn?.name || "Guest"} subtext="Access & manage your account and transactions efficiently." />
        </header>
        <TotalBalanceBox accounts={[]} totalBanks={1} totalCurrentBalance={2698.12} />
        Recent transcaction
      </div>
    </section>
  );
};

export default Home;
