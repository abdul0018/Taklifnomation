import React from 'react';
import {AbsoluteFill, Easing, OffthreadVideo, continueRender, delayRender, interpolate, random, useCurrentFrame, useVideoConfig} from 'remotion';
import '@fontsource/aref-ruqaa/arabic-700.css';
import '@fontsource/aref-ruqaa/700.css';
import '@fontsource/allura/400.css';
import '@fontsource/cinzel/500.css';
import '@fontsource/cinzel/600.css';
import '@fontsource/cormorant-garamond/500-italic.css';
import '@fontsource/cormorant-garamond/600.css';
import {clamp, src} from './kit';

/**
 * Style P: Islamic e-invitation around the user's own faceless clip.
 * Midnight-navy card with a faint gold 8-point-star (girih) lattice, double gold frame and star rosettes in the corners.
 * The clip plays inside a pointed mihrab arch (≈1:1 pixels for a 720-wide source, so it is not visibly upscaled), its gold
 * outline draws on. Gold-foil Bismillah in Aref Ruqaa above; a crescent and twinkling stars; names in script below.
 * Mid-reel the text under the arch turns into the details (invitation, date, time, venue), ending on a closing line.
 * The clip's own audio is kept (it plays inside OffthreadVideo).
 */

const ARABIC = "'Aref Ruqaa', serif";
const SCRIPT = "'Allura', cursive";
const CAPS = "'Cinzel', serif";
const SERIF = "'Cormorant Garamond', 'Georgia', serif";
const NAVY = '#0D1726'; const GOLD = '#D6B26E'; const CREAM = '#F3E7CF';
const FOIL = 'linear-gradient(100deg, #9B7334 0%, #D9B46A 22%, #FFF0C8 38%, #E6C47E 50%, #A8803F 66%, #E9CF94 84%, #9B7334 100%)';

if (typeof document !== 'undefined') {
  const h = delayRender('fonts');
  Promise.all(['700 80px "Aref Ruqaa"', '400 80px Allura', '500 40px Cinzel', '600 40px Cinzel', 'italic 500 40px "Cormorant Garamond"', '600 40px "Cormorant Garamond"']
    .map((f) => document.fonts.load(f, 'بسم Aa‘0'))).then(() => continueRender(h)).catch(() => continueRender(h));
}

export type IslamicInviteProps = {
  video: string; end: number; detailsAt: number;
  bismillah: string; label: string; groom: string; bride: string;
  invite: [string, string]; date: string; time: string; venue: string; address: string; closing: string;
};

const useF = () => { const f = useCurrentFrame(); const {fps} = useVideoConfig(); return {f, s: (x: number) => Math.round(x * fps)}; };
const ease = Easing.bezier(0.22, 1, 0.36, 1);
const prog = (f: number, a: number, b: number, e = ease) => interpolate(f, [a, b], [0, 1], {...clamp, easing: e});
const foil = (f: number): React.CSSProperties => ({backgroundImage: FOIL, backgroundSize: '260% 100%', backgroundPosition: `${100 - ((f * 0.9) % 260)}% 50%`,
  WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', WebkitTextFillColor: 'transparent'});

/* arch window (pointed mihrab), local coords */
const AX = 150; const AY = 260; const AW = 780; const AH = 1000;
const archPath = (w: number, h: number, ox = 0, oy = 0) =>
  `M${ox},${oy + h} V${oy + h * 0.36} C${ox},${oy + h * 0.16} ${ox + w * 0.3},${oy + h * 0.045} ${ox + w / 2},${oy} C${ox + w * 0.7},${oy + h * 0.045} ${ox + w},${oy + h * 0.16} ${ox + w},${oy + h * 0.36} V${oy + h} Z`;

/** 8-point star (two overlapping squares) as a path, centred. */
const star8 = (r: number) => {
  const pts: string[] = [];
  for (let i = 0; i < 16; i++) { const a = (i * Math.PI) / 8 - Math.PI / 2; const rr = i % 2 ? r * 0.72 : r; pts.push(`${Math.cos(a) * rr},${Math.sin(a) * rr}`); }
  return `M${pts.join(' L')} Z`;
};
const Draw: React.FC<{d: string; p: number; w?: number; color?: string; o?: number}> = ({d, p, w = 2, color = GOLD, o = 1}) => (
  <path d={d} fill="none" stroke={color} strokeWidth={w} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} opacity={o} strokeLinejoin="round" />
);

/** Faint girih lattice of 8-point stars + connecting octagon grid. */
const Lattice: React.FC<{o: number}> = ({o}) => {
  const cells: React.ReactNode[] = [];
  const S = 120;
  for (let y = -1; y < 18; y++) for (let x = -1; x < 10; x++) {
    const cx = x * S + (y % 2 ? S / 2 : 0); const cy = y * S;
    cells.push(<path key={`${x}-${y}`} d={star8(34)} transform={`translate(${cx},${cy})`} fill="none" stroke={GOLD} strokeWidth={1} />);
  }
  return <svg width={1080} height={1920} style={{position: 'absolute', inset: 0, opacity: o}}>{cells}</svg>;
};

/** Corner rosette: nested 8-point stars + ring, draws on and slowly turns. */
const Rosette: React.FC<{x: number; y: number; p: number; f: number; dir?: number}> = ({x, y, p, f, dir = 1}) => (
  <g transform={`translate(${x},${y}) rotate(${dir * f * 0.25})`}>
    <Draw d={star8(62)} p={p} w={2} />
    <Draw d={star8(40)} p={Math.max(0, p * 1.3 - 0.3)} w={1.5} />
    <circle r={78} fill="none" stroke={GOLD} strokeWidth={1.2} strokeDasharray="4 7" opacity={p * 0.8} />
    <circle r={6} fill={GOLD} opacity={p} />
  </g>
);

const Crescent: React.FC<{p: number; f: number}> = ({p, f}) => (
  <g transform={`translate(930,150) rotate(${-18 + Math.sin(f / 50) * 3}) scale(${0.6 + 0.4 * p})`} opacity={p}>
    <defs><mask id="cres"><circle r={46} fill="#fff" /><circle cx={20} cy={-12} r={40} fill="#000" /></mask></defs>
    <circle r={46} fill="#E6C47E" mask="url(#cres)" />
    <path d={star8(9)} transform="translate(30,-4)" fill="#FFF0C8" />
  </g>
);

const Twinkles: React.FC<{from: number}> = ({from}) => {
  const {f, s} = useF();
  if (f < s(from)) return null;
  return (
    <>
      {Array.from({length: 18}).map((_, i) => {
        const x = 70 + random(`tx${i}`) * 940; const y = 40 + random(`ty${i}`) * 1840;
        if (x > AX - 10 && x < AX + AW + 10 && y > AY - 10 && y < AY + AH + 10) return null;
        const tw = Math.max(0, Math.sin((f - s(from)) / (8 + (i % 5)) + i * 1.3)); const k = (5 + random(`tk${i}`) * 7) * (0.35 + 0.65 * tw);
        return <path key={i} transform={`translate(${x},${y}) scale(${k / 10})`} d="M0,-10 C1.5,-2 2,-1.5 10,0 C2,1.5 1.5,2 0,10 C-1.5,2 -2,1.5 -10,0 C-2,-1.5 -1.5,-2 0,-10 Z" fill="#FFF0C8" opacity={0.25 + 0.7 * tw} />;
      })}
    </>
  );
};

const Rise: React.FC<{at: number; out?: number; dur?: number; children: React.ReactNode; style?: React.CSSProperties}> = ({at, out, dur = 0.9, children, style}) => {
  const {f, s} = useF();
  const p = prog(f, s(at), s(at + dur));
  const q = out != null ? prog(f, s(out), s(out + 0.5), Easing.in(Easing.quad)) : 0;
  const o = p * (1 - q);
  if (o <= 0.001) return null;
  return <div style={{opacity: o, transform: `translateY(${(1 - p) * 16 - q * 10}px)`, filter: o < 0.98 ? `blur(${8 * (1 - o)}px)` : undefined, ...style}}>{children}</div>;
};
const Write: React.FC<{at: number; out?: number; dur?: number; size: number; children: React.ReactNode}> = ({at, out, dur = 1.1, size, children}) => {
  const {f, s} = useF();
  const p = prog(f, s(at), s(at + dur), Easing.inOut(Easing.sin));
  const q = out != null ? prog(f, s(out), s(out + 0.5), Easing.in(Easing.quad)) : 0;
  if (p <= 0 || q >= 1) return null;
  const x = -15 + 130 * p; const m = `linear-gradient(90deg, #000 ${x - 15}%, transparent ${x}%)`;
  return <div style={{WebkitMaskImage: m, maskImage: m, opacity: 1 - q, padding: `0 ${size * 0.3}px`}}><div style={{fontFamily: SCRIPT, fontSize: size, lineHeight: 1.05, whiteSpace: 'nowrap', ...foil(f)}}>{children}</div></div>;
};
const Center: React.FC<{top: number; children: React.ReactNode}> = ({top, children}) => (
  <div style={{position: 'absolute', left: 0, right: 0, top, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>{children}</div>
);

export const IslamicInviteReel: React.FC<IslamicInviteProps> = (p) => {
  const {f, s} = useF();
  const D = p.detailsAt;
  const frame = prog(f, 0, s(1.1), Easing.inOut(Easing.quad));
  const arch = prog(f, s(0.2), s(1.4), Easing.inOut(Easing.quad));
  const vid = prog(f, s(0.35), s(1.3));
  const zoom = interpolate(f, [0, s(p.end)], [1.08, 1.0]);
  const ros = prog(f, s(0.6), s(2.0), Easing.inOut(Easing.quad));
  return (
    <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 40%, #16243A 0%, ${NAVY} 65%, #070D17 100%)`, overflow: 'hidden'}}>
      <svg width={0} height={0} style={{position: 'absolute'}}><defs>
        <linearGradient id="gold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#9B7334" /><stop offset=".35" stopColor="#FFF0C8" /><stop offset=".6" stopColor="#D9B46A" /><stop offset="1" stopColor="#9B7334" /></linearGradient>
      </defs></svg>
      <Lattice o={0.07 * frame} />
      {/* the clip in the mihrab window */}
      <div style={{position: 'absolute', left: AX, top: AY, width: AW, height: AH, clipPath: `path('${archPath(AW, AH)}')`, opacity: vid}}>
        <OffthreadVideo src={src(p.video)} style={{width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${zoom})`}} toneMapped={false} />
      </div>
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
        <Draw d="M40,40 H1040 V1880 H40 Z" p={frame} w={2.5} />
        <Draw d="M56,56 H1024 V1864 H56 Z" p={frame} w={1} o={0.6} />
        <Draw d={archPath(AW, AH, AX, AY)} p={arch} w={4} color="url(#gold)" />
        <Draw d={archPath(AW + 36, AH + 18, AX - 18, AY - 18)} p={prog(f, s(0.4), s(1.6), Easing.inOut(Easing.quad))} w={1.5} o={0.75} />
        <Rosette x={56} y={56} p={ros} f={f} />
        <Rosette x={1024} y={1864} p={ros} f={f} dir={-1} />
        <Crescent p={prog(f, s(1.0), s(1.8), Easing.out(Easing.back(1.4)))} f={f} />
        {/* small star at the arch apex */}
        <g transform={`translate(540,${AY - 40}) rotate(${f * 0.6})`} opacity={arch}><path d={star8(16)} fill="url(#gold)" /></g>
        <Twinkles from={1.2} />
      </svg>
      <Center top={88}><Rise at={0.5} dur={1.2}><div style={{fontFamily: ARABIC, fontWeight: 700, fontSize: 80, lineHeight: 1.45, direction: 'rtl', ...foil(f)}}>{p.bismillah}</div></Rise></Center>

      {/* under the arch — part 1: names */}
      <Center top={1300}>
        <Rise at={1.5} out={D - 0.6}><div style={{fontFamily: CAPS, fontWeight: 600, fontSize: 30, letterSpacing: '0.42em', marginRight: '-0.42em', color: CREAM}}>{p.label}</div></Rise>
        <Write at={2.1} out={D - 0.5} size={140}>{p.groom}</Write>
        <Rise at={2.9} out={D - 0.5}><div style={{fontFamily: SCRIPT, fontSize: 80, lineHeight: 0.6, color: CREAM}}>&amp;</div></Rise>
        <Write at={3.2} out={D - 0.4} size={140}>{p.bride}</Write>
      </Center>
      {/* part 2: details */}
      <Center top={1300}>
        <Rise at={D}><div style={{fontFamily: SERIF, fontStyle: 'italic', fontWeight: 500, fontSize: 42, color: CREAM, textAlign: 'center', lineHeight: 1.28}}>{p.invite[0]}<br />{p.invite[1]}</div></Rise>
        <Rise at={D + 0.6}><div style={{display: 'flex', alignItems: 'center', gap: 16, margin: '22px 0 10px'}}><div style={{width: 120, height: 1.5, background: GOLD}} /><svg width="22" height="22" viewBox="-12 -12 24 24"><path d={star8(11)} fill={GOLD} /></svg><div style={{width: 120, height: 1.5, background: GOLD}} /></div></Rise>
        <Rise at={D + 0.9}><div style={{fontFamily: CAPS, fontWeight: 600, fontSize: 76, letterSpacing: '0.07em', marginRight: '-0.07em', lineHeight: 1.1, ...foil(f)}}>{p.date}</div></Rise>
        <Rise at={D + 1.3}><div style={{fontFamily: CAPS, fontWeight: 500, fontSize: 44, letterSpacing: '0.2em', marginRight: '-0.2em', color: CREAM}}>{p.time}</div></Rise>
        <Rise at={D + 1.9}><div style={{fontFamily: SCRIPT, fontSize: 92, lineHeight: 1.1, marginTop: 10, ...foil(f)}}>{p.venue}</div></Rise>
        <Rise at={D + 2.2}><div style={{fontFamily: SERIF, fontStyle: 'italic', fontWeight: 500, fontSize: 34, color: CREAM}}>{p.address}</div></Rise>
      </Center>
      <Center top={1795}><Rise at={D + 3.0} dur={1.1}><div style={{fontFamily: SERIF, fontWeight: 600, fontSize: 30, letterSpacing: '0.16em', color: GOLD, textTransform: 'uppercase'}}>{p.closing}</div></Rise></Center>
    </AbsoluteFill>
  );
};

export const islamicInviteDuration = (p: IslamicInviteProps, fps: number) => Math.round(p.end * fps);
