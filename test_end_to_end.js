const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const email = `test_bot_${Date.now()}@example.com`;
  
  console.log('1. Signing up', email);
  const { data: signUpData, error } = await supabase.auth.signUp({
    email,
    password: 'password123',
    options: {
      data: {
        full_name: 'Robot Tester',
        city: 'Mumbai',
        chapter_id: '72932d86-f50e-48b5-b893-25bb36d71eb8'
      },
      emailRedirectTo: `http://localhost:3000/auth/callback`,
    },
  });

  if (error) {
    console.error('Signup failed:', error);
    return;
  }

  console.log('2. User ID created:', signUpData.user.id);
  
  // Simulate the actions.ts update (since we are bypassing the Next.js form)
  console.log('3. Simulating Server Action (actions.ts) update step');
  const authSupabase = createClient(supabaseUrl, supabaseKey, {
    global: {
      headers: {
        Authorization: `Bearer ${signUpData.session.access_token}`,
      },
    },
  });

  const { error: updateError } = await authSupabase
    .from('members')
    .update({
      full_name: 'Robot Tester',
      city: 'Mumbai',
      chapter_id: '72932d86-f50e-48b5-b893-25bb36d71eb8'
    })
    .eq('id', signUpData.user.id);

  if (updateError) {
    console.error('Update failed:', updateError);
  } else {
    console.log('4. Update successful!');
  }

  console.log('5. Querying database immediately for the row...');
  const { data: member } = await supabase.from('members').select('*').eq('id', signUpData.user.id).single();
  console.log('FINAL RAW DB ROW:');
  console.log(JSON.stringify(member, null, 2));
}
run();
