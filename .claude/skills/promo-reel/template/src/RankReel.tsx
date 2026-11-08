import React from 'react';
import {AbsoluteFill, Easing, Img, OffthreadVideo, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import '@fontsource/montserrat/800.css';
import '@fontsource/montserrat/900.css';
import {clamp, src} from './kit';

/**
 * Style R: "top 5" countdown ranking bar over a talking head (reference: Duolingo → YouTube → HelloTalk → BBC → GoPrep).
 * A 1–5 bar (green → red headers, dark slots) sits at chest height. On each app's name its logo pops in big over the bar,
 * then on the place word it shrinks into its numbered slot and the header pulses. Captions under the bar: app name, then
 * "N-o‘rin!". `hideAt` fades the whole bar out (gone 0.5 s later). No shadows: crisp hairlines and stroked text only.
 */

const FONT = "'Montserrat', 'Arial', sans-serif";
const HEAD = ['#1E9E3E', '#7AC943', '#F5C518', '#F28C1E', '#E53935'];

export type RankApp = {name: string; place: number; nameAt: number; placeAt: number; logo: {img?: string; bbc?: boolean; radius?: number; scale?: number}};
export type RankProps = {video: string; overlayOnly?: boolean; end: number; top?: number; hideAt: number; apps: RankApp[]; placeLabel?: (n: number) => string};

const useT = () => { const f = useCurrentFrame(); const {fps} = useVideoConfig(); return {f, fps, s: (x: number) => Math.round(x * fps)}; };
const ease = Easing.bezier(0.22, 1, 0.36, 1);

const W = 880; const X0 = (1080 - W) / 2; const CW = W / 5; const HH = 92; const SH = 178;

/** BBC Learning English wordmark tile, drawn (teal, three white BBC blocks, two-line label). */
const BBCTile: React.FC<{size: number}> = ({size}) => {
  const b = size * 0.2;
  return (
    <div style={{width: size, height: size, background: '#0F7C7B', borderRadius: size * 0.14, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: size * 0.05}}>
      <div style={{display: 'flex', gap: size * 0.035}}>
        {['B', 'B', 'C'].map((c, i) => <div key={i} style={{width: b, height: b, background: '#fff', color: '#0F7C7B', fontFamily: FONT, fontWeight: 900, fontSize: b * 0.8, lineHeight: `${b}px`, textAlign: 'center'}}>{c}</div>)}
      </div>
      <div style={{fontFamily: FONT, fontWeight: 900, fontSize: size * 0.135, lineHeight: 1.0, color: '#fff', textAlign: 'center', letterSpacing: '0.02em'}}>LEARNING<br />ENGLISH</div>
    </div>
  );
};
const Logo: React.FC<{app: RankApp; size: number}> = ({app, size}) => {
  if (app.logo.bbc) return <BBCTile size={size} />;
  const sz = size * (app.logo.scale ?? 1);
  return <Img src={staticFile(app.logo.img!)} style={{width: sz, height: sz, objectFit: 'contain', borderRadius: app.logo.radius ?? sz * 0.18}} />;
};

const Caption: React.FC<{text: string; at: number; until: number; y: number; size?: number}> = ({text, at, until, y, size = 64}) => {
  const {f, fps, s} = useT();
  if (f < s(at) || f >= s(until)) return null;
  const p = spring({frame: f - s(at), fps, config: {damping: 12, stiffness: 260, mass: 0.6}});
  return (
    <div style={{position: 'absolute', left: 40, right: 40, top: y, display: 'flex', justifyContent: 'center'}}>
      <div style={{fontFamily: FONT, fontWeight: 800, fontSize: size, color: '#fff', textAlign: 'center', WebkitTextStroke: `${size * 0.15}px #000`, paintOrder: 'stroke fill',
        transform: `scale(${interpolate(p, [0, 1], [0.7, 1])})`, opacity: Math.min(1, p * 2)}}>{text}</div>
    </div>
  );
};

export const RankReel: React.FC<RankProps> = (p) => {
  const {f, fps, s} = useT();
  const Y = p.top ?? 1080;
  const enter = (i: number) => spring({frame: f - s(0.1) - i * 3, fps, config: {damping: 15, stiffness: 170}});
  const hide = interpolate(f, [s(p.hideAt), s(p.hideAt + 0.5)], [0, 1], {...clamp, easing: Easing.in(Easing.cubic)});
  const label = p.placeLabel ?? ((n: number) => `${n}-o‘rin!`);
  return (
    <AbsoluteFill style={{background: p.overlayOnly ? 'transparent' : '#000'}}>
      {!p.overlayOnly && <OffthreadVideo src={src(p.video)} style={{width: '100%', height: '100%', objectFit: 'cover'}} toneMapped={false} />}
      {hide < 1 && (
        <div style={{position: 'absolute', inset: 0, opacity: 1 - hide, transform: `translateY(${hide * 60}px)`}}>
          {/* bar */}
          {[1, 2, 3, 4, 5].map((n, i) => {
            const e = enter(i);
            const filled = p.apps.find((a) => a.place === n);
            const pulse = filled && f >= s(filled.placeAt) ? Math.sin(Math.min(1, (f - s(filled.placeAt)) / 10) * Math.PI) : 0;
            return (
              <div key={n} style={{position: 'absolute', left: X0 + i * CW, top: Y, width: CW, opacity: Math.min(1, e * 1.5), transform: `translateY(${(1 - e) * 50}px)`}}>
                <div style={{height: HH, background: HEAD[i], borderRight: i < 4 ? '2px solid rgba(255,255,255,.35)' : undefined, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: FONT, fontWeight: 900, fontSize: 60, color: '#fff', WebkitTextStroke: '5px rgba(0,0,0,.55)', paintOrder: 'stroke fill', transform: `scale(${1 + 0.08 * pulse})`}}>{n}</div>
                <div style={{height: SH, background: '#3B3B3D', borderRight: i < 4 ? '2px solid #1E1E20' : undefined, boxShadow: 'inset 0 0 0 1px rgba(255,255,255,.08)'}} />
              </div>
            );
          })}
          <div style={{position: 'absolute', left: X0, top: Y, width: W, height: HH + SH, border: '2px solid rgba(0,0,0,.55)', boxSizing: 'border-box'}} />
          {/* logos */}
          {p.apps.map((a, k) => {
            if (f < s(a.nameAt)) return null;
            const pop = spring({frame: f - s(a.nameAt), fps, config: {damping: 11, stiffness: 220, mass: 0.7}});
            const go = f >= s(a.placeAt) ? spring({frame: f - s(a.placeAt), fps, config: {damping: 16, stiffness: 160}}) : 0;
            const slotX = X0 + (a.place - 1) * CW + CW / 2; const slotY = Y + HH + SH / 2;
            const bigX = Math.min(Math.max(slotX, X0 + 150), X0 + W - 150); const bigY = Y + (HH + SH) / 2 - 10;
            const cx = interpolate(go, [0, 1], [bigX, slotX]); const cy = interpolate(go, [0, 1], [bigY, slotY]);
            const size = interpolate(go, [0, 1], [280, 150]) * interpolate(pop, [0, 1], [0.3, 1]);
            return (
              <div key={k} style={{position: 'absolute', left: cx - size / 2, top: cy - size / 2, width: size, height: size, opacity: Math.min(1, pop * 2), display: 'flex', alignItems: 'center', justifyContent: 'center',
                transform: `rotate(${(1 - Math.min(1, pop)) * -10}deg)`}}>
                <Logo app={a} size={size} />
              </div>
            );
          })}
          {/* captions */}
          {p.apps.map((a, k) => {
            const next = p.apps[k + 1];
            const until = Math.min(next ? next.nameAt : p.hideAt, a.placeAt + 1.6);
            return (
              <React.Fragment key={`c${k}`}>
                <Caption text={a.name} at={a.nameAt} until={a.placeAt} y={Y + HH + SH + 60} />
                <Caption text={label(a.place)} at={a.placeAt} until={until} y={Y + HH + SH + 60} size={74} />
              </React.Fragment>
            );
          })}
        </div>
      )}
    </AbsoluteFill>
  );
};

export const rankDuration = (p: RankProps, fps: number) => Math.round(p.end * fps);
