import HeaderBox from "@/components/HeaderBox";
import TotalBalanceBox from "@/components/TotalBalanceBox";
import React from "react";

const Home = () => {
  const loggedIn = { firstName: "VienNguyen" };
  return (
    <section className="home">
      <div className="home-content">
        <header className="home-header">
          <HeaderBox type="greeting" title={`Wellcome`} user={loggedIn.firstName} subtext="Access & manage your account and transactions efficiently." />
        </header>
        <TotalBalanceBox accounts={[]} totalBanks={1} totalCurrentBalance={2698.12} />
        Recent transcaction
      </div>
    </section>
  );
};

export default Home;
