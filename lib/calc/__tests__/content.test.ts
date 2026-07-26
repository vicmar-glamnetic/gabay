import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { ALLOWED_LINK_HOSTS } from "../../data/agencyLinks";
import { TRANSACTIONS } from "../../data/transactions";
import { TRIVIA } from "../../data/trivia";
import { LEAVE_ENTITLEMENTS } from "../../data/karapatan";

const LINK = /\[([^\]]+)\]\(([^)\s]+)\)/g;

function linksIn(text: string): { label: string; url: string }[] {
  const out: { label: string; url: string }[] = [];
  LINK.lastIndex = 0;
  for (let m = LINK.exec(text); m !== null; m = LINK.exec(text)) {
    out.push({ label: m[1], url: m[2] });
  }
  return out;
}

const allLinks = TRANSACTIONS.flatMap((t) =>
  t.steps.flatMap((s) => linksIn(s).map((l) => ({ ...l, transaction: t.id, step: s })))
);

describe("links in the transactions guide", () => {
  it("actually has links", () => {
    assert.ok(allLinks.length >= 12, `only found ${allLinks.length}`);
  });

  it("are all https", () => {
    for (const l of allLinks) {
      assert.ok(l.url.startsWith("https://"), `${l.transaction}: ${l.url} is not https`);
    }
  });

  it("only point at allow-listed official hosts", () => {
    // A typo'd domain in a government guide is how someone ends up on a
    // lookalike site paying a fixer for a free service.
    for (const l of allLinks) {
      const host = new URL(l.url).host;
      assert.ok(
        ALLOWED_LINK_HOSTS.includes(host),
        `${l.transaction}: ${host} is not in ALLOWED_LINK_HOSTS`
      );
    }
  });

  it("have a label that is not the bare URL", () => {
    for (const l of allLinks) {
      assert.ok(!l.label.startsWith("http"), `${l.transaction}: link label is a raw URL`);
    }
  });

  it("leave the checklist items free of markup — they are tick targets, not prose", () => {
    for (const t of TRANSACTIONS) {
      for (const b of t.bring) {
        assert.equal(linksIn(b).length, 0, `${t.id}: "${b}" contains a link`);
      }
    }
  });
});

describe("content invariants", () => {
  it("every transaction has a non-empty checklist and turned-away list", () => {
    for (const t of TRANSACTIONS) {
      assert.ok(t.bring.length > 0, `${t.id} has no checklist`);
      assert.ok(t.steps.length > 0, `${t.id} has no steps`);
      assert.ok(t.turnedAwayFor.length > 0, `${t.id} has no turnedAwayFor`);
    }
  });

  it("checklist items are unique within a transaction", () => {
    // The tick state is keyed by item text, so a duplicate would tick twice.
    for (const t of TRANSACTIONS) {
      assert.equal(new Set(t.bring).size, t.bring.length, `${t.id} has a duplicate item`);
    }
  });

  it("every trivia card names its law", () => {
    for (const t of TRIVIA) {
      assert.ok(t.law.trim().length > 0, `${t.id} has no law`);
    }
  });

  it("every leave entitlement names its law", () => {
    for (const l of LEAVE_ENTITLEMENTS) {
      assert.ok(l.law.trim().length > 0, `${l.id} has no law`);
    }
  });
});
