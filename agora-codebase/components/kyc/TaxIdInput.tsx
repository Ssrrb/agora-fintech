// components/kyc/TaxIdInput.tsx
import BaseInput from './BaseInput'

interface TaxIdInputProps {
  country: string | null;
  error?: string;
}

export default function TaxIdInput({ country }: TaxIdInputProps) {
  const labels = {
    BR: "CPF (Brazilian Tax ID)",
    PY: "RUC (Paraguayan Tax ID)",
    default: "Tax Identification Number"
  }

  const label = country && labels[country as keyof typeof labels] ? labels[country as keyof typeof labels] : labels.default;

  return (
    <BaseInput
      label={label}
      name="taxId"
      placeholder={country ? `Enter ${labels[country as keyof typeof labels]}` : "Enter Tax ID"}
      required
    />
  )
}