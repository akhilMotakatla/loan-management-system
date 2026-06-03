export const INTEREST_RATES = {
  personal: { min: 10.5, max: 18.0, default: 12.0 },
  home:     { min: 7.5,  max: 11.0, default: 8.5  },
  auto:     { min: 8.5,  max: 14.0, default: 10.0 },
  other:    { min: 12.0, max: 20.0, default: 14.0 },
};

export const PROCESSING_FEE_PERCENT = 1.5;

export const LOAN_STATUSES = ['draft','submitted','under_review','docs_required',
                               'approved','rejected','disbursed','cancelled'];
