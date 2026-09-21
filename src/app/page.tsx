"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { api, type Stats } from "@/lib/api";

const steps = [
  ["Pick the payee", "Choose the school, landlord or hospital from the directory."],
  ["Lock the money", "Funds sit in a smart contract that only that payee can open."],
  ["Get your receipt", "See the moment it is paid. Unclaimed money comes back to you."],
];

export default function Home() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    api
      .stats()
      .then(setStats)
      .catch(() => setStats(null));
  }, []);

  return (
    <div className="space-y-12">
      <section className="rounded-3xl bg-ink px-6 py-12 text-white sm:px-10">
        <p className="text-sm uppercase tracking-widest text-emerald-300">
          School fees · Rent · Hospital bills
        </p>
        <h1 className="mt-3 max-w-2xl text-4xl font-semibold leading-tight sm:text-5xl">
          Send money home. Be sure it is used right.
        </h1>
        <p className="mt-4 max-w-xl text-slate-300">
          RemitSure locks your payment for the exact school, landlord or hospital you choose. Only
          they can claim it. If they do not, it comes back to you. Every step has a public receipt
          on Stellar.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/send"
            className="rounded-full bg-brand px-6 py-3 font-medium text-ink hover:bg-brand-dark hover:text-white"
          >
            Send a payment
          </Link>
          <Link
            href="/payees/register"
            className="rounded-full border border-slate-500 px-6 py-3 hover:bg-ink-soft"
          >
            I receive payments
          </Link>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        {steps.map(([title, body], i) => (
          <div key={title} className="rounded-2xl border border-line bg-card p-5">
            <span className="text-sm font-semibold text-brand-dark">0{i + 1}</span>
            <h3 className="mt-2 font-semibold">{title}</h3>
            <p className="mt-1 text-sm text-muted">{body}</p>
          </div>
        ))}
      </section>

      {stats && (
        <section className="grid gap-4 sm:grid-cols-4">
          <Stat label="Payments sent" value={stats.remittances} />
          <Stat label="Paid to payees" value={stats.claimed} />
          <Stat label="Waiting to be claimed" value={stats.pending} />
          <Stat label="Payees" value={`${stats.payees} (${stats.verifiedPayees} verified)`} />
        </section>
      )}

      <section className="rounded-2xl border border-line bg-card p-6">
        <h2 className="text-lg font-semibold">Why not just send cash?</h2>
        <p className="mt-2 text-muted">
          Money sent for a specific bill too often ends up somewhere else, and the person who sent
          it only finds out when the school calls. With RemitSure the money can only go to the payee
          you picked, you see exactly when it was paid, and nobody in between can redirect it.
        </p>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-2xl border border-line bg-card p-4">
      <p className="text-sm text-muted">{label}</p>
      <p className="mt-1 text-xl font-semibold">{value}</p>
    </div>
  );
}
