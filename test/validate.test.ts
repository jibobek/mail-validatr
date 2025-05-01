import { describe, it, expect } from "vitest";
import { validateEmail } from "../src";

describe("validateEmail", () => {
  it("should validate a standard valid email", async () => {
    const result = await validateEmail("info@gmail.com");
    expect(result.isValidSyntax).toBe(true);
    expect(result.hasValidDomain).toBe(true);
  });

  it("should invalidate an email missing '@'", async () => {
    const result = await validateEmail("invalidemail.com");
    expect(result.isValidSyntax).toBe(false);
    expect(result.hasValidDomain).toBeFalsy();
  });

  it("should invalidate an email with no domain part", async () => {
    const result = await validateEmail("user@");
    expect(result.isValidSyntax).toBe(false);
    expect(result.hasValidDomain).toBeFalsy();
  });

  it("should warn about quoted local part", async () => {
    const result = await validateEmail('"user"@example.com');
    expect(result.isValidSyntax).toBe(true);
    expect(result.warnings[0].message).toContain("Quoted local part – technically valid, but rarely supported.");
  });

  it("should warn about IP address domain", async () => {
    const result = await validateEmail("user@[127.0.0.1]");
    expect(result.isValidSyntax).toBe(true);
    expect(result.warnings[0].message).toContain("Domain is an IP address – valid, but very uncommon.");
  });

  it("should warn about short TLD", async () => {
    const result = await validateEmail("email@cz");
    expect(result.isValidSyntax).toBe(true);
    expect(result.warnings[0].message).toContain("Very short or missing TLD – may not be a real domain.");
  });

  it("should warn about consecutive dots", async () => {
    const result = await validateEmail("\"user..name\"@example.com");
    expect(result.isValidSyntax).toBe(true);
    expect(result.warnings[0].message).toContain("Quoted local part – technically valid, but rarely supported.");
    expect(result.warnings[1].message).toContain("Consecutive dots – may be rejected by some servers.");
  });

  it("should false consecutive dots", async () => {
    const result = await validateEmail("user..name@example.com");
    expect(result.isValidSyntax).toBe(false);
  });

  it("should warn about uncommon special characters", async () => {
    const result = await validateEmail("us!er@domain.com");
    expect(result.isValidSyntax).toBe(true);
    expect(result.warnings[0].message).toContain("Local part contains uncommon or special characters.");
  });

  it("should return false domain for unreachable domain", async () => {
    const result = await validateEmail("user@nonexistent.tld");
    expect(result.hasValidDomain).toBe(false);
  });

  it("should warn about disposable email domains", async () => {
    const result = await validateEmail("user@mailinator.com");
    expect(result.warnings[0].message).toContain("Email domain belongs to a disposable email provider.");
  });

  it("should apply custom warning rules", async () => {
    const customRules = [
      (email: string) =>
        email.endsWith("@example.com")
          ? { code: "example_com_not_allowed", message: "Emails from example.com are not allowed." }
          : null,
      (email: string) =>
        email.startsWith("test")
          ? { code: "test_prefix_discouraged", message: "Emails starting with 'test' are discouraged." }
          : null,
    ];

    const result = await validateEmail("test@example.com", { customWarningRules: customRules });

    expect(result.warnings).toContainEqual({
      code: "example_com_not_allowed",
      message: "Emails from example.com are not allowed.",
    });
    expect(result.warnings).toContainEqual({
      code: "test_prefix_discouraged",
      message: "Emails starting with 'test' are discouraged.",
    });
  });

  it("should not add warnings if no custom rules match", async () => {
    const customRules = [
      (email: string) =>
        email.endsWith("@example.org")
          ? { code: "example_org_not_allowed", message: "Emails from example.org are not allowed." }
          : null,
    ];

    const result = await validateEmail("user@example.com", { customWarningRules: customRules });

    expect(result.warnings).not.toContainEqual({
      code: "example_org_not_allowed",
      message: "Emails from example.org are not allowed.",
    });
  });
});
