import fs from 'fs';

const reactDomProd = fs.readFileSync('node_modules/react-dom/cjs/react-dom.production.min.js', 'utf8');

// Find occurrences of formatProdErrorMessage(306 or ka(306 or error 306
const regex = /[a-zA-Z0-9_$]+\(306/g;
let match;
while ((match = regex.exec(reactDomProd)) !== null) {
  console.log('Match:', match[0], 'at index', match.index);
  console.log('Surrounding code:', reactDomProd.slice(Math.max(0, match.index - 100), Math.min(reactDomProd.length, match.index + 200)));
}
