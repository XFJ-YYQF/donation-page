import { jsonResponse } from '../../_lib/auth.js';

// GET /api/admin/channels — list all saved channel names (for the donation form select)
export async function onRequestGet({ env }) {
  const { results } = await env.DB.prepare(
    'SELECT id, name FROM channels ORDER BY name ASC'
  ).all();
  return jsonResponse(results);
}

// POST /api/admin/channels — add a new channel to the picklist
export async function onRequestPost({ request, env }) {
  let body;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: '请求格式错误' }, 400);
  }

  const name = body && typeof body.name === 'string' ? body.name.trim() : '';
  if (!name) return jsonResponse({ error: '渠道名称不能为空' }, 400);
  if (name.length > 40) return jsonResponse({ error: '渠道名称过长' }, 400);

  try {
    const res = await env.DB.prepare('INSERT INTO channels (name) VALUES (?)').bind(name).run();
    return jsonResponse({ ok: true, id: res.meta.last_row_id, name }, 201);
  } catch (e) {
    // Likely a UNIQUE constraint violation — treat as "already exists" rather than a hard error.
    const existing = await env.DB.prepare('SELECT id, name FROM channels WHERE name = ?').bind(name).first();
    if (existing) return jsonResponse({ ok: true, id: existing.id, name: existing.name }, 200);
    return jsonResponse({ error: '添加渠道失败' }, 500);
  }
}
