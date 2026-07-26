import React from "react";
import { View } from "react-native";
import Svg, {
  Circle,
  G,
  Line,
  Path,
  Polygon,
  Rect,
  Text as SvgText,
} from "react-native-svg";

import { useTheme } from "../lib/theme/ThemeProvider";

/**
 * Inline SVG only — no image files, nothing fetched. Everything here is drawn
 * from the ledger palette so it reads as part of the paper rather than as
 * clip-art dropped onto it. Monoline, geometric, quiet.
 */

/** Ledger sheet with dotted leaders and a stamped corner. Empty states. */
export function LedgerSheet({ size = 120 }: { size?: number }) {
  const th = useTheme();
  return (
    <Svg width={size} height={size} viewBox="0 0 120 120" accessibilityLabel="">
      <G transform="rotate(-4 60 60)">
        <Rect
          x={22}
          y={14}
          width={76}
          height={94}
          rx={4}
          fill={th.c.card}
          stroke={th.c.ruleStrong}
          strokeWidth={1.5}
        />
        {[34, 46, 58, 70].map((y) => (
          <G key={y}>
            <Line x1={32} y1={y} x2={58} y2={y} stroke={th.c.ink} strokeWidth={2.2} strokeLinecap="round" />
            <Line
              x1={62}
              y1={y}
              x2={88}
              y2={y}
              stroke={th.c.rule}
              strokeWidth={2}
              strokeLinecap="round"
              strokeDasharray="1 4"
            />
          </G>
        ))}
        <Line x1={32} y1={82} x2={88} y2={82} stroke={th.c.ruleStrong} strokeWidth={1.2} />
        <Line x1={32} y1={85} x2={88} y2={85} stroke={th.c.ruleStrong} strokeWidth={1.2} />
        <Line x1={60} y1={94} x2={88} y2={94} stroke={th.c.accent} strokeWidth={3} strokeLinecap="round" />
      </G>
      <G transform="rotate(12 92 96)" opacity={0.9}>
        <Rect
          x={70}
          y={84}
          width={44}
          height={24}
          rx={3}
          fill="none"
          stroke={th.c.stamp}
          strokeWidth={2.5}
        />
      </G>
    </Svg>
  );
}

/** Magnifier over a page. No search results. */
export function MagnifyPaper({ size = 110 }: { size?: number }) {
  const th = useTheme();
  return (
    <Svg width={size} height={size} viewBox="0 0 120 120" accessibilityLabel="">
      <Rect
        x={20}
        y={18}
        width={62}
        height={80}
        rx={4}
        fill={th.c.card}
        stroke={th.c.ruleStrong}
        strokeWidth={1.5}
      />
      {[34, 46, 58].map((y) => (
        <Line
          key={y}
          x1={30}
          y1={y}
          x2={72}
          y2={y}
          stroke={th.c.rule}
          strokeWidth={2.4}
          strokeLinecap="round"
        />
      ))}
      <Circle cx={78} cy={72} r={22} fill={th.c.paper} fillOpacity={0.6} stroke={th.c.accent} strokeWidth={3.5} />
      <Line
        x1={94}
        y1={88}
        x2={106}
        y2={100}
        stroke={th.c.accent}
        strokeWidth={4.5}
        strokeLinecap="round"
      />
    </Svg>
  );
}

/**
 * The rubber stamp, drawn properly. Used for the payslip-checker all-clear —
 * the one moment in the app that deserves a small reward.
 */
export function TamaStamp({ size = 128, label = "TAMA" }: { size?: number; label?: string }) {
  const th = useTheme();
  return (
    <Svg width={size} height={size} viewBox="0 0 128 128" accessibilityLabel={label}>
      <G transform="rotate(-11 64 64)" opacity={0.92}>
        <Circle cx={64} cy={64} r={52} fill="none" stroke={th.c.accent} strokeWidth={4} />
        <Circle
          cx={64}
          cy={64}
          r={44}
          fill="none"
          stroke={th.c.accent}
          strokeWidth={1.5}
          strokeDasharray="3 4"
        />
        <SvgText
          x={64}
          y={60}
          fontSize={22}
          fontWeight="bold"
          fill={th.c.accent}
          textAnchor="middle"
          fontFamily={th.font.monoBold}
        >
          {label}
        </SvgText>
        <Path
          d="M48 76 L59 87 L82 66"
          fill="none"
          stroke={th.c.accent}
          strokeWidth={5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </G>
    </Svg>
  );
}

/** Banderitas — the fiesta bunting on every Philippine street in December. */
export function Banderitas({ width = 320, height = 30 }: { width?: number; height?: number }) {
  const th = useTheme();
  const colors = [th.c.accent, th.c.stamp, th.c.warn, th.c.ruleStrong];
  const count = 11;
  const step = 300 / (count - 1);

  return (
    <Svg width="100%" height={height} viewBox="0 0 300 30" accessibilityLabel="" preserveAspectRatio="none">
      <Path
        d="M0 5 Q75 16 150 9 Q225 2 300 12"
        fill="none"
        stroke={th.c.ruleStrong}
        strokeWidth={1.2}
      />
      {Array.from({ length: count }).map((_, i) => {
        const x = i * step;
        // Follow the rough sag of the string above.
        const y = 5 + Math.sin((i / (count - 1)) * Math.PI) * 7 - (i / (count - 1)) * 0;
        return (
          <Polygon
            key={i}
            points={`${x - 7},${y} ${x + 7},${y} ${x},${y + 15}`}
            fill={colors[i % colors.length]}
            opacity={0.85}
          />
        );
      })}
    </Svg>
  );
}

/** The sobre — a pay envelope. Payday countdown. */
export function PayEnvelope({ size = 64 }: { size?: number }) {
  const th = useTheme();
  return (
    <Svg width={size} height={size * 0.72} viewBox="0 0 64 46" accessibilityLabel="">
      <Rect
        x={2}
        y={4}
        width={60}
        height={38}
        rx={3}
        fill={th.c.card}
        stroke={th.c.ruleStrong}
        strokeWidth={1.6}
      />
      <Path d="M2 7 L32 27 L62 7" fill="none" stroke={th.c.ruleStrong} strokeWidth={1.6} strokeLinejoin="round" />
      <Rect x={20} y={16} width={24} height={16} rx={2} fill={th.c.accentSoft} stroke={th.c.accent} strokeWidth={1.4} />
      <SvgText
        x={32}
        y={28}
        fontSize={11}
        fill={th.c.accent}
        textAnchor="middle"
        fontFamily={th.font.monoBold}
      >
        ₱
      </SvgText>
    </Svg>
  );
}

/** A small decorative rule with a diamond, to break long content pages. */
export function LedgerBreak() {
  const th = useTheme();
  return (
    <View accessibilityElementsHidden importantForAccessibility="no">
      <Svg width="100%" height={12} viewBox="0 0 300 12" preserveAspectRatio="none">
        <Line x1={0} y1={6} x2={132} y2={6} stroke={th.c.rule} strokeWidth={1} />
        <Polygon points="150,1 156,6 150,11 144,6" fill={th.c.rule} />
        <Line x1={168} y1={6} x2={300} y2={6} stroke={th.c.rule} strokeWidth={1} />
      </Svg>
    </View>
  );
}

/* ------------------------------------------------------------------ *
 * Filipino set. Same monoline treatment and the same palette, so they
 * sit on the ledger paper rather than on top of it.
 * ------------------------------------------------------------------ */

/** Jeepney. The one object everybody recognises instantly. */
export function Jeepney({ size = 132 }: { size?: number }) {
  const th = useTheme();
  return (
    <Svg width={size} height={size * 0.62} viewBox="0 0 132 82" accessibilityLabel="">
      {/* body */}
      <Path
        d="M8 56 L8 34 Q8 30 12 29 L44 24 L58 12 L96 12 Q102 12 104 18 L110 29 L122 32 Q126 33 126 38 L126 56 Z"
        fill={th.c.card}
        stroke={th.c.ink}
        strokeWidth={2.2}
        strokeLinejoin="round"
      />
      {/* roof rack */}
      <Line x1={60} y1={12} x2={100} y2={12} stroke={th.c.accent} strokeWidth={3} strokeLinecap="round" />
      {/* windows */}
      <Rect x={62} y={17} width={16} height={11} rx={1.5} fill={th.c.accentSoft} stroke={th.c.ink} strokeWidth={1.6} />
      <Rect x={82} y={17} width={16} height={11} rx={1.5} fill={th.c.accentSoft} stroke={th.c.ink} strokeWidth={1.6} />
      {/* side panels, the painted stripes */}
      <Line x1={16} y1={38} x2={52} y2={38} stroke={th.c.stamp} strokeWidth={2.4} strokeLinecap="round" />
      <Line x1={16} y1={44} x2={52} y2={44} stroke={th.c.warn} strokeWidth={2.4} strokeLinecap="round" />
      <Line x1={16} y1={50} x2={52} y2={50} stroke={th.c.accent} strokeWidth={2.4} strokeLinecap="round" />
      {/* wheels */}
      <Circle cx={36} cy={60} r={10} fill={th.c.paper} stroke={th.c.ink} strokeWidth={2.4} />
      <Circle cx={36} cy={60} r={3} fill={th.c.ink} />
      <Circle cx={104} cy={60} r={10} fill={th.c.paper} stroke={th.c.ink} strokeWidth={2.4} />
      <Circle cx={104} cy={60} r={3} fill={th.c.ink} />
      <Line x1={0} y1={71} x2={132} y2={71} stroke={th.c.rule} strokeWidth={1.6} />
    </Svg>
  );
}

/** Parol. The Christmas lantern, for December. */
export function Parol({ size = 96 }: { size?: number }) {
  const th = useTheme();
  const star = "48,6 58,32 86,32 63,48 72,76 48,59 24,76 33,48 10,32 38,32";
  return (
    <Svg width={size} height={size} viewBox="0 0 96 96" accessibilityLabel="">
      <Polygon points={star} fill={th.c.accentSoft} stroke={th.c.accent} strokeWidth={2.4} strokeLinejoin="round" />
      <Polygon points="48,20 56,40 40,40" fill={th.c.warn} opacity={0.75} />
      <Polygon points="48,50 40,40 56,40" fill={th.c.stamp} opacity={0.65} />
      {/* tails */}
      <Path d="M34 74 Q30 86 26 94" fill="none" stroke={th.c.stamp} strokeWidth={2.4} strokeLinecap="round" />
      <Path d="M62 74 Q66 86 70 94" fill="none" stroke={th.c.warn} strokeWidth={2.4} strokeLinecap="round" />
    </Svg>
  );
}

/** Bahay kubo, for anything about home, household work or the LGU. */
export function BahayKubo({ size = 112 }: { size?: number }) {
  const th = useTheme();
  return (
    <Svg width={size} height={size * 0.8} viewBox="0 0 112 90" accessibilityLabel="">
      <Path d="M56 8 L100 40 L12 40 Z" fill={th.c.accentSoft} stroke={th.c.ink} strokeWidth={2.2} strokeLinejoin="round" />
      <Line x1={30} y1={30} x2={82} y2={30} stroke={th.c.accent} strokeWidth={1.6} />
      <Line x1={20} y1={35} x2={92} y2={35} stroke={th.c.accent} strokeWidth={1.6} />
      <Rect x={26} y={40} width={60} height={30} fill={th.c.card} stroke={th.c.ink} strokeWidth={2.2} />
      <Rect x={38} y={48} width={16} height={14} rx={1} fill={th.c.accentSoft} stroke={th.c.ink} strokeWidth={1.6} />
      <Rect x={62} y={48} width={12} height={22} rx={1} fill={th.c.paper} stroke={th.c.ink} strokeWidth={1.6} />
      {/* stilts */}
      <Line x1={32} y1={70} x2={32} y2={82} stroke={th.c.ink} strokeWidth={2.4} strokeLinecap="round" />
      <Line x1={80} y1={70} x2={80} y2={82} stroke={th.c.ink} strokeWidth={2.4} strokeLinecap="round" />
      <Line x1={4} y1={82} x2={108} y2={82} stroke={th.c.rule} strokeWidth={1.6} />
    </Svg>
  );
}

/** The eight-rayed sun, used quietly as a section mark. */
export function SunRays({ size = 64 }: { size?: number }) {
  const th = useTheme();
  const rays = Array.from({ length: 8 }).map((_, i) => {
    const a = (i * Math.PI * 2) / 8 - Math.PI / 2;
    return {
      x1: 32 + Math.cos(a) * 15,
      y1: 32 + Math.sin(a) * 15,
      x2: 32 + Math.cos(a) * 27,
      y2: 32 + Math.sin(a) * 27,
    };
  });
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64" accessibilityLabel="">
      <Circle cx={32} cy={32} r={12} fill="none" stroke={th.c.accent} strokeWidth={2.4} />
      {rays.map((r, i) => (
        <Line
          key={i}
          x1={r.x1}
          y1={r.y1}
          x2={r.x2}
          y2={r.y2}
          stroke={th.c.accent}
          strokeWidth={2.4}
          strokeLinecap="round"
        />
      ))}
    </Svg>
  );
}

/** A queue of people at a government window. Papeles header. */
export function OfficeQueue({ size = 140 }: { size?: number }) {
  const th = useTheme();
  const person = (x: number, h: number, tone: string) => (
    <G key={x}>
      <Circle cx={x} cy={40 - h} r={6.5} fill={th.c.card} stroke={tone} strokeWidth={2.2} />
      <Path
        d={`M${x - 9} ${62} L${x - 9} ${48 - h} Q${x - 9} ${40 - h + 6} ${x} ${40 - h + 6} Q${x + 9} ${40 - h + 6} ${x + 9} ${48 - h} L${x + 9} 62 Z`}
        fill={th.c.card}
        stroke={tone}
        strokeWidth={2.2}
        strokeLinejoin="round"
      />
    </G>
  );
  return (
    <Svg width={size} height={size * 0.52} viewBox="0 0 140 72" accessibilityLabel="">
      {/* counter window */}
      <Rect x={96} y={8} width={40} height={54} rx={3} fill={th.c.cardSunken} stroke={th.c.ruleStrong} strokeWidth={2} />
      <Line x1={96} y1={40} x2={136} y2={40} stroke={th.c.ruleStrong} strokeWidth={2} />
      <Rect x={104} y={46} width={24} height={10} rx={1.5} fill={th.c.accentSoft} stroke={th.c.accent} strokeWidth={1.6} />
      {person(20, 2, th.c.ruleStrong)}
      {person(48, 0, th.c.ruleStrong)}
      {person(76, 3, th.c.accent)}
      <Line x1={0} y1={62} x2={140} y2={62} stroke={th.c.rule} strokeWidth={1.6} />
    </Svg>
  );
}
