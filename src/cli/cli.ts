#!/usr/bin/env node
import { validateEmail } from '../index.js'
import { Command } from 'commander'

const program = new Command()

program
  .name('mail-validatr')
  .description('Validate one or more email addresses')
  .argument('<emails...>', 'Email addresses to validate')
  .option('-s, --skip-dns', 'Skip DNS and MX record validation')
  .option('-v, --verbose', 'Enable verbose output')
  .action(
    async (
      emails: string[],
      options: { skipDns: boolean; verbose: boolean }
    ) => {
      const { skipDns, verbose } = options

      for (const email of emails) {
        if (verbose) {
          console.log(`\n[INFO] Starting validation for email: ${email}`)
          console.log(`[INFO] Options: { skipDnsCheck: ${skipDns} }`)
        }

        try {
          const result = await validateEmail(email, { skipDnsCheck: skipDns })

          console.log(`\n[RESULT] Validation result for ${email}:`)
          console.log(`- Syntax valid: ${result.isValidSyntax}`)
          console.log(`- Domain valid: ${result.hasValidDomain}`)
          console.log(`- MX records found: ${result.hasMxRecords}`)
          console.log(
            `- Warnings: ${result.warnings.map((w) => w.message).join(', ') || 'None'}`
          )
          console.log(`- Recommended: ${result.recommended ? 'Yes' : 'No'}`)

          if (verbose) {
            console.log(`[DETAILS] Full result object:`, result)
          }
        } catch (error) {
          if (error instanceof Error) {
            console.error(`[ERROR] Error validating ${email}:`, error.message)
          } else {
            console.error(`[ERROR] Unknown error validating ${email}:`, error)
          }
        }
      }
    }
  )

program.parse(process.argv)
