// GET /api/leads — read recent leads (owner only).
//
// Requires the request header `x-admin-key` to match the ADMIN_KEY secret
// configured on the Pages project. Without a match: 401. This endpoint is
// for Tariq / Koda to pull leads later; the website itself never calls it.

function json(body, status) {
  return new Response(JSON.stringify(body), {
    status: status || 200,
    headers: { 'Content-Type': 'application/json' }
  });
}

export async function onRequestGet(context) {
  const env = context.env || {};
  const provided = context.request.headers.get('x-admin-key');
  if (!env.ADMIN_KEY || !provided || provided !== env.ADMIN_KEY) {
    return json({ ok: false, error: 'unauthorized' }, 401);
  }

  if (!env.DB) {
    return json({ ok: false, error: 'db not configured' }, 503);
  }

  try {
    const result = await env.DB
      .prepare('SELECT id, created_at, type, name, phone, email, vehicle, services, message, lang FROM leads ORDER BY id DESC LIMIT 100')
      .all();
    return json({ ok: true, leads: result.results || [] });
  } catch (e) {
    return json({ ok: false, error: 'db read failed' }, 503);
  }
}
