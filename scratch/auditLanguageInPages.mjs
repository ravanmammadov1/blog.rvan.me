import fs from 'fs';
import path from 'path';

function checkDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      checkDir(full);
    } else if (e.isFile() && (e.name.endsWith('.tsx') || e.name.endsWith('.ts'))) {
      const content = fs.readFileSync(full, 'utf8');
      if (content.includes('useLanguage(')) {
        // check what is destructured
        const match = content.match(/const\s*\{([^}]+)\}\s*=\s*useLanguage\(\)/);
        if (match) {
          const destructured = match[1];
          const usesLanguage = /\blanguage\b/.test(content.replace(match[0], ''));
          const usesIsAz = /\bisAz\b/.test(content.replace(match[0], ''));
          
          const hasLanguageInDestructured = destructured.includes('language');
          const hasIsAzInDestructured = destructured.includes('isAz');

          if (usesLanguage && !hasLanguageInDestructured) {
            console.log(`⚠️ MISSING 'language' in useLanguage(): ${full}`);
          }
          if (usesIsAz && !hasIsAzInDestructured && !content.includes('language === "az"') && !content.includes("language === 'az'")) {
            console.log(`ℹ️ check isAz in: ${full}`);
          }
        }
      }
    }
  }
}

checkDir('src');
