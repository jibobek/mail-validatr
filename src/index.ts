import { validateDomain, testSyntax, getWarnings, isDisposableEmail, addCustomWarningRule } from "./core";
import { EmailValidationResult, ValidationOptions } from "./types";

export async function validateEmail(email: string, options: ValidationOptions = {}): Promise<EmailValidationResult> {
  const warnings: string[] = [];
  const isValidSyntax = testSyntax(email);

  if (!isValidSyntax) {
    warnings.push("Email does not match basic syntax (missing '@' or domain part).");
    return {
      isValidSyntax: false,
      warnings,
      recommented: false
    };
  }
  const domain = email.split("@")[1];

  const customWarningRules = options.customWarningRules || [];
  customWarningRules.forEach((rule) => addCustomWarningRule(rule));

  warnings.push(...getWarnings(email));

  if (isDisposableEmail(domain, options.customDisposableList || [])) {
    warnings.push("Email domain belongs to a disposable email provider.");
  }

  let hasMxRecords = undefined;
  let hasValidDomain = undefined;

  if (!options.skipDnsCheck && typeof window === "undefined") {
    // Only perform DNS checks in Node.js environments
    try {
      const dnsResult = await validateDomain(domain);
      hasValidDomain = dnsResult.hasValidDomain;
      hasMxRecords = dnsResult.hasMxRecords;
    } catch (error) { }
  }

  const recommented = isValidSyntax && warnings.length === 0 && (hasValidDomain !== false) && (hasMxRecords !== false);

  return {
    isValidSyntax,
    ...(hasValidDomain !== undefined && { hasValidDomain }),
    ...(hasMxRecords !== undefined && { hasMxRecords }),
    warnings,
    recommented
  };
}