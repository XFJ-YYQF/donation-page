import { jsonResponse } from '../../../_lib/auth.js';

function normalizeDonation(body) {
  if (!body) return { error: '请求格式错误' };
  const donorName = String(body.donor_name || '').trim();
  // Empty name always counts as anonymous (no checkbox required).
  const isAnonymous = !!body.is_anonymous || !donorName;
  if (!body.channel || !String(body.channel).trim()) return { error: '捐赠渠道不能为空' };
  const amount = Number(body.amount);
  if (!Number.isFinite(amount) || amount <= 0) return { error: '捐赠金额必须为大于 0 的数字' };
  return {
    donorName,
    isAnonymous,
    channel: String(body.channel).trim(),
    amount,
    note: body.note ? String(body.note).trim() : null
  };
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

  const parsed = normalizeDonation(body);
  if (parsed.error) return jsonResponse({ error: parsed.error }, 400);

  const createdAt = body.created_at && String(body.created_at).trim()
    ? new Date(body.created_at).toISOString()
    : new Date().toISOString();

  const res = await env.DB.prepare(
    'UPDATE donations SET donor_name = ?, channel = ?, amount = ?, note = ?, is_anonymous = ?, created_at = ? WHERE id = ?'
  ).bind(
    parsed.donorName,
    parsed.channel,
    parsed.amount,
    parsed.note,
    parsed.isAnonymous ? 1 : 0,
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
