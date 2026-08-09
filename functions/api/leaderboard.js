import { jsonResponse } from '../_lib/auth.js';

// GET /api/leaderboard — public, aggregated & sorted donation leaderboard
export async function onRequestGet({ env }) {
  const { results } = await env.DB.prepare(
    'SELECT id, donor_name, channel, amount, note, is_anonymous, created_at FROM donations ORDER BY created_at ASC'
  ).all();

  const byDonor = new Map();
  const entries = [];
  let grandTotal = 0;

  for (const row of results) {
    grandTotal += row.amount;

    if (row.is_anonymous) {
      // Anonymous donations never merge with anyone else, even by the same name.
      entries.push({
        key: `anon-${row.id}`,
        donor_name: '匿名支持者',
        anonymous: true,
        total: row.amount,
        count: 1,
        latest_channel: row.channel,
        records: [{ channel: row.channel, amount: row.amount, note: row.note, created_at: row.created_at }]
      });
      continue;
    }

    const key = row.donor_name;
    if (!byDonor.has(key)) {
      const entry = {
        key,
        donor_name: key,
        anonymous: false,
        total: 0,
        records: []
      };
      byDonor.set(key, entry);
      entries.push(entry);
    }
    const entry = byDonor.get(key);
    entry.total += row.amount;
    entry.records.push({ channel: row.channel, amount: row.amount, note: row.note, created_at: row.created_at });
  }

  const leaderboard = entries.map((entry) => ({
    donor_name: entry.donor_name,
    anonymous: entry.anonymous,
    total: Math.round(entry.total * 100) / 100,
    count: entry.records.length,
    latest_channel: entry.latest_channel || entry.records[entry.records.length - 1].channel,
    records: entry.records.slice().reverse() // newest first
  }));

  leaderboard.sort((a, b) => b.total - a.total);

  return jsonResponse(
    {
      total: Math.round(grandTotal * 100) / 100,
      supporterCount: leaderboard.length,
      leaderboard
    },
    200,
    { 'Cache-Control': 'no-store' }
  );
}
