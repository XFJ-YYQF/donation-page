import { verifySessionToken, getCookie, jsonResponse } from '../../_lib/auth.js';

export async function onRequest({ request, env, next }) {
  const secret = env.SESSION_SECRET || env.ADMIN_PASSWORD || '';
  const token = getCookie(request, 'admin_session');
  const valid = secret ? await verifySessionToken(token, secret) : false;

  if (!valid) {
    return jsonResponse({ error: '未登录或登录已过期，请重新登录' }, 401);
  }

  return next();
}
