import fs from 'fs';

const content = fs.readFileSync('src/lib/ecosystemRelationshipMap.ts', 'utf8');
const lines = content.split('\n');

const slugs = [
  'why-search-is-a-magnifying-glass',
  'why-phone-icon-is-a-1960s-telephone-receiver',
  'why-settings-icon-is-a-mechanical-gear',
  'why-email-is-a-paper-envelope-icon'
];

slugs.forEach(slug => {
  lines.forEach((line, index) => {
    if (line.includes(slug)) {
      console.log(`Line ${index + 1}: ${line}`);
    }
  });
});
