import fs from 'fs';

let content = fs.readFileSync('src/lib/ecosystemRelationshipMap.ts', 'utf8');

// Replace in relatedSlugs
content = content.replace(/"why-search-is-a-magnifying-glass",?\n?/g, '"why-notification-icon-is-a-bell",\n');
content = content.replace(/"why-phone-icon-is-a-1960s-telephone-receiver",?\n?/g, '"why-save-icon-is-still-a-floppy-disk",\n');
content = content.replace(/"why-settings-icon-is-a-mechanical-gear",?\n?/g, '"why-hamburger-menu-has-three-lines",\n');
content = content.replace(/"why-email-is-a-paper-envelope-icon",?\n?/g, '"why-delete-action-is-a-trash-can",\n');

// Clean AZ_TO_EN_SLUG_MAP entries
content = content.replace(/\s*"axtaris-niye-boyuducu-susedir":\s*"why-search-is-a-magnifying-glass",?/g, '');
content = content.replace(/\s*"zeng-ikonu-niye-kohne-destekdir":\s*"why-phone-icon-is-a-1960s-telephone-receiver",?/g, '');
content = content.replace(/\s*"tenzimlemeler-niye-disli-carxdir":\s*"why-settings-icon-is-a-mechanical-gear",?/g, '');
content = content.replace(/\s*"e-poct-niye-kagiz-zerf-ikonudur":\s*"why-email-is-a-paper-envelope-icon",?/g, '');

// Now remove the top-level keys from ECOSYSTEM_RELATIONSHIPS
// We can find each block by matching `  "why-search-is-a-magnifying-glass": {[\s\S]*?},` etc.
const blocksToRemove = [
  /\s*"why-search-is-a-magnifying-glass":\s*{[\s\S]*?},\n/g,
  /\s*"why-phone-icon-is-a-1960s-telephone-receiver":\s*{[\s\S]*?},\n/g,
  /\s*"why-settings-icon-is-a-mechanical-gear":\s*{[\s\S]*?},\n/g,
  /\s*"why-email-is-a-paper-envelope-icon":\s*{[\s\S]*?},\n/g,
];

for (const r of blocksToRemove) {
  content = content.replace(r, '\n');
}

// Clean up duplicate slugs in relatedSlugs if any
// Fix commas
fs.writeFileSync('src/lib/ecosystemRelationshipMap.ts', content, 'utf8');
console.log('✅ Cleaned up ecosystemRelationshipMap.ts');
