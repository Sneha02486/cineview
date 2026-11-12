/**
 * Indian Rupee (INR) Currency Formatter
 * Formats numbers into standard Indian numbering format (e.g. ₹1,250)
 */
export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

