import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";

let url = process.env.TURSO_DATABASE_URL ?? "file:./fs-filesharing.db";

if (
  url !== "file:./fs-filesharing.db" &&
  !url.startsWith("libsql://") &&
  !url.startsWith("https://") &&
  !url.startsWith("http://") &&
  !url.startsWith("file:")
) {
  url = "libsql://" + url;
}

const authToken = process.env.TURSO_AUTH_TOKEN;

const client = createClient({ url, authToken });

export const db = drizzle(client, { schema });

export { schema };
