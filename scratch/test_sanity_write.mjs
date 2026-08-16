import fs from "fs";

let token = process.env.SANITY_API_WRITE_TOKEN;
if (!token && fs.existsSync(".env.prod.real")) {
  const envText = fs.readFileSync(".env.prod.real", "utf8");
  const match = envText.match(/SANITY_API_WRITE_TOKEN=["']?([^"'\r\n]+)["']?/);
  if (match) token = match[1].trim();
}

const projectId = "0lqwkcmg";
const dataset = "production";

async function testQuery() {
  const url = `https://${projectId}.api.sanity.io/v2025-01-01/data/query/${dataset}?query=${encodeURIComponent('*[_type == "blog"][0]{ _id, title }')}`;
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  const json = await res.json();
  console.log("Status:", res.status);
  console.log("Raw JSON:", json);
}

testQuery();
