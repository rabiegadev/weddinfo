type MysqlLikeError = {
  code?: string;
  errno?: number;
  sqlMessage?: string;
  message?: string;
  cause?: unknown;
};

export function extractMysqlErrorMessage(error: unknown): string | null {
  let current: unknown = error;
  for (let depth = 0; depth < 4 && current; depth += 1) {
    if (typeof current !== "object" || current === null) break;
    const e = current as MysqlLikeError;
    if (typeof e.sqlMessage === "string" && e.sqlMessage.trim()) return e.sqlMessage;
    if (typeof e.message === "string" && e.message.startsWith("Failed query:")) {
      current = e.cause;
      continue;
    }
    if (e.cause) {
      current = e.cause;
      continue;
    }
    break;
  }
  return null;
}

export function extractMysqlErrorCode(error: unknown): string | null {
  let current: unknown = error;
  for (let depth = 0; depth < 4 && current; depth += 1) {
    if (typeof current !== "object" || current === null) break;
    const e = current as MysqlLikeError;
    if (typeof e.code === "string" && e.code.trim()) return e.code;
    current = e.cause;
  }
  return null;
}
