import fs from 'fs';

function readEnv(){
  const raw = fs.existsSync('.env') ? fs.readFileSync('.env','utf8') : '';
  const out = {};
  for(const line of raw.split(/\r?\n/)){
    const m = line.match(/^([A-Za-z0-9_]+)=(?:"([^"]*)"|(.*))$/);
    if(m) out[m[1]] = m[2] !== undefined ? m[2] : m[3];
  }
  return out;
}

async function testOpenAI(key){
  const resp = await fetch('https://api.openai.com/v1/chat/completions',{
    method:'POST',
    headers:{
      'Content-Type':'application/json',
      'Authorization':`Bearer ${key}`
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages:[{role:'user',content:'Say: OpenAI key working.'}],
      max_tokens: 20
    })
  });
  return await resp.json();
}

async function testGemini(key){
  const url = `https://generativelanguage.googleapis.com/v1/models/chat-bison-001:generate?key=${encodeURIComponent(key)}`;
  const body = {
    messages: [
      {author: 'user', content: [{type: 'text', text: 'Say: Gemini key working.'}]}
    ],
    maxOutputTokens: 60
  };
  const resp = await fetch(url,{
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify(body)
  });
  const text = await resp.text();
  return { status: resp.status, ok: resp.ok, body: text };
}

async function main(){
  const env = readEnv();
  const openaiKey = env.VITE_LLM_API_KEY || process.env.VITE_LLM_API_KEY;
  const geminiKey = env.VITE_GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;

  if(geminiKey){
    console.log('Testing Gemini key...');
    const res = await testGemini(geminiKey);
    console.log(JSON.stringify(res, null, 2));
    return;
  }

  if(openaiKey){
    console.log('No Gemini key found; testing OpenAI key...');
    const res = await testOpenAI(openaiKey);
    console.log(JSON.stringify(res, null, 2));
    return;
  }

  console.error('No API key found in .env or environment variables.');
  process.exit(1);
}

main().catch(e=>{console.error(e); process.exit(1)});
