import fs from 'fs';

// Let's search node_modules for error 306 or react error codes
const reactDev = fs.readFileSync('node_modules/react/cjs/react.development.js', 'utf8');
const reactDomDev = fs.readFileSync('node_modules/react-dom/cjs/react-dom.development.js', 'utf8');

// In React development code, invariant errors have messages. Let's find matches for lazy or suspense or invalid element types
const lines = reactDomDev.split('\n');
lines.forEach((line, idx) => {
  if (line.includes('lazy') && line.includes('throw new Error') || line.includes('306')) {
    console.log(`react-dom dev line ${idx}: ${line.trim()}`);
  }
});

const reactLines = reactDev.split('\n');
reactLines.forEach((line, idx) => {
  if (line.includes('throw new Error') && (line.includes('lazy') || line.includes('Promise') || line.includes('dynamic import'))) {
    console.log(`react dev line ${idx}: ${line.trim()}`);
  }
});
