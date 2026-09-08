// Input validation utilities for Tin Cup

import {
  validateAmount,
  validateHandle,
  validateTitle,
  validateMessage,
} from "./errors"

export interface ValidationResult {
  valid: boolean
  errors: { [key: string]: string }
}

// Validate gift form
export function validateGiftForm(data: {
  amount?: string
  message?: string
}): ValidationResult {
  const errors: { [key: string]: string } = {}

  if (!data.amount) {
    errors.amount = "Amount is required"
  } else {
    const amountCheck = validateAmount(data.amount)
    if (!amountCheck.valid) {
      errors.amount = amountCheck.error || "Invalid amount"
    }
  }

  if (data.message) {
    const messageCheck = validateMessage(data.message)
    if (!messageCheck.valid) {
      errors.message = messageCheck.error || "Invalid message"
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  }
}

// Validate beg form
export function validateBegForm(data: {
  title?: string
  story?: string
  goalCents?: string
  imageUri?: string
}): ValidationResult {
  const errors: { [key: string]: string } = {}

  if (!data.title) {
    errors.title = "Title is required"
  } else {
    const titleCheck = validateTitle(data.title)
    if (!titleCheck.valid) {
      errors.title = titleCheck.error || "Invalid title"
    }
  }

  if (!data.goalCents) {
    errors.goal = "Goal amount is required"
  } else {
    const goalCheck = validateAmount(parseInt(data.goalCents) * 100)
    if (!goalCheck.valid) {
      errors.goal = goalCheck.error || "Invalid goal"
    }
  }

  if (data.story && data.story.length > 2000) {
    errors.story = "Story must be under 2000 characters"
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  }
}

// Validate character form
export function validateCharacterForm(data: {
  handle?: string
  title?: string
  face?: string
  hat?: string
  accent?: string
}): ValidationResult {
  const errors: { [key: string]: string } = {}

  if (!data.handle) {
    errors.handle = "Handle is required"
  } else {
    const handleCheck = validateHandle(data.handle)
    if (!handleCheck.valid) {
      errors.handle = handleCheck.error || "Invalid handle"
    }
  }

  if (!data.title || data.title.length === 0) {
    errors.title = "Title is required"
  }

  if (!data.face) {
    errors.face = "Face emoji required"
  }

  if (!data.hat) {
    errors.hat = "Hat required"
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  }
}

// Validate amount input (live)
export function validateAmountInput(input: string): {
  valid: boolean
  error?: string
  displayValue: string
} {
  // Remove non-numeric except decimal
  const cleaned = input.replace(/[^\d.]/g, "")

  // Allow only one decimal
  const parts = cleaned.split(".")
  if (parts.length > 2) {
    return {
      valid: false,
      error: "Invalid format",
      displayValue: parts[0] + "." + parts[1],
    }
  }

  // Limit to 2 decimal places
  if (parts[1] && parts[1].length > 2) {
    return {
      valid: false,
      error: "Max 2 decimal places",
      displayValue: parts[0] + "." + parts[1].substring(0, 2),
    }
  }

  const num = parseFloat(cleaned)
  if (isNaN(num)) {
    return {
      valid: true,
      displayValue: "",
    }
  }

  if (num <= 0) {
    return {
      valid: false,
      error: "Must be greater than $0",
      displayValue: cleaned,
    }
  }

  if (num > 100000) {
    return {
      valid: false,
      error: "Max $100,000",
      displayValue: cleaned,
    }
  }

  return {
    valid: true,
    displayValue: cleaned,
  }
}

// Format validation errors for display
export function formatValidationErrors(errors: { [key: string]: string }): string {
  const messages = Object.values(errors)
  return messages.join("\n")
}

// Check if wallet address is valid (basic format check)
export function isValidWalletAddress(address: string): boolean {
  if (!address) return false
  // Ethereum address format: 0x + 40 hex characters
  return /^0x[a-fA-F0-9]{40}$/.test(address)
}

// Sanitize input (basic XSS prevention)
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, "") // Remove angle brackets
    .substring(0, 500) // Max length
}
