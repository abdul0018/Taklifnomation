import React from 'react';
import {AbsoluteFill, Easing, OffthreadVideo, continueRender, delayRender, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import '@fontsource/amiri/arabic-400.css';
import '@fontsource/amiri/400.css';
import '@fontsource/allura/400.css';
import '@fontsource/cormorant-garamond/500.css';
import '@fontsource/cormorant-garamond/600.css';
import '@fontsource/cormorant-garamond/500-italic.css';
import {clamp, src} from './kit';

/**
 * Style P2: minimalist Islamic e-invitation around the user's 9:16 clip.
 * Warm ivory paper, one ink colour and a muted gold accent, generous white space, no ornaments beyond hairlines.
 * The clip is never cropped: it keeps its own 9:16 shape (so heads at the frame edge stay visible) inside a softly rounded
 * window with a hairline. A small Amiri Bismillah stays on top. Scene 1: large window. At `shrinkAt` it glides up and shrinks to a
 * smaller window, and the details set in below one line at a time.
 */

const ARABIC = "'Amiri', serif";
const SCRIPT = "'Allura', cursive";
const SERIF = "'Cormorant Garamond', 'Georgia', serif";
const PAPER = '#F4EFE6'; const INK = '#2F2A25'; const GOLD = '#A9864E'; const LINE = '#CDBFA8';

if (typeof document !== 'undefined') {
  const h = delayRender('fonts');
  Promise.all(['400 60px Amiri', '400 80px Allura', '500 40px "Cormorant Garamond"', '600 40px "Cormorant Garamond"', 'italic 500 40px "Cormorant Garamond"']
    .map((f) => document.fonts.load(f, 'بسم Aa‘0'))).then(() => continueRender(h)).catch(() => continueRender(h));
}

export type MinimalIslamicProps = {
  video: string; end: number; shrinkAt: number;
  bismillah: string; label: string; groom: string; bride: string;
  date: string; time: string; venue: string; address: string; closing: string;
};

const useF = () => { const f = useCurrentFrame(); const {fps} = useVideoConfig(); return {f, s: (x: number) => Math.round(x * fps)}; };
const ease = Easing.bezier(0.22, 1, 0.36, 1);
const prog = (f: number, a: number, b: number, e = ease) => interpolate(f, [a, b], [0, 1], {...clamp, easing: e});

const Rise: React.FC<{at: number; dur?: number; children: React.ReactNode}> = ({at, dur = 1.0, children}) => {
  const {f, s} = useF();
  const p = prog(f, s(at), s(at + dur));
  if (p <= 0.001) return null;
  return <div style={{opacity: p, transform: `translateY(${(1 - p) * 14}px)`}}>{children}</div>;
};
const Center: React.FC<{top: number; children: React.ReactNode}> = ({top, children}) => (
  <div style={{position: 'absolute', left: 0, right: 0, top, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>{children}</div>
);
const Hair: React.FC<{w: number; p: number}> = ({w, p}) => (
  <div style={{display: 'flex', alignItems: 'center', gap: 14, opacity: p > 0 ? 1 : 0}}>
    <div style={{width: (w / 2) * p, height: 1, background: GOLD, marginLeft: (w / 2) * (1 - p)}} />
    <div style={{width: 6, height: 6, transform: `rotate(45deg) scale(${p})`, background: GOLD}} />
    <div style={{width: (w / 2) * p, height: 1, background: GOLD, marginRight: (w / 2) * (1 - p)}} />
  </div>
);

// window rects: A (scene 1) and B (scene 2), both exactly 9:16
const A = {w: 900, x: 90, y: 170}; const B = {w: 600, x: 240, y: 160};
const H = (w: number) => (w * 16) / 9;

export const MinimalIslamicReel: React.FC<MinimalIslamicProps> = (p) => {
  const {f, s} = useF();
  const S = p.shrinkAt;
  const k = prog(f, s(S), s(S + 1.4), Easing.inOut(Easing.cubic));
  const sc = interpolate(k, [0, 1], [1, B.w / A.w]);
  const tx = interpolate(k, [0, 1], [A.x, B.x]); const ty = interpolate(k, [0, 1], [A.y, B.y]);
  const vin = prog(f, 0, s(1.0));
  const bis = prog(f, s(0.4), s(1.6));
  const D = S + 1.2;
  return (
    <AbsoluteFill style={{background: PAPER}}>
      {/* hairline page border */}
      <div style={{position: 'absolute', inset: 34, border: `1px solid ${LINE}`, opacity: prog(f, 0, s(1.2))}} />
      {/* Bismillah: above the large window, fades as the window rises */}
      <Center top={58}><div style={{opacity: bis, fontFamily: ARABIC, fontSize: 54, color: GOLD, direction: 'rtl', lineHeight: 1.3}}>{p.bismillah}</div></Center>
      {/* the clip, uncropped 9:16 */}
      <div style={{position: 'absolute', left: 0, top: 0, width: A.w, height: H(A.w), transformOrigin: '0 0',
        transform: `translate(${tx}px, ${ty}px) scale(${sc})`, opacity: vin}}>
        <div style={{position: 'absolute', inset: 0, borderRadius: 28, overflow: 'hidden', outline: `${1 / sc}px solid ${LINE}`, outlineOffset: 10 / sc}}>
          <OffthreadVideo src={src(p.video)} style={{width: '100%', height: '100%', objectFit: 'cover'}} toneMapped={false} />
        </div>
      </div>
      {/* details */}
      <Center top={1262}>
        <Rise at={D}><div style={{fontFamily: SERIF, fontWeight: 600, fontSize: 24, letterSpacing: '0.42em', marginRight: '-0.42em', color: GOLD, textTransform: 'uppercase'}}>{p.label}</div></Rise>
        <Rise at={D + 0.35} dur={1.2}><div style={{fontFamily: SCRIPT, fontSize: 104, color: INK, lineHeight: 1.15, marginTop: 6}}>{p.groom} <span style={{color: GOLD, fontSize: 80}}>&amp;</span> {p.bride}</div></Rise>
        <div style={{marginTop: 18}}><Hair w={260} p={prog(f, s(D + 1.0), s(D + 1.9))} /></div>
        <Rise at={D + 1.3}><div style={{fontFamily: SERIF, fontWeight: 600, fontSize: 54, color: INK, letterSpacing: '0.12em', marginRight: '-0.12em', marginTop: 22}}>{p.date}</div></Rise>
        <Rise at={D + 1.6}><div style={{fontFamily: SERIF, fontWeight: 500, fontSize: 36, color: INK, letterSpacing: '0.2em', marginRight: '-0.2em', opacity: 0.8}}>{p.time}</div></Rise>
        <Rise at={D + 2.1}><div style={{fontFamily: SERIF, fontStyle: 'italic', fontWeight: 500, fontSize: 46, color: INK, marginTop: 26}}>{p.venue}</div></Rise>
        <Rise at={D + 2.4}><div style={{fontFamily: SERIF, fontStyle: 'italic', fontWeight: 500, fontSize: 30, color: INK, opacity: 0.7}}>{p.address}</div></Rise>
      </Center>
      <Center top={1806}><Rise at={D + 3.0}><div style={{fontFamily: SERIF, fontWeight: 600, fontSize: 20, letterSpacing: '0.34em', marginRight: '-0.34em', color: GOLD, textTransform: 'uppercase'}}>{p.closing}</div></Rise></Center>
    </AbsoluteFill>
  );
};

export const minimalIslamicDuration = (p: MinimalIslamicProps, fps: number) => Math.round(p.end * fps);
