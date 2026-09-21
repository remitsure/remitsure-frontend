"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { VerifiedBadge } from "@/components/Badges";
import { Notice } from "@/components/Notice";
import { RemittanceRow } from "@/components/RemittanceRow";
import { useWallet } from "@/components/WalletProvider";
import { api, NotFoundError, type Payee, type Remittance } from "@/lib/api";
import { shortAddress } from "@/lib/format";

interface Data {
  address: string;
  sent: Remittance[];
  received: Remittance[];
  profile: Payee | null;
  names: Record<string, string>;
}

export default function Dashboard() {
  const { address, connect } = useWallet();
  const [data, setData] = useState<Data | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!address) return;
    Promise.all([
      api.remittances({ sender: address }),
      api.remittances({ payee: address }),
      api.payee(address).catch((e) => (e instanceof NotFoundError ? null : Promise.reject(e))),
      api.payees(),
    ])
      .then(([sent, received, profile, payees]) => {
        const names = Object.fromEntries(payees.map((p) => [p.address, p.name]));
        setData({ address, sent, received, profile, names });
        setError(null);
      })
      .catch(() => setError("Could not reach the RemitSure API. It may be waking up."));
  }, [address]);

  if (!address) {
    return (
      <div className="mx-auto max-w-lg space-y-4 text-center">
        <h1 className="text-3xl font-semibold">Your dashboard</h1>
        <p className="text-muted">
          Connect your wallet to see what you have sent and what is waiting for you.
        </p>
        <button onClick={connect} className="rounded-full bg-ink px-6 py-3 text-white">
          Connect wallet
        </button>
      </div>
    );
  }

  const current = data?.address === address ? data : null;
  const waiting = current?.received.filter((r) => r.status === "PENDING") ?? [];

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold">Your dashboard</h1>
          <p className="font-mono text-sm text-muted">{shortAddress(address, 6)}</p>
        </div>
        {current?.profile ? (
          <span className="flex items-center gap-2 rounded-full border border-line bg-card px-4 py-1.5 text-sm">
            Payee: {current.profile.name} <VerifiedBadge verified={current.profile.verified} />
          </span>
        ) : (
          <Link href="/payees/register" className="text-sm text-brand-dark underline">
            Receive payments? Register as a payee
          </Link>
        )}
      </div>

      {error && <Notice tone="error">{error}</Notice>}
      {!error && !current && <Notice>Loading...</Notice>}

      {current && (current.profile || current.received.length > 0) && (
        <Section
          title={`Payments to you${waiting.length ? ` (${waiting.length} waiting to claim)` : ""}`}
          empty="Nothing sent to you yet."
          items={current.received}
          counterparty={(r) => `from ${shortAddress(r.sender)}`}
        />
      )}

      {current && (
        <Section
          title="Payments you sent"
          empty="You have not sent anything yet."
          items={current.sent}
          counterparty={(r) => `to ${current.names[r.payee] ?? shortAddress(r.payee)}`}
          action={
            <Link href="/send" className="text-sm text-brand-dark underline">
              Send a payment
            </Link>
          }
        />
      )}
    </div>
  );
}

function Section({
  title,
  empty,
  items,
  counterparty,
  action,
}: {
  title: string;
  empty: string;
  items: Remittance[];
  counterparty: (r: Remittance) => string;
  action?: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-line bg-card">
      <div className="flex items-center justify-between border-b border-line px-5 py-3">
        <h2 className="font-semibold">{title}</h2>
        {action}
      </div>
      {items.length === 0 ? (
        <p className="px-5 py-4 text-sm text-muted">{empty}</p>
      ) : (
        items.map((r) => <RemittanceRow key={r.id} r={r} counterparty={counterparty(r)} />)
      )}
    </section>
  );
}
