import React from 'react';
import {AbsoluteFill, Audio, Easing, OffthreadVideo, continueRender, delayRender, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import '@fontsource/cormorant-garamond/400-italic.css';
import '@fontsource/cormorant-garamond/500-italic.css';
import '@fontsource/cormorant-garamond/500.css';
import '@fontsource/cormorant-garamond/600.css';
import {clamp, src} from './kit';

/**
 * Style Q: cinematic minimalist e-invitation for a dark, moody clip (silhouette first dance).
 * Near-black page that melts into the clip's own dark edges, champagne type, hairlines only.
 * The clip sits in a soft-cornered window close to its native width (low-res sources stay sharp); `cropTop` hides
 * baked-in stickers at the top. Names under the window, then they give way to the details on the music's swell.
 * Music: the user's track from `musicFrom` seconds, with fade-in/out; the clip's own audio is muted.
 */

const SERIF = "'Cormorant Garamond', 'Georgia', serif";
const PAGE = '#0A0908'; const CHAMP = '#E8DCC4'; const GOLD = '#BFA27A'; const LINE = 'rgba(191,162,122,.45)';

if (typeof document !== 'undefined') {
  const h = delayRender('fonts');
  Promise.all(['italic 400 60px "Cormorant Garamond"', 'italic 500 60px "Cormorant Garamond"', '500 40px "Cormorant Garamond"', '600 40px "Cormorant Garamond"']
    .map((f) => document.fonts.load(f, 'Aa‘0&'))).then(() => continueRender(h)).catch(() => continueRender(h));
}

export type CinemaInviteProps = {
  video: string; srcW: number; srcH: number; cropTop?: number; winW?: number;
  music?: string; musicFrom?: number; musicVolume?: number; end: number; detailsAt: number;
  label: string; groom: string; bride: string; invite: string[]; date: string; time: string; venue: string; address: string; closing: string;
};

const useF = () => { const f = useCurrentFrame(); const {fps} = useVideoConfig(); return {f, fps, s: (x: number) => Math.round(x * fps)}; };
const ease = Easing.bezier(0.22, 1, 0.36, 1);
const prog = (f: number, a: number, b: number, e = ease) => interpolate(f, [a, b], [0, 1], {...clamp, easing: e});

/** Fade/rise in at `at`, optional fade out at `out` — soft, slow, no blur. */
const Line: React.FC<{at: number; out?: number; dur?: number; children: React.ReactNode}> = ({at, out, dur = 1.3, children}) => {
  const {f, s} = useF();
  const p = prog(f, s(at), s(at + dur));
  const q = out != null ? prog(f, s(out), s(out + 0.8), Easing.inOut(Easing.quad)) : 0;
  const o = p * (1 - q);
  if (o <= 0.001) return null;
  return <div style={{opacity: o, transform: `translateY(${(1 - p) * 12}px)`}}>{children}</div>;
};
const Center: React.FC<{top: number; children: React.ReactNode}> = ({top, children}) => (
  <div style={{position: 'absolute', left: 0, right: 0, top, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>{children}</div>
);
const caps = (size: number, track = 0.4): React.CSSProperties => ({fontFamily: SERIF, fontWeight: 600, fontSize: size, letterSpacing: `${track}em`, marginRight: `-${track}em`, color: GOLD, textTransform: 'uppercase'});
const ital = (size: number, color = CHAMP): React.CSSProperties => ({fontFamily: SERIF, fontStyle: 'italic', fontWeight: 500, fontSize: size, color, lineHeight: 1.15, textAlign: 'center'});

export const CinemaInviteReel: React.FC<CinemaInviteProps> = (p) => {
  const {f, fps, s} = useF();
  const W = p.winW ?? 720; const k = W / p.srcW; const crop = p.cropTop ?? 0;
  const H = Math.round((p.srcH - crop) * k);
  const X = (1080 - W) / 2; const Y = 250;
  const D = p.detailsAt;
  const win = prog(f, s(0.6), s(2.2));
  const endFade = prog(f, s(p.end - 0.9), s(p.end), Easing.inOut(Easing.quad));
  const hair = (at: number, w: number) => {
    const q = prog(f, s(at), s(at + 1.1));
    return <div style={{width: w * q, height: 1, background: LINE}} />;
  };
  return (
    <AbsoluteFill style={{background: PAGE}}>
      <AbsoluteFill style={{opacity: 1 - endFade}}>
        <div style={{position: 'absolute', inset: 36, border: `1px solid ${LINE}`, opacity: prog(f, s(0.2), s(1.6))}} />
        <Center top={168}><Line at={0.3}><div style={caps(24, 0.5)}>{p.label}</div></Line></Center>
        {/* the clip: native-ish width, sticker band cropped off the top */}
        <div style={{position: 'absolute', left: X, top: Y, width: W, height: H, borderRadius: 22, overflow: 'hidden', opacity: win}}>
          <OffthreadVideo src={src(p.video)} muted style={{position: 'absolute', left: 0, top: -crop * k, width: W, height: p.srcH * k}} toneMapped={false} />
        </div>
        <div style={{position: 'absolute', left: X - 12, top: Y - 12, width: W + 24, height: H + 24, borderRadius: 30, border: `1px solid ${LINE}`, opacity: prog(f, s(1.0), s(2.4))}} />
        {/* scene 1: names */}
        <Center top={Y + H + 70}>
          <Line at={2.0} out={D - 1.0} dur={1.6}><div style={ital(118)}>{p.groom}</div></Line>
          <Line at={2.7} out={D - 0.95}><div style={{...ital(92, GOLD), lineHeight: 0.8}}>&amp;</div></Line>
          <Line at={3.2} out={D - 0.9} dur={1.6}><div style={ital(118)}>{p.bride}</div></Line>
        </Center>
        {/* scene 2: details, on the music's swell */}
        <Center top={Y + H + 64}>
          <Line at={D}><div style={{...ital(42), lineHeight: 1.32, opacity: 0.92}}>{p.invite.map((l, i) => <React.Fragment key={i}>{i > 0 && <br />}{l}</React.Fragment>)}</div></Line>
          <div style={{height: 26}} />
          {hair(D + 0.9, 220)}
          <div style={{height: 26}} />
          <Line at={D + 1.2}><div style={{fontFamily: SERIF, fontWeight: 500, fontSize: 66, letterSpacing: '0.14em', marginRight: '-0.14em', color: CHAMP}}>{p.date}</div></Line>
          <Line at={D + 1.6}><div style={caps(30, 0.34)}>{p.time}</div></Line>
          <div style={{height: 22}} />
          <Line at={D + 2.4}><div style={ital(56)}>{p.venue}</div></Line>
          <Line at={D + 2.8}><div style={{...ital(32, GOLD)}}>{p.address}</div></Line>
        </Center>
        <Center top={1812}><Line at={D + 4.4} dur={1.6}><div style={caps(20, 0.36)}>{p.closing}</div></Line></Center>
      </AbsoluteFill>
      {p.music && (
        <Audio src={staticFile(p.music)} startFrom={Math.round((p.musicFrom ?? 0) * fps)}
          volume={(fr) => (p.musicVolume ?? 1) * interpolate(fr, [0, 8, s(p.end) - 36, s(p.end)], [0, 1, 1, 0], clamp)} />
      )}
    </AbsoluteFill>
  );
};

export const cinemaInviteDuration = (p: CinemaInviteProps, fps: number) => Math.round(p.end * fps);
