export const calculateEMI = (principal, annualRate, tenureMonths) => {
  const r = annualRate / 12 / 100;
  if (r === 0) return Math.round((principal / tenureMonths) * 100) / 100;
  const emi = (principal * r * Math.pow(1 + r, tenureMonths)) / (Math.pow(1 + r, tenureMonths) - 1);
  return Math.round(emi * 100) / 100;
};

export const getTotalPayment = (emi, tenure) => Math.round(emi * tenure * 100) / 100;

export const getTotalInterest = (principal, emi, tenure) =>
  Math.round((getTotalPayment(emi, tenure) - principal) * 100) / 100;
