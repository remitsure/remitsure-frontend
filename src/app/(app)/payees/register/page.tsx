"use client";

import Link from "next/link";
import { useState } from "react";
import { Notice } from "@/components/Notice";
import { useWallet } from "@/components/WalletProvider";
import type { PayeeCategory } from "@/lib/api";
import { remitsure } from "@/lib/contract";
import { categoryLabels } from "@/lib/format";

export default function RegisterPayee() {
  const { address, connect } = useWallet();
  const [name, setName] = useState("");
  const [category, setCategory] = useState<PayeeCategory>("SCHOOL");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!address) return connect();
    setBusy(true);
    setError(null);
    try {
      await remitsure.registerPayee(address, name.trim(), category);
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <div className="mx-auto max-w-lg space-y-4">
        <h1 className="text-3xl font-semibold">You are registered</h1>
        <Notice tone="success">
          {name} can now receive payments. The RemitSure team will review it for the verified badge.
        </Notice>
        <Link href="/dashboard" className="inline-block rounded-full bg-ink px-5 py-2 text-white">
          Go to your dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="text-3xl font-semibold">Register as a payee</h1>
      <p className="mt-2 text-muted">
        For schools, landlords, hospitals and utilities. Your connected wallet becomes the only
        place payments to you can be claimed.
      </p>

      <form onSubmit={submit} className="mt-8 space-y-6 rounded-2xl border border-line bg-card p-6">
        <label className="block">
          <span className="text-sm font-medium">Name senders will see</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={64}
            placeholder="Greenfield College, Ibadan"
            className="mt-1 w-full rounded-lg border border-line px-3 py-2"
            required
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium">Category</span>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as PayeeCategory)}
            className="mt-1 w-full rounded-lg border border-line px-3 py-2"
          >
            {Object.entries(categoryLabels).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
        </label>

        {error && <Notice tone="error">{error}</Notice>}

        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-full bg-ink py-3 font-medium text-white disabled:opacity-60"
        >
          {!address ? "Connect wallet to continue" : busy ? "Confirm in Freighter..." : "Register"}
        </button>
      </form>
    </div>
  );
}
