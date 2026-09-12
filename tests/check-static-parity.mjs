import assert from "node:assert/strict";
import fsp from "node:fs/promises";

const pairs = [
  ["app.js", "dist/app.js"],
  ["favicon.svg", "dist/favicon.svg"],
  ["index.html", "dist/index.html"],
  ["prompt.html", "dist/prompt.html"],
  ["styles.css", "dist/styles.css"],
  [
    "prompts/generative-engine-optimization-audit-pro-prompt.md",
    "dist/prompts/generative-engine-optimization-audit-pro-prompt.md"
  ]
];

for (const [source, deployed] of pairs) {
  const [sourceBytes, deployedBytes] = await Promise.all([
    fsp.readFile(source),
    fsp.readFile(deployed)
  ]);
  assert.deepEqual(deployedBytes, sourceBytes, `${deployed} differs from ${source}`);
}

console.log(`static_parity=pass file_pairs=${pairs.length}`);
