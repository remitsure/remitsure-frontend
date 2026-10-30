import Link from "next/link";
import { HeroReceipt } from "@/components/HeroReceipt";
import {
  ArrowIcon,
  BoltIcon,
  CheckIcon,
  HomeIcon,
  HospitalIcon,
  LockIcon,
  ReceiptIcon,
  SchoolIcon,
  SearchIcon,
  XIcon,
} from "@/components/Icons";
import { LiveStats } from "@/components/LiveStats";

const useCases = [
  {
    icon: SchoolIcon,
    title: "School fees",
    body: "Pay the school directly, with the student's name and class on the receipt.",
    tint: "bg-sky-100 text-sky-700",
  },
  {
    icon: HomeIcon,
    title: "Rent",
    body: "Lock next year's rent for the landlord. Nobody in between can spend it first.",
    tint: "bg-amber-100 text-amber-700",
  },
  {
    icon: HospitalIcon,
    title: "Hospital bills",
    body: "Settle a family member's bill with the hospital, even from another continent.",
    tint: "bg-rose-100 text-rose-700",
  },
  {
    icon: BoltIcon,
    title: "Utilities",
    body: "Cover electricity, water or internet for parents back home.",
    tint: "bg-violet-100 text-violet-700",
  },
];

const steps = [
  {
    icon: SearchIcon,
    title: "Pick the payee",
    body: "Search the directory for the school, landlord or hospital. Verified payees carry a badge.",
  },
  {
    icon: LockIcon,
    title: "Lock the money",
    body: "Funds move into a smart contract that only that payee can open, with a deadline you choose.",
  },
  {
    icon: ReceiptIcon,
    title: "Get your receipt",
    body: "See the moment it is claimed. If it is not claimed in time, you take it back.",
  },
];

const cash = [
  "Money can be spent on something else",
  "You find out only when the school calls",
  "No proof the bill was paid",
  "If it goes missing, it is gone",
];

const remitsure = [
  "Only the payee you picked can claim it",
  "You see the exact moment it is paid",
  "A public receipt for every payment",
  "Unclaimed money comes back to you",
];

const faqs = [
  [
    "Does the school or landlord need to understand crypto?",
    "They need a Stellar wallet to claim. Cashing out to local currency through a Stellar anchor is the next thing on our roadmap, so payees can receive naira, cedis or shillings directly.",
  ],
  [
    "What if the payee never claims the money?",
    "Every payment has a deadline. After it passes, the sender can take the full amount back from the contract. Nobody else can touch it.",
  ],
  [
    "Who verifies payees?",
    "Any school or landlord can register. The RemitSure team checks them off chain and adds a verified badge. Senders are warned before paying an unverified payee.",
  ],
  [
    "Can RemitSure take or freeze my money?",
    "No. The admin can only add or remove the verified badge. Funds can only go to the named payee, or back to the sender.",
  ],
];

export default function Home() {
  return (
    <div className="space-y-24">
      {/* Hero */}
      <section className="relative -mx-4 overflow-hidden bg-ink px-4 pb-20 pt-14 text-white sm:-mx-6 sm:rounded-b-[2.5rem] sm:px-10">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)",
            backgroundSize: "44px 44px",
          }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-emerald-500/25 blur-3xl"
          aria-hidden
        />
        <div className="relative grid items-center gap-16 lg:grid-cols-[1.15fr_1fr]">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-emerald-200">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Live on Stellar testnet
            </span>
            <h1 className="mt-6 text-4xl font-semibold leading-[1.1] tracking-tight sm:text-6xl">
              Send money home.{" "}
              <span className="bg-gradient-to-r from-emerald-300 to-teal-200 bg-clip-text text-transparent">
                Be sure it is used right.
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-slate-300">
              RemitSure locks your payment for the exact school, landlord or hospital you choose.
              Only they can claim it. If they do not, it comes back to you.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/send"
                className="group inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 font-medium text-ink transition hover:bg-emerald-300"
              >
                Send a payment
                <ArrowIcon className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/payees/register"
                className="rounded-full border border-white/20 px-6 py-3 transition hover:bg-white/10"
              >
                I receive payments
              </Link>
            </div>
            <div className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-400">
              {["Non custodial", "Open source", "Refund if unclaimed"].map((t) => (
                <span key={t} className="flex items-center gap-1.5">
                  <CheckIcon className="h-4 w-4 text-emerald-400" /> {t}
                </span>
              ))}
            </div>
          </div>
          <div className="pb-6 pt-4 lg:pt-0">
            <HeroReceipt />
          </div>
        </div>
      </section>

      <LiveStats />

      {/* Use cases */}
      <section>
        <SectionTitle
          eyebrow="What it is for"
          title="For the bills that matter most"
          sub="Money sent home for a purpose should reach that purpose."
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {useCases.map(({ icon: Icon, title, body, tint }) => (
            <div
              key={title}
              className="rounded-3xl border border-line bg-card p-6 transition hover:-translate-y-1 hover:shadow-lg"
            >
              <span className={`grid h-11 w-11 place-items-center rounded-2xl ${tint}`}>
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="mt-5 font-semibold">{title}</h3>
              <p className="mt-1 text-sm text-muted">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section>
        <SectionTitle eyebrow="How it works" title="Three steps, no middleman" />
        <div className="relative mt-12 grid gap-10 md:grid-cols-3">
          <div
            className="absolute left-[16%] right-[16%] top-7 hidden border-t-2 border-dashed border-line md:block"
            aria-hidden
          />
          {steps.map(({ icon: Icon, title, body }, i) => (
            <div key={title} className="relative text-center">
              <span className="relative mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-ink text-emerald-300 shadow-lg">
                <Icon className="h-6 w-6" />
                <span className="absolute -right-2 -top-2 grid h-6 w-6 place-items-center rounded-full bg-brand text-xs font-bold text-ink">
                  {i + 1}
                </span>
              </span>
              <h3 className="mt-5 text-lg font-semibold">{title}</h3>
              <p className="mx-auto mt-2 max-w-xs text-sm text-muted">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Comparison */}
      <section>
        <SectionTitle eyebrow="Why RemitSure" title="Sending cash vs sending with RemitSure" />
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          <div className="rounded-3xl border border-line bg-card p-7">
            <p className="font-semibold text-muted">Sending cash to a relative</p>
            <ul className="mt-5 space-y-3">
              {cash.map((t) => (
                <li key={t} className="flex gap-3 text-muted">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-rose-100 text-rose-600">
                    <XIcon className="h-3.5 w-3.5" />
                  </span>
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl bg-ink p-7 text-white shadow-xl">
            <p className="font-semibold text-emerald-300">Sending with RemitSure</p>
            <ul className="mt-5 space-y-3">
              {remitsure.map((t) => (
                <li key={t} className="flex gap-3">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand text-ink">
                    <CheckIcon className="h-3.5 w-3.5" />
                  </span>
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl">
        <SectionTitle eyebrow="Questions" title="Good to know" />
        <div className="mt-10 divide-y divide-line rounded-3xl border border-line bg-card">
          {faqs.map(([q, a]) => (
            <details key={q} className="group px-6 py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium">
                {q}
                <span className="text-xl text-muted transition group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-muted">{a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Closing CTA */}
      <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-emerald-400 to-teal-500 px-8 py-14 text-center text-ink">
        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Your next transfer home can come with a receipt.
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-ink/80">
          Try the full flow on testnet in two minutes with a free Freighter wallet.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/send" className="rounded-full bg-ink px-6 py-3 font-medium text-white">
            Send a payment
          </Link>
          <Link href="/payees" className="rounded-full bg-white/70 px-6 py-3 font-medium">
            Browse payees
          </Link>
        </div>
      </section>
    </div>
  );
}

function SectionTitle({ eyebrow, title, sub }: { eyebrow: string; title: string; sub?: string }) {
  return (
    <div className="text-center">
      <p className="text-sm font-semibold uppercase tracking-widest text-brand-dark">{eyebrow}</p>
      <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h2>
      {sub && <p className="mx-auto mt-3 max-w-xl text-muted">{sub}</p>}
    </div>
  );
}
