# HyperMint Alpha Subscribe Module

Standalone microservice for collecting double-opt-in subscriptions.

## 1. Installation

```bash
cd backend
npm install express express-rate-limit body-parser dotenv node-fetch nodemailer @supabase/supabase-js
```

## 2. Configuration

Create `.env` in `subscribe/backend/`:

```env
PORT=4001
PUBLIC_URL=http://localhost:4001
# Provider Options: mailchimp, brevo, nodemailer_mysql, supabase
MAIL_PROVIDER=
BREVO_KEY=
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
DB_URL=
```

## 3. Usage

Start the server:
```bash
node server.js
```

Visit `http://localhost:4001` to see the frontend.

## 4. API Endpoints

- `POST /api/subscribe` { email, source }
- `GET /api/confirm?token=...`
