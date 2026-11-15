// Generates the PNG icons (PWA and iPhone home screen) from the logo. Run: npm run icons
import sharp from 'sharp';

const page = `<rect x="23" y="17" width="54" height="66" rx="8" fill="#FFFFFF"/><rect x="31" y="28" width="11" height="11" rx="3" fill="#C2410C"/><path d="M33.8 33.6 l2.4 2.4 l4.2 -4.4" fill="none" stroke="#FFFFFF" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/><rect x="48" y="31" width="21" height="5" rx="2.5" fill="#C2410C" fill-opacity="0.35"/><rect x="32.5" y="45.5" width="8" height="8" rx="2" fill="none" stroke="#C2410C" stroke-width="3"/><rect x="48" y="47" width="21" height="5" rx="2.5" fill="#C2410C"/><rect x="32.5" y="61.5" width="8" height="8" rx="2" fill="none" stroke="#C2410C" stroke-width="3"/><rect x="48" y="63" width="15" height="5" rx="2.5" fill="#C2410C"/>`;

// Square, full bleed: phones round the corners themselves.
const square = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="#C2410C"/>${page}</svg>`;
// Maskable: the page shrunk into the 80% safe zone.
const maskable = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="#C2410C"/><g transform="translate(15 15) scale(0.7)">${page}</g></svg>`;

const out = [
  ['public/icons/icon-192.png', square, 192],
  ['public/icons/icon-512.png', square, 512],
  ['public/icons/icon-maskable-512.png', maskable, 512],
  ['src/app/apple-icon.png', square, 180],
];

for (const [file, svg, size] of out) {
  await sharp(Buffer.from(svg)).resize(size, size).png().toFile(file);
  console.log('wrote', file);
}
