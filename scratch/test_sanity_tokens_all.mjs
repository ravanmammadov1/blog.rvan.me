import fs from "fs";

const projectId = "0lqwkcmg";
const dataset = "production";

async function testToken(token, source) {
  const cleanToken = token.replace(/["']/g, "").trim();
  const url = `https://${projectId}.api.sanity.io/v2025-01-01/data/query/${dataset}?query=${encodeURIComponent('*[_type == "blog"][0]{ _id, title }')}`;
  try {
    const res = await fetch(url, { headers: { Authorization: `Bearer ${cleanToken}` } });
    const json = await res.json();
    console.log(`Source: ${source} | Status: ${res.status} | OK: ${res.ok} | Title: ${json.result?.title}`);
  } catch (err) {
    console.log(`Source: ${source} | Error: ${err.message}`);
  }
}

async function run() {
  const files = ['.env.production.local', '.env.prod.real', '.env.local', '.env'];
  for (const f of files) {
    if (fs.existsSync(f)) {
      const text = fs.readFileSync(f, 'utf8');
      const lines = text.split('\n');
      for (const line of lines) {
        if (line.includes('TOKEN') && line.includes('=')) {
          const [, val] = line.split('=');
          if (val) {
            await testToken(val, f);
          }
        }
      }
    }
  }

  // Also check if public query without token works
  const publicUrl = `https://${projectId}.api.sanity.io/v2025-01-01/data/query/${dataset}?query=${encodeURIComponent('*[_type == "blog"][0]{ _id, title }')}`;
  const pRes = await fetch(publicUrl);
  const pJson = await pRes.json();
  console.log(`Public query (no auth) | Status: ${pRes.status} | Title: ${pJson.result?.title}`);
}

run();
