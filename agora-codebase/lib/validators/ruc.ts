export function validateRUC(ruc: string): boolean {
    // very simple RUC format check: 8-9 digits + “-” + 1 digit
    return /^\d{8,9}-\d$/.test(ruc)
  }
  