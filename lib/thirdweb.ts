/**
 * thirdweb money + identity helpers (Expo Go safe).
 *
 * Expo Go cannot bundle thirdweb's native in-app wallet stack
 * (`thirdweb/wallets` → AWS KMS / react-native-quick-crypto / Coinbase MWP).
 * This module never imports `thirdweb` or `thirdweb/wallets` so Metro can
 * serve Expo Go. Identity is a local demo seat; money mutations that lack a
 * real signer throw Stage 2 copy: "No gold moved."
 *
 * Custom/dev clients can replace sendUsdt / connectInAppGuest with real
 * thirdweb Account wiring without changing AuthProvider call sites.
 */
import * as Crypto from "expo-crypto";

export const MONEY_FAIL_COPY = "No gold moved.";

const clientId = process.env.EXPO_PUBLIC_THIRDWEB_CLIENT_ID ?? "";
const usdtAddress = (process.env.EXPO_PUBLIC_USDT_ADDRESS ??
  "0x41E94Eb019C0762f9Bfcf9Fb1E58725BfB0e7582") as `0x${string}`;
const projectWallet = (process.env.EXPO_PUBLIC_PROJECT_WALLET ??
  "0x0000000000000000000000000000000000000000") as `0x${string}`;

export const isThirdwebConfigured = Boolean(
  clientId && clientId !== "your_client_id_here" && !clientId.includes("YOUR_"),
);

/** Alias kept for older imports. */
export const thirdwebConfigured = isThirdwebConfigured;

/**
 * Wallet seat used by AuthProvider. In Expo Go this is address-only
 * (no native signer). Custom/dev clients may attach a real signer.
 */
export type WalletAccount = {
  address: `0x${string}`;
  /** Present only when a custom build injects a thirdweb Account. */
  signer?: {
    sendTransaction: (tx: unknown) => Promise<{ transactionHash: `0x${string}` }>;
  };
};

export type ConnectedWallet = WalletAccount & {
  mode: "demo" | "thirdweb";
};

async function createDemoAddress(): Promise<`0x${string}`> {
  const bytes = await Crypto.getRandomBytesAsync(20);
  const hex = Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return `0x${hex}` as `0x${string}`;
}

/** Local seat for Expo Go / missing native wallet. */
export async function connectDemoWallet(): Promise<ConnectedWallet> {
  const address = await createDemoAddress();
  return { address, mode: "demo" };
}

/**
 * Connect identity. Expo Go always returns a demo seat — never imports
 * native thirdweb wallets (that path breaks Metro in Expo Go).
 */
export async function connectInAppGuest(): Promise<WalletAccount> {
  return connectDemoWallet();
}

/**
 * Send USDT on-chain. Expo Go has no signer → always "No gold moved."
 * Wire a real thirdweb Account.signer in a custom build to enable sends.
 */
export async function sendUsdt(
  account: WalletAccount,
  _to: string,
  _cents: number,
): Promise<string> {
  if (!account?.signer || !isThirdwebConfigured) {
    throw new Error(MONEY_FAIL_COPY);
  }
  // Custom builds: replace this body with thirdweb prepareContractCall + sendTransaction.
  throw new Error(MONEY_FAIL_COPY);
}

/** Lord buy-in: $100 USDT (10000 cents) to project wallet. */
export async function stakeLordBuyIn(account: WalletAccount): Promise<string> {
  return sendUsdt(account, projectWallet, 10000);
}

export { projectWallet, usdtAddress };

/** Legacy alias used by gift screen. */
export const USDT_ADDRESS = usdtAddress;
