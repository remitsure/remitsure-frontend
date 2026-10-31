"use client";

import { useState } from "react";
import { UnfundedAccountError } from "@/lib/contract";
import { fundWithFriendbot } from "@/lib/wallet";
import { Notice } from "./Notice";

/** Shows a transaction error. A new, unfunded testnet wallet gets a one click fix. */
export function TxError({ error, onClear }: { error: unknown; onClear: () => void }) {
  const [funding, setFunding] = useState(false);
  const [fundError, setFundError] = useState<string | null>(null);

  if (error instanceof UnfundedAccountError) {
    async function fund() {
      setFunding(true);
      setFundError(null);
      try {
        await fundWithFriendbot((error as UnfundedAccountError).address);
        onClear();
      } catch (e) {
        setFundError(e instanceof Error ? e.message : "Could not fund the wallet");
      } finally {
        setFunding(false);
      }
    }
    return (
      <Notice tone="error">
        <p className="font-medium">Your wallet is new on Stellar testnet.</p>
        <p className="mt-1">
          It needs a little test XLM before it can send anything. This is free play money, not real
          funds.
        </p>
        <button
          type="button"
          onClick={fund}
          disabled={funding}
          className="mt-3 rounded-full bg-ink px-4 py-1.5 text-white disabled:opacity-60"
        >
          {funding ? "Funding..." : "Get free test XLM"}
        </button>
        {fundError && <p className="mt-2">{fundError}</p>}
      </Notice>
    );
  }

  const message = error instanceof Error ? error.message : String(error);
  return <Notice tone="error">{message}</Notice>;
}
