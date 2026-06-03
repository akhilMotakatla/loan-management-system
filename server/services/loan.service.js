import { addMonths } from 'date-fns';

export const calculateEMI = (principal, annualRate, tenureMonths) => {
  const r = annualRate / 12 / 100;
  if (r === 0) return Math.round((principal / tenureMonths) * 100) / 100;
  const emi = (principal * r * Math.pow(1 + r, tenureMonths)) / (Math.pow(1 + r, tenureMonths) - 1);
  return Math.round(emi * 100) / 100;
};

export const generateAmortizationSchedule = (principal, annualRate, tenureMonths, disbursementDate) => {
  const r   = annualRate / 12 / 100;
  const emi = calculateEMI(principal, annualRate, tenureMonths);
  let balance = principal;
  const schedule = [];

  for (let i = 1; i <= tenureMonths; i++) {
    const interest  = Math.round(balance * r * 100) / 100;
    const princ     = Math.round((emi - interest) * 100) / 100;
    balance         = Math.round((balance - princ) * 100) / 100;
    schedule.push({
      installmentNo: i,
      dueDate:       addMonths(new Date(disbursementDate), i),
      emiAmount:     emi,
      principal:     princ,
      interest,
      balance:       Math.max(0, balance),
      status:        'pending',
    });
  }
  return schedule;
};
