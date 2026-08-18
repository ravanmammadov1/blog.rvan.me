const fetch = globalThis.fetch;
const query = '*[_type == "blog"]{ _id, title, title_az, "slug": slug.current, "slug_az": slug_az.current, category, publishDate } | order(_createdAt asc)';
const url = `https://0lqwkcmg.api.sanity.io/v2025-01-01/data/query/production?query=${encodeURIComponent(query)}`;

const res = await fetch(url);
const data = await res.json();
console.log(`Total blogs in Sanity: ${data.result?.length}`);
for (const b of data.result || []) {
  console.log(`ID: ${b._id} | SLUG: ${b.slug} | TITLE: ${b.title}`);
}
