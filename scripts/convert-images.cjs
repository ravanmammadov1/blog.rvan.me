const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const files = [
  'src/imports/ravan_1.png',
  'src/imports/cbfd4b251276815.6a33abf0bf48e.png',
  'src/imports/466885252088463.6a4df53862539.jpg'
];

async function convert(file) {
  const abs = path.resolve(file);
  if (!fs.existsSync(abs)) {
    console.warn('File not found:', file);
    return;
  }

  const dir = path.dirname(abs);
  const base = path.basename(abs, path.extname(abs));

  try {
    await sharp(abs).resize({ width: 1200 }).webp({ quality: 82 }).toFile(path.join(dir, `${base}-1200.webp`));
    await sharp(abs).resize({ width: 800 }).webp({ quality: 78 }).toFile(path.join(dir, `${base}-800.webp`));
    await sharp(abs).resize({ width: 400 }).webp({ quality: 72 }).toFile(path.join(dir, `${base}-400.webp`));

    console.log('Converted', file, '->', `${base}-1200.webp`);
  } catch (e) {
    console.error('Failed to convert', file, e);
  }
}

(async () => {
  for (const f of files) await convert(f);
})();
