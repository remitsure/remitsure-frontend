"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CategoryTag, VerifiedBadge } from "@/components/Badges";
import { Notice } from "@/components/Notice";
import { useWallet } from "@/components/WalletProvider";
import { api, type Payee } from "@/lib/api";
import { config } from "@/lib/config";
import { remitsure } from "@/lib/contract";
import { shortAddress, toUnits } from "@/lib/format";

const deadlines = [
  { label: "10 minutes (demo)", secs: 600 },
  { label: "7 days", secs: 7 * 86_400 },
  { label: "14 days", secs: 14 * 86_400 },
  { label: "30 days", secs: 30 * 86_400 },
  { label: "90 days", secs: 90 * 86_400 },
];

export default function Send() {
  const router = useRouter();
  const { address, connect } = useWallet();
  const [payees, setPayees] = useState<Payee[]>([]);
  const [payee, setPayee] = useState("");
  const [amount, setAmount] = useState("");
  const [reference, setReference] = useState("");
  const [deadline, setDeadline] = useState(30 * 86_400);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const preselected = new URLSearchParams(window.location.search).get("payee");
    api
      .payees()
      .then((items) => {
        setPayees(items);
        if (preselected && items.some((p) => p.address === preselected)) setPayee(preselected);
      })
      .catch(() =>
        setError("Could not load payees. The API may be waking up, refresh in a minute."),
      );
  }, []);

  const selected = payees.find((p) => p.address === payee);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!address) return connect();
    setError(null);
    let units: bigint;
    try {
      units = toUnits(amount);
    } catch (err) {
      return setError(err instanceof Error ? err.message : "Invalid amount");
    }
    setBusy(true);
    try {
      const { value: id } = await remitsure.send(address, {
        payee,
        amount: units,
        reference: reference.trim(),
        expiresAt: Math.floor(Date.now() / 1000) + deadline,
      });
      router.push(`/r/${Number(id)}?new=1`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="text-3xl font-semibold">Send a payment</h1>
      <p className="mt-2 text-muted">
        The money is locked for the payee you choose. Only they can claim it before the deadline.
        After that, you can take it back.
      </p>

      <form onSubmit={submit} className="mt-8 space-y-6 rounded-2xl border border-line bg-card p-6">
        <label className="block">
          <span className="text-sm font-medium">Pay to</span>
          <select
            value={payee}
            onChange={(e) => setPayee(e.target.value)}
            className="mt-1 w-full rounded-lg border border-line px-3 py-2"
            required
          >
            <option value="" disabled>
              Choose a payee
            </option>
            {payees.map((p) => (
              <option key={p.address} value={p.address}>
                {p.name} {p.verified ? "(verified)" : ""}
              </option>
            ))}
          </select>
        </label>

        {selected && (
          <div className="flex items-center justify-between rounded-lg bg-paper px-3 py-2 text-sm">
            <span>
              <CategoryTag category={selected.category} />{" "}
              <span className="font-mono text-muted">{shortAddress(selected.address)}</span>
            </span>
            <VerifiedBadge verified={selected.verified} />
          </div>
        )}
        {selected && !selected.verified && (
          <Notice>
            This payee has not been verified yet. Make sure you know who they are before sending.
          </Notice>
        )}

        <label className="block">
          <span className="text-sm font-medium">Amount ({config.tokenSymbol})</span>
          <input
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            inputMode="decimal"
            placeholder="250"
            className="mt-1 w-full rounded-lg border border-line px-3 py-2"
            required
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium">What is it for?</span>
          <input
            value={reference}
            onChange={(e) => setReference(e.target.value)}
            maxLength={96}
            placeholder="Term 1 fees, Ada Obi, JSS2"
            className="mt-1 w-full rounded-lg border border-line px-3 py-2"
            required
          />
          <span className="mt-1 block text-xs text-muted">
            The payee sees this, so include names, class or invoice numbers.
          </span>
        </label>

        <label className="block">
          <span className="text-sm font-medium">Payee must claim within</span>
          <select
            value={deadline}
            onChange={(e) => setDeadline(Number(e.target.value))}
            className="mt-1 w-full rounded-lg border border-line px-3 py-2"
          >
            {deadlines.map((d) => (
              <option key={d.secs} value={d.secs}>
                {d.label}
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
          {!address
            ? "Connect wallet to continue"
            : busy
              ? "Confirm in Freighter..."
              : "Lock and send"}
        </button>
      </form>
    </div>
  );
}
