"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CategoryTag, VerifiedBadge } from "@/components/Badges";
import { Notice } from "@/components/Notice";
import { api, type Payee, type PayeeCategory } from "@/lib/api";
import { categoryLabels, shortAddress } from "@/lib/format";

export default function Payees() {
  const [q, setQ] = useState("");
  const [category, setCategory] = useState<PayeeCategory | "">("");
  const [payees, setPayees] = useState<Payee[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const t = setTimeout(() => {
      api
        .payees({ q: q.trim() || undefined, category: category || undefined })
        .then((items) => {
          setPayees(items);
          setError(null);
        })
        .catch(() =>
          setError("Could not reach the RemitSure API. It may be waking up, try again shortly."),
        );
    }, 250);
    return () => clearTimeout(t);
  }, [q, category]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold">Payees</h1>
          <p className="mt-1 text-muted">
            Schools, landlords, hospitals and utilities you can pay.
          </p>
        </div>
        <Link
          href="/payees/register"
          className="rounded-full border border-line bg-card px-4 py-2 text-sm"
        >
          Register as a payee
        </Link>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by name"
          className="flex-1 rounded-lg border border-line bg-card px-3 py-2"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as PayeeCategory | "")}
          className="rounded-lg border border-line bg-card px-3 py-2"
        >
          <option value="">All categories</option>
          {Object.entries(categoryLabels).map(([k, v]) => (
            <option key={k} value={k}>
              {v}
            </option>
          ))}
        </select>
      </div>

      {error && <Notice tone="error">{error}</Notice>}
      {!error && payees === null && <Notice>Loading payees...</Notice>}
      {payees?.length === 0 && <Notice>No payees match that search.</Notice>}

      <div className="grid gap-4 sm:grid-cols-2">
        {payees?.map((p) => (
          <div key={p.address} className="rounded-2xl border border-line bg-card p-5">
            <div className="flex items-center justify-between">
              <CategoryTag category={p.category} />
              <VerifiedBadge verified={p.verified} />
            </div>
            <p className="mt-2 text-lg font-semibold">{p.name}</p>
            <p className="font-mono text-xs text-muted">{shortAddress(p.address, 6)}</p>
            <Link
              href={`/send?payee=${p.address}`}
              className="mt-4 inline-block rounded-full bg-ink px-4 py-1.5 text-sm text-white"
            >
              Pay {p.name.split(" ")[0]}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
