// Cloudflare Pages Function, handles POST /api/contact
// Requires a RESEND_API_KEY environment variable (set as a secret in the
// Pages project settings, or via `wrangler pages secret put RESEND_API_KEY`).
// Sign up for a free key at https://resend.com

const TO_ADDRESS = 'contact@tboner.cc';
const FROM_ADDRESS = 'TBone site <onboarding@resend.dev>';

export async function onRequestPost({ request, env }) {
  let data;
  try {
    data = await request.json();
  } catch (err) {
    return json({ error: 'Invalid request.' }, 400);
  }

  const { name, email, message, company } = data;

  // Honeypot: a hidden field real visitors never fill in.
  if (company) {
    return json({ ok: true });
  }

  if (!name || !email || !message) {
    return json({ error: 'Name, email, and message are all required.' }, 400);
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json({ error: 'That email address doesn\'t look right.' }, 400);
  }

  if (!env.RESEND_API_KEY) {
    return json({ error: 'Contact form isn\'t configured yet.' }, 500);
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: FROM_ADDRESS,
      to: TO_ADDRESS,
      reply_to: email,
      subject: `New message from ${name}`,
      text: `From: ${name} <${email}>\n\n${message}`,
    }),
  });

  if (!res.ok) {
    return json({ error: 'Could not send right now. Try again in a bit.' }, 502);
  }

  return json({ ok: true });
}

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
