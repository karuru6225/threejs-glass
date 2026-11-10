// Headless check of the car-following / red-light logic in index.html.
// Extracts updateCity()'s traffic part and runs it for 120 simulated seconds.
//   node tools/traffic-sim.mjs index.html
import fs from 'fs';

const src = fs.readFileSync(process.argv[2] ?? 'index.html', 'utf8');
const a = src.indexOf('const RING_A');
const b = src.indexOf('  for (const f of flicker) {');
if (a < 0 || b < 0) throw new Error('traffic code not found');
const body = src.slice(a, b)
  .replace(/    if \(i < 16\)[^\n]*\n/, '')
  .replace(/  groundMat[^\n]*\n/g, '')
  .replace(/  for \(const lamps of signals\)[^\n]*\n/, '')
  .replace(/    for \(const ms of carMeshes\)[^\n]*\n/, '');

const cars = [];
for (let i = 0; i < 7; i++) cars.push({ dir: 1, x: -0.62, z: -36 + i * 5 + Math.random() * 2, v: 2.2 + Math.random() * 1.6 });
for (let i = 0; i < 7; i++) cars.push({ dir: -1, x: 0.62, z: -36 + i * 5 + Math.random() * 2, v: 1.8 + Math.random() * 1.6 });
const updateCity = new Function('cars', body + '\n}\nreturn updateCity;')(cars);

let minGap = Infinity, stoppedOnRed = 0;
for (let step = 0; step < 60 * 120; step++) {
  const t = step / 60;
  updateCity(t, 1 / 60);
  for (const c of cars) for (const o of cars) if (c !== o && c.dir === o.dir) {
    let d = Math.abs(c.z - o.z); d = Math.min(d, 35.4 - d);
    minGap = Math.min(minGap, d - 0.9);
  }
  if ((t % 14) / 14 > 0.7 && cars.some((c) => c.cur < 0.05)) stoppedOnRed++;
}
console.log(`min bumper gap: ${minGap.toFixed(3)} (must be > 0)`);
console.log(`frames with a car stopped on red: ${stoppedOnRed}`);
process.exit(minGap > 0 ? 0 : 1);
