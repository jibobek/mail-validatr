export function testSyntax(email: string): boolean {
  return /^(?:[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*|"[^\r\n"]*")@(?:[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*|\[?(?:[0-9]{1,3}\.){3}[0-9]{1,3}\]?)$/.test(
    email
  )
}
