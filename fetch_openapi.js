const fetch = require('node-fetch');
require('dotenv').config({ path: '.env.local' });

async function getOpenAPI() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/`, {
    headers: {
      apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    }
  });
  const data = await res.json();
  if (data.definitions) {
    console.log(Object.keys(data.definitions));
    console.log('chat_logs keys:', data.definitions.chat_logs ? Object.keys(data.definitions.chat_logs.properties) : 'Not found');
  } else if (data.components && data.components.schemas) {
    console.log(Object.keys(data.components.schemas));
    console.log('chat_logs keys:', data.components.schemas.chat_logs ? Object.keys(data.components.schemas.chat_logs.properties) : 'Not found');
  } else {
    console.log(Object.keys(data));
  }
}

getOpenAPI();
