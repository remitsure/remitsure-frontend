"use client";

import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { CategoryTag, StatusBadge, VerifiedBadge } from "@/components/Badges";
import { Notice } from "@/components/Notice";
import { useWallet } from "@/components/WalletProvider";
import { api, NotFoundError, type RemittanceDetail } from "@/lib/api";
import { config, explorerAccount, explorerTx } from "@/lib/config";
import { remitsure } from "@/lib/contract";
import { formatDate, fromUnits, relativeTime, shortAddress } from "@/lib/format";

type Action = "claim" | "reject" | "refund";

const labels: Record<Action, string> = {
  claim: "Claim payment",
  reject: "Reject and refund sender",
  refund: "Take my money back",
};

export default function Receipt() {
  const { id: rawId } = useParams<{ id: string }>();
  const id = Number(rawId);
  const { address, connect } = useWallet();
  const [r, setR] = useState<RemittanceDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<Action | null>(null);
  const [lastTx, setLastTx] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  // Ticks with the refresh so the expired check and countdown stay current.
  const [now, setNow] = useState(() => Date.now());

  const load = useCallback(
    () =>
      api
        .remittance(id)
        .then((data) => {
          setR(data);
          setError(null);
        })
        .catch((e) =>
          setError(
            e instanceof NotFoundError
              ? "Receipt not found yet. If you just sent it, it will appear in a few seconds."
              : "Could not reach the RemitSure API. It may be waking up.",
          ),
        ),
    [id],
  );

  useEffect(() => {
    load();
    const t = setInterval(() => {
      setNow(Date.now());
      load();
    }, 8_000);
    return () => clearInterval(t);
  }, [load]);

  async function run(action: Action) {
    if (!address) return connect();
    setBusy(action);
    setError(null);
    try {
      const { hash } = await remitsure[action](address, id);
      setLastTx(hash);
      setTimeout(load, 4_000);
      setTimeout(load, 9_000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Transaction failed");
    } finally {
      setBusy(null);
    }
  }

  async function share() {
    await navigator.clipboard.writeText(window.location.href.split("?")[0]!);
    setCopied(true);
    setTimeout(() => setCopied(false), 2_000);
  }

  if (!r) return <Notice tone={error ? "error" : "info"}>{error ?? "Loading receipt..."}</Notice>;

  const expired = new Date(r.expiresAt).getTime() <= now;
  const pending = r.status === "PENDING";
  const actions: Action[] = [];
  if (pending && address === r.payee && !expired) actions.push("claim", "reject");
  if (pending && address === r.payee && expired) actions.push("reject");
  if (pending && address === r.sender && expired) actions.push("refund");

  const payeeName = r.payeeProfile?.name ?? shortAddress(r.payee);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="rounded-3xl border border-line bg-card p-6 sm:p-8">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted">Receipt #{r.id}</span>
          <StatusBadge status={r.status} />
        </div>
        <p className="mt-4 text-4xl font-semibold">
          {fromUnits(r.amount)} <span className="text-2xl text-muted">{config.tokenSymbol}</span>
        </p>
        <p className="mt-1 text-lg">for {r.reference || "no reference given"}</p>

        <dl className="mt-6 grid gap-4 border-t border-line pt-6 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-muted">Paid to</dt>
            <dd className="mt-1 font-medium">{payeeName}</dd>
            {r.payeeProfile && (
              <dd className="mt-1 flex items-center gap-2">
                <CategoryTag category={r.payeeProfile.category} />
                <VerifiedBadge verified={r.payeeProfile.verified} />
              </dd>
            )}
          </div>
          <div>
            <dt className="text-muted">Sent by</dt>
            <dd className="mt-1">
              <a
                href={explorerAccount(r.sender)}
                target="_blank"
                rel="noreferrer"
                className="font-mono underline"
              >
                {shortAddress(r.sender, 6)}
              </a>
            </dd>
          </div>
          <div>
            <dt className="text-muted">Sent</dt>
            <dd className="mt-1">{formatDate(r.sentAt)}</dd>
          </div>
          <div>
            <dt className="text-muted">{pending ? "Claim deadline" : "Settled"}</dt>
            <dd className="mt-1">
              {pending
                ? `${formatDate(r.expiresAt)} (${relativeTime(r.expiresAt, now)})`
                : r.settledAt
                  ? formatDate(r.settledAt)
                  : ""}
            </dd>
          </div>
        </dl>

        <ol className="mt-6 space-y-2 border-t border-line pt-6 text-sm">
          <li>
            Locked in contract.{" "}
            <a
              href={explorerTx(r.sentTx)}
              target="_blank"
              rel="noreferrer"
              className="text-brand-dark underline"
            >
              View transaction
            </a>
          </li>
          {r.settledTx && (
            <li>
              {r.status === "CLAIMED" && `Claimed by ${payeeName}.`}
              {r.status === "REJECTED" && `Rejected by ${payeeName}, sender refunded.`}
              {r.status === "REFUNDED" && "Not claimed in time, refunded to sender."}{" "}
              <a
                href={explorerTx(r.settledTx)}
                target="_blank"
                rel="noreferrer"
                className="text-brand-dark underline"
              >
                View transaction
              </a>
            </li>
          )}
        </ol>
      </div>

      {error && <Notice tone="error">{error}</Notice>}
      {lastTx && (
        <Notice tone="success">
          Transaction confirmed.{" "}
          <a href={explorerTx(lastTx)} target="_blank" rel="noreferrer" className="underline">
            View on Stellar Expert
          </a>
        </Notice>
      )}
      {pending && address === r.sender && !expired && (
        <Notice>
          Waiting for {payeeName} to claim. If they have not claimed by the deadline, you can take
          the money back here.
        </Notice>
      )}

      <div className="flex flex-wrap gap-3">
        {!address && pending && (
          <button onClick={connect} className="rounded-full bg-ink px-5 py-2 text-white">
            Connect wallet to act on this
          </button>
        )}
        {actions.map((a) => (
          <button
            key={a}
            onClick={() => run(a)}
            disabled={busy !== null}
            className={
              a === "reject"
                ? "rounded-full border border-line bg-card px-5 py-2 disabled:opacity-60"
                : "rounded-full bg-ink px-5 py-2 text-white disabled:opacity-60"
            }
          >
            {busy === a ? "Confirm in Freighter..." : labels[a]}
          </button>
        ))}
        <button onClick={share} className="rounded-full border border-line bg-card px-5 py-2">
          {copied ? "Link copied" : "Copy receipt link"}
        </button>
      </div>
    </div>
  );
}
