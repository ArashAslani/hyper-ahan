export function toEnglishDigits(str: string): string {
  const persianDigits = "۰۱۲۳۴۵۶۷۸۹";
  const englishDigits = "0123456789";
  return str.replace(/[۰-۹]/g, (d) => englishDigits[persianDigits.indexOf(d)] ?? d);
}

/** Parse display price like "۲۳,۵۰۰,۰۰۰" to number */
export function parsePrice(price: string | number): number {
  if (typeof price === "number") return price;
  return Number(toEnglishDigits(price).replace(/,/g, "")) || 0;
}

export function formatPrice(amount: number): string {
  return amount.toLocaleString("en-US");
}
