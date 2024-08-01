import MobileNav from "@/components/MobileNav";
import RightSidebar from "@/components/RightSidebar";
import Sidebar from "@/components/Sidebar";
import { getLoggedInUser } from "@/lib/actions/user.actions";
import Image from "next/image";
import { redirect } from "next/navigation";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const loggedIn = await getLoggedInUser();
  if (!loggedIn) redirect("/sign-in");
  return (
    <main className="flex h-screen w-full font-inter">
      <Sidebar user={loggedIn} />
      <div className="flex flex-col size-full">
        <div className="root-layout">
          <Image src={"/icons/logo.svg"} width={24} height={24} alt="menu logo" />
          <div className="">
            <MobileNav user={loggedIn} />
          </div>
        </div>
        {children}
      </div>
      <RightSidebar transactions={[]} user={loggedIn} banks={[{ currentBalance: 1234.12 }, { currentBalance: 1756.12 }]} />
    </main>
  );
}
