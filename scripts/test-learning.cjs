const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const ts = require('typescript');
const originalResolve = Module._resolveFilename;
Module._resolveFilename = function(name, ...args) {
  return originalResolve.call(this, name.startsWith('@/') ? path.resolve('src', name.slice(2)) : name, ...args);
};
require.extensions['.ts'] = (m, filename) => m._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
  compilerOptions: { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.CommonJS, esModuleInterop: true },
}).outputText, filename);
const { assessLocally, parseAssessment, normalizeAnswer } = require('../src/lib/assessment.ts');
const { scoreSpeech } = require('../src/services/ai.ts');
const { coerceStep, coerceLesson } = require('../src/lib/lesson-validation.ts');
const { nextEvidence } = require('../src/lib/learning-evidence.ts');
const { lessons } = require('../src/data/lessons.ts');
const { dailyMissions, personalizeA1Lesson, missionStep } = require('../src/data/daily-missions.ts');
const { dailyListening } = require('../src/data/daily-listening.ts');
const { productionExam } = require('../src/data/production-exam.ts');
let passed=0;
function test(name, fn) { fn(); passed++; console.log(`PASS ${name}`); }

test('transcript word order errors cannot receive full marks', () => {
  assert.equal(scoreSpeech('Ich lerne Deutsch.', 'Ich lerne Deutsch.').transcriptMatch, 100);
  assert.ok(scoreSpeech('Ich Deutsch lerne.', 'Ich lerne Deutsch.').transcriptMatch < 100);
  assert.ok(scoreSpeech('Ich lerne kein Deutsch.', 'Ich lerne Deutsch.').transcriptMatch < 100);
  assert.equal(scoreSpeech('', 'Ich lerne Deutsch.').transcriptMatch, 0);
  assert.ok(!('pronunciation' in scoreSpeech('Ich lerne Deutsch.', 'Ich lerne Deutsch.')));
});
test('meaningful spelling and negation are preserved', () => {
  assert.notEqual(normalizeAnswer('schon'), normalizeAnswer('schön'));
  assert.equal(assessLocally('Ich habe ein Auto.', { expected: 'Ich habe kein Auto.' }).status, 'needs-work');
  assert.equal(assessLocally('Ich bin mude.', { expected: 'Ich bin müde.' }).status, 'needs-work');
  assert.equal(assessLocally(' Ich bin müde! ', { expected: 'Ich bin müde.' }).status, 'correct');
});
test('keyword salad and alternate personal answers stay ungraded offline', () => {
  assert.equal(assessLocally('treffen uhr', { expected: 'Treffen wir uns um 17 Uhr?', keywords: ['treffen', 'uhr'] }).status, 'ungraded');
  assert.equal(assessLocally('Hallo, ich heiße Iqbal.', { expected: 'Hallo, ich heiße Max.', assessment: 'open' }).status, 'ungraded');
  assert.equal(assessLocally('Hallo, ich heiße Max.', { expected: 'Hallo, ich heiße Max.', assessment: 'open' }).status, 'ungraded');
  assert.equal(assessLocally('Ich bin Studentin.', { expected: 'Ich bin Student.', acceptedAnswers: ['Ich bin Studentin.'] }).status, 'correct');
});
test('AI review rejects incomplete or contradictory criterion results', () => {
  assert.equal(parseAssessment({ status: 'correct', feedback: 'ok', checks: [{ criterion: 'waktu', met: false }] }, ['waktu']), null);
  assert.equal(parseAssessment({ status: 'correct', feedback: 'ok', checks: [] }, ['waktu']), null);
  assert.ok(parseAssessment({ status: 'needs-work', feedback: 'Waktu belum disebut', checks: [{ criterion: 'waktu', met: false }] }, ['waktu']));
});
const drill={ type: 'drill', title: 'Latihan', exercise: { prompt: 'Ich ___ in Bonn.', options: ['wohne', 'wohnst', 'wohnen'], correctIndex: 0, explanation: 'ich menggunakan wohne.' } };
test('AI invalid options never shift answer keys', () => {
  assert.ok(coerceStep(drill));
  assert.equal(coerceStep({ ...drill, exercise: { ...drill.exercise, options: ['wohne', 'wohne', 'wohnen'], correctIndex: 2 } }), null);
  assert.equal(coerceStep({ ...drill, exercise: { ...drill.exercise, options: ['', 'wohnst', 'wohnen'] } }), null);
  assert.equal(coerceStep({ ...drill, exercise: { ...drill.exercise, correctIndex: 0.5 } }), null);
});
test('AI listening requires separate hidden audio and valid tasks', () => {
  assert.equal(coerceStep({ ...drill, type: 'listening' }), null);
  assert.equal(coerceStep({ ...drill, type: 'listening', exercise: { ...drill.exercise, audioText: drill.exercise.prompt } }), null);
  assert.ok(coerceStep({ type: 'listening', title: 'Dengar', exercise: dailyListening[0] }));
  assert.equal(coerceStep({ type: 'writing', prompt: 'Tulislah', expected: 'Ich bin hier.', assessment: 'open' }), null);
  assert.equal(coerceLesson({ steps: [drill] }, { day: 1, subLevel: 'A1.1', theme: 'Hallo', goal: [] }), null);
});
test('all 30 A1 days and 4 goals have usable productive and listening tasks', () => {
  assert.equal(lessons.length, 30); assert.equal(dailyMissions.length, 30); assert.equal(dailyListening.length, 30);
  assert.equal(new Set(lessons.map(l=>l.day)).size,30);
  for (const goal of ['Kuliah di Jerman','Karier & Ausbildung','Travel & keseharian','Belajar hal baru']) for (const base of lessons) {
    const l=personalizeA1Lesson(base,goal);
    assert.ok(l.application.outcome && l.application.task && l.application.criteria.length);
    assert.ok(l.steps.some(s=>s.missionId && s.assessment==='open'));
    assert.ok(l.steps.some(s=>s.type==='speaking' && s.assessment==='open'));
    assert.equal(l.steps.at(-1).type,'victory');
    for(const s of l.steps) {
      if(s.type==='listening') {
        assert.ok(s.exercise.audioText, `day ${l.day}: missing audio`);
        assert.ok(!s.exercise.prompt.includes(s.exercise.audioText));
      }
      if(s.exercise) {
        assert.equal(new Set(s.exercise.options).size,s.exercise.options.length);
        assert.ok(Number.isInteger(s.exercise.correctIndex) && s.exercise.options[s.exercise.correctIndex]);
      }
    }
    const r=missionStep(base.day,goal,true);
    assert.notEqual(r.prompt,missionStep(base.day,goal).prompt);
    assert.equal(r.expected,'');
  }
});
test('goal tracks change applied examples and exam scenario', () => {
  const a=personalizeA1Lesson(lessons[18],'Kuliah di Jerman');
  const b=personalizeA1Lesson(lessons[18],'Karier & Ausbildung');
  assert.ok(JSON.stringify(a).includes('studieren'));
  assert.notEqual(a.steps.find(s=>s.missionId).expected,b.steps.find(s=>s.missionId).expected);
  assert.notEqual(productionExam('Kuliah di Jerman')[0].prompt,productionExam('Karier & Ausbildung')[0].prompt);
  assert.equal(productionExam('Travel & keseharian').filter(s=>s.type==='speaking').length,2);
});
test('same-day repetition cannot manufacture delayed mastery', () => {
  const input={id:'a1-study-1',day:1,goal:'Kuliah di Jerman',answer:'x',status:'correct',source:'ai',feedback:'ok',attemptedAt:'2026-09-15T00:00:00.000Z'};
  let first=nextEvidence(undefined,input,false);
  assert.equal(first.delayedPasses,0);
  let early=nextEvidence(first,{...input,attemptedAt:'2026-09-15T01:00:00.000Z'},true);
  assert.equal(early.delayedPasses,0); assert.equal(early.dueAt,first.dueAt);
  let delayed=nextEvidence(first,{...input,attemptedAt:'2026-09-16T01:00:00.000Z'},true);
  assert.equal(delayed.delayedPasses,1);
  let repeat=nextEvidence(delayed,{...input,attemptedAt:'2026-09-16T02:00:00.000Z'},true);
  assert.equal(repeat.delayedPasses,1);
  let unknown=nextEvidence(first,{...input,status:'ungraded',attemptedAt:'2026-09-16T02:00:00.000Z'},true);
  assert.equal(unknown.delayedPasses,0);
});
console.log(`${passed} learning regression groups passed; 120 personalized lesson variants validated.`);
