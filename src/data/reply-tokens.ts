import { and, eq, gt, isNull } from "drizzle-orm";
import { getDb, replyTokens } from "@/db";
import { hashReplyToken } from "@/lib/token";

export async function insertReplyToken(
  inquiryId: string,
  tokenPlain: string,
  expiresAt: Date,
): Promise<void> {
  const db = getDb();
  await db.insert(replyTokens).values({
    inquiryId,
    tokenHash: hashReplyToken(tokenPlain),
    expiresAt,
  });
}

export async function findValidReplyToken(
  inquiryId: string,
  tokenPlain: string,
): Promise<{ id: string } | null> {
  const db = getDb();
  const hash = hashReplyToken(tokenPlain);
  const now = new Date();
  const [row] = await db
    .select({ id: replyTokens.id })
    .from(replyTokens)
    .where(
      and(
        eq(replyTokens.inquiryId, inquiryId),
        eq(replyTokens.tokenHash, hash),
        isNull(replyTokens.usedAt),
        gt(replyTokens.expiresAt, now),
      ),
    )
    .limit(1);
  return row ?? null;
}

export async function markReplyTokenUsed(tokenId: string): Promise<void> {
  const db = getDb();
  await db
    .update(replyTokens)
    .set({ usedAt: new Date() })
    .where(eq(replyTokens.id, tokenId));
}
