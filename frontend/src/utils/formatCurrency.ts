const thaiBahtFormatter = new Intl.NumberFormat("th-TH", {
  style: "currency",
  currency: "THB",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
});

const thaiBahtNoDecimalFormatter = new Intl.NumberFormat("th-TH", {
  style: "currency",
  currency: "THB",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0
});

export const formatThaiBaht = (amount: number): string => {
  return thaiBahtFormatter.format(Number.isFinite(amount) ? amount : 0);
};

export const formatThaiBahtNoDecimal = (amount: number): string => {
  return thaiBahtNoDecimalFormatter.format(Number.isFinite(amount) ? amount : 0);
};
