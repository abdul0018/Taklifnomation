import React from 'react';
import {AbsoluteFill, Audio, Easing, Img, continueRender, delayRender, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import '@fontsource/cormorant-garamond/500.css';
import '@fontsource/cormorant-garamond/600.css';
import '@fontsource/cormorant-garamond/700.css';
import '@fontsource/cormorant-garamond/500-italic.css';
import '@fontsource/great-vibes/400.css';
import {clamp} from './kit';

/**
 * Style M: animated e-invitation (video taklifnoma). Reference: the "Davron & Munisa" invite reel + a beige "beautiful beginning of
 * forever" poster. Two scenes on cream paper inside a thin double gold frame:
 *  A) arched couple photo, line-art florals that draw themselves on, Quran verse, script names, small tagline;
 *  B) monogram in an oval wreath, invitation text, date, venue, family sign-off, boxed tagline banner.
 * Everything reveals blur→sharp (graphics only), florals draw by stroke, scene A exits with a staggered blur-fade.
 */

const SERIF = "'Cormorant Garamond', 'Georgia', serif";
const SCRIPT = "'Great Vibes', cursive";
const INK = '#5E4535'; const GOLD = '#A8876A'; const LINE = '#B79B80'; const PAPER = '#F7F1E8';

if (typeof document !== 'undefined') {
  const h = delayRender('fonts');
  Promise.all(['600 40px "Cormorant Garamond"', '500 40px "Cormorant Garamond"', '700 40px "Cormorant Garamond"', 'italic 500 40px "Cormorant Garamond"', '400 80px "Great Vibes"']
    .map((f) => document.fonts.load(f, 'AaŊ‘'))).then(() => continueRender(h)).catch(() => continueRender(h));
}

export type InvitationProps = {
  photo: string; music?: string; musicVolume?: number; end: number;
  verse: [string, string]; verseRef: string; groom: string; bride: string; and?: string; tagline: string;
  mono: [string, string]; invite: string[]; inviteEnd: string; date: string; venue: string; venueSub: string; address: string;
  signoff: [string, string]; banner: string;
  sceneB: number;
};

const useF = () => { const f = useCurrentFrame(); const {fps} = useVideoConfig(); return {f, fps, s: (x: number) => Math.round(x * fps)}; };
const ease = Easing.bezier(0.22, 1, 0.36, 1);

/** Blur→sharp fade-up reveal, plus an optional blur-out exit. */
const Reveal: React.FC<{at: number; out?: number; dur?: number; children: React.ReactNode; style?: React.CSSProperties}> = ({at, out, dur = 0.9, children, style}) => {
  const {f, s} = useF();
  const p = interpolate(f, [s(at), s(at + dur)], [0, 1], {...clamp, easing: ease});
  const q = out != null ? interpolate(f, [s(out), s(out + 0.6)], [0, 1], {...clamp, easing: Easing.in(Easing.quad)}) : 0;
  const o = p * (1 - q); const b = 14 * (1 - p) + 12 * q;
  if (o <= 0.001) return null;
  return <div style={{opacity: o, filter: b > 0.2 ? `blur(${b}px)` : undefined, transform: `translateY(${(1 - p) * 18}px)`, ...style}}>{children}</div>;
};

/** Stroke draw-on for a group of paths (pathLength=1). */
const Draw: React.FC<{at: number; dur: number; out?: number; children: (p: number) => React.ReactNode}> = ({at, dur, out, children}) => {
  const {f, s} = useF();
  const p = interpolate(f, [s(at), s(at + dur)], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const q = out != null ? interpolate(f, [s(out), s(out + 0.6)], [1, 0], clamp) : 1;
  if (p <= 0 || q <= 0) return null;
  return <g opacity={q}>{children(p)}</g>;
};
const sp = (p: number, w = 2.2): React.SVGProps<SVGPathElement> => ({fill: 'none', stroke: INK, strokeWidth: w, strokeLinecap: 'round', strokeLinejoin: 'round', pathLength: 1, strokeDasharray: 1, strokeDashoffset: 1 - p, vectorEffect: 'non-scaling-stroke'});

/** Line-art botanical: a curved stem with paired leaves (midribs) and a layered open flower. Drawn in a 400x400 box. */
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
          {[0, 1, 2, 3, 4, 5, 6].map((i) => (
            <path key={i} transform={`rotate(${i * 51.4})`} d="M0,0 C-26,-18 -30,-62 0,-78 C30,-62 26,-18 0,0" {...sp(fl, 2)} />
          ))}
          {[0, 1, 2, 3, 4].map((i) => (
            <path key={`i${i}`} transform={`rotate(${i * 72 + 30})`} d="M0,0 C-14,-10 -16,-38 0,-46 C16,-38 14,-10 0,0" {...sp(Math.max(0, fl * 1.2 - 0.2), 1.6)} />
          ))}
          {fl > 0.7 && [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => {
            const a = (i / 10) * Math.PI * 2; const r = 8 + (i % 3) * 3;
            return <circle key={`c${i}`} cx={Math.cos(a) * r} cy={Math.sin(a) * r} r={2.6} fill={INK} opacity={interpolate(fl, [0.7, 1], [0, 1])} />;
          })}
        </g>
      )}
    </>
  );
};

/** Soft watercolour leaves (image reference, bottom-left): translucent fills, no blur filter needed. */
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

const Divider: React.FC<{w?: number}> = ({w = 300}) => (
  <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14}}>
    <div style={{width: w / 2 - 20, height: 1.5, background: LINE}} />
    <div style={{width: 7, height: 7, borderRadius: 4, background: GOLD}} />
    <div style={{width: w / 2 - 20, height: 1.5, background: LINE}} />
  </div>
);
const Heart: React.FC<{size?: number; fill?: boolean}> = ({size = 34, fill = true}) => (
  <svg width={size} height={size} viewBox="0 0 24 24"><path d="M12 21 C5 15.5 2 12.2 2 8.4 C2 5.4 4.3 3.2 7.1 3.2 C9 3.2 10.9 4.3 12 6 C13.1 4.3 15 3.2 16.9 3.2 C19.7 3.2 22 5.4 22 8.4 C22 12.2 19 15.5 12 21 Z" fill={fill ? GOLD : 'none'} stroke={GOLD} strokeWidth={fill ? 0 : 1.4} /></svg>
);

const Center: React.FC<{top: number; children: React.ReactNode}> = ({top, children}) => (
  <div style={{position: 'absolute', left: 0, right: 0, top, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>{children}</div>
);
const caps = (size: number, extra?: React.CSSProperties): React.CSSProperties => ({fontFamily: SERIF, fontWeight: 600, fontSize: size, color: INK, letterSpacing: '0.08em', textTransform: 'uppercase', textAlign: 'center', lineHeight: 1.25, ...extra});

export const InvitationReel: React.FC<InvitationProps> = (p) => {
  const {f, s} = useF();
  const B = p.sceneB; const outA = B - 0.9;
  // scene A photo
  const ph = interpolate(f, [s(0.3), s(1.4)], [0, 1], {...clamp, easing: ease});
  const phOut = interpolate(f, [s(outA), s(outA + 0.6)], [0, 1], clamp);
  const zoom = interpolate(f, [0, s(B)], [1.1, 1.0]);
  const A = f < s(B + 0.2);
  const frameO = interpolate(f, [0, s(0.8)], [0, 1], clamp);
  return (
    <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 45%, #FCF8F2 0%, ${PAPER} 60%, #F1E8DC 100%)`}}>
      {/* double gold frame */}
      <div style={{position: 'absolute', inset: 40, border: `1.5px solid ${GOLD}`, opacity: frameO}} />
      <div style={{position: 'absolute', inset: 52, border: `1px solid ${LINE}`, opacity: frameO * 0.6}} />

      {A && (
        <>
          <Watercolor o={interpolate(f, [s(1.4), s(2.6)], [0, 1], clamp) * (1 - interpolate(f, [s(outA + 0.3), s(outA + 0.9)], [0, 1], clamp))} />
          {/* arched photo with outline */}
          <div style={{position: 'absolute', left: 156, top: 196, width: 768, height: 948, borderRadius: '384px 384px 0 0', border: `1.5px solid ${GOLD}`, opacity: ph * (1 - phOut)}} />
          <div style={{position: 'absolute', left: 170, top: 210, width: 740, height: 920, borderRadius: '370px 370px 0 0', overflow: 'hidden',
            opacity: ph * (1 - phOut), filter: (1 - ph) * 12 + phOut * 12 > 0.2 ? `blur(${(1 - ph) * 12 + phOut * 12}px)` : undefined}}>
            <Img src={staticFile(p.photo)} style={{width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${zoom})`}} />
          </div>
          <svg width="400" height="400" viewBox="0 0 400 400" style={{position: 'absolute', left: 700, top: 120, transform: 'scaleX(-1) rotate(10deg)'}}>
            <Draw at={0.7} dur={1.8} out={outA}>{(q) => <Floral p={q} />}</Draw>
          </svg>
          <svg width="330" height="330" viewBox="0 0 400 400" style={{position: 'absolute', left: 14, top: 1556}}>
            <Draw at={1.8} dur={1.8} out={outA + 0.25}>{(q) => <Floral p={q} />}</Draw>
          </svg>
          <Center top={1172}>
            <Reveal at={1.3} out={outA + 0.05}><div style={caps(33)}>{p.verse[0]}<br />{p.verse[1]}</div></Reveal>
            <Reveal at={1.7} out={outA + 0.05} style={{alignSelf: 'flex-end', marginRight: 210, marginTop: 6}}><div style={caps(21, {letterSpacing: '0.12em', color: GOLD})}>{p.verseRef}</div></Reveal>
          </Center>
          <Center top={1300}>
            <Reveal at={2.2} out={outA + 0.15} dur={1.1}><div style={{fontFamily: SCRIPT, fontSize: 150, color: INK, lineHeight: 1.05}}>{p.groom}</div></Reveal>
            <Reveal at={2.8} out={outA + 0.2}>
              <div style={{display: 'flex', alignItems: 'center', gap: 22, margin: '2px 0'}}>
                <div style={{width: 170, height: 1.5, background: LINE}} /><div style={caps(26, {letterSpacing: '0.2em', color: GOLD})}>{p.and ?? 'va'}</div><div style={{width: 170, height: 1.5, background: LINE}} />
              </div>
            </Reveal>
            <Reveal at={3.2} out={outA + 0.25} dur={1.1}><div style={{fontFamily: SCRIPT, fontSize: 150, color: INK, lineHeight: 1.05}}>{p.bride}</div></Reveal>
            <Reveal at={4.1} out={outA + 0.3}><div style={caps(24, {letterSpacing: '0.32em', color: GOLD, marginTop: 14})}>{p.tagline}</div></Reveal>
          </Center>
        </>
      )}

      {f >= s(B) && (
        <>
          <Center top={110}><Reveal at={B + 0.1}><div style={{display: 'flex', alignItems: 'center', gap: 16}}><div style={{width: 120, height: 1.5, background: LINE}} /><Heart size={30} /><div style={{width: 120, height: 1.5, background: LINE}} /></div></Reveal></Center>
          {/* monogram wreath */}
          <svg width="1080" height="900" viewBox="0 0 1080 900" style={{position: 'absolute', left: 0, top: 0}}>
            <Draw at={B + 0.1} dur={1.2}>{(q) => <ellipse cx={540} cy={520} rx={250} ry={320} {...(sp(q, 1.8) as React.SVGProps<SVGEllipseElement>)} />}</Draw>
            <g transform="translate(258,118) scale(0.7)"><Draw at={B + 0.4} dur={1.8}>{(q) => <Floral p={q} />}</Draw></g>
            <g transform="translate(822,956) rotate(180) scale(0.7)"><Draw at={B + 0.7} dur={1.8}>{(q) => <Floral p={q} />}</Draw></g>
            <Draw at={B + 1.3} dur={0.7}>{(q) => <path d="M640,330 L440,710" {...sp(q, 1.6)} />}</Draw>
          </svg>
          <div style={{position: 'absolute', left: 360, top: 330}}><Reveal at={B + 1.1} dur={1}><div style={{fontFamily: SCRIPT, fontSize: 200, color: INK, lineHeight: 1}}>{p.mono[0]}</div></Reveal></div>
          <div style={{position: 'absolute', left: 560, top: 520}}><Reveal at={B + 1.5} dur={1}><div style={{fontFamily: SCRIPT, fontSize: 200, color: INK, lineHeight: 1}}>{p.mono[1]}</div></Reveal></div>
          <Center top={930}>
            {p.invite.map((l, i) => <Reveal key={i} at={B + 2.0 + i * 0.25}><div style={caps(31)}>{l}</div></Reveal>)}
            <Reveal at={B + 2.0 + p.invite.length * 0.25 + 0.2}><div style={caps(38, {marginTop: 10, letterSpacing: '0.14em'})}>{p.inviteEnd}</div></Reveal>
          </Center>
          <Center top={1170}><Reveal at={B + 3.2}><Divider w={360} /></Reveal></Center>
          <Center top={1200}><Reveal at={B + 3.5} dur={1}><div style={{fontFamily: SERIF, fontWeight: 500, fontSize: 70, color: INK, letterSpacing: '0.04em'}}>{p.date}</div></Reveal></Center>
          <Center top={1310}>
            <Reveal at={B + 4.2} dur={1}><div style={caps(80, {fontWeight: 700, letterSpacing: '0.04em', lineHeight: 1})}>{p.venue}</div></Reveal>
            <Reveal at={B + 4.5}><div style={caps(34, {letterSpacing: '0.2em', marginTop: 6})}>{p.venueSub}</div></Reveal>
            <Reveal at={B + 4.8}><div style={{fontFamily: SERIF, fontStyle: 'italic', fontWeight: 500, fontSize: 32, color: GOLD, marginTop: 8}}>{p.address}</div></Reveal>
          </Center>
          <Center top={1540}>
            <Reveal at={B + 5.6}><div style={{fontFamily: SERIF, fontStyle: 'italic', fontWeight: 500, fontSize: 32, color: INK}}>{p.signoff[0]}</div></Reveal>
            <Reveal at={B + 6.0} dur={1.1}><div style={{fontFamily: SCRIPT, fontSize: 70, color: INK, lineHeight: 1.15}}>{p.signoff[1]}</div></Reveal>
          </Center>
          <div style={{position: 'absolute', left: 150, right: 150, top: 1735}}>
            <Reveal at={B + 6.8}>
              <div style={{border: `1.5px solid ${GOLD}`, background: 'rgba(252,248,242,.85)', padding: '18px 10px 12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4}}>
                <div style={caps(25, {letterSpacing: '0.16em'})}>{p.banner}</div>
                <div style={{display: 'flex', alignItems: 'center', gap: 10}}><div style={{width: 110, height: 1, background: LINE}} /><Heart size={18} fill={false} /><div style={{width: 110, height: 1, background: LINE}} /></div>
              </div>
            </Reveal>
          </div>
        </>
      )}
      {p.music && <Audio src={staticFile(p.music)} volume={(fr) => (p.musicVolume ?? 1) * interpolate(fr, [0, 20, s(p.end) - 45, s(p.end)], [0, 1, 1, 0], clamp)} />}
    </AbsoluteFill>
  );
};

export const invitationDuration = (p: InvitationProps, fps: number) => Math.round(p.end * fps);
