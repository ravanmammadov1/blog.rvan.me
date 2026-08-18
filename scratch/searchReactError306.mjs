import fs from 'fs';

// Look in node_modules/react/ and node_modules/react-dom/ for production error messages or scripts/error-codes
function searchFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  const content = fs.readFileSync(filePath, 'utf8');
  // Match formatProdErrorMessage(306... or similar
  const matches = [...content.matchAll(/306/g)];
  if (matches.length > 0) {
    console.log(`Found '306' in ${filePath}`);
    const lines = content.split('\n');
    lines.forEach((l, idx) => {
      if (l.includes('306')) {
        console.log(`Line ${idx}:`, l.slice(0, 150));
      }
    });
  }
}

searchFile('node_modules/react/cjs/react.production.min.js');
searchFile('node_modules/react/cjs/react.development.js');
searchFile('node_modules/react-dom/cjs/react-dom.production.min.js');
searchFile('node_modules/react-dom/cjs/react-dom.development.js');
searchFile('node_modules/react-dom/cjs/react-dom-server.browser.production.min.js');
