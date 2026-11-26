import React from 'react';
import {AbsoluteFill, Audio, Easing, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import '@fontsource/patrick-hand/400.css';
import {clamp} from './kit';

/**
 * Style S: "angry teacher" whiteboard reel (reference: a cream-paper explainer where an angry voice shouts a phrase,
 * a marker writes it in red, its English version in blue and a grey note below, with stick-figure doodles and a
 * small angry mascot in the corner). Everything is drawn in code: the marker moves along each line as it is uncovered,
 * doodles draw on stroke by stroke, the mascot bobs with the voice envelope and shakes on the angry punch lines.
 */

let FAST = false;
const HAND = "'Patrick Hand', 'Comic Sans MS', cursive";
const PAPER_COL = {red: '#C8102E', blue: '#1F4FD1', grey: '#4A4A4A', green: '#1E7B34', ink: '#222'};
const CHALK_COL = {red: '#FF8A8A', blue: '#8FD0FF', grey: '#E9E6DC', green: '#B9F07A', ink: '#F4F1E8'};
const COL: Record<string, string> = {...PAPER_COL};
let CHALK = false;
/** dusty chalk texture: alpha noise mask (0.4–1) applied to everything written on the board */
const CHALK_MASK = `url("data:image/svg+xml;utf8,${encodeURIComponent("<svg xmlns='http://www.w3.org/2000/svg' width='420' height='420'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' seed='4'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  -1.5 0 0 0 1.45'/></filter><rect width='100%' height='100%' filter='url(#n)'/></svg>")}")`;

export type BoardItem =
  | {type: 'text'; text: string; color: 'red' | 'blue' | 'grey' | 'green'; y: number; size?: number; at: number; dur?: number; underline?: boolean}
  | {type: 'doodle'; kind: string; at: number; x: number; y: number; s?: number; text?: string; times?: number[]; img?: string};
export type BoardScene = {start: number; end: number; items: BoardItem[]};
/** fast: snappy "fast motion" mode — lines write ~2x faster, doodles draw in 10 frames, hard cuts with a punch-in zoom at every scene and a camera kick on punches. */
/** theme 'chalk': dark green chalkboard with a wooden frame, chalk colours, a chalk stick instead of the marker and a dusty chalk texture on everything written. */
export type AngryBoardProps = {theme?: 'paper' | 'chalk'; fast?: boolean; voice: string; sfx?: string; scenes: BoardScene[]; punches: number[]; env: number[]; mascot: string; brand?: string; end: number};

const useT = () => { const f = useCurrentFrame(); const {fps} = useVideoConfig(); return {f, fps, s: (x: number) => Math.round(x * fps)}; };
const draw = (p: number) => ({pathLength: 1, strokeDasharray: 1, strokeDashoffset: 1 - Math.max(0, Math.min(1, p))});
const ink = (c = COL.ink, w = 6) => ({fill: 'none', stroke: c, strokeWidth: w, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const});

/** black marker, nib at (0,0) pointing down-left */
const Marker: React.FC<{x: number; y: number; o: number}> = ({x, y, o}) => (
  <svg width={120} height={120} style={{position: 'absolute', left: x - 6, top: y - 112, opacity: o, overflow: 'visible'}}>
    <g transform="rotate(-38 6 112)">
      {CHALK ? <><rect x={-1} y={40} width={15} height={74} rx={4} fill="#FBF8EE" stroke="#BDB8A8" strokeWidth={1.5} /><rect x={-1} y={100} width={15} height={14} rx={3} fill="#E8E3D2" /></> : <>
      <rect x={0} y={4} width={13} height={98} rx={4} fill="#1C1C1C" />
      <rect x={0} y={4} width={13} height={22} rx={4} fill="#3A3A3A" />
      <path d="M1 102 L12 102 L6.5 114 Z" fill="#111" /></>}
    </g>
  </svg>
);

const Line: React.FC<{it: Extract<BoardItem, {type: 'text'}>}> = ({it}) => {
  const {f, s} = useT();
  const size = it.size ?? (it.color === 'red' ? 94 : it.color === 'blue' ? 72 : 56);
  const dur = (it.dur ?? Math.min(1.3, 0.25 + it.text.length * 0.045)) * (FAST ? 0.5 : 1);
  const p = interpolate(f, [s(it.at), s(it.at + dur)], [0, 1], {...clamp, easing: Easing.inOut(Easing.quad)});
  if (p <= 0) return null;
  const w = Math.min(1000, it.text.length * size * 0.47);
  const x0 = 540 - w / 2;
  const ul = it.underline ?? it.color !== 'grey';
  return (
    <>
      <div style={{position: 'absolute', left: 0, right: 0, top: it.y, textAlign: 'center', fontFamily: HAND, fontSize: size, lineHeight: 1.1, color: COL[it.color], whiteSpace: 'nowrap'}}>
        <span style={{position: 'relative', display: 'inline-block', clipPath: `inset(-30% ${(1 - p) * 100}% -60% -3%)`}}>
          {it.text}
          {ul && <svg width="100%" height={14} viewBox="0 0 100 14" preserveAspectRatio="none" style={{position: 'absolute', left: 0, bottom: -6, overflow: 'visible'}}>
            <path d={it.color === 'red' ? 'M1 7 Q 6 1 11 7 T 21 7 T 31 7 T 41 7 T 51 7 T 61 7 T 71 7 T 81 7 T 91 7 T 99 7' : 'M1 8 C 30 4, 70 11, 99 6'} {...ink(COL[it.color], 3)} vectorEffect="non-scaling-stroke" {...draw(p)} />
          </svg>}
        </span>
      </div>
      {p < 1 && <Marker x={x0 + w * p} y={it.y + size * 0.85} o={1} />}
    </>
  );
};

/* ---------------------------------------------------------------- doodles (drawn in code) */

const Doodle: React.FC<{d: Extract<BoardItem, {type: 'doodle'}>}> = ({d}) => {
  const {f, fps, s} = useT();
  const a = s(d.at);
  if (f < a) return null;
  const p = interpolate(f, [a, a + (FAST ? 10 : 18)], [0, 1], {...clamp, easing: Easing.out(Easing.quad)});
  const pop = spring({frame: f - a, fps, config: {damping: 10, stiffness: 220, mass: 0.6}});
  const k = d.s ?? 1;
  const box = (w: number, h: number, children: React.ReactNode, extra: React.CSSProperties = {}) => (
    <div style={{position: 'absolute', left: d.x - (w * k) / 2, top: d.y - (h * k) / 2, width: w * k, height: h * k, ...extra}}>{children}</div>
  );
  switch (d.kind) {
    case 'stick': { // stick figure, optional "?" and bubble text
      return box(220, 340, <svg width="100%" height="100%" viewBox="0 0 220 340" style={{overflow: 'visible'}}>
        <circle cx={110} cy={70} r={34} {...ink()} {...draw(p * 1.6)} />
        <path d="M110 104 L110 220 M110 140 L60 190 M110 140 L160 186 M110 220 L70 310 M110 220 L150 310" {...ink()} {...draw(p * 1.3 - 0.2)} />
        {d.text === '?' && <text x={150} y={20} fontFamily={HAND} fontSize={80} fill={COL.red} opacity={pop}>?</text>}
        {d.text && d.text !== '?' && <g opacity={Math.min(1, pop)} transform={`translate(${150} ${-40}) scale(${pop})`}>
          <rect x={0} y={-60} width={Math.max(160, d.text.length * 22)} height={74} rx={30} fill="#FFFDF6" stroke={COL.ink} strokeWidth={4} />
          <path d="M20 14 L4 44 L44 14" fill="#FFFDF6" stroke={COL.ink} strokeWidth={4} strokeLinejoin="round" />
          <text x={Math.max(160, d.text.length * 22) / 2} y={-12} textAnchor="middle" fontFamily={HAND} fontSize={40} fill={PAPER_COL.blue}>{d.text}</text>
        </g>}
      </svg>);
    }
    case 'score': // hand-drawn score card
      return box(360, 260, <svg width="100%" height="100%" viewBox="0 0 360 260" style={{overflow: 'visible'}}>
        <path d="M14 18 L346 12 L350 246 L10 250 Z" {...ink(COL.red, 7)} {...draw(p * 1.4)} />
        <text x={180} y={200} textAnchor="middle" fontFamily={HAND} fontSize={200} fill={COL.red} opacity={Math.min(1, pop)}>{d.text ?? '8.0'}</text>
      </svg>, {transform: `rotate(-4deg) scale(${0.8 + 0.2 * Math.min(1, pop)})`});
    case 'boxes': { // three numbered folders popping at d.times
      return box(760, 220, <>{[0, 1, 2].map((i) => {
        const t = d.times?.[i] ?? d.at + i * 0.3; if (f < s(t)) return null;
        const q = spring({frame: f - s(t), fps, config: {damping: 9, stiffness: 240, mass: 0.5}});
        return <svg key={i} width={220} height={200} viewBox="0 0 220 200" style={{position: 'absolute', left: i * 270, top: 0, transform: `scale(${q}) rotate(${(i - 1) * 4}deg)`, overflow: 'visible'}}>
          <path d="M10 40 L80 40 L96 20 L210 20 L210 190 L10 190 Z" fill="#F3D48A" stroke={COL.ink} strokeWidth={5} strokeLinejoin="round" />
          <text x={110} y={150} textAnchor="middle" fontFamily={HAND} fontSize={110} fill="#222">{i + 1}</text>
        </svg>;
      })}</>);
    }
    case 'cross': // word with a red X slashed over it
      return box(420, 200, <svg width="100%" height="100%" viewBox="0 0 420 200" style={{overflow: 'visible'}}>
        <text x={210} y={140} textAnchor="middle" fontFamily={HAND} fontSize={140} fill={COL.ink} opacity={Math.min(1, pop)} {...((d.text ?? '').length > 5 ? {textLength: 380, lengthAdjust: 'spacingAndGlyphs'} : {})}>{d.text}</text>
        <path d="M30 20 L390 180" {...ink(COL.red, 12)} {...draw((f - a - 8) / 8)} />
        <path d="M390 20 L30 180" {...ink(COL.red, 12)} {...draw((f - a - 14) / 8)} />
      </svg>);
    case 'circle': // word circled in red
      return box(320, 220, <svg width="100%" height="100%" viewBox="0 0 320 220" style={{overflow: 'visible'}}>
        <text x={160} y={150} textAnchor="middle" fontFamily={HAND} fontSize={140} fill={COL.ink} opacity={Math.min(1, pop)} {...((d.text ?? '').length > 4 ? {textLength: 270, lengthAdjust: 'spacingAndGlyphs'} : {})}>{d.text}</text>
        <path d="M170 18 C 300 14, 316 196, 150 204 C 10 206, 6 22, 190 26" {...ink(COL.red, 8)} {...draw((f - a - 6) / 14)} />
      </svg>);
    case 'laptop':
      return box(560, 380, <svg width="100%" height="100%" viewBox="0 0 560 380" style={{overflow: 'visible'}}>
        <path d="M70 20 L490 20 L490 300 L70 300 Z M20 330 L540 330 L510 360 L50 360 Z" {...ink(COL.ink, 7)} {...draw(p * 1.3)} />
        <text x={280} y={180} textAnchor="middle" fontFamily={HAND} fontSize={88} fill={COL.red} opacity={interpolate(f - a, [10, 18], [0, 1], clamp)}>{d.text ?? 'GOPREP.GG'}</text>
        <path d="M120 205 L440 205" {...ink(COL.red, 5)} {...draw((f - a - 14) / 10)} />
      </svg>);
    case 'cards': { // mock test cards popping at d.times
      return box(720, 200, <>{[0, 1, 2].map((i) => {
        const t = d.times?.[i] ?? d.at + i * 0.25; if (f < s(t)) return null;
        const q = spring({frame: f - s(t), fps, config: {damping: 9, stiffness: 240, mass: 0.5}});
        return <div key={i} style={{position: 'absolute', left: i * 250, top: 0, width: 210, height: 160, background: '#FFFDF6', border: `4px solid ${COL.ink}`, borderRadius: 10,
          transform: `scale(${q}) rotate(${(i - 1) * 5}deg)`, fontFamily: HAND, textAlign: 'center', paddingTop: 10, boxSizing: 'border-box'}}>
          <div style={{fontSize: 34, color: '#222'}}>MOCK TEST</div><div style={{fontSize: 80, lineHeight: 1, color: PAPER_COL.red}}>{i + 1}</div>
        </div>;
      })}</>);
    }
    case 'paper': { // draft with red underlines and labelled mistakes
      const tags = ['GRAMMAR', 'VOCAB', 'COHERENCE'];
      return box(620, 520, <>
        <svg width="100%" height="100%" viewBox="0 0 620 520" style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
          <rect x={10} y={10} width={420} height={500} rx={8} fill="#FFFDF6" stroke={COL.ink} strokeWidth={5} opacity={Math.min(1, p * 3)} />
          {Array.from({length: 9}).map((_, i) => <path key={i} d={`M40 ${60 + i * 48} L${i % 3 === 2 ? 300 : 400} ${60 + i * 48}`} {...ink('#9A9A9A', 6)} {...draw(p * 2 - i * 0.12)} />)}
          {[1, 3, 6].map((r, i) => <path key={r} d={`M50 ${74 + r * 48} C 110 ${68 + r * 48}, 170 ${80 + r * 48}, 230 ${72 + r * 48}`} {...ink(COL.red, 6)} {...draw(((d.times?.[i] != null ? f - s(d.times[i]) : f - a - 20 - i * 8)) / 8)} />)}
        </svg>
        {tags.map((t, i) => { const tt = d.times?.[i] != null ? s(d.times[i]) : a + 20 + i * 8; if (f < tt + 4) return null;
          const q = spring({frame: f - tt - 4, fps, config: {damping: 10, stiffness: 260, mass: 0.5}});
          return <div key={t} style={{position: 'absolute', left: 450, top: 40 + [1, 3, 6][i] * 48, padding: '4px 12px', background: '#F3B11B', border: `3px solid ${COL.ink}`, borderRadius: 6,
            fontFamily: HAND, fontSize: 30, color: COL.ink, transform: `scale(${q})`, transformOrigin: '0 50%'}}>{t}</div>; })}
      </>);
    }
    case 'screen': { // hand-drawn goprep.gg browser window: mode writing | speaking | game (d.text = mode, d.img = art)
      const mode = d.text ?? 'writing';
      const t = (sec: number) => f - a - sec * fps;
      const chip = (dt: number) => spring({frame: t(dt), fps, config: {damping: 10, stiffness: 260, mass: 0.5}});
      return box(800, 600, <>
        <svg width="100%" height="100%" viewBox="0 0 800 600" style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
          <rect x={8} y={8} width={784} height={584} rx={22} fill="#FFFDF6" opacity={Math.min(1, p * 3)} />
          <path d="M30 10 L770 10 Q790 10 790 30 L790 570 Q790 590 770 590 L30 590 Q10 590 10 570 L10 30 Q10 10 30 10 Z M10 82 L790 82" {...ink(COL.ink, 6)} {...draw(p * 1.3)} />
          {[44, 80, 116].map((cx, i) => <circle key={i} cx={cx} cy={46} r={11} fill={['#E5493F', '#F3B11B', '#3FA34D'][i]} opacity={Math.min(1, p * 2)} />)}
          <rect x={160} y={26} width={480} height={40} rx={20} fill="#F1EADA" stroke={COL.ink} strokeWidth={3} opacity={Math.min(1, p * 2)} />
          <text x={400} y={56} textAnchor="middle" fontFamily={HAND} fontSize={30} fill={COL.ink} opacity={Math.min(1, p * 2)}>goprep.gg/{mode}</text>
          {mode === 'writing' && <>
            {Array.from({length: 7}).map((_, i) => (i === 1 || i === 4) ? null : <path key={i} d={`M60 ${150 + i * 60} L${i % 3 === 2 ? 470 : 600} ${150 + i * 60}`} {...ink('#A9A9A9', 7)} {...draw(p * 2 - 0.3 - i * 0.1)} />)}
            <text x={70} y={232} fontFamily={HAND} fontSize={44} fill={COL.ink} opacity={chip(0.5)}>very good</text>
            <path d="M66 244 C 120 238, 180 250, 240 242" {...ink(COL.red, 6)} {...draw(t(0.7) / 8)} />
            <text x={70} y={412} fontFamily={HAND} fontSize={44} fill={COL.ink} opacity={chip(0.9)}>a lot of</text>
            <path d="M66 424 C 110 418, 160 430, 210 422" {...ink(COL.red, 6)} {...draw(t(1.1) / 8)} />
          </>}
          {mode === 'speaking' && <>
            <path d="M560 200 Q560 150 610 150 Q660 150 660 200 L660 300 Q660 350 610 350 Q560 350 560 300 Z M530 290 Q530 400 610 400 Q690 400 690 290 M610 400 L610 460 M560 470 L660 470" {...ink(COL.ink, 7)} {...draw(t(0.3) / 16)} />
            {Array.from({length: 11}).map((_, i) => { const h = 20 + 50 * Math.abs(Math.sin(f / 3 + i * 1.3)); return <rect key={i} x={70 + i * 34} y={510 - h / 2} width={18} height={h} rx={9} fill={COL.red} opacity={chip(0.8)} />; })}
          </>}
        </svg>
        {mode === 'writing' && <>
          <div style={{position: 'absolute', left: 280 * k, top: 190 * k, padding: `${4 * k}px ${14 * k}px`, background: '#DFF3DF', border: `${3 * k}px solid ${COL.green}`, borderRadius: 10 * k, fontFamily: HAND, fontSize: 36 * k, color: COL.green, transform: `scale(${chip(1.0)})`, transformOrigin: '0 50%', whiteSpace: 'nowrap'}}>→ excellent</div>
          <div style={{position: 'absolute', left: 250 * k, top: 370 * k, padding: `${4 * k}px ${14 * k}px`, background: '#DFF3DF', border: `${3 * k}px solid ${COL.green}`, borderRadius: 10 * k, fontFamily: HAND, fontSize: 36 * k, color: COL.green, transform: `scale(${chip(1.3)})`, transformOrigin: '0 50%', whiteSpace: 'nowrap'}}>→ a significant number of</div>
          <div style={{position: 'absolute', left: 600 * k, top: 120 * k, padding: `${4 * k}px ${12 * k}px`, background: '#F3B11B', border: `${3 * k}px solid ${COL.ink}`, borderRadius: 8 * k, fontFamily: HAND, fontSize: 30 * k, color: COL.ink, transform: `scale(${chip(0.6)}) rotate(4deg)`}}>VOCAB</div>
        </>}
        {mode === 'speaking' && d.img && <Img src={staticFile(d.img)} style={{position: 'absolute', left: 70 * k, top: 130 * k, width: 400 * k, height: 300 * k, objectFit: 'contain', transform: `scale(${chip(0.2)})`}} />}
        {mode === 'speaking' && <div style={{position: 'absolute', left: 480 * k, top: 500 * k, padding: `${4 * k}px ${14 * k}px`, background: '#F3B11B', border: `${3 * k}px solid ${COL.ink}`, borderRadius: 8 * k, fontFamily: HAND, fontSize: 34 * k, color: COL.ink, transform: `scale(${chip(1.0)}) rotate(-3deg)`}}>MOCK TEST</div>}
        {mode === 'game' && d.img && <Img src={staticFile(d.img)} style={{position: 'absolute', left: 250 * k, top: 120 * k, width: 300 * k, height: 300 * k, borderRadius: 40 * k, objectFit: 'cover', transform: `scale(${chip(0.2)}) rotate(${(1 - Math.min(1, chip(0.2))) * -12}deg)`}} />}
        {mode === 'game' && <div style={{position: 'absolute', left: 0, right: 0, top: 450 * k, textAlign: 'center', fontFamily: HAND, fontSize: 64 * k, color: COL.red, transform: `scale(${chip(0.6)})`}}>IELTS Runner</div>}
      </>);
    }
    case 'img':
      return box(300, 300, <Img src={staticFile(d.img!)} style={{width: '100%', height: '100%', objectFit: 'contain'}} />, {transform: `scale(${pop}) rotate(${(1 - Math.min(1, pop)) * -14}deg)`});
    case 'big':
      return box(1000, 200, <div style={{fontFamily: HAND, fontSize: 150 * k, lineHeight: 1, color: COL.red, textAlign: 'center', whiteSpace: 'nowrap', transform: `scale(${pop}) rotate(-3deg)`}}>{d.text}</div>);
    case 'emoji':
      return box(150, 150, <Img src={staticFile(d.img!)} style={{width: '100%', height: '100%'}} />, {transform: `scale(${pop}) rotate(${Math.sin((f - a) * 1.7) * 10 * Math.exp(-(f - a) / 10)}deg)`});
    default: return null;
  }
};

export const AngryBoardReel: React.FC<AngryBoardProps> = (p) => {
  const {f, fps, s} = useT();
  FAST = !!p.fast; CHALK = p.theme === 'chalk'; Object.assign(COL, CHALK ? CHALK_COL : PAPER_COL);
  const sc = p.scenes.find((x) => f >= s(x.start) && f < s(x.end)) ?? null;
  const fadeOut = sc ? (FAST ? 1 : interpolate(f, [s(sc.end) - 5, s(sc.end)], [1, 0], clamp)) : 0;
  const fadeIn = sc ? (FAST ? 1 : interpolate(f, [s(sc.start), s(sc.start) + 4], [0, 1], clamp)) : 0;
  // fast motion: punch-in zoom at each scene cut, camera kick on punch lines
  const since = sc ? f - s(sc.start) : 99;
  const zoomIn = FAST ? 1 + 0.14 * Math.exp(-since / 4) : 1;
  const pk = p.punches.map((t) => f - s(t)).filter((d) => d >= 0 && d < 12).sort((x, y) => x - y)[0];
  const kick = FAST && pk != null ? 1 + 0.05 * Math.exp(-pk / 3) : 1;
  const jit = FAST && pk != null ? Math.sin(pk * 3.1) * 10 * Math.exp(-pk / 3) : 0;
  // mascot: bob with the voice, shake + grow on punch lines
  const env = p.env[Math.min(p.env.length - 1, f)] ?? 0;
  const pu = p.punches.map((t) => f - s(t)).filter((d) => d >= 0 && d < 24).sort((x, y) => x - y)[0];
  const shake = pu != null ? Math.sin(pu * 2.4) * 16 * Math.exp(-pu / 9) : 0;
  const grow = pu != null ? 0.25 * Math.exp(-pu / 7) : 0;
  return (
    <AbsoluteFill style={{background: CHALK ? '#6B4A2B' : 'radial-gradient(ellipse at 50% 45%, #F7EDD3 0%, #EFDFB9 55%, #E2CB98 100%)'}}>
      {CHALK && <>
        <div style={{position: 'absolute', inset: 0, background: 'repeating-linear-gradient(90deg, #7A5532 0 14px, #6B4A2B 14px 22px, #805A36 22px 40px)'}} />
        <div style={{position: 'absolute', inset: 26, borderRadius: 8, background: 'radial-gradient(ellipse at 50% 40%, #2F4A3B 0%, #263D31 60%, #1E3127 100%)', boxShadow: 'inset 0 0 0 4px #4B331D'}}>
          <svg width="100%" height="100%" style={{position: 'absolute', inset: 0, opacity: 0.35}}>
            <filter id="smudge"><feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="3" seed={9} /><feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.25 0" /></filter>
            <rect width="100%" height="100%" filter="url(#smudge)" />
          </svg>
        </div>
        <div style={{position: 'absolute', left: 26, right: 26, bottom: 26, height: 30, background: '#5A3D22', boxShadow: 'inset 0 3px 0 #7A5532'}}>
          <div style={{position: 'absolute', left: 700, top: 8, width: 70, height: 14, borderRadius: 4, background: '#F4F1E8'}} />
          <div style={{position: 'absolute', left: 800, top: 9, width: 50, height: 12, borderRadius: 4, background: '#FF8A8A'}} />
          <div style={{position: 'absolute', left: 870, top: 4, width: 110, height: 22, borderRadius: 4, background: '#9C7B57', boxShadow: 'inset 0 -6px 0 #3A3A3A'}} />
        </div>
      </>}
      {p.brand && <div style={{position: 'absolute', left: 52, top: 50, padding: '6px 16px', border: `3px solid ${CHALK ? '#F6D55C' : '#8E2A1C'}`, borderRadius: 6, color: CHALK ? '#F6D55C' : '#8E2A1C', fontFamily: HAND, fontSize: 34,
        letterSpacing: '0.08em', transform: 'rotate(-3deg)', background: CHALK ? 'transparent' : 'rgba(255,255,255,.35)'}}>{p.brand}</div>}
      {sc && <AbsoluteFill style={{...(CHALK ? {WebkitMaskImage: CHALK_MASK, maskImage: CHALK_MASK, WebkitMaskSize: '420px 420px', maskSize: '420px 420px'} : {}), opacity: fadeOut * fadeIn, transform: `translateX(${jit}px) scale(${zoomIn * kick}) rotate(${FAST ? (1 - Math.min(1, since / 5)) * -1.5 : 0}deg)`}}>
        {sc.items.map((it, i) => it.type === 'text' ? <Line key={i} it={it} /> : <Doodle key={i} d={it} />)}
      </AbsoluteFill>}
      <div style={{position: 'absolute', left: 40, top: 1520, width: 300, height: 300, transformOrigin: '50% 100%',
        transform: `translateX(${shake}px) translateY(${-env * 26}px) scale(${1 + env * 0.06 + grow}) rotate(${shake * 0.4}deg)`}}>
        <Img src={staticFile(p.mascot)} style={{width: '100%', height: '100%', objectFit: 'contain'}} />
        {pu != null && pu < 16 && [0, 1, 2].map((i) => <div key={i} style={{position: 'absolute', left: 170 + i * 18, top: -10 - i * 8, width: 26, height: 6, borderRadius: 3, background: COL.red,
          transform: `rotate(${-40 + i * 40}deg) translateX(${pu * 2}px)`, opacity: 1 - pu / 16}} />)}
      </div>
      <Audio src={staticFile(p.voice)} />
      {p.sfx && <Audio src={staticFile(p.sfx)} />}
    </AbsoluteFill>
  );
};

export const angryBoardDuration = (p: AngryBoardProps, fps: number) => Math.round(p.end * fps);
