// supabase.js
const { createClient } = require('@supabase/supabase-js');
const supa = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

async function insertSubscriberAndSend(email, confirmUrl){
  // insert row with is_confirmed = false
  await supa.from('subscribers').insert({ email, confirmed: false, confirm_url: confirmUrl });
  // optionally send email via supabase functions or 3rd party transactional provider
  return { ok:true };
}

module.exports = { insertSubscriberAndSend };