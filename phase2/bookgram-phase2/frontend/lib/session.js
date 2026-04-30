import { cookies } from "next/headers";
 
const COOKIE = "bg_uid";
const MAX_AGE = 60 * 60 * 24 * 7; 
 

export async function getSessionUserId() {
  const store = await cookies();
  const raw = store.get(COOKIE)?.value;
  if (!raw) return null;
  const id = parseInt(raw, 10);
  return Number.isFinite(id) ? id : null;
}
 

export async function setSession(userId) {
  const store = await cookies();
  store.set(COOKIE, String(userId), {
    httpOnly: true,
    sameSite: "lax",
    maxAge:   MAX_AGE,
    path:     "/",
  });
}
 

export async function clearSession() {
  const store = await cookies();
  store.set(COOKIE, "", { maxAge: 0, path: "/" });
}
 