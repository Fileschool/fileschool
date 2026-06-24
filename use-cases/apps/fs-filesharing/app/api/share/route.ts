import { NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { db, schema } from "@/lib/db";
import { MAX_FILE_BYTES } from "@/lib/utils";
import { eq, and, gt, count } from "drizzle-orm";

export const runtime = "nodejs";

type CreateBody = {
  handle?: string;
  url?: string;
  filename?: string;
  mimetype?: string;
  size?: number;
  fingerprint?: string;
};

export async function POST(req: Request) {
  let body: CreateBody;
  try {
    body = (await req.json()) as CreateBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { handle, url, filename, mimetype, size, fingerprint } = body;

  if (
    !handle ||
    !url ||
    !filename ||
    !mimetype ||
    typeof size !== "number" ||
    Number.isNaN(size)
  ) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 },
    );
  }

  if (size <= 0 || size > MAX_FILE_BYTES) {
    return NextResponse.json(
      { error: `File must be between 1 byte and ${MAX_FILE_BYTES} bytes` },
      { status: 400 },
    );
  }

  if (!/^https:\/\/cdn\.filestackcontent\.com\//.test(url)) {
    return NextResponse.json(
      { error: "URL must be a Filestack CDN link" },
      { status: 400 },
    );
  }

  const actualFingerprint = fingerprint || "unknown";

  const twentyFourHoursAgo = Date.now() - 24 * 60 * 60 * 1000;
  const [rateLimitResult] = await db
    .select({ count: count() })
    .from(schema.shares)
    .where(
      and(
        eq(schema.shares.fingerprint, actualFingerprint),
        gt(schema.shares.createdAt, twentyFourHoursAgo)
      )
    );

  if (rateLimitResult.count >= 10) {
    return NextResponse.json(
      { error: "Rate limit exceeded: maximum 10 uploads per day." },
      { status: 429 }
    );
  }

  const id = nanoid();
  const code = nanoid(10);
  const createdAt = Date.now();

  await db.insert(schema.shares).values({
    id,
    code,
    handle,
    url,
    filename,
    mimetype,
    size,
    createdAt,
    fingerprint: actualFingerprint,
  });

  return NextResponse.json({ code, id });
}
