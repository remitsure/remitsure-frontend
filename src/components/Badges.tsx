import type { PayeeCategory, RemittanceStatus } from "@/lib/api";
import { categoryLabels } from "@/lib/format";

const statusStyle: Record<RemittanceStatus, string> = {
  PENDING: "bg-amber-100 text-amber-800",
  CLAIMED: "bg-emerald-100 text-emerald-800",
  REJECTED: "bg-slate-200 text-slate-700",
  REFUNDED: "bg-sky-100 text-sky-800",
};

const statusLabel: Record<RemittanceStatus, string> = {
  PENDING: "Waiting for payee",
  CLAIMED: "Paid to payee",
  REJECTED: "Rejected, refunded",
  REFUNDED: "Refunded to sender",
};

export function StatusBadge({ status }: { status: RemittanceStatus }) {
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyle[status]}`}>
      {statusLabel[status]}
    </span>
  );
}

export function VerifiedBadge({ verified }: { verified: boolean }) {
  return verified ? (
    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800">
      Verified
    </span>
  ) : (
    <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">
      Not verified
    </span>
  );
}

export function CategoryTag({ category }: { category: PayeeCategory }) {
  return (
    <span className="text-xs uppercase tracking-wide text-muted">{categoryLabels[category]}</span>
  );
}
