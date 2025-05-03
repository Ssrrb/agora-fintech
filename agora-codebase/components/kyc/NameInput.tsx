import BaseInput from './BaseInput'

export default function NameInput() {
  return (
    <BaseInput
      label="Full Name"
      name="fullName"
      placeholder="John Doe"
      required
    />
  )
}