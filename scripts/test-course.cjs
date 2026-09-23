const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const ts = require('typescript');

const resolve = Module._resolveFilename;
Module._resolveFilename = function(name, ...args) {
  return resolve.call(this, name.startsWith('@/') ? path.resolve('src', name.slice(2)) : name, ...args);
};
require.extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
  compilerOptions: { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.CommonJS, esModuleInterop: true },
}).outputText, filename);

const { courseLevels, unitsForLevel } = require('../src/data/course/index.ts');
const { examPractices, practicesForLevel } = require('../src/data/exam-prep.ts');
const { scoreClosedPractice } = require('../src/lib/exam-scoring.ts');
const allIds = new Set();
const shortModels = [];
let checks = 0;

function questionSet(questions, scope) {
  assert.ok(questions.length >= 2, `${scope}: too few questions`);
  for (const question of questions) {
    assert.ok(!allIds.has(question.id), `${scope}: duplicate question ${question.id}`);
    allIds.add(question.id);
    assert.ok(question.prompt.length > 12 && question.explanation.length > 10, `${scope}: missing prompt/explanation`);
    assert.equal(new Set(question.options).size, question.options.length, `${scope}: duplicate options`);
    assert.ok(Number.isInteger(question.correctIndex) && question.options[question.correctIndex], `${scope}: bad answer key`);
    checks++;
  }
}

for (const level of courseLevels) {
  const units = unitsForLevel(level);
  assert.equal(units.length, 10, `${level}: focused course unit count`);
  for (const [index, unit] of units.entries()) {
    assert.equal(unit.order, index + 1);
    assert.ok(!allIds.has(unit.id), `duplicate unit ${unit.id}`);
    allIds.add(unit.id);
    assert.ok(unit.objectives.length && unit.vocabulary.length >= 4 && unit.grammar.formula);
    assert.ok(unit.reading.text.length > 300, `${unit.id}: reading too short`);
    assert.ok(unit.listening.audioText.length > 220, `${unit.id}: listening too short`);
    assert.notEqual(unit.reading.text, unit.listening.audioText, `${unit.id}: reading reused as audio`);
    assert.ok(unit.writing.prompt.length > 30 && unit.writing.modelAnswer.length > 150);
    const modelWords = unit.writing.modelAnswer.trim().split(/\s+/).length;
    if (modelWords < unit.writing.minWords) shortModels.push(`${unit.id}: ${modelWords}/${unit.writing.minWords}`);
    assert.ok(unit.speaking.prompt.length > 25 && unit.speaking.followUps.length >= 2);
    assert.ok(unit.review.prompt.length > 20 && unit.review.modelAnswer.length > 40);
    questionSet(unit.grammar.questions, `${unit.id} grammar`);
    questionSet(unit.reading.questions, `${unit.id} reading`);
    questionSet(unit.listening.questions, `${unit.id} listening`);
    checks++;
  }
  const practices = practicesForLevel(level);
  assert.equal(practices.length, 4, `${level}: four practice modules`);
  assert.deepEqual(practices.map(p => p.skill).sort(), ['listening', 'reading', 'speaking', 'writing']);
  for (const practice of practices) {
    assert.ok(!allIds.has(practice.id), `duplicate practice ${practice.id}`);
    allIds.add(practice.id);
    assert.ok(practice.practiceMinutes > 0 && practice.instructions);
    if (practice.skill === 'reading' || practice.skill === 'listening') {
      assert.ok((practice.sourceText || practice.audioText).length > 450, `${practice.id}: source too short`);
      questionSet(practice.questions, practice.id);
      assert.deepEqual(scoreClosedPractice(practice.questions, {}).correct, 0);
      assert.deepEqual(scoreClosedPractice(practice.questions, {}).total, practice.questions.length);
      const answers = Object.fromEntries(practice.questions.map(q => [q.id, q.correctIndex]));
      assert.equal(scoreClosedPractice(practice.questions, answers).percent, 100);
    } else {
      assert.ok(practice.prompt.length > 60 && practice.criteria.length >= 3 && practice.modelAnswer.length > 150);
      if (practice.skill === 'speaking') assert.ok(practice.followUps.length >= 2);
    }
    checks++;
  }
}
assert.equal(examPractices.length, 16);
assert.deepEqual(shortModels, [], `Model answers below the suggested minimum: ${shortModels.join(', ')}`);
console.log(`PASS ${checks} course and exam content checks across 40 units and 16 practice modules`);
