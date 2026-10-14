import { allGrahas, sunLongitude, heliocentric } from '../src/content/grahas';
import { julianDayFromParts } from '../src/content/julian';

const DEG = Math.PI / 180;

function gap(a: number, b: number) {
  const g = Math.abs(a - b) % 360;
  return g > 180 ? 360 - g : g;
}

function lon(p: { x: number; y: number }) {
  return ((Math.atan2(p.y, p.x) / DEG) % 360 + 360) % 360;
}

const jd = julianDayFromParts(2000, 1, 1, 12, 0);

const earth = heliocentric(jd, 'earth');
const venus = heliocentric(jd, 'venus');

console.log();
console.log('  J2000.0 - 5.5 ghante  (2000-01-01 12:00 IST)');
console.log();
console.log('  Earth helio lon : %s°', lon(earth).toFixed(3));
console.log('  Venus helio lon : %s°', lon(venus).toFixed(3));
console.log('  Venus ke aas paas apna mean L: 181.979°, C ~ +1.49° → 183.47°');
console.log();

const dx = venus.x - earth.x;
const dy = venus.y - earth.y;
const geo = ((Math.atan2(dy, dx) / DEG) % 360 + 360) % 360;

const g = allGrahas(jd);
const sun = sunLongitude(jd);

console.log('  Venus geocentric  : %s°  (haath se: atan2(-1.0126, -0.5447) = 241.7°)', geo.toFixed(3));
console.log('  engine ka Venus    : %s°', g.venus.longitude.toFixed(3));
console.log();
console.log('  Sun tropical     : %s°', sun.toFixed(3));
console.log('  elongation       : %s°   (47° se kam hona chahiye)', gap(geo, sun).toFixed(2));
console.log();

console.log('  2000 har mahine, Venus elongation:');
for (let month = 1; month <= 12; month += 1) {
  const t = julianDayFromParts(2000, month, 1, 12, 0);
  const gg = allGrahas(t);
  const ss = sunLongitude(t);
  const e = gap(gg.venus.longitude, ss);
  console.log('    %2d  venus %s°  sun %s°  =>  %s°%s',
    month, gg.venus.longitude.toFixed(1).padStart(6),
    ss.toFixed(1).padStart(6),
    e.toFixed(2).padStart(6),
    e > 47 ? '   <-- 47 se zyada, namumkin hai' : '');
}
console.log();
