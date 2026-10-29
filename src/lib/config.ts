import { Networks } from "@stellar/stellar-sdk";

// NEXT_PUBLIC_ values are inlined at build time, so they must be read with literal names.
export const config = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000",
  network: (process.env.NEXT_PUBLIC_STELLAR_NETWORK ?? "testnet") as "testnet" | "mainnet",
  rpcUrl: process.env.NEXT_PUBLIC_SOROBAN_RPC_URL ?? "https://soroban-testnet.stellar.org",
  contractId: process.env.NEXT_PUBLIC_REMITSURE_CONTRACT_ID ?? "",
  token:
    process.env.NEXT_PUBLIC_DEFAULT_TOKEN ??
    "CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC",
  tokenSymbol: process.env.NEXT_PUBLIC_DEFAULT_TOKEN_SYMBOL ?? "XLM",
};

export const networkPassphrase = config.network === "mainnet" ? Networks.PUBLIC : Networks.TESTNET;

const explorerNet = config.network === "mainnet" ? "public" : "testnet";
export const explorerTx = (hash: string) =>
  `https://stellar.expert/explorer/${explorerNet}/tx/${hash}`;
export const explorerAccount = (addr: string) =>
  `https://stellar.expert/explorer/${explorerNet}/account/${addr}`;
