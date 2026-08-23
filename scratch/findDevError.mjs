import fs from 'fs';

const reactDomDev = fs.readFileSync('node_modules/react-dom/cjs/react-dom.development.js', 'utf8');

// Search for case 11, case 14 or lazy component resolution in react-dom.development.js
const lines = reactDomDev.split('\n');
lines.forEach((line, idx) => {
  if (line.includes('mountLazyComponent') || line.includes('resolveLazyComponentTag') || line.includes('Expected a component class, got')) {
    console.log(`Line ${idx}: ${line.trim()}`);
  }
});
