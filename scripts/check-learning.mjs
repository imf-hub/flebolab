import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import assert from "node:assert/strict";
const read = (p) => JSON.parse(fs.readFileSync(p, "utf8"));
const lessons = read("src/data/guided-lessons.json"),
  voices = read("src/data/narration.json");
const known = new Set(lessons.map((l) => l.id));
const previews = read("src/data/lesson-previews.json");
assert.equal(known.size, 31);
const digest = (p) =>
  crypto.createHash("sha256").update(fs.readFileSync(p)).digest("hex");
let bytes = 0,
  seconds = 0;
for (const l of lessons) {
  assert(previews[l.id], `Vista previa faltante: ${l.id}`);
  assert.equal(
    digest(path.join("public", previews[l.id].path)),
    previews[l.id].sha256,
  );
  assert.equal(l.stages.length, 4, l.id);
  const pack = read(`public/media/guides/${l.id}.json`);
  assert.deepEqual(pack.stages, l.stages, `Storyboard sin actualizar: ${l.id}`);
}
for (const [id, n] of Object.entries(voices)) {
  assert(known.has(id), id);
  assert(
    n.transcriptVerified && n.playbackRate === 1 && n.language === "es",
    id,
  );
  const paths = [n.audio, n.vtt, n.package].map((p) => {
    assert(p.startsWith("/media/narration/"));
    return path.join("public", p);
  });
  for (const p of paths) assert(fs.existsSync(p), p);
  assert.equal(digest(paths[0]), n.sha256, id);
  assert(n.audio.includes(n.sha256.slice(0, 12)), `Audio sin versión: ${id}`);
  assert(fs.readFileSync(paths[1], "utf8").startsWith("WEBVTT"));
  const pack = read(paths[2]);
  assert.equal(pack.sha256, n.sha256);
  const provenance = read(`docs/narration/${id}.json`);
  const lesson = lessons.find((l) => l.id === id);
  assert.equal(provenance.request.voiceId, "84854979e66846989bc6c5855f53268f");
  const ssml = provenance.request.text;
  assert.equal(typeof ssml, "string", `Falta SSML: ${id}`);
  for (const stage of lesson.stages)
    assert(
      ssml.includes(stage.spoken.replaceAll("&", "&amp;")),
      `Texto de voz desactualizado: ${id}`,
    );
  assert.equal(n.stages.length, 4);
  assert.equal(n.stages[0].start, 0);
  assert.equal(n.stages[3].end, n.duration);
  for (let i = 0; i < 4; i++) {
    assert(n.stages[i].end > n.stages[i].start);
    if (i < 3) assert.equal(n.stages[i].end, n.stages[i + 1].start);
  }
  for (const c of n.captions)
    assert(c.start >= 0 && c.end > c.start && c.end <= n.duration);
  bytes += fs.statSync(paths[0]).size;
  seconds += n.duration;
}
console.log(
  JSON.stringify(
    {
      status: "passed",
      lessons: 31,
      takes: 124,
      narrations: Object.keys(voices).length,
      visualOnly: lessons.filter((l) => !voices[l.id]).map((l) => l.id),
      audioSeconds: +seconds.toFixed(2),
      audioMB: +(bytes / 1e6).toFixed(2),
    },
    null,
    2,
  ),
);
