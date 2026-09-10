import "server-only";
import crypto from "node:crypto";
import { cookies } from "next/headers";

const COOKIE = "er_admin";
const SECRET = process.env.AUTH_SECRET || "dev-insecure-secret";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function sign(payload: string) {
  const h = crypto.createHmac("sha256", SECRET).update(payload).digest("base64url");
  return `${payload}.${h}`;
}

function verify(token: string): boolean {
  const i = token.lastIndexOf(".");
  if (i < 0) return false;
  const payload = token.slice(0, i);
  const expected = sign(payload).slice(payload.length + 1);
  const got = token.slice(i + 1);
  if (
    expected.length !== got.length ||
    !crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(got))
  )
    return false;
  const exp = Number(payload.split("|")[1]);
  return Number.isFinite(exp) && Date.now() < exp;
}

/** Verify a password against ADMIN_PASSWORD_HASH ("salt:scryptHex"). */
export function checkPassword(password: string): boolean {
  const stored = process.env.ADMIN_PASSWORD_HASH || "";
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const test = crypto.scryptSync(password, salt, 64).toString("hex");
  return (
    test.length === hash.length &&
    crypto.timingSafeEqual(Buffer.from(test), Buffer.from(hash))
  );
}

/** Verify e-mail + password for the admin panel. */
export function checkCredentials(email: string, password: string): boolean {
  const wanted = (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
  if (wanted && email.trim().toLowerCase() !== wanted) return false;
  return checkPassword(password);
}

export async function createSession() {
  const token = sign(`admin|${Date.now() + MAX_AGE * 1000}`);
  (await cookies()).set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function destroySession() {
  (await cookies()).delete(COOKIE);
}

export async function isAuthed(): Promise<boolean> {
  const token = (await cookies()).get(COOKIE)?.value;
  return Boolean(token && verify(token));
}
