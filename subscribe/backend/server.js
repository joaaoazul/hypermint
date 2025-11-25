// server.js
require('dotenv').config();
const express = require('express');
const rateLimit = require('express-rate-limit');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const path = require('path');
const { URL } = require('url');

const app = express();
app.use(bodyParser.json());

// Serve static frontend files for the standalone demo
app.use(express.static(path.join(__dirname, '../frontend')));

// Rate limiter: 100 req / 10 min per IP (ajustar)
const limiter = rateLimit({ windowMs: 10*60*1000, max: 600 });
app.use('/api/', limiter);

// Simple in-memory DB for demo (replace with real DB)
const SUBSCRIBERS = {}; // { token: { email, active, createdAt } }
const EMAIL_TO_TOKEN = {}; // map email->token for quick lookup

// Helpers
function genToken(){ return crypto.randomBytes(24).toString('hex'); }
function isEmail(s){ return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s); }

app.post('/api/subscribe', async (req, res) => {
  const { email, source } = req.body || {};
  if (!email || !isEmail(email)) return res.status(400).json({ error: 'Invalid email' });

  // throttle per email (basic)
  if (EMAIL_TO_TOKEN[email] && SUBSCRIBERS[EMAIL_TO_TOKEN[email]]?.active) {
    return res.status(200).json({ ok:true, message: 'Already subscribed' });
  }

  const token = genToken();
  const entry = { email, active:false, createdAt: Date.now(), token, source: source || null };
  SUBSCRIBERS[token] = entry;
  EMAIL_TO_TOKEN[email] = token;

  // Confirmation URL
  const baseUrl = process.env.PUBLIC_URL || 'http://localhost:4001';
  const confirmUrl = new URL('/api/confirm', baseUrl);
  confirmUrl.searchParams.set('token', token);

  // choose provider by env var
  try {
    if (process.env.MAIL_PROVIDER === 'mailchimp') {
      const mailchimp = require('./mailers/mailchimp');
      await mailchimp.sendConfirmation(email, confirmUrl.toString());
    } else if (process.env.MAIL_PROVIDER === 'brevo') {
      const brevo = require('./mailers/brevo');
      await brevo.sendConfirmation(email, confirmUrl.toString());
    } else if (process.env.MAIL_PROVIDER === 'nodemailer_mysql') {
      const m = require('./mailers/nodemailer_mysql');
      await m.sendConfirmation(email, confirmUrl.toString());
    } else if (process.env.MAIL_PROVIDER === 'supabase') {
      const s = require('./mailers/supabase');
      await s.insertSubscriberAndSend(email, confirmUrl.toString());
    } else {
      // fallback: log to console (dev)
      console.log('------------------------------------------------');
      console.log('MOCK EMAIL SEND (No provider configured)');
      console.log('To: ', email);
      console.log('Confirm URL: ', confirmUrl.toString());
      console.log('------------------------------------------------');
    }
  } catch (err) {
    console.error('mail error', err);
    return res.status(500).json({ error: 'Sending confirmation failed' });
  }

  return res.json({ ok:true, message:'Confirmation sent' });
});

app.get('/api/confirm', (req, res) => {
  const token = req.query.token;
  if (!token || !SUBSCRIBERS[token]) return res.status(400).send('Invalid token');
  const entry = SUBSCRIBERS[token];
  entry.active = true;
  entry.confirmedAt = Date.now();

  // optionally persist to production DB here

  res.send(`
    <html>
      <body style="background:#05060a; color:white; font-family:sans-serif; display:flex; justify-content:center; align-items:center; height:100vh;">
        <div style="text-align:center; padding:40px; border:1px solid #333; border-radius:10px; background:#0A0C10;">
          <h2 style="color:#00ffb3">Confirmed!</h2>
          <p>${entry.email} is now subscribed to HyperMint Alpha.</p>
          <a href="/" style="color:#07f8ff">Back to Home</a>
        </div>
      </body>
    </html>
  `);
});

// Health
app.get('/health', (req,res)=> res.json({ ok:true }));

// Start
const PORT = process.env.PORT || 4001;
app.listen(PORT, ()=> console.log('Subscribe backend running on port ' + PORT));
