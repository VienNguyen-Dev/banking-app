"use client";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { sidebarLinks } from "@/constants";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const MobileNav = (user: MobileNavProps) => {
  const pathname = usePathname();
  return (
    <Sheet>
      <SheetTrigger>
        <Image src={"/icons/hamburger.svg"} width={24} height={24} alt="menu" />
      </SheetTrigger>
      <SheetContent side={"left"} className="bg-white">
        <Link href={"/"} className="flex gap-2 items-center cursor-pointer">
          <Image src={"/icons/logo.svg"} alt="logo" width={24} height={24} />
          <p className="text-26 font-ibm-plex-serif font-bold text-black-1">Horizon</p>
        </Link>
        <div className="mobile-sheet">
          <SheetClose asChild>
            <nav className="flex flex-col pt-16 w-full text-white">
              {sidebarLinks.map((link) => {
                const isActive = link.route === pathname || pathname.startsWith(`/${link.route}`);
                return (
                  <SheetClose asChild key={link.label}>
                    <Link
                      href={link.route}
                      key={link.label}
                      className={cn("mobilenav-sheet_close w-full", {
                        "bg-bankGradient": isActive,
                      })}
                    >
                      <div className="flex items-center justify-center gap-4">
                        <Image src={link.imgURL} alt={link.label} width={24} height={24} className={cn({ "brightness-[3] invert-0": isActive })} />
                      </div>
                      <p
                        className={cn(" text-16 font-semibold text-black-2", {
                          "text-white": isActive,
                        })}
                      >
                        {link.label}
                      </p>
                    </Link>
                  </SheetClose>
                );
              })}
              USER
            </nav>
          </SheetClose>
        </div>
        FOOTER
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;
