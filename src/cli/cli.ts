#!/usr/bin/env node
import minimist from 'minimist'
import { validateEmail } from '../index.js'

const argv = minimist(process.argv.slice(2), {
  boolean: ['skip-dns', 'verbose'],
  alias: { s: 'skip-dns', v: 'verbose' },
})

const emails: string[] = argv._
const skipDns = argv['skip-dns'] || false
const verbose = argv['verbose'] || false

if (emails.length === 0) {
  console.error('Usage: mail-validatr [--skip-dns] [--verbose] <emails...>')
  process.exit(1)
}

;(async () => {
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
})()
