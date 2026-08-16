const projectId = "0lqwkcmg";
const dataset = "production";

async function fetchBlogs() {
  const query = '*[_type == "blog"]{ _id, title, "slug": slug.current, category, tags, publishDate, author, excerpt, readTime, status } | order(_createdAt asc)';
  const url = `https://${projectId}.api.sanity.io/v2025-01-01/data/query/${dataset}?query=${encodeURIComponent(query)}`;
  const res = await fetch(url);
  const json = await res.json();
  console.log("Total blogs returned:", json.result ? json.result.length : 0);
  console.log(JSON.stringify(json.result, null, 2));
}

fetchBlogs();
