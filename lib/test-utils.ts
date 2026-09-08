import { ethers } from 'ethers'

/**
 * Test/Demo Utilities for Tin Cup
 * Use these for testing without real blockchain transactions
 */

// Mock wallet addresses for testing
export const MOCK_WALLETS = {
  user1: '0x742d35Cc6634C0532925a3b844Bc7e7595f0bEb',
  user2: '0x1234567890123456789012345678901234567890',
  user3: '0x0987654321098765432109876543210987654321',
  project: '0x742d35Cc6634C0532925a3b844Bc7e7595f0bEb',
}

// Mock transaction responses
export const mockTransactionHash = () => 
  `0x${Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`

/**
 * Simulate a USDT transfer (for testing without real transactions)
 * In production, this calls the real thirdweb contract
 */
export async function simulateUsdtTransfer(
  fromAddress: string,
  toAddress: string,
  amountCents: number,
  isTestMode = true
): Promise<{ hash: string; from: string; to: string; amount: string }> {
  if (!isTestMode) {
    throw new Error('Real USDT transfers require thirdweb signer')
  }

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500))

  return {
    hash: mockTransactionHash(),
    from: fromAddress,
    to: toAddress,
    amount: (amountCents / 100).toFixed(2),
  }
}

/**
 * Mock wallet connection for testing
 */
export async function connectTestWallet(index: number = 1) {
  const wallets = Object.values(MOCK_WALLETS)
  const wallet = wallets[index % wallets.length]
  
  await new Promise(resolve => setTimeout(resolve, 300))
  
  return {
    address: wallet,
    connected: true,
    isTestMode: true,
  }
}

/**
 * Format cents to USD string
 */
export function formatUSD(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`
}

/**
 * Validate Ethereum address format
 */
export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address)
}

/**
 * Test data generator for demo accounts
 */
export function generateTestProfile(address: string) {
  const adjectives = ['Dusty', 'Ragged', 'Sly', 'Desperate', 'Wandering']
  const nouns = ['Pete', 'Molly', 'Sam', 'Doug', 'Sal']
  const hats = ['stetson', 'bandana', 'floppy', 'newsboy', 'tophat']
  const faces = ['😅', '😏', '😩', '🤨', '🧐']
  
  const randomAdj = adjectives[Math.floor(Math.random() * adjectives.length)]
  const randomNoun = nouns[Math.floor(Math.random() * nouns.length)]
  
  return {
    id: address.toLowerCase(),
    display_name: `${randomAdj}${randomNoun}`,
    handle: `outlaw_${address.slice(2, 10)}`,
    fate: Math.random() > 0.7 ? 'lord' : 'drifter',
    title: Math.random() > 0.7 ? 'MONARCH' : 'DRIFTER',
    hat: hats[Math.floor(Math.random() * hats.length)],
    face: faces[Math.floor(Math.random() * faces.length)],
    accent: 'gold',
    coins: Math.floor(Math.random() * 1000),
    balance_cents: Math.floor(Math.random() * 50000),
    is_lord: Math.random() > 0.7,
    onboarded: true,
    created_at: new Date().toISOString(),
  }
}
