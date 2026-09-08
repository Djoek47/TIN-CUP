// Error types and handling utilities for Tin Cup

export class AppError extends Error {
  constructor(
    public message: string,
    public code: string,
    public statusCode: number = 400,
    public isUserFacing: boolean = true
  ) {
    super(message)
    this.name = "AppError"
  }
}

export const Errors = {
  // Auth errors
  WALLET_NOT_CONNECTED: new AppError(
    "Wallet not connected. Please connect your wallet first.",
    "WALLET_NOT_CONNECTED",
    401,
    true
  ),
  WALLET_MISMATCH: new AppError(
    "Wallet address mismatch. Please reconnect.",
    "WALLET_MISMATCH",
    401,
    true
  ),
  SESSION_EXPIRED: new AppError(
    "Session expired. Please reconnect your wallet.",
    "SESSION_EXPIRED",
    401,
    true
  ),

  // Validation errors
  INVALID_AMOUNT: new AppError(
    "Please enter a valid amount greater than $0.",
    "INVALID_AMOUNT",
    400,
    true
  ),
  INSUFFICIENT_BALANCE: new AppError(
    "Insufficient balance. Add more funds to continue.",
    "INSUFFICIENT_BALANCE",
    400,
    true
  ),
  INVALID_RECIPIENT: new AppError(
    "Invalid recipient. Please try again.",
    "INVALID_RECIPIENT",
    400,
    true
  ),
  INVALID_MESSAGE: new AppError(
    "Message too long. Keep it under 500 characters.",
    "INVALID_MESSAGE",
    400,
    true
  ),
  INVALID_HANDLE: new AppError(
    "Handle must be 3-20 characters, letters and numbers only.",
    "INVALID_HANDLE",
    400,
    true
  ),
  INVALID_TITLE: new AppError(
    "Title must be 3-100 characters.",
    "INVALID_TITLE",
    400,
    true
  ),
  INVALID_GOAL: new AppError(
    "Goal must be between $1 and $100,000.",
    "INVALID_GOAL",
    400,
    true
  ),

  // Payment errors
  PAYMENT_FAILED: new AppError(
    "Payment failed. Please try again.",
    "PAYMENT_FAILED",
    400,
    true
  ),
  LORD_ALREADY_PAID: new AppError(
    "You've already purchased Lord membership.",
    "LORD_ALREADY_PAID",
    400,
    true
  ),
  TRANSACTION_PENDING: new AppError(
    "Transaction still processing. Please wait.",
    "TRANSACTION_PENDING",
    400,
    true
  ),

  // Database errors
  PROFILE_NOT_FOUND: new AppError(
    "Profile not found. Please try connecting again.",
    "PROFILE_NOT_FOUND",
    404,
    true
  ),
  BEG_NOT_FOUND: new AppError(
    "Beg not found. It may have been deleted.",
    "BEG_NOT_FOUND",
    404,
    true
  ),
  DATABASE_ERROR: new AppError(
    "Database error. Please try again.",
    "DATABASE_ERROR",
    500,
    false
  ),

  // File errors
  FILE_UPLOAD_FAILED: new AppError(
    "Failed to upload image. Please try again.",
    "FILE_UPLOAD_FAILED",
    400,
    true
  ),
  INVALID_IMAGE: new AppError(
    "Invalid image. Please use JPG, PNG, or GIF.",
    "INVALID_IMAGE",
    400,
    true
  ),
  IMAGE_TOO_LARGE: new AppError(
    "Image too large. Max 10MB.",
    "IMAGE_TOO_LARGE",
    400,
    true
  ),

  // Camera errors
  CAMERA_PERMISSION_DENIED: new AppError(
    "Camera permission denied. Enable in settings.",
    "CAMERA_PERMISSION_DENIED",
    403,
    true
  ),
  CAMERA_NOT_AVAILABLE: new AppError(
    "Camera not available on this device.",
    "CAMERA_NOT_AVAILABLE",
    400,
    true
  ),

  // Network errors
  NETWORK_ERROR: new AppError(
    "Network error. Check your connection.",
    "NETWORK_ERROR",
    0,
    true
  ),
  TIMEOUT: new AppError(
    "Request timed out. Please try again.",
    "TIMEOUT",
    504,
    true
  ),
}

// Validate amount in cents
export function validateAmount(cents: number | string): { valid: boolean; error?: string } {
  const num = typeof cents === "string" ? parseInt(cents) : cents

  if (isNaN(num) || num <= 0) {
    return { valid: false, error: "Amount must be greater than $0" }
  }
  if (num > 1000000) {
    // $10,000 max
    return { valid: false, error: "Amount too large" }
  }
  return { valid: true }
}

// Validate handle (username)
export function validateHandle(handle: string): { valid: boolean; error?: string } {
  if (!handle || handle.length < 3) {
    return { valid: false, error: "Handle must be at least 3 characters" }
  }
  if (handle.length > 20) {
    return { valid: false, error: "Handle must be under 20 characters" }
  }
  if (!/^[a-zA-Z0-9_]+$/.test(handle)) {
    return { valid: false, error: "Handle can only contain letters, numbers, and _" }
  }
  return { valid: true }
}

// Validate title (for begs)
export function validateTitle(title: string): { valid: boolean; error?: string } {
  if (!title || title.length < 3) {
    return { valid: false, error: "Title must be at least 3 characters" }
  }
  if (title.length > 100) {
    return { valid: false, error: "Title must be under 100 characters" }
  }
  return { valid: true }
}

// Validate message
export function validateMessage(message: string): { valid: boolean; error?: string } {
  if (message.length > 500) {
    return { valid: false, error: "Message must be under 500 characters" }
  }
  return { valid: true }
}

// Get user-friendly error message
export function getUserErrorMessage(error: any): string {
  if (error instanceof AppError) {
    return error.isUserFacing ? error.message : "Something went wrong. Please try again."
  }

  if (error?.message) {
    return error.message
  }

  return "Something went wrong. Please try again."
}

// Log error for debugging
export function logError(context: string, error: any): void {
  const timestamp = new Date().toISOString()
  const message = error?.message || String(error)
  const code = error?.code || "UNKNOWN"

  console.log(`[v0] ${timestamp} ERROR in ${context}: ${code} - ${message}`)

  if (error?.stack) {
    console.log(`[v0] Stack: ${error.stack}`)
  }
}
