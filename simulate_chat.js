const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const email = `test_chat_simulate2_${Date.now()}@example.com`;
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

  // Wait a sec for the triggers to create the member row
  await new Promise(r => setTimeout(r, 1000));

  console.log("Simulating insert with member_id, message, response...");
  const { data: userInsert, error: userErr } = await authSupabase.from('chat_logs').insert({
    member_id: signUpData.user.id,
    message: 'Hello AI',
    response: 'Hello User'
  }).select();
  console.log("Insert err:", userErr);
  console.log("Insert data:", userInsert);

  console.log("Fetching chat history...");
  const { data: history, error: historyErr } = await authSupabase
    .from('chat_logs')
    .select('message, response, created_at')
    .eq('member_id', signUpData.user.id)
    .order('created_at', { ascending: true });
    
  console.log("History err:", historyErr);
  console.log("History:", history);
}
run();
