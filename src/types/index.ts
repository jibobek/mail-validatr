export interface EmailValidationResult {
  isValidSyntax: boolean
  hasValidDomain?: boolean
  hasMxRecords?: boolean
  warnings: Warning[]
  recommended: boolean
}

export interface DomainValidationResult {
  hasValidDomain: boolean
  hasMxRecords: boolean
}

export interface Warning {
  code: string
  message: string
}

export interface ValidationOptions {
  skipDnsCheck?: boolean
  customDisposableList?: string[]
  customWarningRules?: Array<(email: string) => Warning | null>
}
