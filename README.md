# mail-validatr

**mail-validatr** is a lightweight Node.js library and CLI tool for validating email addresses.  
It checks syntax, domain validity, and MX records to ensure an email address is not just well-formed, but also likely to exist.

---

## Features

- 📬 **Syntax Validation** — Checks if an email matches standard formats.
- 🌐 **Domain Verification** — Verifies if the domain is real and reachable.
- 📨 **MX Record Lookup** — Confirms that the domain accepts emails (via MX records).
- ⚡ **Fast and Lightweight** — Minimal dependencies, fast execution.
- 🛠️ **CLI and Programmatic API** — Use in scripts or integrate into your Node.js apps.
- 🛡️ **Custom Rules** — Add custom validation rules or disposable email lists.
- ✅ **Recommended Check** — Indicates if the email is valid and free of warnings.

---

## Installation

Install the library via npm:

```bash
npm install mail-validatr
```

For global CLI usage:

```bash
npm install -g mail-validatr
```

---

## Usage

### Programmatic (Node.js)

Import and use the `validateEmail` function:

```ts
import { validateEmail } from "mail-validatr";

async function checkEmail() {
  const result = await validateEmail("user@example.com");
  console.log(result);
}

checkEmail();
```

**Example output:**
```json
{
  "isValidSyntax": true,
  "hasValidDomain": true,
  "hasMxRecords": true,
  "warnings": [],
  "recommented": true
}
```

#### Skipping DNS Checks

For environments without network access, you can skip DNS and MX record validation:

```ts
await validateEmail("user@example.com", { skipDnsCheck: true });
```

#### Adding Custom Warning Rules

You can define custom rules for additional validation:

```ts
const customRules = [
  (email: string) => email.endsWith("@example.com") ? "Emails from example.com are not allowed." : null,
];

await validateEmail("user@example.com", { customWarningRules: customRules });
```

---

### CLI

Validate email addresses directly from the command line:

```bash
verify-email user@example.com
```

**Output:**
```
[RESULT] Validation result for user@example.com:
- Syntax valid: true
- Domain valid: true
- MX records found: true
- Warnings: None
- Recommended: Yes
```

#### Skipping DNS Checks

Use the `--skip-dns` flag to skip DNS and MX record validation:

```bash
verify-email user@example.com --skip-dns
```

#### Verbose Output

Enable verbose output with the `--verbose` flag:

```bash
verify-email user@example.com --verbose
```

---

## API

### `validateEmail(email: string, options?: ValidationOptions): Promise<EmailValidationResult>`

#### Parameters:

- **email** (string): The email address to validate.
- **options** (object, optional):
  - **skipDnsCheck** (boolean): If `true`, skips DNS and MX record validation.
  - **customDisposableList** (string[]): Add custom disposable email domains.
  - **customWarningRules** (Array<(email: string) => string | null>): Add custom validation rules.

#### Returns:

An `EmailValidationResult` object:

```ts
interface EmailValidationResult {
  isValidSyntax: boolean;
  hasValidDomain?: boolean;
  hasMxRecords?: boolean;
  warnings: string[];
  recommented: boolean;
}
```

---

### Useful Scripts

- **Build:** `npm run build`
- **Dev Mode (watch + test):** `npm run dev:test`
- **Run Tests:** `npx vitest`

---

## License

MIT © 2025  
Made with ❤️ by Jindrich Bobek

---