import { CheckIcon, LockIcon, ReturnIcon } from "./Icons";

/** Static product preview for the hero. Mirrors the real receipt page. */
export function HeroReceipt() {
  return (
    <div className="relative mx-auto w-full max-w-sm">
      <div className="absolute -inset-6 rounded-[2rem] bg-emerald-400/20 blur-3xl" aria-hidden />
      <div className="relative rotate-1 rounded-3xl bg-white p-6 text-ink shadow-2xl shadow-black/30">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted">Receipt #1042</span>
          <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 font-medium text-emerald-800">
            Paid to payee
          </span>
        </div>
        <p className="mt-4 text-4xl font-semibold tracking-tight">
          250 <span className="text-xl text-muted">USDC</span>
        </p>
        <p className="mt-1 text-sm text-muted">Term 1 fees, Ada Obi, JSS2</p>

        <div className="mt-5 flex items-center justify-between rounded-2xl bg-paper px-4 py-3">
          <div>
            <p className="text-xs uppercase tracking-wide text-muted">Paid to</p>
            <p className="font-medium">Greenfield College</p>
          </div>
          <span className="flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800">
            <CheckIcon className="h-3 w-3" /> Verified
          </span>
        </div>

        <ol className="mt-5 space-y-3 text-sm">
          <Step done label="Locked in contract" sub="From London, 2 Sep" />
          <Step done label="Claimed by Greenfield College" sub="Ibadan, 4 Sep" />
        </ol>
      </div>

      <div className="absolute -bottom-6 -left-4 flex rotate-[-3deg] items-center gap-2 rounded-2xl bg-ink-soft px-4 py-3 text-sm text-white shadow-xl ring-1 ring-white/10 sm:-left-10">
        <ReturnIcon className="h-4 w-4 text-emerald-300" />
        Not claimed in 30 days? It comes back.
      </div>
      <div className="absolute -right-3 -top-5 flex rotate-[4deg] items-center gap-2 rounded-2xl bg-amber-300 px-3 py-2 text-xs font-semibold text-ink shadow-lg sm:-right-8">
        <LockIcon className="h-4 w-4" /> Only the school can claim
      </div>
    </div>
  );
}

function Step({ label, sub, done }: { label: string; sub: string; done?: boolean }) {
  return (
    <li className="flex items-start gap-3">
      <span
        className={`mt-0.5 grid h-5 w-5 place-items-center rounded-full ${done ? "bg-brand text-white" : "bg-line"}`}
      >
        <CheckIcon className="h-3 w-3" />
      </span>
      <span>
        <span className="block font-medium">{label}</span>
        <span className="block text-xs text-muted">{sub}</span>
      </span>
    </li>
  );
}
