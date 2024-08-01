import Image from "next/image";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="flex w-full min-h-screen justify-center">
      {children}
      <div className="auth-asset">
        <Image src={"/icons/auth-image.svg"} alt="auth-iamge" width={500} height={500} />
      </div>
    </main>
  );
}
