import React from 'react';
import {AbsoluteFill, Audio, Easing, Img, continueRender, delayRender, interpolate, random, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import '@fontsource/allura/400.css';
import '@fontsource/cormorant-garamond/500.css';
import '@fontsource/cormorant-garamond/600.css';
import '@fontsource/cormorant-garamond/500-italic.css';
import '@fontsource/cinzel/600.css';
import {clamp} from './kit';

/**
 * Style O: painterly-illustration e-invitation (reference: gouache couple in a cosmos meadow, pastel sky).
 * One illustration does the whole reel:
 *  A) slow push-in on the couple; script title + names appear in the sky; painted cosmos flowers drift past at three depths
 *     (near = large and soft, far = small and sharp), blown left→right like the hair in the art;
 *  B) the camera tilts up and pushes into the empty sky (a smooth gradient, so the zoom costs no visible detail) and the
 *     details write on there: invitation line, date, time, venue; a cosmos sprig draws under the date.
 * No shadows and no grading on the art: text is ink-brown on the sky.
 */

const SCRIPT = "'Allura', cursive";
const SERIF = "'Cormorant Garamond', 'Georgia', serif";
const CAPS = "'Cinzel', serif";
const INK = '#4E3428';
const ROSE = '#A3405C';

if (typeof document !== 'undefined') {
  const h = delayRender('fonts');
  Promise.all(['400 80px Allura', '500 40px "Cormorant Garamond"', '600 40px "Cormorant Garamond"', 'italic 500 40px "Cormorant Garamond"', '600 40px Cinzel']
    .map((f) => document.fonts.load(f, 'AaŊ‘0'))).then(() => continueRender(h)).catch(() => continueRender(h));
}

export type PaintedInviteProps = {
  art: string; /** sky extension stacked above the art (tools/sky_extend.py) */ skyExt?: string; skyH?: number;
  /** vertical camera offsets (px the art is pushed down): scene A, scene B */ lift?: {a: number; b: number};
  music?: string; musicVolume?: number; end: number;
  /** where the couple sits in the art (0..1) — the push-in aims there; sky = the empty area aimed at in scene B */
  focus?: {x: number; y: number}; sky?: {x: number; y: number};
  /** scene B start (s). With art2 this is the crossfade to art2; tilt2 is when art2 tilts up into its sky. */
  turn: number;
  art2?: string; sky2?: string; sky2H?: number; focus2?: {x: number; y: number}; lift2?: {a: number; b: number}; tilt2?: number;
  closing?: string;
  title: string; groom: string; bride: string;
  invite: [string, string]; date: string; time: string; venue: string; venueSub: string; address: string;
};

const useF = () => { const f = useCurrentFrame(); const {fps} = useVideoConfig(); return {f, s: (x: number) => Math.round(x * fps)}; };
const ease = Easing.bezier(0.22, 1, 0.36, 1);
const prog = (f: number, a: number, b: number, e = ease) => interpolate(f, [a, b], [0, 1], {...clamp, easing: e});

/* ---------------------------------------------------------------- painted cosmos */
const COLORS = [['#F7B6C8', '#E07A98'], ['#C9B3EA', '#9C7CCB'], ['#FFF6F0', '#E8D6CF'], ['#F49FB2', '#D9607E']];
/** Cosmos flower: 8 notched petals with a soft two-tone gradient and a yellow centre. */
const Cosmos: React.FC<{r: number; c: number; id: string}> = ({r, c, id}) => {
  const [a, b] = COLORS[c % COLORS.length];
  const petal = `M0,0 C${-r * 0.28},${-r * 0.25} ${-r * 0.34},${-r * 0.82} ${-r * 0.16},${-r} L0,${-r * 0.9} L${r * 0.16},${-r} C${r * 0.34},${-r * 0.82} ${r * 0.28},${-r * 0.25} 0,0 Z`;
  return (
    <g>
      <defs><radialGradient id={id} cx="0" cy="0" r={r} gradientUnits="userSpaceOnUse"><stop offset="0" stopColor={b} /><stop offset=".55" stopColor={a} /><stop offset="1" stopColor={a} /></radialGradient></defs>
      {Array.from({length: 8}).map((_, i) => <path key={i} d={petal} transform={`rotate(${i * 45 + (i % 2) * 6})`} fill={`url(#${id})`} />)}
      <circle r={r * 0.2} fill="#F2C14E" /><circle r={r * 0.11} fill="#D99A2B" />
    </g>
  );
};
const Petal: React.FC<{r: number; c: number}> = ({r, c}) => (
  <path d={`M0,0 C${-r * 0.5},${-r * 0.3} ${-r * 0.55},${-r * 1.4} 0,${-r * 1.6} C${r * 0.55},${-r * 1.4} ${r * 0.5},${-r * 0.3} 0,0 Z`} fill={COLORS[c % COLORS.length][0]} />
);

/** Drifting flowers + loose petals at three depths, wind left→right with gusts. */
const Drift: React.FC = () => {
  const {f} = useF();
  const items = Array.from({length: 22}).map((_, i) => {
    const depth = i < 4 ? 2 : i < 11 ? 1 : 0; // 2 = near
    const flower = i % 3 !== 2;
    const size = depth === 2 ? 70 + random(`s${i}`) * 40 : depth === 1 ? 26 + random(`s${i}`) * 16 : 12 + random(`s${i}`) * 8;
    const speed = (depth === 2 ? 5.2 : depth === 1 ? 2.8 : 1.5) * (0.8 + random(`v${i}`) * 0.4);
    const gust = 1 + 0.35 * Math.sin(f / 37 + i);
    const x = ((random(`x${i}`) * 1500 + f * speed * gust) % 1500) - 210;
    const y = random(`y${i}`) * 1920 + Math.sin(f / 26 + i * 1.7) * (depth === 2 ? 40 : 18) - f * speed * 0.18;
    const yy = ((y % 2100) + 2100) % 2100 - 90;
    const rot = random(`r${i}`) * 360 + f * (depth + 1) * 0.9 * (i % 2 ? 1 : -1);
    const tilt = 0.45 + 0.55 * Math.abs(Math.cos(f / 22 + i));
    return {i, depth, flower, size, x, y: yy, rot, tilt, c: Math.floor(random(`c${i}`) * 4)};
  });
  return (
    <svg width={1080} height={1920} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
      {[0, 1].map((d) => items.filter((it) => it.depth === d).map((it) => (
        <g key={it.i} transform={`translate(${it.x},${it.y}) rotate(${it.rot}) scale(1,${it.tilt})`} opacity={d === 0 ? 0.75 : 0.92}>
          {it.flower ? <Cosmos r={it.size} c={it.c} id={`cg${it.i}`} /> : <Petal r={it.size * 0.6} c={it.c} />}
        </g>
      )))}
    </svg>
  );
};
/** Near layer separately so it can be softly out of focus (blur only on the graphic, never on the art). */
const DriftNear: React.FC<{o?: number}> = ({o = 1}) => {
  const {f} = useF();
  return (
    <svg width={1080} height={1920} style={{position: 'absolute', inset: 0, overflow: 'visible', filter: 'blur(5px)', opacity: o}}>
      {Array.from({length: 4}).map((_, i) => {
        const size = 80 + random(`ns${i}`) * 45; const speed = 6 * (0.8 + random(`nv${i}`) * 0.4);
        const x = ((random(`nx${i}`) * 1700 + f * speed) % 1700) - 300;
        const y = 300 + random(`ny${i}`) * 1500 + Math.sin(f / 30 + i) * 50;
        return <g key={i} transform={`translate(${x},${y}) rotate(${f * 1.4 * (i % 2 ? 1 : -1) + i * 50}) scale(1,${0.5 + 0.5 * Math.abs(Math.cos(f / 25 + i))})`} opacity={0.85}><Cosmos r={size} c={i} id={`nc${i}`} /></g>;
      })}
    </svg>
  );
};

/* ---------------------------------------------------------------- text */
const Rise: React.FC<{at: number; dur?: number; children: React.ReactNode; style?: React.CSSProperties}> = ({at, dur = 0.9, children, style}) => {
  const {f, s} = useF();
  const p = prog(f, s(at), s(at + dur));
  if (p <= 0.001) return null;
  return <div style={{opacity: p, transform: `translateY(${(1 - p) * 18}px)`, filter: p < 0.98 ? `blur(${8 * (1 - p)}px)` : undefined, ...style}}>{children}</div>;
};
/** Script written on left→right. */
const Write: React.FC<{at: number; dur?: number; size: number; color?: string; children: React.ReactNode}> = ({at, dur = 1.2, size, color = INK, children}) => {
  const {f, s} = useF();
  const p = prog(f, s(at), s(at + dur), Easing.inOut(Easing.sin));
  if (p <= 0) return null;
  const x = -15 + 130 * p; const m = `linear-gradient(90deg, #000 ${x - 15}%, transparent ${x}%)`;
  return <div style={{WebkitMaskImage: m, maskImage: m, padding: `0 ${size * 0.3}px`}}><div style={{fontFamily: SCRIPT, fontSize: size, color, lineHeight: 1.08, whiteSpace: 'nowrap'}}>{children}</div></div>;
};
const Center: React.FC<{top: number; children: React.ReactNode}> = ({top, children}) => (
  <div style={{position: 'absolute', left: 0, right: 0, top, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>{children}</div>
);
const Sprig: React.FC<{p: number}> = ({p}) => (
  <svg width="420" height="70" viewBox="0 0 420 70">
    <path d="M10,48 C120,30 300,30 410,48" fill="none" stroke={INK} strokeWidth={2} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} opacity={0.8} />
    {p > 0.5 && <g transform={`translate(210,36) scale(${interpolate(p, [0.5, 1], [0, 1], clamp)})`}><Cosmos r={22} c={0} id="sprig" /></g>}
    {p > 0.7 && <g transform={`translate(165,40) scale(${interpolate(p, [0.7, 1], [0, 0.6], clamp)})`}><Cosmos r={22} c={1} id="sprig2" /></g>}
    {p > 0.75 && <g transform={`translate(255,40) scale(${interpolate(p, [0.75, 1], [0, 0.55], clamp)})`}><Cosmos r={22} c={2} id="sprig3" /></g>}
  </svg>
);

export const PaintedInviteReel: React.FC<PaintedInviteProps> = (p) => {
  const {f, s} = useF();
  const two = !!p.art2;
  const T = p.turn; const fo = p.focus ?? {x: 0.5, y: 0.55}; const sk = p.sky ?? {x: 0.5, y: 0.12};
  // camera: A pushes 1.0→1.07 toward the couple; B tilts to the sky and pushes to 1.55 (sky is a flat gradient)
  const b = prog(f, s(T - 0.3), s(T + 1.6), Easing.inOut(Easing.cubic));
  const lift = p.lift ?? {a: 0, b: 0};
  // A: slow push-in toward the couple; B: the camera tilts up into the (extended) sky, art slides down out of frame
  const z = interpolate(f, [0, s(T)], [1.0, 1.06], {...clamp, easing: Easing.out(Easing.sin)}) * (1 - 0.04 * b) + 0.02 * prog(f, s(T + 1.6), s(p.end), Easing.linear);
  const dy = lift.a + (lift.b - lift.a) * (two ? 0 : b);
  const ox = fo.x + (sk.x - fo.x) * b; const oy = fo.y + (sk.y - fo.y) * b;
  const sway = 0.35 * Math.sin(f / 60);
  const X = two ? prog(f, s(T), s(T + 0.9), Easing.inOut(Easing.sin)) : 0; // crossfade art → art2
  const fadeA = two ? 1 - prog(f, s(T - 0.2), s(T + 0.5)) : 1 - prog(f, s(T - 0.4), s(T + 0.2));
  const intro = prog(f, 0, s(0.8));
  const T2 = p.tilt2 ?? T + 4.5;
  const b2 = two ? prog(f, s(T2 - 0.3), s(T2 + 1.6), Easing.inOut(Easing.cubic)) : 0;
  const L2 = p.lift2 ?? {a: 0, b: 1720};
  const dy2 = L2.a + (L2.b - L2.a) * b2;
  const z2 = interpolate(f, [s(T), s(T2)], [1.0, 1.045], {...clamp, easing: Easing.out(Easing.sin)}) * (1 - 0.03 * b2);
  const fo2 = p.focus2 ?? {x: 0.5, y: 0.62};
  const gust = two ? Math.sin(Math.PI * prog(f, s(T - 0.4), s(T + 1.3), Easing.linear)) : 0;
  return (
    <AbsoluteFill style={{background: '#9CC0C8', overflow: 'hidden'}}>
      <AbsoluteFill style={{transform: `scale(${two ? z / (1 - 0.04 * b) : z}) rotate(${sway}deg)`, transformOrigin: `${(two ? fo.x : ox) * 100}% ${(two ? fo.y : oy) * 100}%`, opacity: intro * (1 - X)}}>
        <div style={{position: 'absolute', left: 0, right: 0, top: dy - (p.skyH ?? 0), height: 1920 + (p.skyH ?? 0)}}>
          {p.skyExt && <Img src={staticFile(p.skyExt)} style={{position: 'absolute', top: 0, left: '50%', height: p.skyH, transform: `translateX(-${fo.x * 100}%)`}} />}
          <Img src={staticFile(p.art)} style={{position: 'absolute', top: p.skyH ?? 0, left: '50%', height: 1920, transform: `translateX(-${fo.x * 100}%)`}} />
        </div>
      </AbsoluteFill>
      {two && X > 0 && (
        <AbsoluteFill style={{transform: `scale(${z2}) rotate(${sway}deg)`, transformOrigin: `${fo2.x * 100}% ${fo2.y * 100}%`, opacity: X}}>
          <div style={{position: 'absolute', left: 0, right: 0, top: dy2 - (p.sky2H ?? 0), height: 1920 + (p.sky2H ?? 0)}}>
            {p.sky2 && <Img src={staticFile(p.sky2)} style={{position: 'absolute', top: 0, left: '50%', height: p.sky2H, transform: `translateX(-${fo2.x * 100}%)`}} />}
            <Img src={staticFile(p.art2 ?? '')} style={{position: 'absolute', top: p.sky2H ?? 0, left: '50%', height: 1920, transform: `translateX(-${fo2.x * 100}%)`}} />
          </div>
        </AbsoluteFill>
      )}
      <Drift />
      {/* scene A text, in the sky */}
      <div style={{opacity: fadeA}}>
        <Center top={190}><Rise at={0.5}><div style={{fontFamily: CAPS, fontWeight: 600, fontSize: 30, letterSpacing: '0.42em', marginRight: '-0.42em', color: INK}}>{p.title}</div></Rise></Center>
        <Center top={255}>
          <Write at={1.1} size={150}>{p.groom}</Write>
          <Rise at={1.9}><div style={{fontFamily: SCRIPT, fontSize: 84, color: ROSE, lineHeight: 0.7}}>&amp;</div></Rise>
          <Write at={2.2} size={150}>{p.bride}</Write>
        </Center>
      </div>
      {/* two-art: invite + date over the hands shot's sky, then venue after the tilt */}
      {two && f >= s(T) && (
        <>
          <div style={{opacity: 1 - b2}}>
            <Center top={150}><Rise at={T + 0.9}><div style={{fontFamily: SERIF, fontStyle: 'italic', fontWeight: 500, fontSize: 50, color: INK, textAlign: 'center', lineHeight: 1.28}}>{p.invite[0]}<br />{p.invite[1]}</div></Rise></Center>
            <Center top={300}><Sprig p={prog(f, s(T + 1.5), s(T + 2.5))} /></Center>
            <Center top={380}>
              <Rise at={T + 1.9}><div style={{fontFamily: CAPS, fontWeight: 600, fontSize: 84, color: INK, letterSpacing: '0.08em', marginRight: '-0.08em'}}>{p.date}</div></Rise>
              <Rise at={T + 2.3}><div style={{fontFamily: SERIF, fontWeight: 600, fontSize: 66, color: ROSE, letterSpacing: '0.1em'}}>{p.time}</div></Rise>
            </Center>
          </div>
          {f >= s(T2) && (
            <>
              <Center top={470}><Rise at={T2 + 1.1}><div style={{fontFamily: SCRIPT, fontSize: 96, color: INK, lineHeight: 1}}>{p.groom} <span style={{color: ROSE}}>&amp;</span> {p.bride}</div></Rise></Center>
              <Center top={660}><Sprig p={prog(f, s(T2 + 1.5), s(T2 + 2.4))} /></Center>
              <Center top={760}>
                <Rise at={T2 + 1.8}><div style={{fontFamily: SCRIPT, fontSize: 132, color: INK, lineHeight: 1}}>{p.venue}</div></Rise>
                <Rise at={T2 + 2.1}><div style={{fontFamily: CAPS, fontWeight: 600, fontSize: 32, color: INK, letterSpacing: '0.34em', marginRight: '-0.34em', marginTop: 8}}>{p.venueSub}</div></Rise>
                <Rise at={T2 + 2.4}><div style={{fontFamily: SERIF, fontStyle: 'italic', fontWeight: 500, fontSize: 40, color: INK, marginTop: 16}}>{p.address}</div></Rise>
              </Center>
              {p.closing && <Center top={1130}><Rise at={T2 + 3.0} dur={1.1}><div style={{fontFamily: SCRIPT, fontSize: 96, color: ROSE, lineHeight: 1}}>{p.closing}</div></Rise></Center>}
            </>
          )}
        </>
      )}
      {/* scene B details, on the sky */}
      {!two && f >= s(T) && (
        <>
          <Center top={430}><Rise at={T + 1.2}><div style={{fontFamily: SCRIPT, fontSize: 104, color: INK, lineHeight: 1}}>{p.groom} <span style={{color: ROSE}}>&amp;</span> {p.bride}</div></Rise></Center>
          <Center top={620}>
            <Rise at={T + 1.7}><div style={{fontFamily: SERIF, fontStyle: 'italic', fontWeight: 500, fontSize: 46, color: INK, textAlign: 'center', lineHeight: 1.3}}>{p.invite[0]}<br />{p.invite[1]}</div></Rise>
          </Center>
          <Center top={810}><Sprig p={prog(f, s(T + 2.3), s(T + 3.4))} /></Center>
          <Center top={900}>
            <Rise at={T + 2.6}><div style={{fontFamily: CAPS, fontWeight: 600, fontSize: 78, color: INK, letterSpacing: '0.08em', marginRight: '-0.08em'}}>{p.date}</div></Rise>
            <Rise at={T + 3.0}><div style={{fontFamily: SERIF, fontWeight: 600, fontSize: 64, color: ROSE, letterSpacing: '0.1em'}}>{p.time}</div></Rise>
          </Center>
          <Center top={1130}>
            <Rise at={T + 3.6}><div style={{fontFamily: SCRIPT, fontSize: 112, color: INK, lineHeight: 1}}>{p.venue}</div></Rise>
            <Rise at={T + 3.9}><div style={{fontFamily: CAPS, fontWeight: 600, fontSize: 30, color: INK, letterSpacing: '0.34em', marginRight: '-0.34em', marginTop: 6}}>{p.venueSub}</div></Rise>
            <Rise at={T + 4.2}><div style={{fontFamily: SERIF, fontStyle: 'italic', fontWeight: 500, fontSize: 36, color: INK, marginTop: 14}}>{p.address}</div></Rise>
          </Center>
        </>
      )}
      {/* near flowers frame scene A; they clear out for the details so nothing crosses the text */}
      <DriftNear o={two ? Math.max(1 - b2, gust) : 1 - b} />
      {p.music && <Audio src={staticFile(p.music)} volume={(fr) => (p.musicVolume ?? 1) * interpolate(fr, [0, 15, s(p.end) - 40, s(p.end)], [0, 1, 1, 0], clamp)} />}
    </AbsoluteFill>
  );
};

export const paintedInviteDuration = (p: PaintedInviteProps, fps: number) => Math.round(p.end * fps);
