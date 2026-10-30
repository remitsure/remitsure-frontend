import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { WalletProvider } from "@/components/WalletProvider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "RemitSure | Send money home for a purpose",
  description:
    "Send money for school fees, rent or hospital bills and be sure it is used for it. Funds are locked for the payee you choose, and refunded if they are not claimed.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="flex min-h-screen flex-col overflow-x-hidden font-sans antialiased">
        <WalletProvider>
          <Header />
          <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-8 sm:px-6">{children}</main>
          <Footer />
        </WalletProvider>
      </body>
    </html>
  );
}
