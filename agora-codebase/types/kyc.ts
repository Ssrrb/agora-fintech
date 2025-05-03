// types/kyc.ts
export interface BaseInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export interface CountryDropdownProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  error?: string;
}

export interface TaxIdInputProps {
  country: string;
  error?: string;
}

export interface KYCFormData {
  fullName: string;
  email: string;
  country: string;
  taxId: string;
}