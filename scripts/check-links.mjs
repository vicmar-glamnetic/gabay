#!/usr/bin/env node
/**
 * Fetches every URL the app ships and reports its status.
 *
 * This cannot be a unit test: the test suite is offline and deterministic, and
 * it must not fail because a government site is down. Run this by hand before a
 * release, and whenever a link is reported broken.
 *
 *   npm run check:links
 *
 * A 403 from Cloudflare ("Just a moment...") is a bot check, not a dead link —
 * those hosts are listed under BOT_PROTECTED and reported separately, because a
 * real browser passes them.
 */

import { execFile } from "node:child_process";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { promisify } from "node:util";

const run = promisify(execFile);

const ROOTS = ["lib", "components", "app"];
const URL_RE = /https:\/\/[^\s"')<>\]]+/g;

/** Hosts behind a WAF that answers curl-like clients with 403. */
const BOT_PROTECTED = new Set(["www.dole.gov.ph", "www.passport.gov.ph"]);

/** Cited as a source in prose, or an illustrative example in a doc comment. */
const IGNORE = [/bir-cdn\.bir\.gov\.ph/, /…/];

function walk(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) out.push(...walk(full));
    else if (/\.tsx?$/.test(name)) out.push(full);
  }
  return out;
}

const found = new Map();
for (const root of ROOTS) {
  for (const file of walk(root)) {
    const text = readFileSync(file, "utf8");
    for (const m of text.matchAll(URL_RE)) {
      const url = m[0].replace(/[.,;]+$/, "");
      if (IGNORE.some((re) => re.test(url))) continue;
      if (!found.has(url)) found.set(url, new Set());
      found.get(url).add(file);
    }
  }
}

const urls = [...found.keys()].sort();
console.log(`Checking ${urls.length} URLs…\n`);

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0 Safari/537.36";

let broken = 0;
let warned = 0;

for (const url of urls) {
  let status = "ERR";
  let note = "";
  try {
    const res = await fetch(url, {
      redirect: "follow",
      headers: { "user-agent": UA },
      signal: AbortSignal.timeout(25_000),
    });
    status = String(res.status);
    if (res.url && res.url.replace(/\/$/, "") !== url.replace(/\/$/, "")) {
      note = `→ ${res.url}`;
    }
  } catch (e) {
    // Node's fetch is stricter about malformed response headers than browsers
    // are — pagibigfundservices.com sends one, and undici refuses the whole
    // response. Fall back to curl so a live site is not reported as dead.
    try {
      const { stdout } = await run("curl", [
        "-sS", "-L", "-o", "/dev/null", "--max-time", "25",
        "-A", UA, "-w", "%{http_code} %{url_effective}", url,
      ]);
      const [code, finalUrl] = stdout.trim().split(" ");
      status = code;
      note = `via curl${finalUrl && finalUrl.replace(/\/$/, "") !== url.replace(/\/$/, "") ? ` → ${finalUrl}` : ""}`;
    } catch {
      note = e instanceof Error ? e.message : String(e);
    }
  }

  const host = (() => {
    try {
      return new URL(url).host;
    } catch {
      return "";
    }
  })();

  let verdict;
  if (status.startsWith("2")) verdict = "OK  ";
  else if (status === "403" && BOT_PROTECTED.has(host)) {
    verdict = "BOT ";
    warned++;
    note = note || "Cloudflare bot check — a real browser passes";
  } else {
    verdict = "DEAD";
    broken++;
  }

  console.log(`${verdict} ${status.padEnd(4)} ${url}`);
  if (note) console.log(`          ${note}`);
  if (verdict === "DEAD") {
    for (const f of found.get(url)) console.log(`          used in ${f}`);
  }
}

console.log(
  `\n${urls.length - broken - warned} ok, ${warned} bot-protected, ${broken} broken`
);
process.exit(broken ? 1 : 0);
