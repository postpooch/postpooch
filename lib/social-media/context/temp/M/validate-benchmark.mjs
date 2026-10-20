/** Read-only portable validator. Run: node validate-benchmark.mjs [folder]. */
import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const ts = require('typescript');
const dir = process.argv[2] ? path.resolve(process.argv[2]) : path.dirname(fileURLToPath(import.meta.url));
const fail = (message) => { throw Error(message); };
const read = (name) => readFileSync(path.join(dir,name),'utf8');
const sha = (s) => crypto.createHash('sha256').update(s).digest('hex');
const manifest = JSON.parse(read('manifest.json'));
for (const [name,expected] of Object.entries(manifest.sha256)) {
  if (!existsSync(path.join(dir,name))) fail(`Missing ${name}`);
  if (sha(read(name)) !== expected) fail(`Hash mismatch ${name}`);
}
if (sha(read('postpooch-combined-classifier-j.ts')) !== 'e10d8e72a2c40625318dcfc24584f5923b90725817f71dd3f042513fe7ba5ad0') fail('Wrong Combined J source');
const parses = Object.keys(manifest.sha256).filter(x=>x.endsWith('.ts'));
for(const f of parses) {
  const src = read(f);
  const result = ts.transpileModule(src, {fileName:f,reportDiagnostics:true,compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext}});
  const errs = (result.diagnostics||[]).filter(d=>d.category===ts.DiagnosticCategory.Error);
  if(errs.length) fail(`TypeScript syntax ${f}: ${errs.map(x=>ts.flattenDiagnosticMessageText(x.messageText,' ')).join('; ')}`);
}
const ast = (f) => ts.createSourceFile(f,read(f),ts.ScriptTarget.Latest,true,ts.ScriptKind.TS);
function findVar(file,name){let out; function walk(n){if(ts.isVariableDeclaration(n)&&n.name.getText(file)===name)out=n.initializer;ts.forEachChild(n,walk);}walk(file); if(!out)fail(`Missing variable: ${name}`);return out;}
function getTextLiteral(node){if(!ts.isStringLiteral(node)&&!ts.isNoSubstitutionTemplateLiteral(node))fail('Expected string literal');return node.text;}
function descriptor(file,name){const x=findVar(file,name);if(!ts.isCallExpression(x)||x.expression.getText(file)!=='noul')fail(`${name} not noul`);const q=getTextLiteral(x.arguments[0]);const props=x.arguments[1];if(!ts.isObjectLiteralExpression(props))fail(`${name} descriptor not object`);const data={question:q};for(const k of ['true','false']){let member=props.properties.find(p=>p.name?.getText(file)===k);if(!member)fail('No '+k);data[k]=getTextLiteral(member.initializer)}return data;}
const j=ast('postpooch-combined-classifier-j.ts');
const m=ast('candidate-relevance-m-n.ts');
const tests=[
 ['TEMPORARY_QUESTION_CANDIDATE_H','TEMPORARY_QUESTION_M'],
 ['PREFERENCE_QUESTION_CANDIDATE_I','PREFERENCE_QUESTION_N'],
 ['FREQUENCY_QUESTION_VERSION_7','FREQUENCY_QUESTION_N'],
];
for(const [origin,candidate] of tests){const a=descriptor(j,origin),b=descriptor(m,candidate);if(a.question!==b.question||a.true!==b.true||!b.false.startsWith(a.false))fail(`Unexpected edit to ${candidate}`);const extra=b.false.slice(a.false.length);if(!extra.trim().startsWith('A quoted or described'))fail(`Unexpected suffix ${candidate}`);if(extra.length<60||extra.length>330)fail(`Candidate edit too large ${candidate}`);}
if((read('candidate-relevance-m-n.ts').match(/\bnoul\(/g)||[]).length!==3)fail('Candidate file should define three noul objects (shared among arms)');
const keys=[...Object.keys(JSON.parse(read('manifest.json')).counts)];
const jStr=read('postpooch-combined-classifier-j.ts');
const mStr=read('candidate-relevance-m-n.ts');
if(!mStr.includes('...COMBINED_J_QUESTIONS')||!mStr.includes('QUESTIONS_J = COMBINED_J_QUESTIONS')||!mStr.includes('QUESTIONS_M =')||!mStr.includes('QUESTIONS_N ='))fail('Wrong arm composition');
for (const key of ['temporary: TEMPORARY_QUESTION_M','preference: PREFERENCE_QUESTION_N','frequency: FREQUENCY_QUESTION_N']) if(!mStr.includes(key))fail('Missing candidate override '+key);
const data = JSON.parse(read('relevance-holdout-m.json'));
const tscopy=read('relevance-holdout-m.ts');
const tsmatch=tscopy.match(/export const RELEVANCE_HOLDOUT_M = ([\s\S]+) as const;\s*$/);
if(!tsmatch||JSON.stringify(JSON.parse(tsmatch[1]))!==JSON.stringify(data))fail('TS and JSON holdouts disagree');
if(data.length!==312)fail('Wrong fixture size');
const fresh=data.filter(c=>c.cohort==='fresh'),replays=data.filter(c=>c.cohort==='diagnostic_replay');
if(fresh.length!==288||replays.length!==24)fail('Wrong cohort sizes');
if(fresh.filter(x=>x.goldConfidence==='high').length!==216||fresh.filter(x=>x.goldConfidence==='interpretive').length!==72)fail('Wrong primary split');
const uniq=new Set();const groups=new Map(),pairs=new Map();
for(const x of data){
 const n=x.note.toLocaleLowerCase().replace(/\s+/g,' ').trim();
 if(uniq.has(n))fail(`Duplicated note: ${x.id}`); uniq.add(n);
 if((x.expectedCategories.includes('identity'))!==(x.expectedIdentityFields.length>0))fail(`Identity labels ${x.id}`);
 if((x.expectedCategories.includes('temporary'))!==(x.expectedTemporaryType!==null))fail(`Temp labels ${x.id}`);
 if(x.expectedTemporaryType!==null&&!['counter','date_range','unclear'].includes(x.expectedTemporaryType))fail(`Wrong type ${x.id}`);
 if(x.cohort==='fresh')groups.set(x.group,(groups.get(x.group)||0)+1);
 if(x.pairId){const pair=pairs.get(x.pairId)||[];pair.push(x);pairs.set(x.pairId,pair);}
}
if(groups.size!==24||![...groups.values()].every(v=>v===12))fail('Wrong group structure');
if(pairs.size!==36||![...pairs.values()].every(v=>v.length===2&&v.some(x=>x.expectedCategories.length===0)&&v.some(x=>x.expectedCategories.length===1)))fail('Wrong matched pairs');
if(replays.some(x=>!x.sourceId?.startsWith('L-R-')))fail('Replay provenance missing');
if(!jStr.includes('CLASSIFICATION_INCLUDE_THRESHOLD = 0.75')||!jStr.includes('CLASSIFICATION_EXCLUDE_THRESHOLD = 0.25')||!jStr.includes('TEMPORARY_TYPE_THRESHOLD = 0.7'))fail('Threshold drift');
const expected=manifest.counts;
if(expected.fresh!==288||expected.replays!==24||expected.attempts!==2808||expected.arms!==3||expected.repeats!==3||expected.quotePairs!==36)fail('Manifest count drift');
console.log('PASS: file hashes, original J hash, source syntax, exact J→M→N edits, dataset parity, 24 groups, 36 pairs, thresholds, 312 unique notes, and 2,808 attempts. No Jev calls.');
