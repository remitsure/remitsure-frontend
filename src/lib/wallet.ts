import {
  getAddress,
  isConnected,
  requestAccess,
  signTransaction as freighterSign,
} from "@stellar/freighter-api";
import { networkPassphrase } from "./config";

export class WalletError extends Error {}

export async function hasFreighter(): Promise<boolean> {
  const res = await isConnected();
  return !res.error && res.isConnected;
}

/** Address if the user already approved this site, otherwise null. Never shows a popup. */
export async function currentAddress(): Promise<string | null> {
  const res = await getAddress();
  return res.error || !res.address ? null : res.address;
}

export async function connect(): Promise<string> {
  if (!(await hasFreighter())) {
    throw new WalletError("Freighter is not installed. Get it at freighter.app and refresh.");
  }
  const res = await requestAccess();
  if (res.error || !res.address) throw new WalletError(res.error?.message ?? "Access was denied");
  return res.address;
}

export async function signTransaction(xdr: string, address: string): Promise<string> {
  const res = await freighterSign(xdr, { networkPassphrase, address });
  if (res.error) throw new WalletError(res.error.message ?? "Signing was rejected");
  return res.signedTxXdr;
}
