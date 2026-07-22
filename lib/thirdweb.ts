import { ethers } from "ethers"

// Polygon Mumbai testnet
export const CHAIN_ID = 80001
export const CHAIN_NAME = "Polygon Mumbai"
export const RPC_URL = "https://rpc-mumbai.maticvigil.com"

// USDT on Polygon Mumbai (testnet)
// This is a test USDT token - replace with actual USDT address for production
export const USDT_ADDRESS = "0x2E8D98fd126a32365dB66C12C9B80Fc51fCE2D58"
export const USDT_DECIMALS = 6

// Project wallet receiving Lord membership fees
export const PROJECT_WALLET = "0x742d35Cc6634C0532925a3b844Bc7e7595f0bEb"

// Placeholder USDT contract ABI (minimal for transfers)
export const USDT_ABI = [
  {
    constant: false,
    inputs: [
      { name: "_to", type: "address" },
      { name: "_value", type: "uint256" },
    ],
    name: "transfer",
    outputs: [{ name: "", type: "bool" }],
    type: "function",
  },
  {
    constant: true,
    inputs: [{ name: "_owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "balance", type: "uint256" }],
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "decimals",
    outputs: [{ name: "", type: "uint8" }],
    type: "function",
  },
]

// Convert USD cents to USDT wei (USDT has 6 decimals)
export function centsToUsdt(cents: number): string {
  // cents = USD * 100, USDT wei = USD * 1,000,000
  // So wei = cents * 10,000
  return (cents * 10000).toString()
}

// Convert USDT wei to cents
export function usdtToCents(wei: string | number): number {
  return Math.floor(Number(wei) / 10000)
}

// Format USDT balance for display
export function formatUsdt(wei: string | number): string {
  const cents = usdtToCents(wei)
  return `$${(cents / 100).toFixed(2)}`
}

// Get provider for read-only calls
export function getProvider() {
  return new ethers.providers.JsonRpcProvider(RPC_URL)
}

// Check USDT balance
export async function checkUsdtBalance(address: string): Promise<number> {
  const provider = getProvider()
  const contract = new ethers.Contract(USDT_ADDRESS, USDT_ABI, provider)
  const balance = await contract.balanceOf(address)
  return usdtToCents(balance.toString())
}

// Send USDT (requires signer)
export async function sendUsdt(
  signer: ethers.Signer,
  recipient: string,
  cents: number
): Promise<string> {
  const contract = new ethers.Contract(USDT_ADDRESS, USDT_ABI, signer)
  const wei = centsToUsdt(cents)
  const tx = await contract.transfer(recipient, wei)
  const receipt = await tx.wait()
  return receipt.transactionHash
}
