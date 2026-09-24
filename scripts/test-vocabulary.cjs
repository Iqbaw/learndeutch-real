const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..", "src", "data");
const base = fs.readFileSync(path.join(root, "vocabulary.ts"), "utf8");
const names = new Set([...base.matchAll(/\bgerman:\s*"([^"]+)"/g)].map((match) => match[1].toLocaleLowerCase("de-DE")));
const counts = Object.fromEntries(["A1", "A2", "B1", "B2", "C1", "C2"].map((level) => [level, 0]));
const repeated = [];

for (const file of ["vocabulary-a1-a2.ts", "vocabulary-b1-b2.ts", "vocabulary-c1-c2.ts"]) {
  const source = fs.readFileSync(path.join(root, file), "utf8");
  const groups = [...source.matchAll(/group\("((?:A|B|C)[12]\.[12])",\s*"[^"]+",\s*"[^"]+",\s*`([^`]+)`\)/g)];
  assert.ok(groups.length > 0, `${file}: no vocabulary groups found`);
  for (const [, sublevel, content] of groups) {
    for (const line of content.trim().split("\n")) {
      const fields = line.split("|").map((value) => value.trim());
      assert.ok(fields.length === 4 || fields.length === 5, `${sublevel}: expected German, meaning, example and translation: ${line}`);
      assert.ok(fields.slice(0, 4).every(Boolean), `${sublevel}: incomplete entry: ${line}`);
      const key = fields[0].toLocaleLowerCase("de-DE");
      if (names.has(key)) repeated.push(fields[0]);
      names.add(key);
      counts[sublevel.slice(0, 2)]++;
      if (fields[4]) assert.match(fields[0], /^(der|die|das) /, `Plural without noun: ${fields[0]}`);
    }
  }
}

assert.deepEqual(repeated, [], `Repeated headwords: ${repeated.join(", ")}`);
assert.ok(names.size >= 500, `Expected at least 500 distinct entries; got ${names.size}`);
for (const [level, count] of Object.entries(counts)) assert.ok(count >= 75, `${level}: expected at least 75 new entries; got ${count}`);
console.log(`Vocabulary content: ${names.size} unique entries; new words by level ${JSON.stringify(counts)}`);
