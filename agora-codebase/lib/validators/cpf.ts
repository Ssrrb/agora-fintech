export function validateCPF(cpf: string): boolean {
    // stripped-down CPF validator (11 digits, simple check)
    const clean = cpf.replace(/\D/g, '')
    return /^\d{11}$/.test(clean)
  }
  