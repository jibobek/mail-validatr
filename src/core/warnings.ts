const customRules: Array<(email: string) => string | null> = [];

export function addCustomWarningRule(rule: (email: string) => string | null): void {
  customRules.push(rule);
}

export function getWarnings(email: string): string[] {
  const warnings: string[] = [];
  const [localPart, domainPart] = email.split("@");

  // 1. Quoted local part (e.g. "user"@domain.com)
  if (/^".+"$/.test(localPart)) {
    warnings.push("Quoted local part – technically valid, but rarely supported.");
  }

  // 2. IP address domain (e.g. user@[127.0.0.1])
  if (/^\[[^\]]+\]$/.test(domainPart)) {
    warnings.push("Domain is an IP address – valid, but very uncommon.");
  }

  // 3. Short TLD (e.g. email@cz)
  if (/^[a-zA-Z0-9\-]+\.[a-zA-Z]{1,2}$/.test(email) || /^[a-zA-Z0-9\-]+@[a-zA-Z]{2}$/.test(email)) {
    warnings.push("Very short or missing TLD – may not be a real domain.");
  }

  // 4. Consecutive dots (e.g. user..name@domain.com)
  if (/\.\./.test(localPart) || /\.\./.test(domainPart)) {
    warnings.push("Consecutive dots – may be rejected by some servers.");
  }

  // 5. Weird characters or formatting
  if (/[^a-zA-Z0-9._]/.test(localPart)) {
    warnings.push("Local part contains uncommon or special characters.");
  }
  
  // 6. Localhost domain
  if (domainPart === "localhost") {
    warnings.push("Domain is 'localhost' – typically only used in testing environments.");
  }

  for (const rule of customRules) {
    const customWarning = rule(email);
    if (customWarning) {
      warnings.push(customWarning);
    }
  }

  return warnings;
}