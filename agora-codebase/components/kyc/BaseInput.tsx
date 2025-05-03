// components/kyc/BaseInput.tsx
import { BaseInputProps } from '@/types/kyc'
import { cn } from '@/lib/utils' // Import the cn function

export default function BaseInput({ label, error, className, ...props }: BaseInputProps) {
  return (
    <div className="input-group">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <input 
        className={cn(
          "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50",
          error && "border-red-500",
          className
        )}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  )
}