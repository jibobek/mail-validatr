const disposableDomains = [
  'mailinator.com',
  'tempmail.com',
  '10minutemail.com',
  'guerrillamail.com',
  'yopmail.com',
  'trashmail.com',
  'getnada.com',
]

export function isDisposableEmail(
  domain: string,
  customList: string[] = []
): boolean {
  const combinedList = [...disposableDomains, ...customList]
  return combinedList.includes(domain)
}
