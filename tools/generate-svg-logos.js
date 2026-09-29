const fs = require('fs');

const brandMarkPng = fs.readFileSync('public/brand-mark.png');
const base64 = brandMarkPng.toString('base64');

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 56 46" width="56" height="46">
  <image width="56" height="46" href="data:image/png;base64,${base64}"/>
</svg>`;
fs.writeFileSync('public/brand-mark.svg', svg);

const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <rect width="64" height="64" rx="14" fill="#102d27"/>
  <g transform="translate(8, 11) scale(0.85)">
    <image width="56" height="46" href="data:image/png;base64,${base64}"/>
  </g>
</svg>`;
fs.writeFileSync('public/favicon.svg', faviconSvg);

console.log('Saved public/brand-mark.svg and public/favicon.svg');
