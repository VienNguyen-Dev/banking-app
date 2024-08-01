import Image from "next/image";
import Link from "next/link";
import BankCard from "./BankCard";

const RightSidebar = ({ transactions, user, banks }: RightSidebarProps) => {
  return (
    <aside className="right-sidebar">
      <section className="flex flex-col pb-8">
        <div className="profile-banner" />
        <div className="profile">
          <div className="profile-img ">
            <span className="text-26 font-semibold text-blue-500">{user?.firstName[0]}</span>
          </div>
          <div className="profile-details">
            <h1 className="profile-name">{user.name}</h1>
            <p className="profile-email">{user.email}</p>
          </div>
        </div>
      </section>
      <section className="banks">
        <div className="flex w-full justify-between">
          <h2 className="header-2">My banks</h2>
          <Link href={"/"} className="flex gap-2">
            <Image src={"/icons/plus.svg"} width={24} height={24} alt="plus" />
            <p className="font-semibold text-14 text-gray-600">Add bank</p>
          </Link>
        </div>
        {banks.length > 0 && (
          <div className="flex flex-1 flex-col relative justify-center">
            <div className=" relative z-10">
              <BankCard key={banks[0].$id} account={banks[0]} userName={user.name} showBalance={false} />
            </div>
            <div className=" absolute z-0 top-8 right-0 w-[90%]">{banks[1] && <BankCard key={banks[1].$id} account={banks[1]} userName={user.name} showBalance={false} />}</div>
          </div>
        )}
      </section>
    </aside>
  );
};

export default RightSidebar;
