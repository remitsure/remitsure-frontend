/** Stellar assets use 7 decimal places. */
export const DECIMALS = 7;

/** "12.5" -> 125000000n. Throws on anything that is not a positive decimal. */
export function toUnits(amount: string, decimals = DECIMALS): bigint {
  const trimmed = amount.trim();
  if (!/^\d+(\.\d+)?$/.test(trimmed)) throw new Error("Enter a positive number");
  const [whole = "0", frac = ""] = trimmed.split(".");
  if (frac.length > decimals) throw new Error(`At most ${decimals} decimal places`);
  return BigInt(whole) * 10n ** BigInt(decimals) + BigInt(frac.padEnd(decimals, "0"));
}

/** 125000000n -> "12.5" */
export function fromUnits(units: bigint | string, decimals = DECIMALS): string {
  const v = BigInt(units);
  const base = 10n ** BigInt(decimals);
  const whole = v / base;
  const frac = (v % base).toString().padStart(decimals, "0").replace(/0+$/, "");
  return frac ? `${whole}.${frac}` : whole.toString();
}

export function shortAddress(addr: string, chars = 4): string {
  if (addr.length <= chars * 2 + 3) return addr;
  return `${addr.slice(0, chars)}...${addr.slice(-chars)}`;
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
}

/** "in 3 days", "2 hours ago" */
export function relativeTime(iso: string, now = Date.now()): string {
  const diff = new Date(iso).getTime() - now;
  const abs = Math.abs(diff);
  const units: [Intl.RelativeTimeFormatUnit, number][] = [
    ["day", 86_400_000],
    ["hour", 3_600_000],
    ["minute", 60_000],
  ];
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  for (const [unit, ms] of units) {
    if (abs >= ms || unit === "minute") return rtf.format(Math.round(diff / ms), unit);
  }
  return "";
}

export const categoryLabels = {
  SCHOOL: "School",
  LANDLORD: "Landlord",
  HOSPITAL: "Hospital",
  UTILITY: "Utility",
  OTHER: "Other",
} as const;
