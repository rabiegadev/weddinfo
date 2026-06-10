function pad2(value: number): string {
  return String(value).padStart(2, "0");
}

/** `YYYY-MM-DD HH:MM:SS` bez milisekund — zgodne z MySQL DATETIME. */
export function formatMysqlDateTime(date: Date): string {
  const d = new Date(date);
  d.setMilliseconds(0);
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())} ${pad2(d.getHours())}:${pad2(d.getMinutes())}:${pad2(d.getSeconds())}`;
}

export function mysqlDateTimeNow(): string {
  return formatMysqlDateTime(new Date());
}

export function mysqlDateOnly(value: string): string {
  return value.slice(0, 10);
}
