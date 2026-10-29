import {
  Address,
  BASE_FEE,
  Contract,
  TransactionBuilder,
  nativeToScVal,
  rpc,
  scValToNative,
  xdr,
} from "@stellar/stellar-sdk";
import type { PayeeCategory } from "./api";
import { config, networkPassphrase } from "./config";
import { signTransaction } from "./wallet";

const addr = (a: string) => new Address(a).toScVal();
const u64 = (n: number | bigint) => nativeToScVal(n, { type: "u64" });
const i128 = (n: bigint) => nativeToScVal(n, { type: "i128" });
const str = (s: string) => nativeToScVal(s, { type: "string" });

const categoryVariant: Record<PayeeCategory, string> = {
  SCHOOL: "School",
  LANDLORD: "Landlord",
  HOSPITAL: "Hospital",
  UTILITY: "Utility",
  OTHER: "Other",
};
/** Unit enum variants are encoded as a one element vec holding the variant name. */
const category = (c: PayeeCategory) => xdr.ScVal.scvVec([xdr.ScVal.scvSymbol(categoryVariant[c])]);

export interface TxResult<T = unknown> {
  hash: string;
  value: T;
}

/** Build, simulate, sign in Freighter, submit and wait. */
async function invoke<T>(source: string, method: string, args: xdr.ScVal[]): Promise<TxResult<T>> {
  if (!config.contractId) throw new Error("NEXT_PUBLIC_REMITSURE_CONTRACT_ID is not set");
  const server = new rpc.Server(config.rpcUrl);
  const account = await server.getAccount(source);
  const tx = new TransactionBuilder(account, { fee: BASE_FEE, networkPassphrase })
    .addOperation(new Contract(config.contractId).call(method, ...args))
    .setTimeout(60)
    .build();

  const prepared = await server.prepareTransaction(tx).catch((e: unknown) => {
    throw new Error(friendlySimulationError(e));
  });
  const signed = await signTransaction(prepared.toXDR(), source);
  const sent = await server.sendTransaction(TransactionBuilder.fromXDR(signed, networkPassphrase));
  if (sent.status === "ERROR") {
    throw new Error("The network rejected the transaction. Check your balance and try again.");
  }

  const final = await server.pollTransaction(sent.hash, { attempts: 30 });
  if (final.status !== rpc.Api.GetTransactionStatus.SUCCESS) {
    throw new Error(`Transaction ${final.status.toLowerCase()}`);
  }
  const value = final.returnValue ? (scValToNative(final.returnValue) as T) : (undefined as T);
  return { hash: sent.hash, value };
}

// Mirrors contracts/remittance/src/errors.rs
const contractErrors: Record<number, string> = {
  1: "That payment does not exist.",
  2: "That payee is not registered.",
  3: "This wallet is already registered as a payee.",
  4: "Name must be 1 to 64 characters.",
  5: "Amount must be more than zero.",
  6: "Reference is too long (96 characters max).",
  7: "Pick a deadline in the future, within a year.",
  8: "You cannot send to yourself.",
  9: "This payment is already settled.",
  10: "The deadline has passed. The sender can now take a refund.",
  11: "The deadline has not passed yet.",
};

function friendlySimulationError(e: unknown): string {
  const msg = e instanceof Error ? e.message : String(e);
  const code = /Error\(Contract, #(\d+)\)/.exec(msg)?.[1];
  if (code && contractErrors[Number(code)]) return contractErrors[Number(code)]!;
  if (/balance|underfunded/i.test(msg)) return "Not enough balance for this payment.";
  return "The transaction would fail. Please check the details and try again.";
}

export const remitsure = {
  registerPayee: (source: string, name: string, cat: PayeeCategory) =>
    invoke(source, "register_payee", [addr(source), str(name), category(cat)]),

  send: (
    source: string,
    p: { payee: string; amount: bigint; reference: string; expiresAt: number },
  ) =>
    invoke<bigint>(source, "send", [
      addr(source),
      addr(p.payee),
      addr(config.token),
      i128(p.amount),
      str(p.reference),
      u64(p.expiresAt),
    ]),

  claim: (source: string, id: number) => invoke(source, "claim", [u64(id)]),
  reject: (source: string, id: number) => invoke(source, "reject", [u64(id)]),
  refund: (source: string, id: number) => invoke(source, "refund", [u64(id)]),
};
