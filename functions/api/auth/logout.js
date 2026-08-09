import { sessionCookieName, jsonResponse } from '../../_lib/auth.js';

export async function onRequestPost() {
  return jsonResponse(
    { ok: true },
    200,
    { 'Set-Cookie': `${sessionCookieName()}=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0` }
  );
}
