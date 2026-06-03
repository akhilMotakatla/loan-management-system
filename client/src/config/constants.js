export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';
export const APP_NAME = import.meta.env.VITE_APP_NAME || 'Premier Bank';

export const LOAN_TYPES = [
  { value: 'personal', label: 'Personal Loan', icon: '👤', color: '#C9A84C', minRate: 10.5, maxRate: 18.0, maxAmount: 50000, description: 'For personal expenses, education, travel, or emergencies' },
  { value: 'home',     label: 'Home Loan',     icon: '🏠', color: '#1A4B8B', minRate: 7.5,  maxRate: 11.0, maxAmount: 500000, description: 'Purchase, construction or renovation of residential property' },
  { value: 'auto',     label: 'Auto Loan',     icon: '🚗', color: '#0F7B5E', minRate: 8.5,  maxRate: 14.0, maxAmount: 100000, description: 'Finance new or pre-owned vehicles at competitive rates' },
  { value: 'other',    label: 'Other Loan',    icon: '💼', color: '#8B1A2E', minRate: 12.0, maxRate: 20.0, maxAmount: 200000, description: 'Business expansion, medical, or other specialized needs' },
];

export const APPLICATION_STATUSES = {
  draft:        { label: 'Draft',        color: 'text-silver',   bg: 'bg-navy-mid' },
  submitted:    { label: 'Submitted',    color: 'text-sapphire', bg: 'bg-sapphire/20' },
  under_review: { label: 'Under Review', color: 'text-amber',    bg: 'bg-amber/20' },
  docs_required:{ label: 'Docs Needed',  color: 'text-gold-primary', bg: 'bg-gold-primary/20' },
  approved:     { label: 'Approved',     color: 'text-emerald',  bg: 'bg-emerald/20' },
  rejected:     { label: 'Rejected',     color: 'text-ruby',     bg: 'bg-ruby/20' },
  disbursed:    { label: 'Disbursed',    color: 'text-emerald',  bg: 'bg-emerald/20' },
  cancelled:    { label: 'Cancelled',    color: 'text-muted',    bg: 'bg-muted/20' },
};

export const DOCUMENT_TYPES = [
  { value: 'identity',          label: 'Identity Proof (Passport/ID)' },
  { value: 'address_proof',     label: 'Address Proof' },
  { value: 'income_proof',      label: 'Income Proof (Pay Slip)' },
  { value: 'bank_statement',    label: 'Bank Statement' },
  { value: 'property_document', label: 'Property Document' },
  { value: 'vehicle_document',  label: 'Vehicle Document' },
  { value: 'tax_return',        label: 'Tax Return' },
  { value: 'other',             label: 'Other' },
];
