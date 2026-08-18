import fs from 'fs';

let content = fs.readFileSync('src/lib/ecosystemRelationshipMap.ts', 'utf8');

// Remove Block 27: Search Magnifying Glass
content = content.replace(/\s*\/\/ 27\. Search Magnifying Glass[\s\S]*?\},/g, '');

// Remove Block 29: Phone Call 1960s Receiver
content = content.replace(/\s*\/\/ 29\. Phone Call 1960s Receiver[\s\S]*?\},/g, '');

// Remove Block 31: Settings Mechanical Gear
content = content.replace(/\s*\/\/ 31\. Settings Mechanical Gear[\s\S]*?\},/g, '');

// Remove Block 35: Email Paper Envelope
content = content.replace(/\s*\/\/ 35\. Email Paper Envelope[\s\S]*?\},/g, '');

fs.writeFileSync('src/lib/ecosystemRelationshipMap.ts', content, 'utf8');
console.log('✅ Cleaned up relationship blocks from ecosystemRelationshipMap.ts');
