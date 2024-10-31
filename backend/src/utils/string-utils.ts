export function format(str: string): string {
  return str
    .split(/(?=[A-Z])/)
    .map((part) => part.toLowerCase())
    .join(" ");
}
