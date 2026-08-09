import { jsonResponse } from '../../_lib/auth.js';

function validate(body) {
  if (!body) return '请求格式错误';
  if (!body.donor_name || !String(body.donor_name).trim()) return '捐赠者名称不能为空';
  if (!body.channel || !String(body.channel).trim()) return '捐赠渠道不能为空';
  const amount = Number(body.amount);
  if (!Number.isFinite(amount) || amount <= 0) return '捐赠金额必须为大于 0 的数字';
  return null;
}

// GET /api/admin/donations — list every raw donation record (for the admin table)
export async function onRequestGet({ env }) {
  const { results } = await env.DB.prepare(
    'SELECT id, donor_name, channel, amount, note, is_anonymous, created_at FROM donations ORDER BY created_at DESC, id DESC'
  ).all();
  return jsonResponse(results);
}

// POST /api/admin/donations — create a new donation record (also used to "追加捐赠")
export async function onRequestPost({ request, env }) {
  let body;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: '请求格式错误' }, 400);
  }

  const err = validate(body);
  if (err) return jsonResponse({ error: err }, 400);

  const createdAt = body.created_at && String(body.created_at).trim()
    ? new Date(body.created_at).toISOString()
    : new Date().toISOString();

  const res = await env.DB.prepare(
    'INSERT INTO donations (donor_name, channel, amount, note, is_anonymous, created_at) VALUES (?, ?, ?, ?, ?, ?)'
  ).bind(
    String(body.donor_name).trim(),
    String(body.channel).trim(),
    Number(body.amount),
    body.note ? String(body.note).trim() : null,
    body.is_anonymous ? 1 : 0,
    createdAt
  ).run();

  return jsonResponse({ ok: true, id: res.meta.last_row_id }, 201);
}
