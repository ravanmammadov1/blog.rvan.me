import fs from 'fs';

const content = fs.readFileSync('src/app/pages/FontDetailPage.tsx', 'utf8');
const lines = content.split('\n');

lines.forEach((line, index) => {
  if (line.includes('language')) {
    console.log(`Line ${index + 1}: ${line}`);
  }
});
