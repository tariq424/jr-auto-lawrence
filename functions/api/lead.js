// POST /api/lead — store a website lead (contact form, booking, chat) in D1.
//
// Graceful by design: if the D1 binding `DB` is not configured yet, or the
// database write fails for any reason, this still answers { ok: true,
// stored: false } so the visitor's experience never breaks. The only hard
// failure is a completely empty lead, answered 400 { ok: false }.

const TYPES = ['form', 'chat', 'booking'];

function clean(value, max) {
  if (value === null || value === undefined) return '';
  return String(value).slice(0, max);
}

function json(body, status) {
  return new Response(JSON.stringify(body), {
    status: status || 200,
    headers: { 'Content-Type': 'application/json' }
  });
}

export async function onRequestPost(context) {
  let data;
  try {
    data = await context.request.json();
  } catch (e) {
    return json({ ok: false, error: 'invalid json' }, 400);
  }

  const lead = {
    type: TYPES.indexOf(data.type) >= 0 ? data.type : 'form',
    name: clean(data.name, 120),
    phone: clean(data.phone, 40),
    email: clean(data.email, 160),
    vehicle: clean(data.vehicle, 160),
    services: Array.isArray(data.services)
      ? data.services.map(function (s) { return clean(s, 80); }).join(', ').slice(0, 500)
      : clean(data.services, 500),
    message: clean(data.message, 2000),
    lang: data.lang === 'es' ? 'es' : 'en'
  };

  // Minimal validation: at least a name, a phone, or a message must exist.
  if (!lead.name && !lead.phone && !lead.message) {
    return json({ ok: false, error: 'empty lead' }, 400);
  }

  const db = context.env && context.env.DB;
  if (!db) {
    // Backend not wired up yet — accept the lead, report it was not stored.
    return json({ ok: true, stored: false });
  }

  try {
    await db
      .prepare(
        'INSERT INTO leads (type, name, phone, email, vehicle, services, message, lang) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8)'
      )
      .bind(lead.type, lead.name, lead.phone, lead.email, lead.vehicle, lead.services, lead.message, lead.lang)
      .run();
    return json({ ok: true, stored: true });
  } catch (e) {
    // Table missing or DB hiccup — never surface a 500 to the visitor.
    return json({ ok: true, stored: false });
  }
}
