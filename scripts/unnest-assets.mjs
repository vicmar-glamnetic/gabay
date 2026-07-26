#!/usr/bin/env node
/**
 * Moves exported assets out of `dist/assets/node_modules/…` and rewrites every
 * reference to them.
 *
 * Why: Metro derives an asset's export path from where its source file lives, so
 * anything shipped inside a package — Ionicons.ttf from @expo/vector-icons,
 * expo-router's bundled assets — lands under a path segment literally named
 * `node_modules`. Vercel excludes `node_modules` from every upload and there is
 * no opt-out: `.vercelignore` does not override it. The files simply never ship,
 * and the app loads with missing icons and fallback type.
 *
 * Vendoring our own fonts fixes the ones we control. This handles the rest,
 * which come from inside dependencies and cannot be moved at source.
 *
 * Run after `expo export` and before deploying.
 */

import { readFileSync, writeFileSync, renameSync, existsSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const DIST = process.argv[2] ?? "dist";
const FROM_DIR = join(DIST, "assets", "node_modules");
const TO_DIR = join(DIST, "assets", "vendor");
const FROM_REF = "assets/node_modules/";
const TO_REF = "assets/vendor/";

if (!existsSync(FROM_DIR)) {
  console.log("unnest-assets: nothing nested under assets/node_modules — skipping");
  process.exit(0);
}

renameSync(FROM_DIR, TO_DIR);

function walk(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) out.push(...walk(full));
    else if (/\.(js|html|json|css|map)$/.test(name)) out.push(full);
  }
  return out;
}

let files = 0;
let hits = 0;
for (const file of walk(DIST)) {
  const before = readFileSync(file, "utf8");
  if (!before.includes(FROM_REF)) continue;
  const after = before.split(FROM_REF).join(TO_REF);
  hits += before.split(FROM_REF).length - 1;
  writeFileSync(file, after);
  files++;
}

console.log(
  `unnest-assets: moved assets/node_modules -> assets/vendor, rewrote ${hits} reference${hits === 1 ? "" : "s"} across ${files} file${files === 1 ? "" : "s"}`
);
