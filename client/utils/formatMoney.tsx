import currency from 'currency.js';


const formatMoney = (amount: number, currencyCode:string) => {
    let symbol = "$"; // Default symbol

  if (currencyCode === "GBP") {
    symbol = "£";
  } else if (currencyCode === "MYR") {
    symbol = "RM"; // Malaysian Ringgit
  }

  return currency(amount, {
    symbol,
    precision: 2,
    separator: ",", // Thousand separator
    decimal: ".",   // Decimal separator
  }).format();
};

export default formatMoney;