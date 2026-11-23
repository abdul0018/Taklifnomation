import React from 'react';
import {AbsoluteFill, Easing, Img, OffthreadVideo, continueRender, delayRender, interpolate, random, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import '@fontsource/architects-daughter/400.css';
import '@fontsource/patrick-hand/400.css';
import {clamp, src} from './kit';

/**
 * Style J3: cork-board tiers (reference: the craft "JEE 2026" study board pin — cork panel, patterned washi frame,
 * twine with wooden clothespins, coloured paper cards, cream label tags with push pins, paper stars).
 * A cork board sits above the head. Three coloured cards hang from clothespins on a twine line, each with a pinned
 * cream tag (YOMON / YAXSHI / AJOYIB) and a white note holding a pencil "?". On a reveal the card swings on its pin,
 * the app's logo is stuck onto the note, its name is written on a tag, and a round sticker lands (✗ / ✓ / ★).
 * The topic is a notched paper ribbon pinned below the chest. No shadows: depth comes from crisp darker edges.
 */

const HAND_T = "'Architects Daughter', 'Patrick Hand', cursive";
const HAND = "'Patrick Hand', 'Architects Daughter', cursive";
const INK = '#2B2622'; const CREAM = '#FFF8E6'; const NOTE = '#FFFEF8';
const TIER = [
  {label: 'YOMON', card: '#E5493F', edge: '#B8322A', mark: 'x', sticker: '#E5493F'},
  {label: 'YAXSHI', card: '#F3C433', edge: '#C99A16', mark: 'v', sticker: '#E39A00'},
  {label: 'AJOYIB', card: '#86BD58', edge: '#5E9238', mark: 'star', sticker: '#2E9E4F'},
] as const;
const PINS = ['#E5493F', '#2F7FD8', '#F3B11B', '#3FA34D'];

if (typeof document !== 'undefined') {
  const h = delayRender('fonts');
  Promise.all(['400 60px "Architects Daughter"', '400 60px "Patrick Hand"'].map((f) => document.fonts.load(f, 'Aa?')))
    .then(() => continueRender(h)).catch(() => continueRender(h));
}

export type CorkLogo = {name: string; kind: 'img' | 'mask'; file: string; color?: string; gradient?: string; radius?: number; scale?: number};
export type CorkTopic = {title: string; emoji?: string; start: number; reveal: [number, number, number]; logos: [CorkLogo, CorkLogo, CorkLogo]};
/** board: cork panel rect (top area, above the head). ribbonY: top of the topic ribbon. mirror: YOMON on the right. */
export type CorkTiersProps = {video: string; overlayOnly?: boolean; mirror?: boolean; topics: CorkTopic[]; end: number;
  board?: {x: number; y: number; w: number; h: number}; ribbonY?: number};

const useT = () => { const f = useCurrentFrame(); const {fps} = useVideoConfig(); return {f, fps, s: (x: number) => Math.round(x * fps)}; };
const draw = (p: number) => ({pathLength: 1, strokeDasharray: 1, strokeDashoffset: 1 - p});

const LogoArt: React.FC<{logo: CorkLogo; size: number}> = ({logo, size}) => {
  const sz = size * (logo.scale ?? 1);
  if (logo.kind === 'img') return <Img src={staticFile(logo.file)} style={{width: sz, height: sz, borderRadius: logo.radius ?? sz * 0.22, objectFit: 'cover', display: 'block'}} />;
  return <div style={{width: sz, height: sz, background: logo.gradient ?? logo.color ?? '#111', WebkitMaskImage: `url(${staticFile(logo.file)})`, maskImage: `url(${staticFile(logo.file)})`,
    WebkitMaskSize: 'contain', maskSize: 'contain', WebkitMaskRepeat: 'no-repeat', maskRepeat: 'no-repeat', WebkitMaskPosition: 'center', maskPosition: 'center'}} />;
};

const Pin: React.FC<{c: string; x: number; y: number; r?: number}> = ({c, x, y, r = 11}) => (
  <div style={{position: 'absolute', left: x - r, top: y - r, width: 2 * r, height: 2 * r, borderRadius: r,
    background: `radial-gradient(circle at 35% 30%, #FFFFFF 0, ${c} 32%, ${c} 70%, rgba(0,0,0,.25) 100%)`, boxShadow: 'inset 0 0 0 1.5px rgba(0,0,0,.25)'}} />
);

const Star: React.FC<{c: string; x: number; y: number; s?: number; rot?: number}> = ({c, x, y, s = 26, rot = 0}) => (
  <svg width={s} height={s} viewBox="0 0 24 24" style={{position: 'absolute', left: x - s / 2, top: y - s / 2, transform: `rotate(${rot}deg)`}}>
    <path d="M12 1.8l2.9 6.6 7.1.6-5.4 4.7 1.6 7-6.2-3.7-6.2 3.7 1.6-7L2 9l7.1-.6z" fill={c} stroke="rgba(0,0,0,.22)" strokeWidth={0.8} strokeLinejoin="round" />
  </svg>
);

/** wooden clothespin, pivot at its bottom centre */
const Clothespin: React.FC<{x: number; y: number}> = ({x, y}) => (
  <div style={{position: 'absolute', left: x - 13, top: y - 52, width: 26, height: 70, borderRadius: 5,
    background: 'linear-gradient(90deg, #C99A62 0, #E2BC86 30%, #D8AE74 52%, #B98A52 54%, #DDB57E 70%, #C4935A 100%)', boxShadow: 'inset 0 0 0 1.5px rgba(80,50,20,.35)'}}>
    <div style={{position: 'absolute', left: 3, right: 3, top: 26, height: 7, borderRadius: 3, background: '#9C9C9C', boxShadow: 'inset 0 0 0 1px rgba(0,0,0,.3)'}} />
  </div>
);

const CorkBoard: React.FC<{b: {x: number; y: number; w: number; h: number}}> = ({b}) => {
  const {f, fps} = useT();
  const p = spring({frame: f, fps, config: {damping: 16, stiffness: 140}});
  return (
    <div style={{position: 'absolute', left: b.x, top: b.y, width: b.w, height: b.h, transform: `translateY(${(1 - p) * -60}px)`, opacity: Math.min(1, p * 1.6)}}>
      {/* patterned washi frame */}
      <div style={{position: 'absolute', inset: 0, borderRadius: 10, background: 'repeating-linear-gradient(45deg, #3E7CC4 0 6px, #F4F1E8 6px 12px, #9CC3EA 12px 15px, #F4F1E8 15px 21px)', boxShadow: 'inset 0 0 0 1.5px rgba(30,60,110,.45)'}} />
      {/* cork */}
      <div style={{position: 'absolute', inset: 16, borderRadius: 4, background: '#C69B68', overflow: 'hidden', boxShadow: 'inset 0 0 0 1.5px rgba(90,60,30,.35)'}}>
        <svg width="100%" height="100%" style={{position: 'absolute', inset: 0}}>
          <filter id="cork"><feTurbulence type="fractalNoise" baseFrequency="0.55" numOctaves="3" seed={3} />
            <feColorMatrix values="0 0 0 0 0.36  0 0 0 0 0.22  0 0 0 0 0.1  0 0 0 1.25 -0.45" /></filter>
          <rect width="100%" height="100%" filter="url(#cork)" />
        </svg>
      </div>
      <Star c="#3E7CC4" x={46} y={b.h - 42} s={24} rot={12} />
      <Star c="#E5493F" x={b.w - 44} y={b.h - 44} s={22} rot={-10} />
      <Star c="#F3B11B" x={b.w - 70} y={b.h - 30} s={16} rot={20} />
    </div>
  );
};

const Card: React.FC<{i: number; t: CorkTopic; next?: CorkTopic; cx: number; top: number; w: number; h: number}> = ({i, t, next, cx, top, w, h}) => {
  const {f, fps, s} = useT();
  const T = TIER[i];
  const a = s(t.start); const out = next ? s(next.start) : 1e9; const r = s(t.reveal[i]);
  const logo = t.logos[i];
  const shown = f >= r;
  // swing: entry drop on the very first topic, a kick on each reveal, a gentle idle sway
  const drop = spring({frame: f - 4 - i * 4, fps, config: {damping: 12, stiffness: 120}});
  const kick = shown ? Math.sin((f - r) / 2.6) * 9 * Math.exp(-(f - r) / 11) : 0;
  const sway = Math.sin(f / 22 + i * 1.7) * 1.2;
  const stick = shown ? spring({frame: f - r, fps, config: {damping: 11, stiffness: 260, mass: 0.6}}) : 0;
  const name = shown ? interpolate(f - r, [5, 14], [0, 1], {...clamp, easing: Easing.inOut(Easing.quad)}) : 0;
  const stk = shown ? spring({frame: f - r - 7, fps, config: {damping: 9, stiffness: 280, mass: 0.5}}) : 0;
  const q = interpolate(f, [a + 6 + i * 3, a + 14 + i * 3], [0, 1], clamp) * (shown ? interpolate(f - r, [0, 3], [1, 0], clamp) : 1);
  const er = interpolate(f, [out - 5, out], [1, 0], clamp);
  const lit = shown ? interpolate(f - r, [0, 6], [0, 1], clamp) : 0;
  const NW = w - 56;
  return (
    <div style={{position: 'absolute', left: cx - w / 2, top, width: w, height: h, transformOrigin: '50% -10px',
      transform: `translateY(${(1 - drop) * -260}px) rotate(${kick + sway + (i - 1) * 1.5}deg)`}}>
      {/* coloured paper card */}
      <div style={{position: 'absolute', inset: 0, borderRadius: 8, background: T.card, boxShadow: `inset 0 0 0 2px ${T.edge}`, filter: lit < 1 ? `saturate(${0.55 + 0.45 * lit})` : undefined}} />
      {/* pinned cream label tag */}
      <div style={{position: 'absolute', left: 18, right: 18, top: 16, height: 52, background: CREAM, borderRadius: 3, boxShadow: 'inset 0 0 0 1.5px rgba(80,60,30,.25)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `rotate(${(i - 1) * -1.2}deg)`}}>
        <div style={{fontFamily: HAND_T, fontSize: 38, color: INK, letterSpacing: '0.06em', WebkitTextStroke: `1.2px ${INK}`, lineHeight: 1}}>{T.label}</div>
        <Pin c={PINS[(i + 1) % 4]} x={14} y={12} r={8} />
        <Pin c={PINS[(i + 2) % 4]} x={w - 36 - 14} y={12} r={8} />
      </div>
      {/* white note */}
      <div style={{position: 'absolute', left: 28, top: 80, width: NW, height: h - 146, background: NOTE, borderRadius: 3, boxShadow: 'inset 0 0 0 1.5px rgba(80,60,30,.2)',
        backgroundImage: 'repeating-linear-gradient(180deg, transparent 0 26px, #DCE6F3 26px 28px)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden'}}>
        {q > 0.01 && <div style={{position: 'absolute', fontFamily: HAND_T, fontSize: 112, color: '#9AA0A6', lineHeight: 1, opacity: q * er,
          clipPath: `inset(0 0 ${(1 - q) * 100}% 0)`}}>?</div>}
        {shown && <div style={{opacity: er * Math.min(1, stick * 2), transform: `scale(${interpolate(stick, [0, 1], [1.5, 1])}) rotate(${(1 - stick) * 12}deg)`}}><LogoArt logo={logo} size={Math.min(NW, h - 146) - 22} /></div>}
      </div>
      {/* name tag */}
      <div style={{position: 'absolute', left: 30, right: 30, bottom: 12, height: 46, background: CREAM, borderRadius: 3, boxShadow: 'inset 0 0 0 1.5px rgba(80,60,30,.25)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden'}}>
        {shown && <div style={{fontFamily: HAND, fontSize: logo.name.length > 10 ? 30 : 34, color: INK, lineHeight: 1, whiteSpace: 'nowrap', opacity: er,
          clipPath: `inset(-20% ${(1 - name) * 100}% -30% 0)`}}>{logo.name}</div>}
      </div>
      {/* round sticker */}
      {stk > 0.01 && (
        <div style={{position: 'absolute', right: -16, top: 64, width: 66, height: 66, borderRadius: 33, background: '#FFFFFF', boxShadow: `inset 0 0 0 3px ${T.sticker}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: er * Math.min(1, stk * 2), transform: `scale(${interpolate(stk, [0, 1], [1.8, 1])}) rotate(${(1 - stk) * -30 + 8}deg)`}}>
          {T.mark === 'x' && <svg width={34} height={34}><path d="M6 6 L28 28 M28 6 L6 28" stroke={T.sticker} strokeWidth={7} strokeLinecap="round" /></svg>}
          {T.mark === 'v' && <svg width={38} height={34}><path d="M5 18 L15 28 L33 6" fill="none" stroke={T.sticker} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" /></svg>}
          {T.mark === 'star' && <svg width={42} height={42} viewBox="0 0 24 24"><path d="M12 1.8l2.9 6.6 7.1.6-5.4 4.7 1.6 7-6.2-3.7-6.2 3.7 1.6-7L2 9l7.1-.6z" fill={T.sticker} /></svg>}
        </div>
      )}
      {/* paper star burst for AJOYIB */}
      {T.mark === 'star' && shown && f - r < 22 && [0, 1, 2, 3, 4, 5].map((k) => {
        const ang = -Math.PI / 2 + (k - 2.5) * 0.55; const d = interpolate(f - r, [0, 18], [20, 120 + 30 * random(`s${k}`)], {...clamp, easing: Easing.out(Easing.quad)});
        return <Star key={k} c={['#F3B11B', '#3E7CC4', '#E5493F'][k % 3]} x={w / 2 + Math.cos(ang) * d} y={h / 2 + Math.sin(ang) * d} s={22} rot={(f - r) * 12 + k * 40} />;
      })}
    </div>
  );
};

const Ribbon: React.FC<{topics: CorkTopic[]; y: number}> = ({topics, y}) => {
  const {f, fps, s} = useT();
  const idx = Math.max(0, topics.findIndex((t, i) => f >= s(t.start) && (i === topics.length - 1 || f < s(topics[i + 1].start))));
  const t = topics[idx]; const a = s(t.start); const out = idx < topics.length - 1 ? s(topics[idx + 1].start) : 1e9;
  const p = spring({frame: f - a, fps, config: {damping: 11, stiffness: 200}});
  const o = interpolate(f, [out - 5, out], [1, 0], clamp);
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: y, display: 'flex', justifyContent: 'center', opacity: o * Math.min(1, p * 1.6)}}>
      <div style={{position: 'relative', transform: `rotate(-1.5deg) scale(${interpolate(p, [0, 1], [0.7, 1])})`}}>
        <div style={{position: 'relative', display: 'flex', alignItems: 'center', gap: 16, padding: '18px 74px', background: '#F6D55C',
          clipPath: 'polygon(0 0, 100% 0, calc(100% - 30px) 50%, 100% 100%, 0 100%, 30px 50%)'}}>
          <div style={{position: 'absolute', inset: 0, boxShadow: 'inset 0 0 0 2px rgba(150,110,10,.35)'}} />
          <div style={{fontFamily: HAND_T, fontSize: 72, color: INK, WebkitTextStroke: `1.6px ${INK}`, lineHeight: 1.05, whiteSpace: 'nowrap', letterSpacing: '0.02em'}}>{t.title}</div>
          {t.emoji && <Img src={staticFile(t.emoji)} style={{width: 70, height: 70}} />}
        </div>
        <Pin c="#E5493F" x={50} y={20} r={12} />
        <div style={{position: 'absolute', right: 38, top: 8, width: 24, height: 24}}><Pin c="#2F7FD8" x={12} y={12} r={12} /></div>
      </div>
    </div>
  );
};

export const CorkTiersReel: React.FC<CorkTiersProps> = (p) => {
  const {f, s} = useT();
  const b = p.board ?? {x: 20, y: 18, w: 1040, h: 384};
  const ti = Math.max(0, p.topics.findIndex((t, i) => f >= s(t.start) && (i === p.topics.length - 1 || f < s(p.topics[i + 1].start))));
  const t = p.topics[ti];
  const lineY = b.y + 64;
  const xs = [b.x + b.w * 0.18, b.x + b.w * 0.5, b.x + b.w * 0.82];
  const order = p.mirror ? [2, 1, 0] : [0, 1, 2];
  const cw = Math.min(290, b.w * 0.29); const ch = b.h - 112;
  const sag = (x: number) => lineY + 16 * Math.sin(((x - b.x) / b.w) * Math.PI);
  return (
    <AbsoluteFill style={{background: p.overlayOnly ? 'transparent' : '#000'}}>
      {!p.overlayOnly && <OffthreadVideo src={src(p.video)} muted style={{width: '100%', height: '100%', objectFit: 'cover'}} toneMapped={false} />}
      <CorkBoard b={b} />
      {/* twine */}
      <svg width={1080} height={b.y + 140} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible', opacity: Math.min(1, f / 8)}}>
        <path d={`M${b.x + 30} ${lineY} Q ${b.x + b.w / 2} ${lineY + 32} ${b.x + b.w - 30} ${lineY}`} fill="none" stroke="#8A6A45" strokeWidth={5} strokeLinecap="round" />
        <path d={`M${b.x + 30} ${lineY} Q ${b.x + b.w / 2} ${lineY + 32} ${b.x + b.w - 30} ${lineY}`} fill="none" stroke="#C7A57A" strokeWidth={2} strokeDasharray="6 7" strokeLinecap="round" />
      </svg>
      <Pin c="#F3B11B" x={b.x + 30} y={lineY} r={12} />
      <Pin c="#3FA34D" x={b.x + b.w - 30} y={lineY} r={12} />
      {[0, 1, 2].map((k) => {
        const i = order[k]; const x = xs[k]; const y = sag(x);
        return <React.Fragment key={`${ti}-${i}`}>
          <Card i={i} t={t} next={p.topics[ti + 1]} cx={x} top={y + 8} w={cw} h={ch} />
          <Clothespin x={x} y={y + 22} />
        </React.Fragment>;
      })}
      <Ribbon topics={p.topics} y={p.ribbonY ?? 1500} />
    </AbsoluteFill>
  );
};

export const corkTiersDuration = (p: CorkTiersProps, fps: number) => Math.round(p.end * fps);
