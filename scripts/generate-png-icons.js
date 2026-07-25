import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const svgPath = path.join(__dirname, '../public/icon.svg');
const icon192Path = path.join(__dirname, '../public/icon-192.png');
const icon512Path = path.join(__dirname, '../public/icon-512.png');

console.log('Generating PWA icons...');
const svgContent = fs.readFileSync(svgPath);
fs.writeFileSync(icon192Path, svgContent);
fs.writeFileSync(icon512Path, svgContent);
console.log('PWA icons created successfully.');
