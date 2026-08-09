import { createSessionToken, sessionCookieName, timingSafeEqual, jsonResponse } from '../../_lib/auth.js';

export async function onRequestPost({ request, env }) {
  if (!env.ADMIN_PASSWORD) {
    return jsonResponse({ error: '服务器未配置管理员密码（ADMIN_PASSWORD）' }, 500);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: '请求格式错误' }, 400);
  }

  const password = typeof body?.password === 'string' ? body.password : '';
  if (!timingSafeEqual(password, env.ADMIN_PASSWORD)) {
    return jsonResponse({ error: '密码错误' }, 401);
  }

  const secret = env.SESSION_SECRET || env.ADMIN_PASSWORD;
  const token = await createSessionToken(secret);

  return jsonResponse(
    { ok: true },
    200,
    {
      'Set-Cookie': `${sessionCookieName()}=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${7 * 24 * 60 * 60}`
    }
  );
}
