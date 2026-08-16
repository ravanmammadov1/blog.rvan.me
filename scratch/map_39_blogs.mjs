const projectId = "0lqwkcmg";
const dataset = "production";

async function mapBlogs() {
  const query = '*[_type == "blog"]{ _id, title, "slug": slug.current, category, publishDate, _createdAt } | order(_createdAt asc)';
  const url = `https://${projectId}.api.sanity.io/v2025-01-01/data/query/${dataset}?query=${encodeURIComponent(query)}`;
  const res = await fetch(url);
  const json = await res.json();
  const blogs = json.result || [];
  console.log(`Total blogs: ${blogs.length}`);
  blogs.forEach((b, idx) => {
    console.log(`${idx + 1}. [${b._id}] (slug: ${b.slug}) -> "${b.title}"`);
  });
}

mapBlogs();
