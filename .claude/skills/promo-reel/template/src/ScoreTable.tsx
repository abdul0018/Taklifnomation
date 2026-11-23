import React from 'react';
import {AbsoluteFill, Audio, Easing, Img, OffthreadVideo, Sequence, continueRender, delayRender, interpolate, spring, staticFile, random, useCurrentFrame, useVideoConfig} from 'remotion';
import '@fontsource/montserrat/700.css';
import '@fontsource/montserrat/800.css';
import '@fontsource/montserrat/900.css';
import '@fontsource/oswald/500.css';
import '@fontsource/oswald/600.css';
import '@fontsource/oswald/700.css';
import '@fontsource/architects-daughter/400.css';
import '@fontsource/patrick-hand/400.css';
import {clamp, src} from './kit';

/**
 * Style H: "8+ resource table" over a talking head (reference: Speaking/Listening/Reading/Writing 8+ table).
 * Frosted mint rows (skill icon + name | 8+ pill | resource) build in at the start; when the speaker names a
 * skill its row lifts and glows, and when they name the resource its tile pops into the third column.
 * Footage is never graded — the only addition is the cards' soft drop shadow.
 */

const FONT = "'Montserrat', 'Arial', sans-serif";
const INK = '#16201A';
const MINT = 'rgba(236,248,238,.93)';
const GREEN = '#1F8A3B';

if (typeof document !== 'undefined') {
  const h = delayRender('fonts');
  Promise.all(['900 60px Montserrat', '800 60px Montserrat', '700 60px Montserrat', '500 60px Oswald', '600 60px Oswald', '700 60px Oswald', '400 60px "Architects Daughter"', '400 60px "Patrick Hand"'].map((f) => document.fonts.load(f, 'Aa8+.')))
    .then(() => continueRender(h)).catch(() => continueRender(h));
}

/* ------------------------------------------------------------------ original icons (SVG 120x120) */

const I: React.FC<{children: React.ReactNode}> = ({children}) => <svg viewBox="0 0 120 120" width="100%" height="100%">{children}</svg>;

/** Skill icons: glossy, slightly 3D, with a little motion accent drawn in. */
export const SKILL_ICONS: Record<string, React.FC> = {
  listening: () => (
    <I>
      <defs><linearGradient id="hp" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#4A4F57" /><stop offset="1" stopColor="#15181C" /></linearGradient></defs>
      <path d="M22 70 V58 a38 38 0 0 1 76 0 V70" fill="none" stroke="url(#hp)" strokeWidth="11" strokeLinecap="round" />
      <rect x="12" y="62" width="26" height="40" rx="12" fill="url(#hp)" /><rect x="82" y="62" width="26" height="40" rx="12" fill="url(#hp)" />
      <rect x="18" y="68" width="8" height="26" rx="4" fill="#fff" opacity=".25" /><rect x="88" y="68" width="8" height="26" rx="4" fill="#fff" opacity=".25" />
      <path d="M104 30 l8 -6 M108 42 l10 -1" stroke="#F5B21B" strokeWidth="5" strokeLinecap="round" />
    </I>
  ),
  vocabulary: () => (
    <I>
      <rect x="14" y="78" width="88" height="20" rx="5" fill="#2F7BE5" /><rect x="14" y="78" width="88" height="6" rx="3" fill="#fff" opacity=".35" />
      <rect x="20" y="58" width="80" height="20" rx="5" fill="#F5B21B" /><rect x="20" y="58" width="80" height="6" rx="3" fill="#fff" opacity=".35" />
      <g transform="rotate(-10 60 44)"><rect x="24" y="30" width="76" height="28" rx="6" fill="#E9F1FF" stroke="#2F7BE5" strokeWidth="4" />
        <text x="62" y="51" textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize="20" fill="#2F7BE5">A–Z</text></g>
      <path d="M100 14 l4 10 l10 4 l-10 4 l-4 10 l-4 -10 l-10 -4 l10 -4 Z" fill="#F5B21B" />
    </I>
  ),
  reading: () => (
    <I>
      <path d="M10 34 Q35 24 60 36 Q85 24 110 34 V96 Q85 86 60 98 Q35 86 10 96 Z" fill="#E4472F" />
      <path d="M16 32 Q38 24 58 34 V90 Q38 80 16 88 Z" fill="#FFF7EA" /><path d="M104 32 Q82 24 62 34 V90 Q82 80 104 88 Z" fill="#FFF1DC" />
      {[44, 54, 64, 74].map((y) => <path key={y} d={`M24 ${y} Q38 ${y - 5} 50 ${y + 2}`} stroke="#E4B98A" strokeWidth="3.5" fill="none" strokeLinecap="round" />)}
      {[44, 54, 64, 74].map((y) => <path key={y} d={`M70 ${y + 2} Q82 ${y - 5} 96 ${y}`} stroke="#E4B98A" strokeWidth="3.5" fill="none" strokeLinecap="round" />)}
      <path d="M100 12 l3 8 l8 3 l-8 3 l-3 8 l-3 -8 l-8 -3 l8 -3 Z" fill="#F5B21B" />
    </I>
  ),
  speaking: () => (
    <I>
      <path d="M58 46 h44 a10 10 0 0 1 10 10 v24 a10 10 0 0 1 -10 10 h-8 l-8 12 l-4 -12 h-24 a10 10 0 0 1 -10 -10 v-24 a10 10 0 0 1 10 -10 z" fill="#6B4A2B" />
      <path d="M14 18 h56 a12 12 0 0 1 12 12 v28 a12 12 0 0 1 -12 12 h-30 l-14 14 v-14 h-12 a12 12 0 0 1 -12 -12 v-28 a12 12 0 0 1 12 -12 z" fill="#F5B21B" />
      <path d="M14 18 h56 a12 12 0 0 1 12 12 v6 h-80 v-6 a12 12 0 0 1 12 -12 z" fill="#fff" opacity=".3" />
      {[26, 42, 58].map((x) => <circle key={x} cx={x} cy="45" r="5.5" fill="#fff" />)}
    </I>
  ),
  writing: () => (
    <I>
      <rect x="18" y="12" width="66" height="90" rx="8" fill="#fff" stroke="#C9D3DD" strokeWidth="3" />
      {[32, 46, 60, 74].map((y) => <rect key={y} x="30" y={y} width={y === 74 ? 26 : 42} height="5" rx="2.5" fill="#C9D3DD" />)}
      <g transform="rotate(40 82 70)"><rect x="74" y="26" width="16" height="70" rx="3" fill="#F5B21B" /><rect x="74" y="26" width="16" height="12" rx="3" fill="#E9708A" /><path d="M74 96 h16 l-8 16 z" fill="#F2D7A8" /><path d="M79 106 h6 l-3 6 z" fill="#333" /></g>
    </I>
  ),
};

/** Resource tiles for the third column. */
export const RESOURCE_TILES: Record<string, React.FC> = {
  youtube: () => (
    <svg viewBox="0 0 160 112" height="78">
      <defs><linearGradient id="yt" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#FF3B30" /><stop offset="1" stopColor="#D9140B" /></linearGradient></defs>
      <rect x="4" y="4" width="152" height="104" rx="30" fill="url(#yt)" />
      <rect x="10" y="8" width="140" height="40" rx="20" fill="#fff" opacity=".18" />
      <path d="M64 34 L106 56 L64 78 Z" fill="#fff" />
    </svg>
  ),
  preppy: () => (
    <svg viewBox="0 0 170 120" height="86">
      {/* original flame-haired mascot */}
      <path d="M22 54 L30 14 L48 40 L60 6 L76 36 L90 4 L102 36 L118 8 L128 40 L146 16 L150 56 Z" fill="#FF6A1A" />
      <path d="M34 52 L40 28 L52 44 L62 22 L76 42 L90 20 L102 42 L116 24 L124 44 L136 30 L138 54 Z" fill="#FFB020" />
      <rect x="18" y="46" width="134" height="68" rx="32" fill="#fff" stroke="#FF5A1F" strokeWidth="6" />
      <path d="M50 70 l20 8" stroke="#1B1B1B" strokeWidth="7" strokeLinecap="round" /><path d="M120 70 l-20 8" stroke="#1B1B1B" strokeWidth="7" strokeLinecap="round" />
      <circle cx="64" cy="86" r="7" fill="#1B1B1B" /><circle cx="106" cy="86" r="7" fill="#1B1B1B" />
      <path d="M76 100 q9 -6 18 0" stroke="#1B1B1B" strokeWidth="5" fill="none" strokeLinecap="round" />
    </svg>
  ),
};

/* ------------------------------------------------------------------ types */

/** resource: `tile` (original SVG) or `img` (real logo file in public/, drawn `imgH` px tall), plus optional text/caption. */
export type Row = {skill: string; label: string; badge?: string; at: number; resource: {at: number; tile?: string; img?: string; imgH?: number; text?: string; textSize?: number; sub?: string; caption?: string}};
/**
 * clean: no shadows or blurred glows (crisp hairline outline instead). overlayOnly: graphics on transparent for ffmpeg compositing.
 * highlight (default true): active row lifts and glows; false = rows stay still, only resources pop (cafe-table reference).
 * enter: 'up' (default) or 'left' (rows slide in from the left with a small tilt). scale: size of the whole table (1 = 880 px wide).
 */
export type ScoreTableProps = {video: string; rows: Row[]; top?: number; voice?: string; voiceVolume?: number; music?: string; musicVolume?: number; sfx?: boolean; end: number;
  clean?: boolean; overlayOnly?: boolean; highlight?: boolean; enter?: 'up' | 'left'; scale?: number;
  /** theme 'board': one dark scoreboard panel (leaf corners: big radius top-left/bottom-right, small on the others), Oswald caps,
   *  yellow row numbers, white logo slots; rows wipe in one by one and the named row gets a yellow bar + yellow label. title: header text. */
  theme?: 'mint' | 'board' | 'notebook'; title?: string; titleAccent?: string;
  /** notebook: ruled-paper page with a red margin, navy handwriting (Architects Daughter caps title + Patrick Hand rows), hand-drawn
   *  underlines, a cloud badge (`titleAccent`) and wobbly pen boxes for the logos. subtitle: second title line. */
  subtitle?: string};

const useT = () => { const f = useCurrentFrame(); const {fps} = useVideoConfig(); return {f, fps, s: (x: number) => Math.round(x * fps)}; };
const ease = Easing.bezier(0.16, 1, 0.3, 1);

/* ------------------------------------------------------------------ pieces */

const W = 880; const H = 116; const GAP = 14;
const C1 = 470; const C2 = 150; const C3 = W - C1 - C2 - 2 * 10;

let CLEAN = false; let HIGHLIGHT = true; let ENTER: 'up' | 'left' = 'up';

const Cell: React.FC<{w: number; children?: React.ReactNode; glow?: number; style?: React.CSSProperties}> = ({w, children, glow = 0, style}) => (
  <div style={{width: w, height: H, borderRadius: 22, background: MINT, display: 'flex', alignItems: 'center', boxSizing: 'border-box',
    boxShadow: CLEAN
      ? `inset 0 0 0 2px rgba(22,32,26,.10), inset 0 2px 0 rgba(255,255,255,.9)${glow > 0 ? `, 0 0 0 ${3 * glow}px rgba(64,200,96,${glow})` : ''}`
      : `0 10px 26px rgba(0,0,0,.22), 0 2px 6px rgba(0,0,0,.12), inset 0 1px 0 rgba(255,255,255,.9)${glow > 0 ? `, 0 0 0 ${3 * glow}px rgba(64,200,96,${0.75 * glow}), 0 0 ${26 * glow}px rgba(64,200,96,${0.5 * glow})` : ''}`, ...style}}>
    {children}
  </div>
);

const RowView: React.FC<{row: Row; i: number; next?: Row}> = ({row, i, next}) => {
  const {f, fps, s} = useT();
  // build-in: rows slide up and fade one after another at the very start
  const inP = ENTER === 'left' ? spring({frame: f - i * 3, fps, config: {damping: 14, stiffness: 150}}) : spring({frame: f - i * 4, fps, config: {damping: 16, stiffness: 170}});
  // active while this skill is being talked about
  const a = s(row.at); const until = next ? s(next.at) : 100000;
  const act = HIGHLIGHT && f >= a && f < until ? interpolate(f - a, [0, 7], [0, 1], {...clamp, easing: ease}) * interpolate(f, [until - 5, until], [1, 0], clamp) : 0;
  const lift = act;
  const Skill = SKILL_ICONS[row.skill];
  const wob = act > 0 ? Math.sin((f - a) / 3) * 8 * Math.exp(-(f - a) / 12) : 0;
  const r = row.resource;
  const rp = f >= s(r.at) ? spring({frame: f - s(r.at), fps, config: {damping: 10, stiffness: 230, mass: 0.7}}) : 0;
  const Tile = r.tile ? RESOURCE_TILES[r.tile] : null;
  return (
    <div style={{display: 'flex', gap: 10, opacity: Math.min(1, inP * 1.4), transformOrigin: '50% 50%',
      transform: ENTER === 'left' ? `translateX(${(1 - inP) * -520}px) rotate(${(1 - inP) * -5}deg)` : `translateY(${(1 - inP) * 60 - lift * 6}px) scale(${1 + 0.03 * lift})`}}>
      <Cell w={C1} glow={act}>
        <div style={{width: 92, height: 92, marginLeft: 16, transform: `rotate(${wob}deg) scale(${1 + 0.12 * act})`}}>{Skill ? <Skill /> : null}</div>
        <div style={{marginLeft: 18, fontFamily: FONT, fontWeight: 800, fontSize: 50, color: INK, letterSpacing: '-0.01em'}}>{row.label}</div>
      </Cell>
      <Cell w={C2} style={{justifyContent: 'center'}}>
        <div style={{padding: '8px 22px', borderRadius: 999, background: act > 0.05 ? `linear-gradient(180deg, #43C566, ${GREEN})` : '#BFE6C6',
          color: act > 0.05 ? '#fff' : '#155F2A', fontFamily: FONT, fontWeight: 900, fontSize: 48, transform: `scale(${1 + 0.1 * act})`, boxShadow: act > 0.05 && !CLEAN ? '0 4px 12px rgba(31,138,59,.4)' : 'none'}}>{row.badge ?? '8+'}</div>
      </Cell>
      <Cell w={C3} style={{justifyContent: 'center', overflow: 'visible', position: 'relative'}}>
        {rp > 0 && (
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', transform: `scale(${rp}) rotate(${(1 - rp) * -14}deg)`, opacity: Math.min(1, rp * 1.6)}}>
            {Tile ? <Tile /> : null}
            {r.img && <Img src={staticFile(r.img)} style={{height: r.imgH ?? 72, width: 'auto', display: 'block'}} />}
            {r.text && <div style={{fontFamily: FONT, fontWeight: 900, fontSize: r.textSize ?? (r.sub ? 32 : 40), color: INK, letterSpacing: '-0.01em', lineHeight: 1.05, textAlign: 'center'}}>{r.text}</div>}
            {r.sub && <div style={{fontFamily: FONT, fontWeight: 700, fontSize: 24, color: '#4C5A50', lineHeight: 1.1}}>{r.sub}</div>}
            {r.caption && (Tile || r.img) && <div style={{fontFamily: FONT, fontWeight: 800, fontSize: 18, color: INK, marginTop: -4}}>{r.caption}</div>}
          </div>
        )}
        {/* sparkle burst on arrival */}
        {rp > 0 && f - s(r.at) < 14 && [0, 1, 2, 3, 4, 5].map((k) => {
          const ang = (k / 6) * Math.PI * 2; const d = interpolate(f - s(r.at), [0, 12], [30, 92], clamp);
          return <div key={k} style={{position: 'absolute', left: '50%', top: '50%', width: 10, height: 10, marginLeft: -5, marginTop: -5, borderRadius: 5, background: k % 2 ? '#43C566' : '#F5B21B',
            transform: `translate(${Math.cos(ang) * d}px, ${Math.sin(ang) * d * 0.6}px)`, opacity: interpolate(f - s(r.at), [6, 14], [1, 0], clamp)}} />;
        })}
      </Cell>
    </div>
  );
};


/* ------------------------------------------------------------------ theme: board */

const OSWALD = "'Oswald', 'Arial Narrow', sans-serif";
const BOARD = 'rgba(17,18,21,.94)'; const YEL = '#FFD23F'; const BW = 880; const BH = 112;

const BoardRow: React.FC<{row: Row; i: number; next?: Row; last: boolean}> = ({row, i, next, last}) => {
  const {f, fps, s} = useT();
  const t0 = 6 + i * 4;
  const wipe = interpolate(f, [t0, t0 + 10], [0, 1], {...clamp, easing: ease});
  const a = s(row.at); const until = next ? s(next.at) : 100000;
  const act = f >= a && f < until ? interpolate(f - a, [0, 6], [0, 1], {...clamp, easing: ease}) * interpolate(f, [until - 5, until], [1, 0], clamp) : 0;
  const Skill = SKILL_ICONS[row.skill];
  const r = row.resource;
  const rp = f >= s(r.at) ? spring({frame: f - s(r.at), fps, config: {damping: 11, stiffness: 240, mass: 0.6}}) : 0;
  const flash = f >= s(r.at) ? interpolate(f - s(r.at), [0, 3, 12], [0, 1, 0], clamp) : 0;
  const Tile = r.tile ? RESOURCE_TILES[r.tile] : null;
  return (
    <div style={{position: 'relative', height: BH, display: 'flex', alignItems: 'center', clipPath: `inset(0 ${(1 - wipe) * 100}% 0 0)`,
      borderTop: '1px solid rgba(255,255,255,.12)', ...(last ? {} : {})}}>
      {/* active bar */}
      <div style={{position: 'absolute', left: 0, top: 14, bottom: 14, width: 7, borderRadius: 4, background: YEL, transform: `scaleY(${act})`}} />
      <div style={{width: 74, marginLeft: 26, fontFamily: OSWALD, fontWeight: 700, fontSize: 40, color: YEL, opacity: 0.55 + 0.45 * act}}>{String(i + 1).padStart(2, '0')}</div>
      <div style={{width: 84, height: 84, borderRadius: 42, background: 'rgba(255,255,255,.88)', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${1 + 0.1 * act})`}}><div style={{width: 66, height: 66}}>{Skill ? <Skill /> : null}</div></div>
      <div style={{marginLeft: 20, flex: 1, fontFamily: OSWALD, fontWeight: 600, fontSize: 52, lineHeight: 1, textTransform: 'uppercase', letterSpacing: '0.02em',
        color: act > 0.5 ? YEL : '#FFFFFF', whiteSpace: 'nowrap'}}>{row.label}</div>
      {/* logo slot */}
      <div style={{width: 196, height: 90, marginRight: 14, borderRadius: 14, position: 'relative', overflow: 'visible',
        background: rp > 0 ? '#FFFFFF' : 'rgba(255,255,255,.06)', boxShadow: rp > 0 ? `inset 0 0 0 ${3 * flash}px ${YEL}` : 'inset 0 0 0 2px rgba(255,255,255,.14)',
        display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        {rp > 0 && (
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', transform: `scale(${rp}) translateY(${(1 - rp) * 18}px)`, opacity: Math.min(1, rp * 1.6)}}>
            {Tile ? <Tile /> : null}
            {r.img && <Img src={staticFile(r.img)} style={{height: (r.imgH ?? 72) * 0.86, width: 'auto', display: 'block'}} />}
            {r.text && <div style={{fontFamily: FONT, fontWeight: 900, fontSize: (r.textSize ?? 40) * 0.9, color: INK, letterSpacing: '-0.01em', lineHeight: 1.05, textAlign: 'center'}}>{r.text}</div>}
            {r.caption && (Tile || r.img) && <div style={{fontFamily: FONT, fontWeight: 800, fontSize: 15, color: INK, marginTop: -2, whiteSpace: 'nowrap'}}>{r.caption}</div>}
          </div>
        )}
      </div>
    </div>
  );
};

const Board: React.FC<{rows: Row[]; title?: string; accent?: string}> = ({rows, title, accent}) => {
  const {f, fps} = useT();
  const p = spring({frame: f, fps, config: {damping: 15, stiffness: 150}});
  const hd = interpolate(f, [2, 12], [0, 1], {...clamp, easing: ease});
  return (
    <div style={{width: BW, background: BOARD, borderRadius: '34px 8px 34px 8px', overflow: 'hidden', boxShadow: 'inset 0 0 0 1.5px rgba(255,255,255,.16)',
      transform: `translateY(${(1 - p) * 70}px) scale(${0.94 + 0.06 * p})`, opacity: Math.min(1, p * 1.5)}}>
      {title && (
        <div style={{height: 92, display: 'flex', alignItems: 'center', paddingLeft: 32, paddingRight: 28, gap: 16, opacity: hd, transform: `translateX(${(1 - hd) * -30}px)`}}>
          <div style={{fontFamily: OSWALD, fontWeight: 700, fontSize: 46, color: '#fff', letterSpacing: '0.04em', textTransform: 'uppercase'}}>{title}</div>
          {accent && <div style={{fontFamily: OSWALD, fontWeight: 700, fontSize: 38, color: INK, background: YEL, borderRadius: '12px 4px 12px 4px', padding: '0 16px', lineHeight: 1.35}}>{accent}</div>}
          <div style={{flex: 1, height: 3, background: `linear-gradient(90deg, ${YEL}, rgba(255,210,63,0))`, transform: `scaleX(${hd})`, transformOrigin: '0 50%'}} />
        </div>
      )}
      {rows.map((r, i) => <BoardRow key={i} row={r} i={i} next={rows[i + 1]} last={i === rows.length - 1} />)}
    </div>
  );
};


/* ------------------------------------------------------------------ theme: notebook */

const HAND_T = "'Architects Daughter', 'Patrick Hand', cursive";
const HAND = "'Patrick Hand', 'Architects Daughter', cursive";
const NAVY = '#1E3566'; const PEN = '#2C56A6'; const NW = 880; const NRH = 124; const NTOP = 176;

/** a wobbly hand-drawn rectangle path (closed, slightly overshooting start) */
const roughRect = (w: number, h: number, seed: string, j = 2.6) => {
  const pts: [number, number][] = [];
  const side = (x0: number, y0: number, x1: number, y1: number, k: string) => {
    for (let t = 0; t < 4; t++) { const u = t / 4; pts.push([x0 + (x1 - x0) * u + (random(`${seed}${k}x${t}`) - 0.5) * j, y0 + (y1 - y0) * u + (random(`${seed}${k}y${t}`) - 0.5) * j]); }
  };
  side(3, 3, w - 3, 3, 'a'); side(w - 3, 3, w - 3, h - 3, 'b'); side(w - 3, h - 3, 3, h - 3, 'c'); side(3, h - 3, 3, 3, 'd');
  pts.push([pts[0][0] + 7, pts[0][1] + 1.5]);
  return 'M' + pts.map((p) => p.map((v) => v.toFixed(1)).join(' ')).join(' L');
};
/** hand underline: gentle wave */
const Underline: React.FC<{w: number; p: number; color?: string; thick?: number; seed: string}> = ({w, p, color = PEN, thick = 3.4, seed}) => {
  const a = (random(seed) - 0.5) * 5; const b = (random(seed + 'b') - 0.5) * 5;
  const d = `M2 ${6 + a} C ${w * 0.3} ${3 + b}, ${w * 0.65} ${9 - a}, ${w - 2} ${5 + b}`;
  return <svg width={w} height={14} style={{display: 'block', overflow: 'visible'}}><path d={d} fill="none" stroke={color} strokeWidth={thick} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} /></svg>;
};
/** pen reveal: text uncovered left→right like it is being written */
const Write: React.FC<{p: number; children: React.ReactNode; style?: React.CSSProperties}> = ({p, children, style}) => (
  <div style={{clipPath: `inset(-20% ${(1 - p) * 100}% -30% -4%)`, ...style}}>{children}</div>
);

const NoteRow: React.FC<{row: Row; i: number; next?: Row}> = ({row, i, next}) => {
  const {f, fps, s} = useT();
  const t0 = 10 + i * 6;
  const w = interpolate(f, [t0, t0 + 12], [0, 1], {...clamp, easing: Easing.inOut(Easing.quad)});
  const a = s(row.at); const until = next ? s(next.at) : 100000;
  const ul = f >= a ? interpolate(f - a, [0, 9], [0, 1], {...clamp, easing: Easing.out(Easing.quad)}) : 0;
  const on = f >= a && f < until;
  const r = row.resource; const ra = s(r.at);
  const box = f >= ra ? interpolate(f - ra, [0, 8], [0, 1], {...clamp, easing: Easing.out(Easing.quad)}) : 0;
  const lp = f >= ra ? spring({frame: f - ra - 2, fps, config: {damping: 10, stiffness: 230, mass: 0.6}}) : 0;
  const nm = f >= ra ? interpolate(f - ra, [4, 14], [0, 1], {...clamp, easing: Easing.inOut(Easing.quad)}) : 0;
  const arrow = f >= ra ? interpolate(f - ra, [0, 6], [0, 1], clamp) : 0;
  const Tile = r.tile ? RESOURCE_TILES[r.tile] : null;
  const name = r.caption ?? r.text ?? '';
  return (
    <div style={{position: 'absolute', left: 0, top: NTOP + i * NRH, width: NW, height: NRH}}>
      <Write p={w} style={{position: 'absolute', left: 22, top: 26, fontFamily: HAND, fontSize: 50, color: on ? PEN : NAVY, lineHeight: 1}}>{i + 1}.</Write>
      <div style={{position: 'absolute', left: 92, top: 22}}>
        <Write p={w}><div style={{fontFamily: HAND, fontSize: 60, color: NAVY, lineHeight: 1, whiteSpace: 'nowrap'}}>{row.label}</div></Write>
        <div style={{marginTop: 2}}><Underline w={Math.min(300, row.label.length * 27)} p={ul} seed={`u${i}`} /></div>
      </div>
      {/* arrow */}
      <svg width={64} height={30} style={{position: 'absolute', left: 422, top: 46, overflow: 'visible'}}>
        <path d="M2 16 C 20 12, 40 18, 56 14 M44 5 L58 14 L45 24" fill="none" stroke={NAVY} strokeWidth={3.2} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - arrow} />
      </svg>
      {/* pen box + logo */}
      <svg width={104} height={104} style={{position: 'absolute', left: 498, top: 10, overflow: 'visible'}}>
        <path d={roughRect(104, 104, `b${i}`)} fill="none" stroke={NAVY} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - box} />
      </svg>
      {lp > 0 && (
        <div style={{position: 'absolute', left: 498, top: 10, width: 104, height: 104, display: 'flex', alignItems: 'center', justifyContent: 'center',
          transform: `scale(${lp}) rotate(${(1 - lp) * -12 + (i % 2 ? 2 : -2)}deg)`, opacity: Math.min(1, lp * 1.6)}}>
          {Tile ? <Tile /> : r.img ? <Img src={staticFile(r.img)} style={{maxWidth: 80, maxHeight: 80, width: 'auto', height: 'auto', display: 'block'}} /> : null}
        </div>
      )}
      {name && <Write p={nm} style={{position: 'absolute', left: 620, top: 34, fontFamily: HAND, fontSize: 46, color: PEN, lineHeight: 1, whiteSpace: 'nowrap'}}>{name}</Write>}
    </div>
  );
};

const NoteBoard: React.FC<{rows: Row[]; title?: string; subtitle?: string; badge?: string}> = ({rows, title, subtitle, badge}) => {
  const {f, fps} = useT();
  const p = spring({frame: f, fps, config: {damping: 16, stiffness: 140}});
  const H = NTOP + rows.length * NRH + 22;
  const t1 = interpolate(f, [4, 16], [0, 1], {...clamp, easing: Easing.inOut(Easing.quad)});
  const t2 = interpolate(f, [10, 22], [0, 1], {...clamp, easing: Easing.inOut(Easing.quad)});
  const bd = interpolate(f, [12, 26], [0, 1], {...clamp, easing: Easing.out(Easing.quad)});
  const cloud = 'M30 62 C 8 62, 6 36, 26 33 C 24 12, 52 6, 62 20 C 72 4, 104 6, 108 24 C 130 18, 146 38, 134 52 C 146 66, 124 80, 106 72 C 96 86, 64 86, 58 72 C 50 80, 30 78, 30 62 Z';
  return (
    <div style={{position: 'relative', width: NW, height: H, borderRadius: 14, background: '#FBFAF3', boxShadow: 'inset 0 0 0 1.5px rgba(30,53,102,.18)', overflow: 'hidden',
      transform: `translateY(${(1 - p) * 60}px) rotate(${(1 - p) * -2.5}deg)`, opacity: Math.min(1, p * 1.5), transformOrigin: '50% 100%'}}>
      {/* ruled lines + red margin */}
      <div style={{position: 'absolute', left: 0, right: 0, top: NTOP - 2, bottom: 0,
        backgroundImage: `repeating-linear-gradient(180deg, transparent 0, transparent ${NRH - 2}px, #C7D6EE ${NRH - 2}px, #C7D6EE ${NRH}px)`, backgroundPosition: '0 -16px'}} />
      <div style={{position: 'absolute', top: 0, bottom: 0, left: 76, width: 2, background: '#E9A7A7'}} />
      {/* title */}
      {title && (
        <div style={{position: 'absolute', left: 0, right: 0, top: 22, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          <Write p={t1}><div style={{fontFamily: HAND_T, fontSize: 52, color: NAVY, letterSpacing: '0.05em', lineHeight: 1.05, whiteSpace: 'nowrap'}}>{title}</div></Write>
          <Underline w={title.length * 34} p={t1} color={PEN} thick={3} seed="t1" />
          {subtitle && <>
            <Write p={t2} style={{marginTop: 8}}><div style={{fontFamily: HAND_T, fontSize: 40, color: PEN, letterSpacing: '0.06em', lineHeight: 1.05, whiteSpace: 'nowrap'}}>{subtitle}</div></Write>
            <Underline w={subtitle.length * 28} p={t2} color={NAVY} thick={3} seed="t2" />
          </>}
        </div>
      )}
      {/* cloud badge */}
      {badge && (
        <div style={{position: 'absolute', right: 18, top: 18, width: 150, height: 92}}>
          <svg width={150} height={92} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
            <path d={cloud} fill="none" stroke={NAVY} strokeWidth={3} strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - bd} />
          </svg>
          <Write p={interpolate(f, [20, 30], [0, 1], clamp)} style={{position: 'absolute', left: 0, right: 0, top: 31, textAlign: 'center', fontFamily: HAND_T, fontSize: 25, color: PEN, lineHeight: 1, whiteSpace: 'nowrap', paddingLeft: 6}}>{badge}</Write>
        </div>
      )}
      {rows.map((r, i) => <NoteRow key={i} row={r} i={i} next={rows[i + 1]} />)}
    </div>
  );
};

/* ------------------------------------------------------------------ composition */

export const ScoreTableReel: React.FC<ScoreTableProps> = (p) => {
  const {s} = useT();
  CLEAN = !!p.clean; HIGHLIGHT = p.highlight ?? true; ENTER = p.enter ?? 'up';
  const sfx: {f: number; file: string; vol: number}[] = [];
  if (p.sfx) {
    p.rows.forEach((r, i) => { sfx.push({f: i * 4, file: 'pop', vol: 0.12}); sfx.push({f: s(r.resource.at), file: 'pop', vol: 0.35}); });
  }
  return (
    <AbsoluteFill style={{background: p.overlayOnly ? 'transparent' : '#000'}}>
      {/* untouched footage */}
      {!p.overlayOnly && <OffthreadVideo src={src(p.video)} muted style={{width: '100%', height: '100%', objectFit: 'cover'}} toneMapped={false} />}
      <div style={{position: 'absolute', top: p.top ?? 1010, left: (1080 - (p.theme === 'board' ? BW : p.theme === 'notebook' ? NW : W)) / 2, width: p.theme === 'board' ? BW : p.theme === 'notebook' ? NW : W, display: 'flex', flexDirection: 'column', gap: GAP,
        transform: p.scale && p.scale !== 1 ? `scale(${p.scale})` : undefined, transformOrigin: '50% 0'}}>
        {p.theme === 'notebook' ? <NoteBoard rows={p.rows} title={p.title} subtitle={p.subtitle} badge={p.titleAccent} /> : p.theme === 'board' ? <Board rows={p.rows} title={p.title} accent={p.titleAccent} /> : p.rows.map((r, i) => <RowView key={i} row={r} i={i} next={p.rows[i + 1]} />)}
      </div>
      {p.voice && <Audio src={src(p.voice)} volume={p.voiceVolume ?? 1} />}
      {p.music && <Audio src={staticFile(p.music)} volume={p.musicVolume ?? 0.5} />}
      {sfx.map((e, i) => <Sequence key={i} from={Math.max(0, e.f)} durationInFrames={30} layout="none"><Audio src={staticFile(`sfx/${e.file}.wav`)} volume={e.vol} /></Sequence>)}
    </AbsoluteFill>
  );
};

export const scoreTableDuration = (p: ScoreTableProps, fps: number) => Math.round(p.end * fps);
