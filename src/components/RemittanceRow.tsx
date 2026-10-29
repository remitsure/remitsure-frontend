import Link from "next/link";
import type { Remittance } from "@/lib/api";
import { config } from "@/lib/config";
import { fromUnits, relativeTime, shortAddress } from "@/lib/format";
import { StatusBadge } from "./Badges";

export function RemittanceRow({ r, counterparty }: { r: Remittance; counterparty: string }) {
  return (
    <Link
      href={`/r/${r.id}`}
      className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-4 last:border-0 hover:bg-paper"
    >
      <div className="min-w-0">
        <p className="truncate font-medium">{r.reference || "No reference"}</p>
        <p className="text-sm text-muted">
          #{r.id} · {counterparty || shortAddress(r.payee)} · sent {relativeTime(r.sentAt)}
        </p>
      </div>
      <div className="flex items-center gap-3">
        <span className="font-semibold">
          {fromUnits(r.amount)} {config.tokenSymbol}
        </span>
        <StatusBadge status={r.status} />
      </div>
    </Link>
  );
}
