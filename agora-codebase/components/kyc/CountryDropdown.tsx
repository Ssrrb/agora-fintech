// components/kyc/CountryDropdown.tsx
import { CountryDropdownProps } from '@/types/kyc'

export default function CountryDropdown({ value, onChange }: CountryDropdownProps) {
  return (
    <div className="input-group">
      <label>Country</label>
      <select 
        name="country" 
        value={value} 
        onChange={onChange}
        className="kyc-select"
        required
      >
        <option value="">Select Country</option>
        <option value="BR">Brazil</option>
        <option value="PY">Paraguay</option>
      </select>
    </div>
  )
}