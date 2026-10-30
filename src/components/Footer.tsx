import Link from "next/link";

const repos = [
  ["Contracts", "https://github.com/remitsure/remitsure-contracts"],
  ["Backend", "https://github.com/remitsure/remitsure-backend"],
  ["Frontend", "https://github.com/remitsure/remitsure-frontend"],
] as const;

export function Footer() {
  return (
    <footer className="mt-20 border-t border-line bg-card">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-3 sm:px-6">
        <div>
          <div className="flex items-center gap-2 font-semibold">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.svg" alt="" width={28} height={28} />
            RemitSure
          </div>
          <p className="mt-2 text-sm text-muted">
            Send money home for a purpose, and be sure it is used for it.
          </p>
        </div>
        <div className="text-sm">
          <p className="font-medium">Product</p>
          <ul className="mt-2 space-y-1 text-muted">
            <li>
              <Link href="/send" className="hover:text-ink">
                Send a payment
              </Link>
            </li>
            <li>
              <Link href="/payees" className="hover:text-ink">
                Payee directory
              </Link>
            </li>
            <li>
              <Link href="/payees/register" className="hover:text-ink">
                Register as a payee
              </Link>
            </li>
          </ul>
        </div>
        <div className="text-sm">
          <p className="font-medium">Open source</p>
          <ul className="mt-2 space-y-1 text-muted">
            {repos.map(([label, href]) => (
              <li key={href}>
                <a href={href} target="_blank" rel="noreferrer" className="hover:text-ink">
                  {label} on GitHub
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <p className="border-t border-line py-4 text-center text-xs text-muted">
        Running on Stellar testnet. Not audited, do not use real funds yet.
      </p>
    </footer>
  );
}
