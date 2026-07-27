const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function run() {
  const email = 'test9@example.com';
  const passwordsToTry = ['password', 'password123', 'test9', 'test9password', '12345678'];
  
  for (const pw of passwordsToTry) {
    const { data } = await supabase.auth.signInWithPassword({ email, password: pw });
    if (data?.user) {
      console.log(`Success! test9 ID:`, data.user.id);
      const { data: member } = await supabase.from('members').select('*').eq('id', data.user.id).single();
      console.log('test9 member row:', member);
      return;
    }
  }
  console.log('Could not log in to test9@example.com');
}
run();
