import BaseInput from './BaseInput'

export default function EmailInput() {
  return (
    <BaseInput
      label="Email Address"
      name="email"
      type="email"
      placeholder="john@example.com"
      required
    />
  )
}