import { validateCPF } from './cpf'
import { validateRUC } from './ruc'
import { KYCFormData, KYCValidationErrors } from '@/components/features/kyc/KYC-form'

export const validateKYCForm = (data: Partial<KYCFormData>): KYCValidationErrors => {
  const errors: KYCValidationErrors = {}

  if (!data.fullName?.trim()) {
    errors.fullName = 'Full name is required'
  }

  if (!data.email?.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    errors.email = 'Valid email is required'
  }

  if (!data.country) {
    errors.country = 'Country selection is required'
  }

  if (data.country === 'BR' && !validateCPF(data.taxId || '')) {
    errors.taxId = 'Valid CPF is required'
  }

  if (data.country === 'PY' && !validateRUC(data.taxId || '')) {
    errors.taxId = 'Valid RUC is required'
  }

  if (!data.walletAddress?.match(/^0x[a-fA-F0-9]{40}$/)) {
    errors.walletAddress = 'Valid Ethereum address required'
  }

  return errors
}