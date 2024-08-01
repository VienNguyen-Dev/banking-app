"use client";
import { sidebarLinks } from "@/constants";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Footer from "./Footer";

const Sidebar = ({ user }: SiderbarProps) => {
  const pathname = usePathname();
  return (
    <section className="sidebar">
      <nav className="flex flex-col gap-4">
        <Link href={"/"} className="flex gap-2 mb-12 items-center cursor-pointer">
          <Image src={"/icons/logo.svg"} alt="logo" width={24} height={24} />
          <p className="text-26 font-ibm-plex-serif font-bold text-black-1">Horizon</p>
        </Link>
        {sidebarLinks.map((link) => {
          const isActive = link.route === pathname || pathname.startsWith(`/${link.route}`);
          return (
            <Link
              href={link.route}
              key={link.label}
              className={cn("sidebar-link", {
                "bg-bankGradient": isActive,
              })}
            >
              <div className=" relative size-6">
                <Image src={link.imgURL} alt={link.label} fill className={cn({ "brightness-[3] invert-0": isActive })} />
              </div>
              <p
                className={cn("sidebar-label", {
                  "!text-white": isActive,
                })}
              >
                {link.label}
              </p>
            </Link>
          );
        })}
      </nav>
      <hr className="w-full" />
      <Footer user={user} type="desktop" />
    </section>
  );
};

export default Sidebar;
