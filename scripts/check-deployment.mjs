import fs from "node:fs";
import crypto from "node:crypto";
import assert from "node:assert/strict";
const base = process.argv[2];
assert(base?.endsWith("/"), "Proporcionar la URL base terminada en /");
const read = (p) => JSON.parse(fs.readFileSync(p, "utf8"));
const digest = (b) => crypto.createHash("sha256").update(b).digest("hex");
const items = new Map();
const add = (path, hash) => items.set(path, { path, hash });
for (const l of read("src/data/guided-lessons.json"))
  add(`media/guides/${l.id}.json`);
for (const p of Object.values(read("src/data/lesson-previews.json")))
  add(p.path.slice(1), p.sha256);
for (const n of Object.values(read("src/data/narration.json"))) {
  add(n.audio.slice(1), n.sha256);
  add(n.vtt.slice(1));
  add(n.package.slice(1));
}
const dc = read("src/data/dus.json").find((c) => c.id === "dus-cfv-001");
for (const atlas of dc.frameAtlases) add(atlas.src.slice(1));
for (const id of [
  "vision-c4-004-v5",
  "vision-c4-001-v1",
  "vision-c5-001-v5",
  "vision-c5-001-v1",
  "vision-c6-003-v1",
  "vision-c6-003-v5",
]) {
  const p = read("src/data/vision.json").find((p) => p.id === id);
  add(p.image.slice(1));
}
add(read("src/data/waterloo.json").videoPath.slice(1));
const expectedIndex = fs.readFileSync("dist/index.html", "utf8");
for (const match of expectedIndex.matchAll(
  /(?:src|href)="\/flebolab\/(assets\/[^" ]+)"/g,
))
  add(match[1]);
const htmlResponse = await fetch(base),
  html = await htmlResponse.text();
assert.equal(htmlResponse.status, 200);
for (const p of items.keys())
  if (p.startsWith("assets/"))
    assert(html.includes(p), `HTML de otra compilación: ${p}`);
const queue = [...items.values()],
  results = [];
await Promise.all(
  Array.from({ length: 4 }, async () => {
    while (queue.length) {
      const item = queue.shift();
      try {
        const r = await fetch(new URL(item.path, base), {
          signal: AbortSignal.timeout(30000),
        });
        const bytes = Buffer.from(await r.arrayBuffer());
        assert.equal(r.status, 200);
        assert(
          !r.headers.get("content-type")?.includes("text/html"),
          `HTML en lugar de medio: ${item.path}`,
        );
        if (item.hash) assert.equal(digest(bytes), item.hash);
        results.push({
          path: item.path,
          status: r.status,
          bytes: bytes.length,
          hashVerified: !!item.hash,
        });
      } catch (error) {
        results.push({ path: item.path, error: String(error) });
      }
    }
  }),
);
const audio = Object.values(read("src/data/narration.json"))[0];
const range = await fetch(new URL(audio.audio.slice(1), base), {
  headers: { Range: "bytes=0-1023" },
});
const report = {
  base,
  checkedAt: new Date().toISOString(),
  count: results.length,
  failures: results.filter((r) => r.error),
  audioRange: {
    status: range.status,
    contentRange: range.headers.get("content-range"),
  },
  results,
};
if (process.argv[3])
  fs.writeFileSync(process.argv[3], JSON.stringify(report, null, 2) + "\n");
console.log(
  JSON.stringify(
    {
      base,
      count: report.count,
      failures: report.failures,
      audioRange: report.audioRange,
    },
    null,
    2,
  ),
);
assert.equal(report.failures.length, 0);
assert.equal(range.status, 206);
