export function formatNumberWithCommas(number) {
  return number.toLocaleString("en-US");
}

export const currencyFormat = (value, currency = "USD") => {
  value = parseFloat(value);

  if (isNaN(value)) {
    return `Formato no válido.`;
  }

  // Format the amount as a dollar amount
  const formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(value);

  return formatted;
};
