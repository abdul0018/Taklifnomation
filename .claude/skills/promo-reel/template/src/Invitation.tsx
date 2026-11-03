import React from 'react';
import {AbsoluteFill, Audio, Easing, Img, continueRender, delayRender, interpolate, random, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import '@fontsource/cinzel/500.css';
import '@fontsource/cinzel/600.css';
import '@fontsource/cinzel/700.css';
import '@fontsource/cormorant-garamond/500.css';
import '@fontsource/cormorant-garamond/600.css';
import '@fontsource/cormorant-garamond/500-italic.css';
import '@fontsource/cormorant-garamond/600-italic.css';
import '@fontsource/allura/400.css';
import {clamp} from './kit';

/**
 * Style M: animated e-invitation (video taklifnoma). References: the "Davron & Munisa" invite reel + a beige
 * "beautiful beginning of forever" poster. Two scenes on cream paper inside a thin double gold frame:
 *  A) arched couple photo, line-art florals drawing on, verse, script names written on in gold foil, tagline;
 *  B) gold-foil monogram in an oval wreath, invitation text, date, venue, family sign-off, boxed tagline banner.
 * Typography: Allura script (names, family) in gold foil with a moving sheen; a Cormorant italic foil monogram; long text in
 * sentence-case Cormorant (all-caps paragraphs read as shouting); Cinzel caps only for short labels, settling from wide tracking. Camera: slow drift + parallax per layer, push-through between scenes, gold dust.
 */

const CAPS = "'Cinzel', 'Trajan Pro', serif";
const ITAL = "'Cormorant Garamond', 'Georgia', serif";
/** Allura: flowing script with readable capitals (Pinyon's A/N/z read as other letters). */
const SCRIPT = "'Allura', cursive";
const INK = '#5A4232'; const GOLD = '#A8865F'; const LINE = '#C2A584'; const PAPER = '#F7F1E8';
const FOIL = 'linear-gradient(100deg, #7A5631 0%, #B08955 18%, #E9D3A2 34%, #FFF3D6 40%, #D2AE72 48%, #9C7646 64%, #C9A46B 82%, #8A6640 100%)';

if (typeof document !== 'undefined') {
  const h = delayRender('fonts');
  Promise.all(['500 40px Cinzel', '600 40px Cinzel', '700 40px Cinzel', 'italic 500 40px "Cormorant Garamond"', 'italic 600 40px "Cormorant Garamond"', '400 80px Allura', '500 40px "Cormorant Garamond"', '600 40px "Cormorant Garamond"']
    .map((f) => document.fonts.load(f, 'AaŊ‘'))).then(() => continueRender(h)).catch(() => continueRender(h));
}

export type InvitationProps = {
  photo: string; music?: string; musicVolume?: number; end: number;
  verse: [string, string]; verseRef: string; groom: string; bride: string; and?: string; tagline: string;
  mono: [string, string]; invite: string[]; inviteEnd: string; date: string; venue: string; venueSub: string; address: string;
  signoff: [string, string]; banner: string;
  /** scene B start (s); scene A is timed to fit before it */
  sceneB: number;
};

const useF = () => { const f = useCurrentFrame(); const {fps} = useVideoConfig(); return {f, fps, s: (x: number) => Math.round(x * fps)}; };
const ease = Easing.bezier(0.22, 1, 0.36, 1);
const prog = (f: number, a: number, b: number, e = ease) => interpolate(f, [a, b], [0, 1], {...clamp, easing: e});

/** Blur→sharp fade-up; optional blur-out exit. */
const Reveal: React.FC<{at: number; out?: number; dur?: number; children: React.ReactNode; style?: React.CSSProperties}> = ({at, out, dur = 0.9, children, style}) => {
  const {f, s} = useF();
  const p = prog(f, s(at), s(at + dur));
  const q = out != null ? prog(f, s(out), s(out + 0.55), Easing.in(Easing.quad)) : 0;
  const o = p * (1 - q); const b = 12 * (1 - p) + 10 * q;
  if (o <= 0.001) return null;
  return <div style={{opacity: o, filter: b > 0.2 ? `blur(${b}px)` : undefined, transform: `translateY(${(1 - p) * 16 - q * 10}px)`, ...style}}>{children}</div>;
};

/** Cinzel caps that settle from wide tracking to their final spacing while sharpening. */
const Caps: React.FC<{at: number; out?: number; size: number; track?: number; color?: string; weight?: number; foil?: boolean; children: React.ReactNode; style?: React.CSSProperties}> = ({at, out, size, track = 0.12, color = INK, weight = 500, foil, children, style}) => {
  const {f, s} = useF();
  const p = prog(f, s(at), s(at + 1.1));
  const ls = track + 0.28 * (1 - p);
  return (
    <Reveal at={at} out={out} dur={1.0}>
      <div style={{fontFamily: CAPS, fontWeight: weight, fontSize: size, letterSpacing: `${ls}em`, marginRight: `-${ls}em`, color, textAlign: 'center', lineHeight: 1.3, textTransform: 'uppercase', ...(foil ? foilStyle(f) : {}), ...style}}>{children}</div>
    </Reveal>
  );
};

const foilStyle = (f: number): React.CSSProperties => ({
  backgroundImage: FOIL, backgroundSize: '260% 100%', backgroundPosition: `${(100 - ((f * 0.9) % 260))}% 50%`,
  WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', WebkitTextFillColor: 'transparent',
});

/** Sentence-case serif body line (blur→sharp). */
const Body: React.FC<{at: number; out?: number; size: number; italic?: boolean; color?: string; children: React.ReactNode}> = ({at, out, size, italic, color = INK, children}) => (
  <Reveal at={at} out={out}><div style={{fontFamily: ITAL, fontStyle: italic ? 'italic' : 'normal', fontWeight: 500, fontSize: size, color, textAlign: 'center', lineHeight: 1.3}}>{children}</div></Reveal>
);

/** Script written on left→right through a soft-edged mask, in gold foil. */
const Script: React.FC<{at: number; out?: number; dur?: number; size: number; children: React.ReactNode; foil?: boolean; font?: React.CSSProperties}> = ({at, out, dur = 1.2, size, children, foil = true, font}) => {
  const {f, s} = useF();
  const p = prog(f, s(at), s(at + dur), Easing.inOut(Easing.sin));
  const q = out != null ? prog(f, s(out), s(out + 0.55), Easing.in(Easing.quad)) : 0;
  if (p <= 0 || q >= 1) return null;
  const x = -15 + 130 * p; const m = `linear-gradient(90deg, #000 ${x - 15}%, transparent ${x}%)`;
  return (
    <div style={{opacity: 1 - q, filter: q > 0.01 ? `blur(${10 * q}px)` : undefined, WebkitMaskImage: m, maskImage: m, padding: `0 ${size * 0.25}px`}}>
      <div style={{fontFamily: SCRIPT, fontSize: size, lineHeight: 1.15, color: INK, whiteSpace: 'nowrap', ...font, ...(foil ? foilStyle(f) : {})}}>{children}</div>
    </div>
  );
};

/** Stroke draw-on for a group of paths (pathLength=1). */
const Draw: React.FC<{at: number; dur: number; out?: number; children: (p: number) => React.ReactNode}> = ({at, dur, out, children}) => {
  const {f, s} = useF();
  const p = prog(f, s(at), s(at + dur), Easing.inOut(Easing.cubic));
  const q = out != null ? interpolate(f, [s(out), s(out + 0.55)], [1, 0], clamp) : 1;
  if (p <= 0 || q <= 0) return null;
  return <g opacity={q}>{children(p)}</g>;
};
const sp = (p: number, w = 2.2): React.SVGProps<SVGPathElement> => ({fill: 'none', stroke: '#7D6049', strokeWidth: w, strokeLinecap: 'round', strokeLinejoin: 'round', pathLength: 1, strokeDasharray: 1, strokeDashoffset: 1 - p, vectorEffect: 'non-scaling-stroke'});

/** Line-art botanical: curved stem, paired leaves with midribs, a layered open flower. 400x400 box. */
const Floral: React.FC<{p: number; flower?: boolean}> = ({p, flower = true}) => {
  const leaf = (x: number, y: number, a: number, L: number, k: number, d: number) => {
    const rad = (a * Math.PI) / 180; const ex = x + Math.cos(rad) * L; const ey = y + Math.sin(rad) * L;
    const nx = -Math.sin(rad) * L * 0.28; const ny = Math.cos(rad) * L * 0.28;
    const mx = (x + ex) / 2; const my = (y + ey) / 2;
    const pl = Math.max(0, Math.min(1, (p - d) / 0.35));
    return (
      <g key={k}>
        <path d={`M${x},${y} Q${mx + nx},${my + ny} ${ex},${ey} Q${mx - nx},${my - ny} ${x},${y}`} {...sp(pl)} />
        <path d={`M${x},${y} L${x + (ex - x) * 0.85},${y + (ey - y) * 0.85}`} {...sp(pl, 1.2)} />
      </g>
    );
  };
  const ps = Math.min(1, p / 0.5);
  const fl = Math.max(0, Math.min(1, (p - 0.35) / 0.6));
  return (
    <>
      <path d="M40,380 C120,330 170,250 230,170 C270,115 320,80 380,60" {...sp(ps, 2)} />
      {leaf(95, 345, -120, 70, 1, 0.1)}{leaf(110, 336, 10, 64, 2, 0.15)}
      {leaf(170, 275, -140, 78, 3, 0.25)}{leaf(185, 262, -10, 70, 4, 0.3)}
      {leaf(250, 150, -150, 66, 5, 0.4)}{leaf(268, 132, -30, 60, 6, 0.45)}
      {leaf(330, 82, -160, 52, 7, 0.55)}
      {flower && (
        <g transform="translate(150,300)">
          {[0, 1, 2, 3, 4, 5, 6].map((i) => <path key={i} transform={`rotate(${i * 51.4})`} d="M0,0 C-26,-18 -30,-62 0,-78 C30,-62 26,-18 0,0" {...sp(fl, 2)} />)}
          {[0, 1, 2, 3, 4].map((i) => <path key={`i${i}`} transform={`rotate(${i * 72 + 30})`} d="M0,0 C-14,-10 -16,-38 0,-46 C16,-38 14,-10 0,0" {...sp(Math.max(0, fl * 1.2 - 0.2), 1.6)} />)}
          {fl > 0.7 && [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => {
            const a = (i / 10) * Math.PI * 2; const r = 8 + (i % 3) * 3;
            return <circle key={`c${i}`} cx={Math.cos(a) * r} cy={Math.sin(a) * r} r={2.6} fill="#7D6049" opacity={interpolate(fl, [0.7, 1], [0, 1])} />;
          })}
        </g>
      )}
    </>
  );
};

/** Soft watercolour leaves (poster reference, bottom-left). */
const Watercolor: React.FC<{o: number}> = ({o}) => (
  <svg width="460" height="520" viewBox="0 0 460 520" style={{position: 'absolute', left: 0, bottom: 0, opacity: o}}>
    <defs>
      <radialGradient id="wc1" cx="40%" cy="60%" r="60%"><stop offset="0" stopColor="#CDB49B" stopOpacity=".55" /><stop offset="1" stopColor="#CDB49B" stopOpacity="0" /></radialGradient>
      <radialGradient id="wc2" cx="50%" cy="50%" r="50%"><stop offset="0" stopColor="#D9C3AC" stopOpacity=".5" /><stop offset="1" stopColor="#D9C3AC" stopOpacity="0" /></radialGradient>
    </defs>
    <ellipse cx="150" cy="380" rx="200" ry="170" fill="url(#wc1)" />
    <ellipse cx="300" cy="460" rx="160" ry="110" fill="url(#wc2)" />
    {[[90, 470, -70], [120, 400, -55], [150, 330, -40], [180, 270, -30], [70, 420, -110], [100, 350, -120], [130, 290, -130]].map(([x, y, a], i) => (
      <path key={i} transform={`translate(${x},${y}) rotate(${a})`} d="M0,0 C18,-14 52,-14 74,0 C52,14 18,14 0,0" fill={i % 2 ? '#C9AE93' : '#BFA185'} opacity={0.42} />
    ))}
    <path d="M60,520 C90,440 140,330 200,240" fill="none" stroke="#B39477" strokeWidth={2} opacity={0.5} />
  </svg>
);

/** Floating gold dust: small sharp motes in the mid-ground, a few large soft ones in front (depth). */
const GoldDust: React.FC = () => {
  const {f} = useF();
  return (
    <>
      {Array.from({length: 34}).map((_, i) => {
        const front = i < 5;
        const x0 = random(`x${i}`) * 1080; const sp0 = 0.25 + random(`v${i}`) * 0.5; const ph = random(`p${i}`) * 6.28;
        const size = front ? 14 + random(`s${i}`) * 16 : 2.5 + random(`s${i}`) * 4.5;
        const y = 1960 - ((random(`y${i}`) * 2100 + f * sp0 * (front ? 2.2 : 1)) % 2100);
        const x = x0 + Math.sin(f / 40 + ph) * (front ? 30 : 14);
        const tw = 0.55 + 0.45 * Math.sin(f / 13 + ph);
        return <div key={i} style={{position: 'absolute', left: x, top: y, width: size, height: size, borderRadius: '50%',
          background: 'radial-gradient(circle, #FFF2CF 0%, #D8B678 45%, rgba(200,160,100,0) 72%)',
          opacity: (front ? 0.35 : 0.75) * tw, filter: front ? 'blur(3px)' : undefined}} />;
      })}
    </>
  );
};

const Divider: React.FC<{w?: number}> = ({w = 300}) => (
  <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14}}>
    <div style={{width: w / 2 - 20, height: 1.5, background: LINE}} />
    <div style={{width: 8, height: 8, transform: 'rotate(45deg)', background: GOLD}} />
    <div style={{width: w / 2 - 20, height: 1.5, background: LINE}} />
  </div>
);
const Heart: React.FC<{size?: number; fill?: boolean}> = ({size = 34, fill = true}) => (
  <svg width={size} height={size} viewBox="0 0 24 24"><path d="M12 21 C5 15.5 2 12.2 2 8.4 C2 5.4 4.3 3.2 7.1 3.2 C9 3.2 10.9 4.3 12 6 C13.1 4.3 15 3.2 16.9 3.2 C19.7 3.2 22 5.4 22 8.4 C22 12.2 19 15.5 12 21 Z" fill={fill ? GOLD : 'none'} stroke={GOLD} strokeWidth={fill ? 0 : 1.4} /></svg>
);
const Center: React.FC<{top: number; children: React.ReactNode}> = ({top, children}) => (
  <div style={{position: 'absolute', left: 0, right: 0, top, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>{children}</div>
);

export const InvitationReel: React.FC<InvitationProps> = (p) => {
  const {f, s} = useF();
  const B = p.sceneB; const outA = B - 0.75; const T = Math.min(1, (B - 0.75) / 4.2); // scene A pacing
  const a = (x: number) => x * T;
  // camera: scene A slow drift-in, push-through into B, B slow drift
  const camA = interpolate(f, [0, s(outA)], [1.05, 1.0], {...clamp, easing: Easing.out(Easing.sin)}) + 0.08 * prog(f, s(outA), s(B + 0.1), Easing.in(Easing.cubic));
  const camB = interpolate(f, [s(B - 0.1), s(B + 1.2)], [0.93, 1.0], {...clamp, easing: ease}) + 0.025 * prog(f, s(B + 1.2), s(p.end), Easing.linear);
  const driftA = interpolate(f, [0, s(B)], [14, -14]);
  const driftB = interpolate(f, [s(B), s(p.end)], [10, -12]);
  const ph = prog(f, s(a(0.15)), s(a(1.1)));
  const phOut = prog(f, s(outA), s(outA + 0.55));
  const zoom = interpolate(f, [0, s(B)], [1.12, 1.0]);
  const A = f < s(B + 0.2);
  const frameO = prog(f, 0, s(0.7));
  return (
    <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 42%, #FDFAF5 0%, ${PAPER} 58%, #EFE5D7 100%)`, overflow: 'hidden'}}>
      <div style={{position: 'absolute', inset: 40, border: `1.5px solid ${GOLD}`, opacity: frameO}} />
      <div style={{position: 'absolute', inset: 52, border: `1px solid ${LINE}`, opacity: frameO * 0.6}} />

      {A && (
        <AbsoluteFill style={{transform: `translateY(${driftA}px) scale(${camA})`}}>
          <div style={{position: 'absolute', inset: 0, transform: `translateY(${driftA * 0.6}px)`}}>
            <Watercolor o={prog(f, s(a(1.0)), s(a(2.2))) * (1 - prog(f, s(outA + 0.2), s(outA + 0.75)))} />
          </div>
          <div style={{position: 'absolute', left: 156, top: 196, width: 768, height: 948, borderRadius: '384px 384px 0 0', border: `1.5px solid ${GOLD}`, opacity: ph * (1 - phOut)}} />
          <div style={{position: 'absolute', left: 170, top: 210, width: 740, height: 920, borderRadius: '370px 370px 0 0', overflow: 'hidden',
            opacity: ph * (1 - phOut), filter: (1 - ph) * 12 + phOut * 12 > 0.2 ? `blur(${(1 - ph) * 12 + phOut * 12}px)` : undefined}}>
            <Img src={staticFile(p.photo)} style={{width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${zoom})`}} />
          </div>
          {/* florals sit on a nearer layer: they drift a little more than the card */}
          <div style={{position: 'absolute', inset: 0, transform: `translate(${-driftA * 0.4}px, ${driftA * 0.5}px)`}}>
            <svg width="400" height="400" viewBox="0 0 400 400" style={{position: 'absolute', left: 700, top: 120, transform: 'scaleX(-1) rotate(10deg)'}}>
              <Draw at={a(0.4)} dur={1.8 * T} out={outA}>{(q) => <Floral p={q} />}</Draw>
            </svg>
            <svg width="330" height="330" viewBox="0 0 400 400" style={{position: 'absolute', left: 14, top: 1556}}>
              <Draw at={a(1.4)} dur={1.8 * T} out={outA + 0.2}>{(q) => <Floral p={q} />}</Draw>
            </svg>
          </div>
          <Center top={1170}>
            <Body at={a(0.9)} out={outA} size={42} italic>{p.verse[0]}<br />{p.verse[1]}</Body>
            <div style={{alignSelf: 'flex-end', marginRight: 200, marginTop: 4}}><Reveal at={a(1.3)} out={outA}><div style={{fontFamily: ITAL, fontStyle: 'italic', fontWeight: 600, fontSize: 26, color: GOLD}}>{p.verseRef}</div></Reveal></div>
          </Center>
          <Center top={1292}>
            <Script at={a(1.6)} out={outA + 0.1} size={150}>{p.groom}</Script>
            <Reveal at={a(2.4)} out={outA + 0.15}>
              <div style={{display: 'flex', alignItems: 'center', gap: 22, margin: '-6px 0'}}>
                <div style={{width: 170, height: 1.5, background: LINE}} /><div style={{fontFamily: ITAL, fontStyle: 'italic', fontWeight: 600, fontSize: 40, color: GOLD}}>{p.and ?? 'va'}</div><div style={{width: 170, height: 1.5, background: LINE}} />
              </div>
            </Reveal>
            <Script at={a(2.6)} out={outA + 0.2} size={150}>{p.bride}</Script>
            <div style={{marginTop: 8}}><Caps at={a(3.4)} out={outA + 0.25} size={24} track={0.34} color={GOLD}>{p.tagline}</Caps></div>
          </Center>
        </AbsoluteFill>
      )}

      {f >= s(B - 0.1) && (
        <AbsoluteFill style={{transform: `translateY(${driftB}px) scale(${camB})`, opacity: prog(f, s(B - 0.1), s(B + 0.5))}}>
          <Center top={108}><Reveal at={B + 0.1}><div style={{display: 'flex', alignItems: 'center', gap: 16}}><div style={{width: 120, height: 1.5, background: LINE}} /><Heart size={30} /><div style={{width: 120, height: 1.5, background: LINE}} /></div></Reveal></Center>
          <div style={{position: 'absolute', inset: 0, transform: `translate(${driftB * 0.5}px, ${driftB * 0.6}px)`}}>
            <svg width="1080" height="900" viewBox="0 0 1080 900" style={{position: 'absolute', left: 0, top: 0}}>
              <Draw at={B + 0.1} dur={1.3}>{(q) => <ellipse cx={540} cy={520} rx={250} ry={320} {...(sp(q, 1.8) as React.SVGProps<SVGEllipseElement>)} />}</Draw>
              <g transform="translate(258,118) scale(0.7)"><Draw at={B + 0.4} dur={1.8}>{(q) => <Floral p={q} />}</Draw></g>
              <g transform="translate(822,956) rotate(180) scale(0.7)"><Draw at={B + 0.7} dur={1.8}>{(q) => <Floral p={q} />}</Draw></g>
              <Draw at={B + 1.3} dur={0.8}>{(q) => <path d="M650,320 L430,720" {...sp(q, 1.6)} />}</Draw>
            </svg>
          </div>
          <div style={{position: 'absolute', left: 330, top: 300}}><Script at={B + 1.0} dur={1.0} size={240} font={{fontFamily: ITAL, fontStyle: 'italic', fontWeight: 600}}>{p.mono[0]}</Script></div>
          <div style={{position: 'absolute', left: 540, top: 470}}><Script at={B + 1.5} dur={1.0} size={240} font={{fontFamily: ITAL, fontStyle: 'italic', fontWeight: 600}}>{p.mono[1]}</Script></div>
          <Center top={928}>
            {p.invite.map((l, i) => <Body key={i} at={B + 2.2 + i * 0.3} size={38}>{l}</Body>)}
            <div style={{marginTop: 12}}><Caps at={B + 2.2 + p.invite.length * 0.3 + 0.2} size={36} track={0.2} weight={600} foil>{p.inviteEnd}</Caps></div>
          </Center>
          <Center top={1168}><Reveal at={B + 3.6}><Divider w={380} /></Reveal></Center>
          <Center top={1196}><Caps at={B + 3.9} size={62} track={0.06} weight={500}>{p.date}</Caps></Center>
          <Center top={1300}>
            <Caps at={B + 4.7} size={76} track={0.05} weight={700} foil>{p.venue}</Caps>
            <Caps at={B + 5.1} size={30} track={0.3}>{p.venueSub}</Caps>
            <Reveal at={B + 5.5}><div style={{fontFamily: ITAL, fontStyle: 'italic', fontWeight: 600, fontSize: 32, color: GOLD, marginTop: 6}}>{p.address}</div></Reveal>
          </Center>
          <Center top={1540}>
            <Reveal at={B + 6.4}><div style={{fontFamily: ITAL, fontStyle: 'italic', fontWeight: 600, fontSize: 34, color: INK}}>{p.signoff[0]}</div></Reveal>
            <Script at={B + 6.8} dur={1.6} size={72}>{p.signoff[1]}</Script>
          </Center>
          <div style={{position: 'absolute', left: 140, right: 140, top: 1738}}>
            <Reveal at={B + 8.2}>
              <div style={{border: `1.5px solid ${GOLD}`, outline: `1px solid ${LINE}`, outlineOffset: 5, background: 'rgba(252,248,242,.88)', padding: '18px 10px 12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4}}>
                <div style={{fontFamily: CAPS, fontWeight: 500, fontSize: 23, letterSpacing: '0.16em', color: INK, textTransform: 'uppercase'}}>{p.banner}</div>
                <div style={{display: 'flex', alignItems: 'center', gap: 10}}><div style={{width: 110, height: 1, background: LINE}} /><Heart size={18} fill={false} /><div style={{width: 110, height: 1, background: LINE}} /></div>
              </div>
            </Reveal>
          </div>
        </AbsoluteFill>
      )}
      <GoldDust />
      {p.music && <Audio src={staticFile(p.music)} volume={(fr) => (p.musicVolume ?? 1) * interpolate(fr, [0, 6, s(p.end) - 30, s(p.end)], [0, 1, 1, 0], clamp)} />}
    </AbsoluteFill>
  );
};

export const invitationDuration = (p: InvitationProps, fps: number) => Math.round(p.end * fps);
