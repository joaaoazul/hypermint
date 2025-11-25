// brevo.js
const fetch = require('node-fetch');
const BREVO_KEY = process.env.BREVO_KEY;
const SENDER = process.env.BREVO_SENDER_EMAIL || 'noreply@hypermint.io';
const SENDER_NAME = process.env.BREVO_SENDER_NAME || 'Hypermint';

async function sendConfirmation(toEmail, confirmUrl){
  if (!BREVO_KEY) throw new Error('BREVO_KEY missing');
  const url = 'https://api.brevo.com/v3/smtp/email';
  const body = {
    sender: { name: SENDER_NAME, email: SENDER },
    to: [{ email: toEmail }],
    subject: 'Confirm your subscription to HyperMint Alpha',
    htmlContent: `<h2>Confirm your subscription</h2><p>Click <a href="${confirmUrl}">here</a> to confirm your subscription to HyperMint Alpha.</p>`,
  };
  const res = await fetch(url, {
    method:'POST',
    headers:{ 'Content-Type':'application/json', 'api-key': BREVO_KEY },
    body: JSON.stringify(body)
  });
  const json = await res.json();
  if (!res.ok) throw new Error('Brevo error: ' + JSON.stringify(json));
  return json;
}

module.exports = { sendConfirmation };