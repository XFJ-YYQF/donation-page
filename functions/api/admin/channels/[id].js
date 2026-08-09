import { jsonResponse } from '../../../_lib/auth.js';

// DELETE /api/admin/channels/:id — remove a channel from the picklist
// (existing donation records keep their stored channel text either way)
export async function onRequestDelete({ params, env }) {
  const id = Number(params.id);
  if (!Number.isInteger(id)) return jsonResponse({ error: '无效的渠道 ID' }, 400);

  const res = await env.DB.prepare('DELETE FROM channels WHERE id = ?').bind(id).run();
  if (res.meta.changes === 0) return jsonResponse({ error: '渠道不存在' }, 404);
  return jsonResponse({ ok: true });
}
