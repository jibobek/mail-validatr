#!/usr/bin/env node
import { validateEmail } from '../index.js'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'

const argv = yargs(hideBin(process.argv))
  .usage('Usage: $0 <emails...> [options]')
  .command('$0 <emails...>', 'Validate one or more email addresses')
  .option('skip-dns', {
    alias: 's',
    type: 'boolean',
    description: 'Skip DNS and MX record validation',
  })
  .option('verbose', {
    alias: 'v',
    type: 'boolean',
    description: 'Enable verbose output',
  })
  .help()
  .alias('help', 'h')
  .parseSync()

const emails = argv.emails as string[]
const skipDnsCheck = argv['skip-dns'] || false
const verbose = argv.verbose || false

;(async () => {
  for (const email of emails) {
    if (verbose) {
      console.log(`\n[INFO] Starting validation for email: ${email}`)
      console.log(`[INFO] Options: { skipDnsCheck: ${skipDnsCheck} }`)
    }

    try {
      const result = await validateEmail(email, { skipDnsCheck })

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
})()
