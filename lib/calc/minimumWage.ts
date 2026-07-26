import { num, peso, round2 } from "./money";

/**
 * Seventeen regional wage boards issue wage orders independently and they move
 * often, so the figures are NOT compiled in until each one is verified against
 * the issuing wage order. `dailyFloor: null` renders as "not loaded" with a
 * pointer to the NWPC, never as a number.
 *
 * TO POPULATE: fill `dailyFloor`, `wageOrder` and `effective` from the current
 * wage order for that region, then set `status: "verified"` and update
 * `lastVerified`. The comparison below starts working the moment a figure lands.
 */

export type WageSector = "non-agriculture" | "agriculture" | "retail-service";

export const WAGE_SECTORS: { id: WageSector; label: string; hint: string }[] = [
  {
    id: "non-agriculture",
    label: "Non-agriculture",
    hint: "Offices, factories, BPO, retail chains, construction",
  },
  {
    id: "agriculture",
    label: "Agriculture",
    hint: "Plantation and non-plantation agricultural work",
  },
  {
    id: "retail-service",
    label: "Retail and service establishments",
    hint: "Small establishments, usually those employing 15 workers or fewer",
  },
];

export type WageFloor = {
  sector: WageSector;
  /** null means not yet verified against the wage order. Never render a guess. */
  dailyFloor: number | null;
  wageOrder: string | null;
  effective: string | null;
  status: "verified" | "pending";
};

export type WageRegion = {
  id: string;
  name: string;
  /** The cities and provinces the board covers, to help people pick correctly. */
  covers: string;
  board: string;
  /** That board's page on the NWPC site, where its current wage order lives. */
  url: string;
  floors: WageFloor[];
};

const pending = (sector: WageSector): WageFloor => ({
  sector,
  dailyFloor: null,
  wageOrder: null,
  effective: null,
  status: "pending",
});

const allPending = (): WageFloor[] => [
  pending("non-agriculture"),
  pending("agriculture"),
  pending("retail-service"),
];

export const WAGE_REGIONS: WageRegion[] = [
  { id: "ncr", name: "National Capital Region", covers: "Metro Manila", board: "RTWPB-NCR", url: "https://nwpc.dole.gov.ph/ncr/", floors: allPending() },
  { id: "car", name: "Cordillera Administrative Region", covers: "Abra, Apayao, Benguet, Ifugao, Kalinga, Mountain Province, Baguio City", board: "RTWPB-CAR", url: "https://nwpc.dole.gov.ph/car/", floors: allPending() },
  { id: "r1", name: "Region I — Ilocos", covers: "Ilocos Norte, Ilocos Sur, La Union, Pangasinan", board: "RTWPB-I", url: "https://nwpc.dole.gov.ph/region-i/", floors: allPending() },
  { id: "r2", name: "Region II — Cagayan Valley", covers: "Batanes, Cagayan, Isabela, Nueva Vizcaya, Quirino", board: "RTWPB-II", url: "https://nwpc.dole.gov.ph/region-ii/", floors: allPending() },
  { id: "r3", name: "Region III — Central Luzon", covers: "Aurora, Bataan, Bulacan, Nueva Ecija, Pampanga, Tarlac, Zambales", board: "RTWPB-III", url: "https://nwpc.dole.gov.ph/region-iii/", floors: allPending() },
  { id: "r4a", name: "Region IV-A — CALABARZON", covers: "Cavite, Laguna, Batangas, Rizal, Quezon", board: "RTWPB-IV-A", url: "https://nwpc.dole.gov.ph/region-iva/", floors: allPending() },
  { id: "mimaropa", name: "MIMAROPA", covers: "Occidental Mindoro, Oriental Mindoro, Marinduque, Romblon, Palawan", board: "RTWPB-MIMAROPA", url: "https://nwpc.dole.gov.ph/region-ivb/", floors: allPending() },
  { id: "r5", name: "Region V — Bicol", covers: "Albay, Camarines Norte, Camarines Sur, Catanduanes, Masbate, Sorsogon", board: "RTWPB-V", url: "https://nwpc.dole.gov.ph/region-v/", floors: allPending() },
  { id: "r6", name: "Region VI — Western Visayas", covers: "Aklan, Antique, Capiz, Guimaras, Iloilo, Negros Occidental", board: "RTWPB-VI", url: "https://nwpc.dole.gov.ph/region-vi/", floors: allPending() },
  { id: "r7", name: "Region VII — Central Visayas", covers: "Bohol, Cebu, Negros Oriental, Siquijor", board: "RTWPB-VII", url: "https://nwpc.dole.gov.ph/region-vii/", floors: allPending() },
  { id: "r8", name: "Region VIII — Eastern Visayas", covers: "Biliran, Eastern Samar, Leyte, Northern Samar, Samar, Southern Leyte", board: "RTWPB-VIII", url: "https://nwpc.dole.gov.ph/region-viii/", floors: allPending() },
  { id: "r9", name: "Region IX — Zamboanga Peninsula", covers: "Zamboanga del Norte, Zamboanga del Sur, Zamboanga Sibugay", board: "RTWPB-IX", url: "https://nwpc.dole.gov.ph/region-ix/", floors: allPending() },
  { id: "r10", name: "Region X — Northern Mindanao", covers: "Bukidnon, Camiguin, Lanao del Norte, Misamis Occidental, Misamis Oriental", board: "RTWPB-X", url: "https://nwpc.dole.gov.ph/region-x/", floors: allPending() },
  { id: "r11", name: "Region XI — Davao", covers: "Davao del Norte, Davao del Sur, Davao Occidental, Davao Oriental, Davao de Oro", board: "RTWPB-XI", url: "https://nwpc.dole.gov.ph/region-xi/", floors: allPending() },
  { id: "r12", name: "Region XII — SOCCSKSARGEN", covers: "Cotabato, Sarangani, South Cotabato, Sultan Kudarat", board: "RTWPB-XII", url: "https://nwpc.dole.gov.ph/region-xii/", floors: allPending() },
  { id: "r13", name: "Region XIII — Caraga", covers: "Agusan del Norte, Agusan del Sur, Surigao del Norte, Surigao del Sur, Dinagat Islands", board: "RTWPB-XIII", url: "https://nwpc.dole.gov.ph/region-xiii/", floors: allPending() },
  { id: "barmm", name: "BARMM", covers: "Basilan, Lanao del Sur, Maguindanao del Norte, Maguindanao del Sur, Sulu, Tawi-Tawi", board: "RTWPB-BARMM", url: "https://nwpc.dole.gov.ph/barmm/", floors: allPending() },
];

/**
 * The NWPC site has no combined wage-order index — /regional-wage-orders is a
 * 404. Each board publishes its own page, so link the board, not a directory.
 */
export const NWPC_URL = "https://nwpc.dole.gov.ph/";

export type WageComparison = {
  region: WageRegion;
  floor: WageFloor;
  /** null when the floor has not been verified, so no verdict is rendered. */
  difference: number | null;
  verdict: "unknown" | "at-or-above" | "below";
  message: string;
  source: string;
};

export function compareToWageFloor(
  regionId: string,
  sector: WageSector,
  userDailyRate: number | undefined
): WageComparison | null {
  const region = WAGE_REGIONS.find((r) => r.id === regionId);
  if (!region) return null;
  const floor = region.floors.find((f) => f.sector === sector) ?? region.floors[0];

  if (floor.dailyFloor === null) {
    return {
      region,
      floor,
      difference: null,
      verdict: "unknown",
      message:
        "The wage floor for this region is not loaded in this build. Check the current wage order on the NWPC site rather than relying on a number here.",
      source: `${region.board} — see the current wage order`,
    };
  }

  const source = `${floor.wageOrder ?? "Wage order"}, effective ${floor.effective ?? "—"} · ${region.board}`;

  if (userDailyRate === undefined) {
    return {
      region,
      floor,
      difference: null,
      verdict: "unknown",
      message: `The current daily floor for ${WAGE_SECTORS.find((s) => s.id === sector)?.label.toLowerCase()} in ${region.name} is ${peso(floor.dailyFloor)}. Enter your daily rate to compare.`,
      source,
    };
  }

  const difference = round2(userDailyRate - floor.dailyFloor);
  const below = difference < 0;

  return {
    region,
    floor,
    difference,
    verdict: below ? "below" : "at-or-above",
    message: below
      ? `Your ${peso(userDailyRate)} daily rate is ${peso(
          Math.abs(difference)
        )} below the current floor for your region, worth raising with your employer.`
      : difference === 0
        ? `Your daily rate is exactly at the current floor for your region, ${peso(floor.dailyFloor)}.`
        : `Your ${peso(userDailyRate)} daily rate is ${peso(difference)} above the current floor of ${peso(
            floor.dailyFloor
          )} for your region.`,
    source,
  };
}

export const WAGE_CAVEATS = [
  "Wage orders are issued by seventeen regional boards independently, and they move often. Confirm the figure against the current wage order for your region before acting on it.",
  "Some establishments are exempt from a wage order, including barangay micro business enterprises registered under RA 9178 and, on application, distressed establishments and new business enterprises.",
  "The floor is a daily rate for eight hours of work. Monthly-paid employees convert using their company's day factor, so comparing a monthly salary directly to this number will mislead.",
  "Domestic workers are covered by a separate wage floor under RA 10361, the Batas Kasambahay, not by these wage orders.",
];

export function wageFloorAsMonthly(dailyFloor: number, dayFactor: number): string {
  return `${peso(round2((dailyFloor * dayFactor) / 12))} a month at a ${num(dayFactor, 0)}-day factor`;
}
