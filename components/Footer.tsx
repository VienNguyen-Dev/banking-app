"use client";
import { signOut } from "@/lib/actions/user.actions";

import Image from "next/image";
import { useRouter } from "next/navigation";

const Footer = ({ type = "desktop", user }: FooterProps) => {
  const router = useRouter();
  const handleSignOut = async () => {
    const loggedOut = await signOut();
    if (loggedOut) router.push("/sign-in");
  };
  return (
    <footer className="footer">
      <div className={`${type === "mobile" ? "footer_name-mobile" : "footer_name"}`}>
        <span className="text-26 font-semibold text-blue-500">{user.firstName[0]}</span>
      </div>
      <div className={`${type === "mobile" ? "footer_email-mobile" : "footer_email"}`}>
        <h1 className=" font-semibold text-14 truncate text-gray-800">{`${user.firstName} ${user.lastName}`}</h1>
        <p className=" font-normal text-14 truncate text-gray-700">{user.email}</p>
      </div>
      <div className={`${type === "mobile" ? "footer_image-mobile" : "footer_image"}`} onClick={handleSignOut}>
        <Image src={"/icons/logout.svg"} alt="logout" fill />
      </div>
    </footer>
  );
};

export default Footer;
