"use client";

import { useEffect, useState } from "react";
import { api, type Stats } from "@/lib/api";

/** Live numbers from the indexer. Renders nothing if the API is unreachable. */
export function LiveStats() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    api
      .stats()
      .then(setStats)
      .catch(() => setStats(null));
  }, []);

  if (!stats) return null;

  const items = [
    ["Payments locked", stats.remittances],
    ["Paid to payees", stats.claimed],
    ["Waiting to be claimed", stats.pending],
    ["Payees in directory", stats.payees],
  ] as const;

  return (
    <section className="rounded-3xl border border-line bg-card px-6 py-6">
      <div className="mb-4 flex items-center gap-2 text-sm text-muted">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-brand" />
        </span>
        Live from the Stellar testnet contract
      </div>
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
        {items.map(([label, value]) => (
          <div key={label}>
            <p className="text-3xl font-semibold tracking-tight">{value}</p>
            <p className="text-sm text-muted">{label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
