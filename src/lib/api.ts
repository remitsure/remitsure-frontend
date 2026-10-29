import { config } from "./config";

export type PayeeCategory = "SCHOOL" | "LANDLORD" | "HOSPITAL" | "UTILITY" | "OTHER";
export type RemittanceStatus = "PENDING" | "CLAIMED" | "REJECTED" | "REFUNDED";

export interface Payee {
  address: string;
  name: string;
  category: PayeeCategory;
  verified: boolean;
  registeredAt: string;
}

export interface Remittance {
  id: number;
  sender: string;
  payee: string;
  token: string;
  amount: string;
  reference: string;
  expiresAt: string;
  status: RemittanceStatus;
  sentAt: string;
  sentTx: string;
  settledAt: string | null;
  settledTx: string | null;
}

export interface RemittanceDetail extends Remittance {
  payeeProfile: Payee | null;
}

export interface Stats {
  remittances: number;
  pending: number;
  claimed: number;
  payees: number;
  verifiedPayees: number;
}

export class NotFoundError extends Error {}

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${config.apiUrl}${path}`, { cache: "no-store" });
  if (res.status === 404) throw new NotFoundError(path);
  if (!res.ok) throw new Error(`API ${res.status} on ${path}`);
  return res.json() as Promise<T>;
}

function qs(params: Record<string, string | undefined>) {
  const q = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) if (v) q.set(k, v);
  const s = q.toString();
  return s ? `?${s}` : "";
}

export const api = {
  payees: (p: { q?: string; category?: PayeeCategory } = {}) =>
    get<{ items: Payee[] }>(`/payees${qs(p)}`).then((r) => r.items),
  payee: (address: string) => get<Payee>(`/payees/${address}`),
  remittances: (p: { sender?: string; payee?: string; status?: RemittanceStatus }) =>
    get<{ items: Remittance[] }>(`/remittances${qs(p)}`).then((r) => r.items),
  remittance: (id: number) => get<RemittanceDetail>(`/remittances/${id}`),
  stats: () => get<Stats>("/stats"),
};
