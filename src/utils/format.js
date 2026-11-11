const rupees = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
})

// formatINR(100000) -> "₹1,00,000" (Indian digit grouping)
export const formatINR = (amount) => rupees.format(amount)
