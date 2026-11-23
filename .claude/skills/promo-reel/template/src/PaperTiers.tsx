import React from 'react';
import {AbsoluteFill, Easing, Img, OffthreadVideo, continueRender, delayRender, interpolate, random, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import '@fontsource/permanent-marker/400.css';
import '@fontsource/architects-daughter/400.css';
import '@fontsource/patrick-hand/400.css';
import {clamp, src} from './kit';

/**
 * Style J2: paper YOMON / YAXSHI / AJOYIB tiers. Three taped index cards (cream paper, red header rule, faint blue rules,
 * marker labels) and a torn notebook strip for the topic. Before a reveal the card holds a pencil "?"; on the reveal a
 * highlighter swipes behind the label, the logo is stuck on, its name is written in, and a pen mark is drawn
 * (YOMON red cross, YAXSHI orange tick, AJOYIB green circle + tick). No shadows; the cards are opaque paper.
 * `cover` mode: the cards and strip are sized to fully hide an earlier TiersReel render (default layout) underneath,
 * so a finished edit can be restyled when the raw clip is gone.
 */

const MARKER = "'Permanent Marker', 'Architects Daughter', cursive";
const HAND_T = "'Architects Daughter', 'Patrick Hand', cursive";
const HAND = "'Patrick Hand', 'Architects Daughter', cursive";
const PAPER = '#FBF8EE'; const NAVY = '#1E3566'; const RULE = '#CBD9EF'; const MARGIN = '#E9A3A3';
const TIER = [
  {label: 'YOMON', color: '#D62839', mark: 'cross'},
  {label: 'YAXSHI', color: '#E58E00', mark: 'tick'},
  {label: 'AJOYIB', color: '#23964A', mark: 'circle'},
] as const;

if (typeof document !== 'undefined') {
  const h = delayRender('fonts');
  Promise.all(['400 60px "Permanent Marker"', '400 60px "Architects Daughter"', '400 60px "Patrick Hand"'].map((f) => document.fonts.load(f, 'Aa?')))
    .then(() => continueRender(h)).catch(() => continueRender(h));
}

export type PaperLogo = {name: string; kind: 'img' | 'mask'; file: string; color?: string; gradient?: string; radius?: number; scale?: number};
export type PaperTopic = {title: string; emoji?: string; start: number; reveal: [number, number, number]; logos: [PaperLogo, PaperLogo, PaperLogo]};
/** card centres/sizes per tier [YOMON, YAXSHI, AJOYIB] before mirroring; strip: topic strip rect. */
export type PaperTiersProps = {video: string; overlayOnly?: boolean; mirror?: boolean; topics: PaperTopic[]; end: number;
  cards?: {x: number; y: number; w: number; h: number}[]; strip?: {x: number; y: number; w: number; h: number}};

const DEF_CARDS = [{x: 215, y: 70, w: 304, h: 368}, {x: 540, y: 10, w: 304, h: 368}, {x: 865, y: 70, w: 304, h: 368}];
const DEF_STRIP = {x: 136, y: 1236, w: 808, h: 188};

const useT = () => { const f = useCurrentFrame(); const {fps} = useVideoConfig(); return {f, fps, s: (x: number) => Math.round(x * fps)}; };
const draw = (p: number) => ({pathLength: 1, strokeDasharray: 1, strokeDashoffset: 1 - p});

const LogoArt: React.FC<{logo: PaperLogo; size: number}> = ({logo, size}) => {
  const sz = size * (logo.scale ?? 1);
  if (logo.kind === 'img') return <Img src={staticFile(logo.file)} style={{width: sz, height: sz, borderRadius: logo.radius ?? sz * 0.22, objectFit: 'cover', display: 'block'}} />;
  return <div style={{width: sz, height: sz, background: logo.gradient ?? logo.color ?? '#111', WebkitMaskImage: `url(${staticFile(logo.file)})`, maskImage: `url(${staticFile(logo.file)})`,
    WebkitMaskSize: 'contain', maskSize: 'contain', WebkitMaskRepeat: 'no-repeat', maskRepeat: 'no-repeat', WebkitMaskPosition: 'center', maskPosition: 'center'}} />;
};

/** paper grain: tiny static speckle so the card reads as paper, not a flat box */
const Grain: React.FC<{id: string}> = ({id}) => (
  <svg width="100%" height="100%" style={{position: 'absolute', inset: 0}}>
    <filter id={id}><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={7} /><feColorMatrix values="0 0 0 0 0.35  0 0 0 0 0.3  0 0 0 0 0.22  0 0 0 0.09 0" /></filter>
    <rect width="100%" height="100%" filter={`url(#${id})`} />
  </svg>
);

const Tape: React.FC<{w: number; rot: number; style?: React.CSSProperties}> = ({w, rot, style}) => (
  <div style={{position: 'absolute', width: w, height: 38, background: 'rgba(236,226,190,.82)', transform: `rotate(${rot}deg)`,
    clipPath: 'polygon(0 8%, 4% 0, 9% 10%, 14% 0, 86% 0, 91% 9%, 96% 0, 100% 10%, 100% 90%, 96% 100%, 91% 90%, 86% 100%, 14% 100%, 9% 91%, 4% 100%, 0 92%)', ...style}} />
);

const Mark: React.FC<{kind: string; color: string; p: number}> = ({kind, color, p}) => {
  const st = {fill: 'none', stroke: color, strokeWidth: 9, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const};
  if (kind === 'cross') return (
    <svg width={84} height={84} style={{overflow: 'visible'}}>
      <path d="M14 14 C 30 32, 52 52, 72 72" {...st} {...draw(Math.min(1, p * 2))} />
      <path d="M72 12 C 54 32, 34 50, 12 74" {...st} {...draw(Math.max(0, p * 2 - 1))} />
    </svg>
  );
  return <svg width={90} height={80} style={{overflow: 'visible'}}><path d="M10 42 C 20 50, 28 60, 34 70 C 46 46, 62 24, 84 8" {...st} {...draw(p)} /></svg>;
};

const Card: React.FC<{i: number; t: PaperTopic; next?: PaperTopic; mirror: boolean; geo: {x: number; y: number; w: number; h: number}}> = ({i, t, next, mirror, geo}) => {
  const {f, fps, s} = useT();
  const T = TIER[i];
  const cx = mirror ? 1080 - geo.x : geo.x;
  const a = s(t.start); const out = next ? s(next.start) : 1e9; const r = s(t.reveal[i]);
  const logo = t.logos[i];
  const shown = f >= r;
  const hl = shown ? interpolate(f - r, [0, 7], [0, 1], {...clamp, easing: Easing.out(Easing.quad)}) : 0;
  const stick = shown ? spring({frame: f - r, fps, config: {damping: 11, stiffness: 260, mass: 0.6}}) : 0;
  const name = shown ? interpolate(f - r, [5, 15], [0, 1], {...clamp, easing: Easing.inOut(Easing.quad)}) : 0;
  const mark = shown ? interpolate(f - r, [6, 16], [0, 1], {...clamp, easing: Easing.inOut(Easing.quad)}) : 0;
  const q = interpolate(f, [a + 2 + i * 2, a + 12 + i * 2], [0, 1], {...clamp, easing: Easing.inOut(Easing.quad)}) * (shown ? interpolate(f - r, [0, 3], [1, 0], clamp) : 1);
  const erase = interpolate(f, [out - 5, out], [1, 0], clamp);
  const rot = [-1.6, 1.1, 1.8][i] * (mirror ? -1 : 1);
  const jx = (random(`${t.title}${i}`) - 0.5) * 6;
  const W = geo.w; const H = geo.h;
  return (
    <div style={{position: 'absolute', left: cx - W / 2, top: geo.y, width: W, height: H, transform: `rotate(${rot}deg)`}}>
      <div style={{position: 'absolute', inset: 0, background: PAPER, borderRadius: 6, overflow: 'hidden', boxShadow: 'inset 0 0 0 1.5px rgba(60,50,30,.16)'}}>
        <div style={{position: 'absolute', left: 0, right: 0, top: 118, bottom: 0, backgroundImage: `repeating-linear-gradient(180deg, transparent 0, transparent 38px, ${RULE} 38px, ${RULE} 40px)`}} />
        <div style={{position: 'absolute', left: 0, right: 0, top: 108, height: 3, background: MARGIN}} />
        <Grain id={`g${i}`} />
      </div>
      {/* label with highlighter swipe */}
      <div style={{position: 'absolute', left: 0, right: 0, top: 30, display: 'flex', justifyContent: 'center'}}>
        <div style={{position: 'relative'}}>
          <div style={{position: 'absolute', left: -14, right: -14, top: 16, height: 44, background: T.color, opacity: 0.22, borderRadius: 6,
            transform: `scaleX(${hl}) skewX(-8deg)`, transformOrigin: '0 50%'}} />
          <div style={{position: 'relative', fontFamily: MARKER, fontSize: 54, lineHeight: 1.3, color: T.color, opacity: 0.5 + 0.5 * hl, letterSpacing: '0.02em'}}>{T.label}</div>
        </div>
      </div>
      {/* pencil question mark */}
      {q > 0.01 && <div style={{position: 'absolute', left: 0, right: 0, top: 128, textAlign: 'center', fontFamily: HAND_T, fontSize: 150, lineHeight: 1, color: '#8E949B', opacity: q * erase,
        clipPath: `inset(0 0 ${(1 - Math.min(1, q * 1.2)) * 100}% 0)`, transform: `rotate(${Math.sin(f / 9 + i) * 3}deg)`}}>?</div>}
      {/* logo sticker + handwritten name + pen mark */}
      {shown && (
        <div style={{opacity: erase}}>
          <div style={{position: 'absolute', left: W / 2 - 66 + jx, top: 138, width: 132, height: 132, display: 'flex', alignItems: 'center', justifyContent: 'center',
            transform: `scale(${interpolate(stick, [0, 1], [1.5, 1])}) rotate(${(1 - stick) * 10 - rot * 0.6}deg)`, opacity: Math.min(1, stick * 2)}}>
            <LogoArt logo={logo} size={124} />
          </div>
          {T.mark === 'circle' && (
            <svg width={W} height={190} style={{position: 'absolute', left: 0, top: 112, overflow: 'visible'}}>
              <path d={`M${W / 2 + 4} 14 C ${W / 2 + 96} 12, ${W / 2 + 104} 172, ${W / 2 - 6} 170 C ${W / 2 - 104} 168, ${W / 2 - 100} 10, ${W / 2 + 18} 18`} fill="none" stroke={T.color} strokeWidth={6} strokeLinecap="round" {...draw(mark)} />
            </svg>
          )}
          <div style={{position: 'absolute', left: 0, right: 0, top: 292, textAlign: 'center', fontFamily: HAND, fontSize: logo.name.length > 10 ? 38 : 44, lineHeight: 1, color: NAVY,
            whiteSpace: 'nowrap', clipPath: `inset(-20% ${(1 - name) * 100}% -30% 0)`}}>{logo.name}</div>
          <div style={{position: 'absolute', right: 8, top: 124, transform: 'scale(0.9)'}}>
            <Mark kind={T.mark === 'circle' ? 'tick' : T.mark} color={T.color} p={T.mark === 'circle' ? Math.max(0, mark * 1.4 - 0.4) : mark} />
          </div>
        </div>
      )}
      <Tape w={118} rot={-4 + i * 3} style={{left: W / 2 - 59, top: -16}} />
    </div>
  );
};

const Strip: React.FC<{topics: PaperTopic[]; geo: {x: number; y: number; w: number; h: number}}> = ({topics, geo}) => {
  const {f, s} = useT();
  const idx = Math.max(0, topics.findIndex((t, i) => f >= s(t.start) && (i === topics.length - 1 || f < s(topics[i + 1].start))));
  const t = topics[idx]; const a = s(t.start); const out = idx < topics.length - 1 ? s(topics[idx + 1].start) : 1e9;
  const w = interpolate(f, [a + 1, a + 13], [0, 1], {...clamp, easing: Easing.inOut(Easing.quad)});
  const er = interpolate(f, [out - 5, out], [1, 0], clamp);
  const ul = interpolate(f, [a + 10, a + 20], [0, 1], {...clamp, easing: Easing.out(Easing.quad)});
  const torn = 'polygon(0 6%, 3% 2%, 6% 7%, 10% 1%, 14% 6%, 19% 2%, 24% 7%, 29% 1%, 34% 5%, 40% 2%, 46% 7%, 52% 1%, 58% 6%, 64% 2%, 70% 7%, 76% 1%, 82% 6%, 88% 2%, 94% 7%, 100% 3%, 100% 95%, 96% 99%, 91% 93%, 86% 99%, 80% 94%, 74% 99%, 68% 93%, 62% 98%, 56% 93%, 50% 99%, 44% 94%, 38% 99%, 32% 93%, 26% 98%, 20% 94%, 14% 99%, 8% 93%, 3% 98%, 0 94%)';
  return (
    <div style={{position: 'absolute', left: geo.x, top: geo.y, width: geo.w, height: geo.h, transform: 'rotate(-0.8deg)'}}>
      <div style={{position: 'absolute', inset: 0, background: PAPER, clipPath: torn, overflow: 'hidden'}}>
        <div style={{position: 'absolute', left: 0, right: 0, top: geo.h * 0.72, height: 2, background: RULE}} />
        <div style={{position: 'absolute', left: 0, right: 0, top: geo.h * 0.24, height: 2, background: RULE}} />
        <div style={{position: 'absolute', top: 0, bottom: 0, left: 74, width: 2, background: MARGIN}} />
        <Grain id="gs" />
      </div>
      <div style={{position: 'absolute', left: 74, right: 0, top: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: er}}>
        <div style={{position: 'relative', display: 'flex', alignItems: 'center', gap: 18, clipPath: `inset(-30% ${(1 - w) * 100}% -40% -5%)`}}>
          <div style={{fontFamily: HAND_T, fontSize: 76, color: NAVY, lineHeight: 1, whiteSpace: 'nowrap'}}>{t.title}</div>
          {t.emoji && <Img src={staticFile(t.emoji)} style={{width: 70, height: 70}} />}
          <svg width="100%" height={16} style={{position: 'absolute', left: 0, bottom: -22, overflow: 'visible'}} viewBox="0 0 100 16" preserveAspectRatio="none">
            <path d="M1 8 C 30 3, 60 13, 99 6" fill="none" stroke="#2C56A6" strokeWidth={3.4} vectorEffect="non-scaling-stroke" strokeLinecap="round" {...draw(ul)} />
          </svg>
        </div>
      </div>
      <Tape w={96} rot={-38} style={{left: -30, top: 18}} />
      <Tape w={96} rot={36} style={{right: -30, top: 22}} />
    </div>
  );
};

export const PaperTiersReel: React.FC<PaperTiersProps> = (p) => {
  const {f, s} = useT();
  const cards = p.cards ?? DEF_CARDS; const strip = p.strip ?? DEF_STRIP;
  const ti = Math.max(0, p.topics.findIndex((t, i) => f >= s(t.start) && (i === p.topics.length - 1 || f < s(p.topics[i + 1].start))));
  const t = p.topics[ti];
  return (
    <AbsoluteFill style={{background: p.overlayOnly ? 'transparent' : '#000'}}>
      {!p.overlayOnly && <OffthreadVideo src={src(p.video)} muted style={{width: '100%', height: '100%', objectFit: 'cover'}} toneMapped={false} />}
      {[0, 1, 2].map((i) => <Card key={`${ti}-${i}`} i={i} t={t} next={p.topics[ti + 1]} mirror={!!p.mirror} geo={cards[i]} />)}
      <Strip topics={p.topics} geo={strip} />
    </AbsoluteFill>
  );
};

export const paperTiersDuration = (p: PaperTiersProps, fps: number) => Math.round(p.end * fps);
