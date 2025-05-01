import { validateDomain, testSyntax, getWarnings, isDisposableEmail, addCustomWarningRule } from "./core";
import { EmailValidationResult, ValidationOptions, Warning } from "./types";

export async function validateEmail(email: string, options: ValidationOptions = {}): Promise<EmailValidationResult> {
  const warnings: Warning[] = [];
  const isValidSyntax = testSyntax(email);

  if (!isValidSyntax) {
    warnings.push({
      code: "invalid_syntax",
      message: "Email does not match basic syntax (missing '@' or domain part).",
    });
    return {
      isValidSyntax: false,
      warnings,
      recommended: false
    };
  }
  const domain = email.split("@")[1];

  const customWarningRules = options.customWarningRules || [];
  customWarningRules.forEach((rule) => addCustomWarningRule(rule));

  warnings.push(...getWarnings(email));

  if (isDisposableEmail(domain, options.customDisposableList || [])) {
    warnings.push({
      code: "disposable_email",
      message: "Email domain belongs to a disposable email provider.",
    });
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

  const recommended = isValidSyntax && warnings.length === 0 && (hasValidDomain !== false) && (hasMxRecords !== false);

  return {
    isValidSyntax,
    ...(hasValidDomain !== undefined && { hasValidDomain }),
    ...(hasMxRecords !== undefined && { hasMxRecords }),
    warnings,
    recommended
  };
}