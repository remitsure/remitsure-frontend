import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { WalletProvider } from "@/components/WalletProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "RemitSure | Send money home for a purpose",
  description:
    "Send money for school fees, rent or hospital bills and be sure it is used for it. Funds are locked for the payee you choose, and refunded if they are not claimed.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen font-sans antialiased">
        <WalletProvider>
          <Header />
          <main className="mx-auto max-w-5xl px-4 pb-16 pt-6 sm:px-6">{children}</main>
        </WalletProvider>
      </body>
    </html>
  );
}
