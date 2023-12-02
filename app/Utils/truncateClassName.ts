export function truncateClassName(className: string): string {
  className = className.endsWith('_C') ? className.slice(0, -2) : className

  if (className.startsWith('Desc_')) {
    return className.substring(5)
  }

  if (className.startsWith('Build_')) {
    return className.substring(6)
  }

  if (className.startsWith('Recipe_')) {
    return className.substring(7)
  }

  if (className.startsWith('BP_')) {
    return className.substring(3)
  }

  throw new Error(`Unknown class name: ${className}`)
}
