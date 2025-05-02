import { DomainValidationResult } from "../types";

export async function validateDomain(domain: string): Promise<DomainValidationResult | null> {
  if (typeof window !== "undefined") {
    return null;
  }

  const dns = await import('dns').then(mod => mod.promises);

  let hasMxRecords = false;
  let hasValidDomain = false;

  try {
    const mxRecords = await dns.resolveMx(domain);
    hasMxRecords = mxRecords.length > 0;
    hasValidDomain = true;
  } catch {
    try {
      await dns.resolve(domain);
      hasValidDomain = true;
    } catch {
      hasValidDomain = false;
    }
  }

  return { hasValidDomain, hasMxRecords };
}
