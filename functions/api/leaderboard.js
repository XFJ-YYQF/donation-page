import { jsonResponse } from '../_lib/auth.js';

// GET /api/leaderboard — public, aggregated & sorted donation leaderboard
export async function onRequestGet({ env }) {
  const { results } = await env.DB.prepare(
    'SELECT donor_name, channel, amount, note, created_at FROM donations ORDER BY created_at ASC'
  ).all();

  const byDonor = new Map();
  for (const row of results) {
    const key = row.donor_name;
    if (!byDonor.has(key)) {
      byDonor.set(key, { donor_name: key, total: 0, records: [] });
    }
    const entry = byDonor.get(key);
    entry.total += row.amount;
    entry.records.push({
      channel: row.channel,
      amount: row.amount,
      note: row.note,
      created_at: row.created_at
    });
  }

  const leaderboard = Array.from(byDonor.values()).map((entry) => ({
    donor_name: entry.donor_name,
    total: Math.round(entry.total * 100) / 100,
    count: entry.records.length,
    latest_channel: entry.records[entry.records.length - 1].channel,
    records: entry.records.slice().reverse() // newest first
  }));

  leaderboard.sort((a, b) => b.total - a.total);

  return jsonResponse(leaderboard, 200, { 'Cache-Control': 'no-store' });
}
