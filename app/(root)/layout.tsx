import MobileNav from "@/components/MobileNav";
import RightSidebar from "@/components/RightSidebar";
import Sidebar from "@/components/Sidebar";
import Image from "next/image";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const loggedIn = { firstName: "Vien", lastName: "Nguyen", email: "chivien107@gmail.com" };
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
