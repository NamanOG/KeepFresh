export function getDaysUntilExpiry(expiryDate: string): number {
  const today = new Date()
  today.setHours(0, 0, 0, 0) // Reset time to start of day

  const expiry = new Date(expiryDate)
  expiry.setHours(0, 0, 0, 0) // Reset time to start of day

  const diffTime = expiry.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  console.log(`📅 Days calculation for ${expiryDate}: ${diffDays} days`)
  console.log(`📅 Today: ${today.toISOString()}, Expiry: ${expiry.toISOString()}`)
  return diffDays
}
