import React from 'react';
import {AbsoluteFill, Audio, Easing, Img, continueRender, delayRender, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import '@fontsource/allura/400.css';
import '@fontsource/playfair-display/600.css';
import '@fontsource/playfair-display/700.css';
import '@fontsource/montserrat/300.css';
import '@fontsource/cormorant-garamond/500-italic.css';
import {clamp} from './kit';

/**
 * Style N: marble e-invitation (reference: "Shaxzod & Hilola" black-gold rose invite).
 * White marble slab, black roses with gold rims, thin gold frames. Page 1: script "Wedding invitation", a rose wreath around a
 * gold circle with a script monogram. A horizontal pan across the slab to page 2: an arched double gold frame with verse, script
 * names, invitation, date/time, venue and two gold rings. Roses, leaves and rings are all drawn in code (SVG gradients).
 */

const SCRIPT = "'Allura', cursive";
const SERIF = "'Playfair Display', 'Georgia', serif";
const SANS = "'Montserrat', 'Arial', sans-serif";
const ITAL = "'Cormorant Garamond', 'Georgia', serif";
const INK = '#3B3A3A'; const GREY = '#5C5B5B';
const GOLD_STOPS = [['0', '#A9792A'], ['.28', '#E9CF8C'], ['.5', '#FFF1C9'], ['.72', '#C99A45'], ['1', '#8E6420']];

if (typeof document !== 'undefined') {
  const h = delayRender('fonts');
  Promise.all(['400 80px Allura', '600 40px "Playfair Display"', '700 40px "Playfair Display"', '300 40px Montserrat', 'italic 500 40px "Cormorant Garamond"']
    .map((f) => document.fonts.load(f, 'AaŊ‘0'))).then(() => continueRender(h)).catch(() => continueRender(h));
}

export type MarbleInviteProps = {
  marble: string; music?: string; musicVolume?: number; end: number; turn: number;
  heading: string; mono: [string, string];
  verse: [string, string]; verseRef: string; groom: string; bride: string;
  invite: [string, string]; date: string; time: string; place: string; venue: string; venueSub: string;
};

const useF = () => { const f = useCurrentFrame(); const {fps} = useVideoConfig(); return {f, s: (x: number) => Math.round(x * fps)}; };
const ease = Easing.bezier(0.22, 1, 0.36, 1);
const prog = (f: number, a: number, b: number, e = ease) => interpolate(f, [a, b], [0, 1], {...clamp, easing: e});

/* ---------------------------------------------------------------- shared gradients (one hidden svg) */
const Defs: React.FC = () => (
  <svg width={0} height={0} style={{position: 'absolute'}}>
    <defs>
      <linearGradient id="gold" x1="0" y1="0" x2="1" y2="1">{GOLD_STOPS.map(([o, c]) => <stop key={o} offset={o} stopColor={c} />)}</linearGradient>
      <linearGradient id="goldH" x1="0" y1="0" x2="1" y2="0">{GOLD_STOPS.map(([o, c]) => <stop key={o} offset={o} stopColor={c} />)}</linearGradient>
      <radialGradient id="petalO" cx="50%" cy="95%" r="95%"><stop offset="0" stopColor="#1C1C1E" /><stop offset=".55" stopColor="#3A3A3D" /><stop offset="1" stopColor="#8E8E92" /></radialGradient>
      <radialGradient id="petalI" cx="50%" cy="90%" r="90%"><stop offset="0" stopColor="#141416" /><stop offset=".6" stopColor="#2E2E31" /><stop offset="1" stopColor="#6E6E72" /></radialGradient>
      <linearGradient id="leaf" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#2A2A2C" /><stop offset=".6" stopColor="#4A4A4D" /><stop offset="1" stopColor="#77777B" /></linearGradient>
      <linearGradient id="ring" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#8A5E1C" /><stop offset=".3" stopColor="#F3D58E" /><stop offset=".5" stopColor="#FFF5D8" /><stop offset=".7" stopColor="#D2A04A" /><stop offset="1" stopColor="#7A5216" /></linearGradient>
    </defs>
  </svg>
);

/* ---------------------------------------------------------------- botanicals */
const RIM = {stroke: 'url(#gold)', strokeWidth: 1.6, strokeLinejoin: 'round' as const};
const petal = (r: number, w: number) => `M0,0 C${-w * r},${-0.2 * r} ${-w * 1.05 * r},${-0.86 * r} 0,${-r} C${w * 1.05 * r},${-0.86 * r} ${w * r},${-0.2 * r} 0,0 Z`;

/** Black rose with gold rims, ~r px radius, seen from above/three-quarter. */
const Rose: React.FC<{r: number}> = ({r}) => (
  <g>
    {[0, 1, 2, 3, 4, 5].map((i) => <path key={`o${i}`} transform={`rotate(${i * 60 + 15})`} d={petal(r, 0.62)} fill="url(#petalO)" {...RIM} />)}
    {[0, 1, 2, 3, 4].map((i) => <path key={`m${i}`} transform={`rotate(${i * 72 + 40})`} d={petal(r * 0.72, 0.6)} fill="url(#petalO)" {...RIM} />)}
    {[0, 1, 2, 3].map((i) => <path key={`n${i}`} transform={`rotate(${i * 90 + 5})`} d={petal(r * 0.48, 0.62)} fill="url(#petalI)" {...RIM} />)}
    {/* cupped centre: nested open arcs */}
    <circle r={r * 0.3} fill="#1E1E20" {...RIM} />
    <path d={`M${-r * 0.22},${r * 0.05} C${-r * 0.24},${-r * 0.2} ${r * 0.12},${-r * 0.26} ${r * 0.2},${-r * 0.04}`} fill="none" {...RIM} />
    <path d={`M${-r * 0.12},${r * 0.1} C${-r * 0.14},${-r * 0.08} ${r * 0.1},${-r * 0.12} ${r * 0.1},${r * 0.04}`} fill="none" {...RIM} />
    <path d={`M${-r * 0.04},${r * 0.04} C${-r * 0.03},${-r * 0.04} ${r * 0.05},${-r * 0.04} ${r * 0.04},${r * 0.02}`} fill="none" {...RIM} />
  </g>
);
/** Pointed leaf from the origin along +x, length L, dark with gold rim + midrib. */
const Leaf: React.FC<{L: number}> = ({L}) => (
  <g>
    <path d={`M0,0 C${0.3 * L},${-0.26 * L} ${0.72 * L},${-0.22 * L} ${L},0 C${0.72 * L},${0.22 * L} ${0.3 * L},${0.26 * L} 0,0 Z`} fill="url(#leaf)" {...RIM} strokeWidth={1.3} />
    <path d={`M0,0 Q${0.5 * L},${-0.04 * L} ${0.92 * L},0`} fill="none" stroke="url(#gold)" strokeWidth={1.1} />
  </g>
);
/** Thin gold line-art leaf (background filler). */
const GoldLeaf: React.FC<{L: number}> = ({L}) => (
  <path d={`M0,0 C${0.3 * L},${-0.24 * L} ${0.72 * L},${-0.2 * L} ${L},0 C${0.72 * L},${0.2 * L} ${0.3 * L},${0.24 * L} 0,0 Z M0,0 L${0.9 * L},0`} fill="none" stroke="#D9BC7E" strokeWidth={1.4} opacity={0.85} />
);
/** Gold sprig: a stem with filled foil leaves (the reference's gold wheat/leaf accents). */
const GoldSprig: React.FC<{p: number}> = ({p}) => (
  <g>
    <path d="M0,0 C10,-60 20,-120 40,-190" fill="none" stroke="url(#gold)" strokeWidth={2.2} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - Math.min(1, p * 1.4)} />
    {[[6, -30, -120], [12, -60, -40], [18, -95, -125], [26, -125, -50], [33, -158, -118], [40, -190, -75]].map(([x, y, a], i) => {
      const q = Math.max(0, Math.min(1, (p - 0.15 - i * 0.1) / 0.3));
      return <path key={i} transform={`translate(${x},${y}) rotate(${a}) scale(${q})`} d="M0,0 C12,-9 30,-9 44,0 C30,9 12,9 0,0 Z" fill="url(#gold)" />;
    })}
  </g>
);

type Item = {k: 'rose' | 'leaf' | 'gleaf'; x: number; y: number; r: number; a?: number};
/** A placed cluster; each item grows in on its own delay (stagger), then breathes very slightly. */
const Cluster: React.FC<{items: Item[]; at: number; step?: number}> = ({items, at, step = 0.07}) => {
  const {f, s} = useF();
  return (
    <>
      {items.map((it, i) => {
        const p = prog(f, s(at + i * step), s(at + i * step + 0.8), Easing.out(Easing.back(1.4)));
        if (p <= 0) return null;
        const br = 1 + 0.012 * Math.sin((f + i * 17) / 28);
        const op = Math.min(1, p * 1.6);
        return (
          <g key={i} transform={`translate(${it.x},${it.y}) rotate(${(it.a ?? 0) + (1 - p) * -18}) scale(${Math.max(0.001, p * br)})`} opacity={op}>
            {it.k === 'rose' ? <Rose r={it.r} /> : it.k === 'leaf' ? <Leaf L={it.r} /> : <GoldLeaf L={it.r} />}
          </g>
        );
      })}
    </>
  );
};

/* ---------------------------------------------------------------- type helpers */
const Reveal: React.FC<{at: number; dur?: number; children: React.ReactNode; style?: React.CSSProperties}> = ({at, dur = 0.8, children, style}) => {
  const {f, s} = useF();
  const p = prog(f, s(at), s(at + dur));
  if (p <= 0.001) return null;
  return <div style={{opacity: p, filter: p < 0.98 ? `blur(${10 * (1 - p)}px)` : undefined, transform: `translateY(${(1 - p) * 14}px)`, ...style}}>{children}</div>;
};
const Script: React.FC<{at: number; dur?: number; size: number; color?: string; children: React.ReactNode}> = ({at, dur = 1.1, size, color = GREY, children}) => {
  const {f, s} = useF();
  const p = prog(f, s(at), s(at + dur), Easing.inOut(Easing.sin));
  if (p <= 0) return null;
  const x = -15 + 130 * p; const m = `linear-gradient(90deg, #000 ${x - 15}%, transparent ${x}%)`;
  return <div style={{WebkitMaskImage: m, maskImage: m, padding: `0 ${size * 0.3}px`}}><div style={{fontFamily: SCRIPT, fontSize: size, lineHeight: 1.1, color, whiteSpace: 'nowrap'}}>{children}</div></div>;
};
const Center: React.FC<{top: number; children: React.ReactNode}> = ({top, children}) => (
  <div style={{position: 'absolute', left: 0, right: 0, top, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>{children}</div>
);
const capsStyle = (size: number, w = 700): React.CSSProperties => ({fontFamily: SERIF, fontWeight: w, fontSize: size, color: INK, letterSpacing: '0.03em', textAlign: 'center', lineHeight: 1.32, textTransform: 'uppercase'});

/** Stroke-drawn gold path helper. */
const GoldStroke: React.FC<{d: string; p: number; w?: number}> = ({d, p, w = 4}) => (
  <path d={d} fill="none" stroke="url(#goldH)" strokeWidth={w} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
);

/* ---------------------------------------------------------------- layouts (page = 1080x1920) */
const TOP_A: Item[] = [
  {k: 'gleaf', x: 600, y: 120, r: 110, a: 190}, {k: 'gleaf', x: 960, y: 150, r: 100, a: 30}, {k: 'gleaf', x: 700, y: 160, r: 80, a: 140},
  {k: 'leaf', x: 600, y: 90, r: 120, a: 165}, {k: 'leaf', x: 980, y: 100, r: 110, a: 15}, {k: 'leaf', x: 760, y: 140, r: 110, a: 115}, {k: 'leaf', x: 860, y: 140, r: 100, a: 70},
  {k: 'rose', x: 700, y: 70, r: 110}, {k: 'rose', x: 900, y: 40, r: 125}, {k: 'rose', x: 560, y: 30, r: 80}, {k: 'rose', x: 1050, y: 30, r: 75},
];
const BOT_A: Item[] = [
  {k: 'gleaf', x: 150, y: 1720, r: 100, a: -60}, {k: 'gleaf', x: 330, y: 1760, r: 90, a: -20},
  {k: 'leaf', x: 20, y: 1650, r: 120, a: -80}, {k: 'leaf', x: 280, y: 1820, r: 120, a: -20}, {k: 'leaf', x: 380, y: 1880, r: 100, a: -10},
  {k: 'rose', x: 60, y: 1830, r: 120}, {k: 'rose', x: 230, y: 1900, r: 110}, {k: 'rose', x: 30, y: 1690, r: 70},
];
const BOT_A_R: Item[] = [
  {k: 'leaf', x: 1080, y: 1760, r: 110, a: 200}, {k: 'rose', x: 1040, y: 1880, r: 95}, {k: 'gleaf', x: 950, y: 1800, r: 90, a: 230},
];
/** wreath around circle (cx 540, cy 945, R 290) */
const WREATH: Item[] = (() => {
  const cx = 540, cy = 945, R = 300;
  const at = (deg: number, dr = 0) => [cx + Math.cos((deg * Math.PI) / 180) * (R + dr), cy + Math.sin((deg * Math.PI) / 180) * (R + dr)];
  const L: Item[] = [];
  [[-150, 120, -60], [-120, 110, -150], [-35, 110, 40], [175, 110, 120], [200, 100, 260], [70, 110, 160], [100, 100, 30], [20, 100, 110], [-10, 90, -20]].forEach(([d, r, a]) => { const [x, y] = at(d, 10); L.push({k: 'leaf', x, y, r, a}); });
  [[-140, 80, 200], [-60, 90, -40], [160, 90, 120], [60, 80, 180], [10, 70, 60]].forEach(([d, r, a]) => { const [x, y] = at(d, 30); L.push({k: 'gleaf', x, y, r, a}); });
  [[-100, 78], [-75, 95], [-135, 62], [180, 82], [150, 60], [110, 76], [80, 92], [-5, 70], [25, 58]].forEach(([d, r]) => { const [x, y] = at(d, 0); L.push({k: 'rose', x, y, r}); });
  return L;
})();
const TOP_B: Item[] = [
  {k: 'gleaf', x: 120, y: 130, r: 100, a: 195}, {k: 'gleaf', x: 540, y: 150, r: 100, a: 25},
  {k: 'leaf', x: 100, y: 90, r: 120, a: 165}, {k: 'leaf', x: 500, y: 100, r: 120, a: 15}, {k: 'leaf', x: 270, y: 140, r: 110, a: 115}, {k: 'leaf', x: 360, y: 140, r: 100, a: 70},
  {k: 'rose', x: 200, y: 60, r: 115}, {k: 'rose', x: 400, y: 40, r: 125}, {k: 'rose', x: 40, y: 20, r: 85}, {k: 'rose', x: 590, y: 50, r: 80},
];
const BOT_B: Item[] = [
  {k: 'gleaf', x: 830, y: 1700, r: 100, a: 240}, {k: 'gleaf', x: 700, y: 1820, r: 90, a: 200},
  {k: 'leaf', x: 1080, y: 1620, r: 120, a: 250}, {k: 'leaf', x: 780, y: 1830, r: 120, a: 200}, {k: 'leaf', x: 680, y: 1890, r: 100, a: 190},
  {k: 'rose', x: 1010, y: 1810, r: 125}, {k: 'rose', x: 840, y: 1900, r: 110}, {k: 'rose', x: 1060, y: 1660, r: 70},
];

const Rings: React.FC<{p: number; f: number}> = ({p, f}) => {
  const y = (1 - p) * -60; const glint = ((f % 75) / 75);
  return (
    <svg width="220" height="130" viewBox="0 0 220 130" style={{transform: `translateY(${y}px) scale(${0.6 + 0.4 * p})`, opacity: Math.min(1, p * 2)}}>
      <ellipse cx="80" cy="72" rx="62" ry="38" fill="none" stroke="url(#ring)" strokeWidth="13" />
      <ellipse cx="140" cy="60" rx="62" ry="38" fill="none" stroke="url(#ring)" strokeWidth="13" />
      <ellipse cx="80" cy="72" rx="62" ry="38" fill="none" stroke="url(#ring)" strokeWidth="13" strokeDasharray="120 400" strokeDashoffset="-250" />
      {p >= 1 && glint < 0.25 && <circle cx={40 + 160 * (glint / 0.25)} cy={60} r={5} fill="#FFFBEA" opacity={Math.sin((glint / 0.25) * Math.PI)} />}
    </svg>
  );
};

export const MarbleInviteReel: React.FC<MarbleInviteProps> = (p) => {
  const {f, s} = useF();
  const T = p.turn; // page turn start (s)
  const pan = prog(f, s(T), s(T + 0.9), Easing.inOut(Easing.cubic));
  const marbleO = prog(f, s(0.1), s(0.9));
  const drift = 1 + 0.03 * interpolate(f, [0, s(p.end)], [0, 1]);
  const frameA = prog(f, s(0.05), s(0.9), Easing.inOut(Easing.quad));
  const circle = prog(f, s(0.75), s(1.4), Easing.inOut(Easing.quad));
  const arch = prog(f, s(T + 0.6), s(T + 1.5), Easing.inOut(Easing.quad));
  const B = T + 0.9;
  return (
    <AbsoluteFill style={{background: '#FAFAF9', overflow: 'hidden'}}>
      <Defs />
      <div style={{position: 'absolute', left: 0, top: 0, width: 2160, height: 1920, transform: `translateX(${-1080 * pan}px) scale(${drift})`, transformOrigin: `${540 + 1080 * pan}px 960px`}}>
        <Img src={staticFile(p.marble)} style={{position: 'absolute', inset: 0, width: 2160, height: 1920, opacity: 0.72 * marbleO}} />
        {/* ---------------- page A */}
        <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
          <GoldStroke d="M93,150 H983 V1763 H93 Z" p={frameA} w={4} />
          <circle cx={540} cy={945} r={292} fill="rgba(250,250,249,.94)" opacity={circle} />
          <GoldStroke d="M540,653 A292,292 0 1 1 539.9,653" p={circle} w={5} />
          <Cluster items={WREATH} at={0.95} step={0.04} />
          <Cluster items={TOP_A} at={0.3} />
          <Cluster items={BOT_A} at={0.5} />
          <Cluster items={BOT_A_R} at={0.7} />
        </svg>
        <div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 1920}}>
          <Center top={300}><Script at={0.55} size={84}>{p.heading}</Script></Center>
          <div style={{position: 'absolute', left: 300, top: 735}}><Script at={1.25} dur={0.9} size={200}>{p.mono[0]}</Script></div>
          <div style={{position: 'absolute', left: 505, top: 900}}><Reveal at={1.6}><div style={{fontFamily: SCRIPT, fontSize: 100, color: GREY}}>&amp;</div></Reveal></div>
          <div style={{position: 'absolute', left: 545, top: 950}}><Script at={1.75} dur={0.9} size={200}>{p.mono[1]}</Script></div>
        </div>
        {/* ---------------- page B */}
        <div style={{position: 'absolute', left: 1080, top: 0, width: 1080, height: 1920}}>
          <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
            <GoldStroke d="M105,1703 V638 A420,420 0 0 1 945,638 V1703 Z" p={arch} w={5} />
            <GoldStroke d="M127,1681 V660 A398,398 0 0 1 923,660 V1681 Z" p={prog(f, s(T + 0.8), s(T + 1.7), Easing.inOut(Easing.quad))} w={2.5} />
            <g transform="translate(55,640) rotate(-12)"><GoldSprig p={prog(f, s(B + 0.5), s(B + 1.6))} /></g>
            <g transform="translate(960,1600) rotate(14)"><GoldSprig p={prog(f, s(B + 0.8), s(B + 1.9))} /></g>
            <Cluster items={TOP_B} at={B + 0.2} />
            <Cluster items={BOT_B} at={B + 0.45} />
          </svg>
          <Center top={392}>
            <Reveal at={B + 0.6}><div style={capsStyle(34)}>{p.verse[0]}<br />{p.verse[1]}</div></Reveal>
            <div style={{alignSelf: 'flex-end', marginRight: 205}}><Reveal at={B + 0.9}><div style={{fontFamily: ITAL, fontStyle: 'italic', fontWeight: 500, fontSize: 30, color: GREY}}>{p.verseRef}</div></Reveal></div>
          </Center>
          <Center top={540}>
            <Script at={B + 1.2} size={136}>{p.groom}</Script>
            <Reveal at={B + 1.9}><div style={{fontFamily: SCRIPT, fontSize: 78, color: GREY, lineHeight: 0.9}}>&amp;</div></Reveal>
            <Script at={B + 2.1} size={136}>{p.bride}</Script>
          </Center>
          <Center top={1028}><Reveal at={B + 2.9}><div style={capsStyle(32, 600)}>{p.invite[0]}<br />{p.invite[1]}</div></Reveal></Center>
          <Center top={1150}>
            <Reveal at={B + 3.4}><div style={{fontFamily: SANS, fontWeight: 300, fontSize: 72, color: INK, letterSpacing: '0.02em', lineHeight: 1.05}}>{p.date}</div></Reveal>
            <Reveal at={B + 3.7}><div style={{fontFamily: SANS, fontWeight: 300, fontSize: 92, color: INK, lineHeight: 1.05}}>{p.time}</div></Reveal>
          </Center>
          <Center top={1380}>
            <Reveal at={B + 4.1}><div style={{fontFamily: SERIF, fontWeight: 600, fontSize: 26, color: GREY, letterSpacing: '0.08em', textTransform: 'uppercase'}}>{p.place}</div></Reveal>
            <Reveal at={B + 4.4}><div style={{...capsStyle(60), lineHeight: 1.1, marginTop: 10}}>{p.venue}</div></Reveal>
            <Reveal at={B + 4.7}><div style={{fontFamily: SERIF, fontWeight: 600, fontSize: 42, color: INK, letterSpacing: '0.04em', textTransform: 'uppercase'}}>{p.venueSub}</div></Reveal>
          </Center>
          <Center top={1585}><Rings p={prog(f, s(B + 5.1), s(B + 5.9), Easing.out(Easing.back(1.6)))} f={f} /></Center>
        </div>
      </div>
      {p.music && <Audio src={staticFile(p.music)} volume={(fr) => (p.musicVolume ?? 1) * interpolate(fr, [0, 4, s(p.end) - 20, s(p.end)], [0, 1, 1, 0], clamp)} />}
    </AbsoluteFill>
  );
};

export const marbleInviteDuration = (p: MarbleInviteProps, fps: number) => Math.round(p.end * fps);
