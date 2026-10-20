/** Simple local preflight. Never imports the Jev SDK or makes any API calls. */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
const dir = path.dirname(new URL(import.meta.url).pathname);
const manifest = JSON.parse(fs.readFileSync(path.join(dir,'benchmark-l-manifest.json'),'utf8'));
for (const [filename, expected] of Object.entries(manifest.sha256)) {
  const actual = crypto.createHash('sha256').update(fs.readFileSync(path.join(dir, filename))).digest('hex');
  if (actual !== expected) throw Error(`${filename}: SHA-256 mismatch`);
}
const notes = JSON.parse(fs.readFileSync(path.join(dir,'postpooch-jev-intent-holdout-l.json'),'utf8'));
const fresh = notes.filter(x => x.cohort === 'fresh');
const replay = notes.filter(x => x.cohort === 'diagnostic_replay');
const groups = new Map();
for (const x of fresh) groups.set(x.group, (groups.get(x.group)||0)+1);
const keys = new Set(notes.map(x => x.note.toLowerCase().trim()));
const ids = new Set(notes.map(x => x.id));
if (fresh.length !== 264 || replay.length !== 24 || groups.size !== 22 || [...groups.values()].some(n => n !== 12)) throw Error('cohort/group counts mismatch');
if (keys.size !== notes.length || ids.size !== notes.length) throw Error('duplicate notes or IDs');
if (fresh.filter(x => x.goldConfidence === 'high').length !== 216 || fresh.filter(x => x.goldConfidence === 'interpretive').length !== 48) throw Error('gold confidence counts mismatch');
for (const x of notes) {
  if (x.expectedCategories.includes('temporary') !== (x.expectedTemporaryType !== null)) throw Error(`temporary label mismatch ${x.id}`);
  if (x.expectedCategories.includes('identity') !== (x.expectedIdentityFields.length > 0)) throw Error(`identity labels mismatch ${x.id}`);
}
const pairs = new Map();
for (const x of fresh.filter(x => x.pairId)) {
  const p = pairs.get(x.pairId)||[]; p.push(x.pairSide); pairs.set(x.pairId,p);
}
if (pairs.size !== 12 || [...pairs.values()].some(p=>p.length !== 2 || !p.includes('relevant') || !p.includes('not_relevant'))) throw Error('matched pair mismatch');
console.log(`PASS: ${fresh.length} fresh, ${replay.length} replay, ${groups.size} groups, ${pairs.size} matched pairs, all SHA-256 hashes valid.`);
