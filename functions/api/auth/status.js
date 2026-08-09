import { verifySessionToken, getCookie, jsonResponse } from '../../_lib/auth.js';

export async function onRequestGet({ request, env }) {
  const secret = env.SESSION_SECRET || env.ADMIN_PASSWORD || '';
  const token = getCookie(request, 'admin_session');
  const loggedIn = secret ? await verifySessionToken(token, secret) : false;
  return jsonResponse({ loggedIn });
}
