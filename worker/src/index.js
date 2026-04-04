function jsonResponse(data, status = 200, corsHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      ...corsHeaders
    }
  });
}

function buildCorsHeaders(origin, env) {
  const allowedOrigins = (env.ALLOWED_ORIGINS || '')
    .split(',')
    .map((v) => v.trim())
    .filter(Boolean);

  const allowOrigin = allowedOrigins.includes(origin) ? origin : '';

  return {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Vary': 'Origin'
  };
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function sanitize(value, max = 5000) {
  return String(value || '').replace(/[<>]/g, '').trim().slice(0, max);
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const origin = request.headers.get('Origin') || '';
    const corsHeaders = buildCorsHeaders(origin, env);

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    if (request.method !== 'POST' || url.pathname !== '/api/contact') {
      return jsonResponse({ ok: false, message: 'Not Found' }, 404, corsHeaders);
    }

    if (!corsHeaders['Access-Control-Allow-Origin']) {
      return jsonResponse({ ok: false, message: 'Origin not allowed' }, 403, corsHeaders);
    }

    let payload;
    try {
      payload = await request.json();
    } catch {
      return jsonResponse({ ok: false, message: 'Invalid JSON payload' }, 400, corsHeaders);
    }

    const name = sanitize(payload.name, 120);
    const business = sanitize(payload.business, 160);
    const email = sanitize(payload.email, 180);
    const message = sanitize(payload.message, 2000);
    const website = sanitize(payload.website, 120);

    if (website) {
      return jsonResponse({ ok: true, message: 'Accepted' }, 200, corsHeaders);
    }

    if (!name || !business || !email || !isValidEmail(email)) {
      return jsonResponse({ ok: false, message: 'Missing or invalid fields' }, 400, corsHeaders);
    }

    if (!env.RESEND_API_KEY || !env.FROM_EMAIL || !env.TO_EMAIL) {
      return jsonResponse(
        { ok: false, message: 'Server email configuration missing (RESEND_API_KEY/FROM_EMAIL/TO_EMAIL)' },
        500,
        corsHeaders
      );
    }

    const textBody = [
      'New bulk enquiry received from Himalyan Organic Farm website',
      '',
      `Name: ${name}`,
      `Business: ${business}`,
      `Email: ${email}`,
      '',
      'Requirement:',
      message || 'No message provided.'
    ].join('\n');

    // With Resend free plan using onboarding@resend.dev, only the verified
    // account email can receive. Once you add a verified domain in Resend,
    // change FROM_EMAIL to youremail@yourdomain.com and CC will work for any address.
    const recipients = [env.TO_EMAIL];
    if (env.CC_EMAIL && env.CC_EMAIL !== env.TO_EMAIL) {
      recipients.push(env.CC_EMAIL);
    }

    const mailPayload = {
      from: `Himalyan Organic Farm <${env.FROM_EMAIL}>`,
      to: recipients,
      subject: `Bulk Millet Enquiry from ${business}`,
      text: textBody,
      reply_to: email
    };

    const mailRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${env.RESEND_API_KEY}`
      },
      body: JSON.stringify(mailPayload)
    });

    if (!mailRes.ok) {
      const errorText = await mailRes.text();
      return jsonResponse({ ok: false, message: `Email provider failed: ${errorText}` }, 502, corsHeaders);
    }

    return jsonResponse({ ok: true, message: 'Enquiry sent' }, 200, corsHeaders);
  }
};
