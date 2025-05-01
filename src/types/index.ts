export interface EmailValidationResult {
  isValidSyntax: boolean;
  hasValidDomain?: boolean;
  hasMxRecords?: boolean;
  warnings: string[];
  recommented: boolean;
}

export interface DomainValidationResult {
  hasValidDomain: boolean;
  hasMxRecords: boolean;
}

export interface ValidationOptions {
  skipDnsCheck?: boolean;
  customDisposableList?: string[];
  customWarningRules?: Array<(email: string) => string | null>;
}
