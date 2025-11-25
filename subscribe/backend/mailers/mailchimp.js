// mailchimp.js
const fetch = require('node-fetch');
const MAILCHIMP_KEY = process.env.MAILCHIMP_KEY;
const MAILCHIMP_SERVER = process.env.MAILCHIMP_SERVER; // e.g. us19
const MAILCHIMP_LIST_ID = process.env.MAILCHIMP_LIST_ID;

if (!MAILCHIMP_KEY || !MAILCHIMP_SERVER || !MAILCHIMP_LIST_ID) {
  console.warn('Mailchimp not configured');
}

async function sendConfirmation(email, confirmUrl){
  // Add the user to a list as pending (double opt in via Mailchimp can send confirm automatically)
  const url = `https://${MAILCHIMP_SERVER}.api.mailchimp.com/3.0/lists/${MAILCHIMP_LIST_ID}/members`;
  const body = {
    email_address: email,
    status: 'pending', // 'pending' triggers Mailchimp double opt-in
    merge_fields: { CONFIRM_URL: confirmUrl }
  };
  const res = await fetch(url, {
    method:'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type':'application/json', 'Authorization': `apikey ${MAILCHIMP_KEY}` }
  });
  const data = await res.json();
  if (!res.ok) throw new Error('Mailchimp error: ' + JSON.stringify(data));
  return data;
}

module.exports = { sendConfirmation };