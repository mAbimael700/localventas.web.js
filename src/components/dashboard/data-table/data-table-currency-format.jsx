export const rowCurrencyFormat = ( row, value ) => {
  const rowValue = parseFloat(row.getValue(value));

  if(isNaN(rowValue)){
    return <span className="text-muted-foreground text-sm ">Formato <br />no válido.</span>
  }

  // Format the amount as a dollar amount
  const formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(rowValue);

  return <div className="font-medium">{formatted}</div>;
};
