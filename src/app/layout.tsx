import "~/styles/globals.css";

import { Inter } from "next/font/google";
import { cookies } from "next/headers";

import { TRPCReactProvider } from "~/trpc/react";
import { Navbar } from "./_components/Navbar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "Skybook",
  description: "",
};

export const NAVBAR_HEIGHT_REM = "4rem";
export function getNavbarHeight() {
  return `h-${NAVBAR_HEIGHT_REM}`;
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`font-sans ${inter.variable}`}>
        <TRPCReactProvider cookies={cookies().toString()}>
          <main className={`min-h-screen w-full p-${NAVBAR_HEIGHT_REM} flex flex-col`}>
            <Navbar />
            {children}
          </main>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
