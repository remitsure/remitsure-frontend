"use client";

import Link from "next/link";
import { shortAddress } from "@/lib/format";
import { useWallet } from "./WalletProvider";

const links = [
  ["/send", "Send"],
  ["/payees", "Payees"],
  ["/dashboard", "Dashboard"],
] as const;

export function Header() {
  const { address, connecting, error, connect, disconnect } = useWallet();

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-card/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.svg" alt="" width={32} height={32} className="h-8 w-8" />
          RemitSure
        </Link>
        <nav className="flex items-center gap-4">
          {links.map(([href, label]) => (
            <Link
              key={href}
              href={href}
              className="hidden text-sm font-medium text-muted transition hover:text-ink sm:block"
            >
              {label}
            </Link>
          ))}
          {address ? (
            <button
              onClick={disconnect}
              className="rounded-full border border-line px-4 py-1.5 font-mono text-sm hover:bg-paper"
              title="Disconnect"
            >
              {shortAddress(address)}
            </button>
          ) : (
            <button
              onClick={connect}
              disabled={connecting}
              className="rounded-full bg-ink px-4 py-1.5 text-sm text-white disabled:opacity-60"
            >
              {connecting ? "Connecting..." : "Connect wallet"}
            </button>
          )}
        </nav>
      </div>
      <nav className="flex justify-center gap-6 border-t border-line py-2 text-sm sm:hidden">
        {links.map(([href, label]) => (
          <Link key={href} href={href} className="text-muted">
            {label}
          </Link>
        ))}
      </nav>
      {error && (
        <p className="bg-red-50 px-4 py-2 text-center text-sm text-red-700" role="alert">
          {error}
        </p>
      )}
    </header>
  );
}
