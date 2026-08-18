import fs from 'fs';

const exp = JSON.parse(fs.readFileSync('sanity_to_wp_export.json', 'utf8'));
console.log('SiteSettings from export:', exp.siteSettings);
