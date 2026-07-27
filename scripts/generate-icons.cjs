const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const root = path.resolve(__dirname, '..');
const src = path.join(root, 'public', 'favicon.png');
const outDir = path.join(root, 'public');

(async () => {
  if (!fs.existsSync(src)) {
    throw new Error(`Source icon not found: ${src}`);
  }

  const input = sharp(src);
  const metadata = await input.metadata();
  const size = Math.max(metadata.width || 32, metadata.height || 32);
  const base = await input
    .resize({ width: size, height: size, fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ compressionLevel: 9 })
    .toBuffer();

  await sharp(base).resize(16, 16).png({ compressionLevel: 9 }).toFile(path.join(outDir, 'favicon-16x16.png'));
  await sharp(base).resize(32, 32).png({ compressionLevel: 9 }).toFile(path.join(outDir, 'favicon-32x32.png'));
  await sharp(base).resize(192, 192).png({ compressionLevel: 9 }).toFile(path.join(outDir, 'android-chrome-192.png'));
  await sharp(base).resize(512, 512).png({ compressionLevel: 9 }).toFile(path.join(outDir, 'android-chrome-512.png'));
  await sharp(base).resize(180, 180).png({ compressionLevel: 9 }).toFile(path.join(outDir, 'apple-touch-icon.png'));

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" role="img" aria-label="Ravan Mammadov icon">
  <image href="data:image/png;base64,${base.toString('base64')}" width="${size}" height="${size}" />
</svg>`;
  fs.writeFileSync(path.join(outDir, 'favicon.svg'), svg);

  console.log('Generated icon assets from', path.relative(root, src));
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
