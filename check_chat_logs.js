const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const email = `test_chat_simulate4_${Date.now()}@example.com`;
  const { data: signUpData, error } = await supabase.auth.signUp({
    email,
    password: 'password123',
    options: {
      data: { full_name: 'Robot Tester' },
      emailRedirectTo: `http://localhost:3000/auth/callback`,
    },
  });

  const authSupabase = createClient(supabaseUrl, supabaseKey, {
    global: {
      headers: {
        Authorization: `Bearer ${signUpData.session.access_token}`,
      },
    },
  });

  // Wait a sec
  await new Promise(r => setTimeout(r, 1000));

  const { error: insertError } = await authSupabase.from('chat_logs').insert({});
  console.log('Insert error empty:', insertError);
}
run();
