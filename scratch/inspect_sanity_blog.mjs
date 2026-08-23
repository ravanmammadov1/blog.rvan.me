async function run() {
  const url = 'https://0lqwkcmg.api.sanity.io/v2025-01-01/data/query/production?query=' + encodeURIComponent('*[_type == "blog"][0]');
  const res = await fetch(url);
  const json = await res.json();
  console.log("Keys:", Object.keys(json.result || {}));
  console.log("Title:", json.result?.title);
  console.log("Slug:", json.result?.slug);
  console.log("Category:", json.result?.category);
  console.log("Author:", json.result?.author);
  console.log("Sample body block types:", json.result?.body?.map(b => b._type));
}
run();
