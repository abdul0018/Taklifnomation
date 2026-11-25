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

const HAND = "'Patrick Hand', 'Comic Sans MS', cursive";
const COL: Record<string, string> = {red: '#C8102E', blue: '#1F4FD1', grey: '#4A4A4A', green: '#1E7B34', ink: '#222'};

export type BoardItem =
  | {type: 'text'; text: string; color: 'red' | 'blue' | 'grey' | 'green'; y: number; size?: number; at: number; dur?: number; underline?: boolean}
  | {type: 'doodle'; kind: string; at: number; x: number; y: number; s?: number; text?: string; times?: number[]; img?: string};
export type BoardScene = {start: number; end: number; items: BoardItem[]};
export type AngryBoardProps = {voice: string; sfx?: string; scenes: BoardScene[]; punches: number[]; env: number[]; mascot: string; brand?: string; end: number};

const useT = () => { const f = useCurrentFrame(); const {fps} = useVideoConfig(); return {f, fps, s: (x: number) => Math.round(x * fps)}; };
const draw = (p: number) => ({pathLength: 1, strokeDasharray: 1, strokeDashoffset: 1 - Math.max(0, Math.min(1, p))});
const ink = (c = COL.ink, w = 6) => ({fill: 'none', stroke: c, strokeWidth: w, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const});

/** black marker, nib at (0,0) pointing down-left */
const Marker: React.FC<{x: number; y: number; o: number}> = ({x, y, o}) => (
  <svg width={120} height={120} style={{position: 'absolute', left: x - 6, top: y - 112, opacity: o, overflow: 'visible'}}>
    <g transform="rotate(-38 6 112)">
      <rect x={0} y={4} width={13} height={98} rx={4} fill="#1C1C1C" />
      <rect x={0} y={4} width={13} height={22} rx={4} fill="#3A3A3A" />
      <path d="M1 102 L12 102 L6.5 114 Z" fill="#111" />
    </g>
  </svg>
);

const Line: React.FC<{it: Extract<BoardItem, {type: 'text'}>}> = ({it}) => {
  const {f, s} = useT();
  const size = it.size ?? (it.color === 'red' ? 94 : it.color === 'blue' ? 72 : 56);
  const dur = it.dur ?? Math.min(1.3, 0.25 + it.text.length * 0.045);
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
  const p = interpolate(f, [a, a + 18], [0, 1], {...clamp, easing: Easing.out(Easing.quad)});
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
          <text x={Math.max(160, d.text.length * 22) / 2} y={-12} textAnchor="middle" fontFamily={HAND} fontSize={40} fill={COL.blue}>{d.text}</text>
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
          <text x={110} y={150} textAnchor="middle" fontFamily={HAND} fontSize={110} fill={COL.ink}>{i + 1}</text>
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
          <div style={{fontSize: 34, color: COL.ink}}>MOCK TEST</div><div style={{fontSize: 80, lineHeight: 1, color: COL.red}}>{i + 1}</div>
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
  const sc = p.scenes.find((x) => f >= s(x.start) && f < s(x.end)) ?? null;
  const fadeOut = sc ? interpolate(f, [s(sc.end) - 5, s(sc.end)], [1, 0], clamp) : 0;
  const fadeIn = sc ? interpolate(f, [s(sc.start), s(sc.start) + 4], [0, 1], clamp) : 0;
  // mascot: bob with the voice, shake + grow on punch lines
  const env = p.env[Math.min(p.env.length - 1, f)] ?? 0;
  const pu = p.punches.map((t) => f - s(t)).filter((d) => d >= 0 && d < 24).sort((x, y) => x - y)[0];
  const shake = pu != null ? Math.sin(pu * 2.4) * 16 * Math.exp(-pu / 9) : 0;
  const grow = pu != null ? 0.25 * Math.exp(-pu / 7) : 0;
  return (
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 45%, #F7EDD3 0%, #EFDFB9 55%, #E2CB98 100%)'}}>
      {p.brand && <div style={{position: 'absolute', left: 40, top: 40, padding: '6px 16px', border: '3px solid #8E2A1C', borderRadius: 6, color: '#8E2A1C', fontFamily: HAND, fontSize: 34,
        letterSpacing: '0.08em', transform: 'rotate(-3deg)', background: 'rgba(255,255,255,.35)'}}>{p.brand}</div>}
      {sc && <AbsoluteFill style={{opacity: fadeOut * fadeIn}}>
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
