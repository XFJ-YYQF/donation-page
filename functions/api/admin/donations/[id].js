import { jsonResponse } from '../../../_lib/auth.js';

function validate(body) {
  if (!body) return '请求格式错误';
  if (!body.donor_name || !String(body.donor_name).trim()) return '捐赠者名称不能为空';
  if (!body.channel || !String(body.channel).trim()) return '捐赠渠道不能为空';
  const amount = Number(body.amount);
  if (!Number.isFinite(amount) || amount <= 0) return '捐赠金额必须为大于 0 的数字';
  return null;
}

// PUT /api/admin/donations/:id — edit any field of an existing record
export async function onRequestPut({ request, env, params }) {
  const id = Number(params.id);
  if (!Number.isInteger(id)) return jsonResponse({ error: '无效的记录 ID' }, 400);

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
    'UPDATE donations SET donor_name = ?, channel = ?, amount = ?, note = ?, created_at = ? WHERE id = ?'
  ).bind(
    String(body.donor_name).trim(),
    String(body.channel).trim(),
    Number(body.amount),
    body.note ? String(body.note).trim() : null,
    createdAt,
    id
  ).run();

  if (res.meta.changes === 0) return jsonResponse({ error: '记录不存在' }, 404);
  return jsonResponse({ ok: true });
}

// DELETE /api/admin/donations/:id
export async function onRequestDelete({ params, env }) {
  const id = Number(params.id);
  if (!Number.isInteger(id)) return jsonResponse({ error: '无效的记录 ID' }, 400);

  const res = await env.DB.prepare('DELETE FROM donations WHERE id = ?').bind(id).run();
  if (res.meta.changes === 0) return jsonResponse({ error: '记录不存在' }, 404);
  return jsonResponse({ ok: true });
}
