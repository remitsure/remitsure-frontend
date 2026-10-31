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

// The hosted API sleeps when idle and answers with network errors or 5xx while it
// wakes up, so those are retried with backoff. 4xx responses are final.
const RETRY_DELAYS_MS = [2_000, 4_000, 8_000, 16_000];

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function get<T>(path: string, delays: number[] = RETRY_DELAYS_MS): Promise<T> {
  for (let attempt = 0; ; attempt++) {
    let res: Response | undefined;
    try {
      res = await fetch(`${config.apiUrl}${path}`, { cache: "no-store" });
    } catch (err) {
      if (attempt >= delays.length) throw err;
    }
    if (res) {
      if (res.status === 404) throw new NotFoundError(path);
      if (res.ok) return res.json() as Promise<T>;
      if (res.status < 500 || attempt >= delays.length) {
        throw new Error(`API ${res.status} on ${path}`);
      }
    }
    await sleep(delays[attempt] ?? 0);
  }
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
