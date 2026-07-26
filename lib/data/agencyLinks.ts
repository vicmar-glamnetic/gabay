/**
 * Official agency URLs, kept in one place for the same reason the rates are:
 * they move, and a wrong link in a government guide is worse than no link.
 *
 * Rules for this file:
 *  - Official government domains only. Never a third-party "assistance" site,
 *    which is how people end up paying a fixer for a free service.
 *  - https only.
 *  - `ALLOWED_LINK_HOSTS` below is asserted by a unit test against every link in
 *    the transactions dataset, so a typo'd domain cannot ship.
 *
 * lastVerified: 2026-07-26 — all URLs fetched, see `npm run check:links`
 */

export const AGENCY_URLS = {
  psaSerbilis: "https://www.psaserbilis.com.ph",
  psaHelpline: "https://www.psahelpline.ph",
  nbiClearance: "https://clearance.nbi.gov.ph",
  dfaPassport: "https://www.passport.gov.ph",
  philsysRegister: "https://register.philsys.gov.ph",
  philsys: "https://philsys.gov.ph",
  ltoPortal: "https://portal.lto.gov.ph",
  birOrus: "https://orus.bir.gov.ph",
  bir: "https://www.bir.gov.ph",
  pnpClearance: "https://pnpclearance.ph",
  sss: "https://www.sss.gov.ph",
  sssMember: "https://member.sss.gov.ph",
  philhealth: "https://www.philhealth.gov.ph",
  pagibigVirtual: "https://www.pagibigfundservices.com/virtualpagibig",
  pagibig: "https://www.pagibigfund.gov.ph",
  dtiBnrs: "https://bnrs.dti.gov.ph",
  dole: "https://www.dole.gov.ph",
  dmw: "https://dmw.gov.ph",
  nwpc: "https://nwpc.dole.gov.ph/",
} as const;

/** Every host the transactions dataset is permitted to link to. */
export const ALLOWED_LINK_HOSTS = [
  "www.psaserbilis.com.ph",
  "www.psahelpline.ph",
  "clearance.nbi.gov.ph",
  "www.passport.gov.ph",
  "register.philsys.gov.ph",
  "philsys.gov.ph",
  "portal.lto.gov.ph",
  "orus.bir.gov.ph",
  "www.bir.gov.ph",
  "pnpclearance.ph",
  "www.sss.gov.ph",
  "member.sss.gov.ph",
  "www.philhealth.gov.ph",
  "www.pagibigfundservices.com",
  "www.pagibigfund.gov.ph",
  "bnrs.dti.gov.ph",
  "www.dole.gov.ph",
  "dmw.gov.ph",
  "nwpc.dole.gov.ph",
];

export const LINK_CAVEAT =
  "Links go to official agency sites. Agencies reorganise their sites without notice — if a link is dead, search for the agency by name rather than trusting a lookalike site, and never pay a third party for a service the agency provides directly.";
