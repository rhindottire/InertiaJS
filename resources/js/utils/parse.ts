export function parseMySQLDate(mysqlDate: string): Date | undefined {
  const parts = mysqlDate.split('-');
  if (parts.length !== 3) return undefined;
  const [year, month, day] = parts.map(Number);
  return new Date(year, month - 1, day); // month is 0-based
}
