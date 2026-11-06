import React from 'react';
import {AbsoluteFill, Audio, Easing, OffthreadVideo, continueRender, delayRender, interpolate, random, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import '@fontsource/bodoni-moda/400.css';
import '@fontsource/bodoni-moda/500.css';
import '@fontsource/bodoni-moda/400-italic.css';
import '@fontsource/bodoni-moda/500-italic.css';
import '@fontsource/bodoni-moda/700-italic.css';
import {clamp, src} from './kit';

/**
 * Style Q2: "wow" cinematic invite. Opening: the couple's names, huge, in Bodoni Moda italic — with the clip playing
 * INSIDE the letters (black layer with white type, mix-blend multiply over the clip). A gold hairline traces the letters,
 * then the black melts away so the clip surfaces from inside the names, while a gold-foil copy of the names glides down
 * under the window. Details arrive on the music's swell; floating gold dust; a light sweep crosses the date.
 * Clip pixels are untouched (only scaled into its window); the clip's own audio is muted, the user's track plays.
 */

const BODONI = "'Bodoni Moda', 'Didot', serif";
const PAGE = '#000000'; const CHAMP = '#EDE2CC'; const GOLD = '#C9A96E'; const LINE = 'rgba(201,169,110,.5)';
const FOIL = 'linear-gradient(100deg, #8C6A35 0%, #C9A96E 22%, #FFF1CF 38%, #E2C489 50%, #A07B40 66%, #E7CD97 84%, #8C6A35 100%)';

if (typeof document !== 'undefined') {
  const h = delayRender('fonts');
  Promise.all(['400 60px "Bodoni Moda"', '500 60px "Bodoni Moda"', 'italic 400 60px "Bodoni Moda"', 'italic 500 60px "Bodoni Moda"', 'italic 700 60px "Bodoni Moda"']
    .map((f) => document.fonts.load(f, 'Aa‘0&'))).then(() => continueRender(h)).catch(() => continueRender(h));
}

export type GrandInviteProps = {
  video: string; srcW: number; srcH: number; cropTop?: number; winW?: number;
  music?: string; musicFrom?: number; musicVolume?: number; end: number; revealAt: number; detailsAt: number;
  label: string; groom: string; bride: string; invite: string[]; date: string; time: string; venue: string; address: string; closing: string;
};

const useF = () => { const f = useCurrentFrame(); const {fps} = useVideoConfig(); return {f, fps, s: (x: number) => Math.round(x * fps)}; };
const ease = Easing.bezier(0.22, 1, 0.36, 1);
const prog = (f: number, a: number, b: number, e = ease) => interpolate(f, [a, b], [0, 1], {...clamp, easing: e});
const foil = (f: number): React.CSSProperties => ({backgroundImage: FOIL, backgroundSize: '260% 100%', backgroundPosition: `${100 - ((f * 0.8) % 260)}% 50%`,
  WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', WebkitTextFillColor: 'transparent'});

const Line: React.FC<{at: number; out?: number; dur?: number; children: React.ReactNode}> = ({at, out, dur = 1.3, children}) => {
  const {f, s} = useF();
  const p = prog(f, s(at), s(at + dur));
  const q = out != null ? prog(f, s(out), s(out + 0.8), Easing.inOut(Easing.quad)) : 0;
  const o = p * (1 - q);
  if (o <= 0.001) return null;
  return <div style={{opacity: o, transform: `translateY(${(1 - p) * 14}px)`, filter: p < 0.97 ? `blur(${6 * (1 - p)}px)` : undefined}}>{children}</div>;
};
const Center: React.FC<{top: number; children: React.ReactNode}> = ({top, children}) => (
  <div style={{position: 'absolute', left: 0, right: 0, top, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>{children}</div>
);

/** The names block, identical geometry for the video-mask copy and the gold copy. */
const Names: React.FC<{groom: string; bride: string; style: React.CSSProperties; amp?: React.CSSProperties}> = ({groom, bride, style, amp}) => (
  <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', fontFamily: BODONI, fontStyle: 'italic', fontWeight: 700, lineHeight: 0.98, whiteSpace: 'nowrap'}}>
    <div style={{fontSize: 188, ...style}}>{groom}</div>
    <div style={{fontSize: 128, lineHeight: 0.8, fontWeight: 400, ...style, ...amp}}>&amp;</div>
    <div style={{fontSize: 188, ...style}}>{bride}</div>
  </div>
);

const Dust: React.FC = () => {
  const {f} = useF();
  return (
    <>
      {Array.from({length: 26}).map((_, i) => {
        const near = i < 4;
        const size = near ? 16 + random(`a${i}`) * 14 : 2 + random(`a${i}`) * 4;
        const sp = (near ? 0.9 : 0.35) * (0.7 + random(`b${i}`) * 0.6);
        const y = 1960 - ((random(`c${i}`) * 2100 + f * sp) % 2100);
        const x = random(`d${i}`) * 1080 + Math.sin(f / 45 + i) * (near ? 24 : 10);
        const tw = 0.5 + 0.5 * Math.sin(f / 14 + i * 2.1);
        return <div key={i} style={{position: 'absolute', left: x, top: y, width: size, height: size, borderRadius: '50%',
          background: 'radial-gradient(circle, #FFF3D6 0%, #D6B678 45%, rgba(214,182,120,0) 72%)', opacity: (near ? 0.28 : 0.7) * tw, filter: near ? 'blur(3px)' : undefined}} />;
      })}
    </>
  );
};

export const GrandInviteReel: React.FC<GrandInviteProps> = (p) => {
  const {f, fps, s} = useF();
  const W = p.winW ?? 720; const k = W / p.srcW; const crop = p.cropTop ?? 0;
  const H = Math.round((p.srcH - crop) * k);
  const X = (1080 - W) / 2; const Y = 250;
  const R = p.revealAt; const D = p.detailsAt;
  // scene 1: names in the clip
  const namesIn = prog(f, s(0.3), s(2.0));
  const trace = prog(f, s(1.4), s(2.8));
  const melt = prog(f, s(R), s(R + 1.5), Easing.inOut(Easing.cubic)); // black → clip
  const glide = prog(f, s(R + 0.2), s(R + 1.8), Easing.inOut(Easing.cubic)); // gold names → under the window
  const cx = Y + H / 2; const target = Y + H + 270;
  const nY = interpolate(glide, [0, 1], [cx, target]); const nS = interpolate(glide, [0, 1], [1, 0.6]);
  const namesOut = prog(f, s(D - 1.0), s(D - 0.2), Easing.inOut(Easing.quad));
  const ring = prog(f, s(R + 0.8), s(R + 2.2));
  const endFade = prog(f, s(p.end - 0.9), s(p.end), Easing.inOut(Easing.quad));
  const sweep = interpolate(f, [s(D + 1.4), s(D + 2.6)], [-30, 130], clamp);
  return (
    <AbsoluteFill style={{background: PAGE}}>
      <AbsoluteFill style={{opacity: 1 - endFade}}>
        <div style={{position: 'absolute', inset: 34, border: `1px solid ${LINE}`, opacity: prog(f, s(0.2), s(1.8))}} />
        <Center top={164}><Line at={0.5}><div style={{fontFamily: BODONI, fontWeight: 500, fontSize: 24, letterSpacing: '0.55em', marginRight: '-0.55em', textTransform: 'uppercase', ...foil(f)}}>{p.label}</div></Line></Center>

        {/* clip + text matte (isolated so the multiply only touches the clip) */}
        <div style={{position: 'absolute', left: X, top: Y, width: W, height: H, borderRadius: 22, overflow: 'hidden', isolation: 'isolate'}}>
          <OffthreadVideo src={src(p.video)} muted style={{position: 'absolute', left: 0, top: -crop * k, width: W, height: p.srcH * k}} toneMapped={false} />
          {melt < 1 && (
            <div style={{position: 'absolute', inset: 0, background: `rgba(0,0,0,${1 - melt})`, mixBlendMode: 'multiply', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <div style={{opacity: namesIn, transform: `scale(${0.94 + 0.06 * namesIn})`}}>
                <Names groom={p.groom} bride={p.bride} style={{color: '#fff'}} />
              </div>
            </div>
          )}
        </div>
        <div style={{position: 'absolute', left: X - 12, top: Y - 12, width: W + 24, height: H + 24, borderRadius: 30, border: `1px solid ${LINE}`, opacity: ring}} />

        {/* gold names: hairline trace over the video letters, then foil, then glide below the window */}
        {namesOut < 1 && (
          <div style={{position: 'absolute', left: 0, right: 0, top: nY, display: 'flex', justifyContent: 'center', transform: `translateY(-50%) scale(${nS})`, opacity: 1 - namesOut}}>
            <div style={{position: 'relative'}}>
              <div style={{opacity: trace * (1 - glide)}}>
                <Names groom={p.groom} bride={p.bride} style={{color: 'transparent', WebkitTextStroke: `1.6px ${GOLD}`}} />
              </div>
              <div style={{position: 'absolute', inset: 0, opacity: glide}}>
                <Names groom={p.groom} bride={p.bride} style={foil(f)} />
              </div>
            </div>
          </div>
        )}

        {/* details on the swell */}
        <Center top={Y + H + 70}>
          <Line at={D}><div style={{fontFamily: BODONI, fontStyle: 'italic', fontWeight: 400, fontSize: 38, color: CHAMP, textAlign: 'center', lineHeight: 1.36}}>{p.invite.map((l, i) => <React.Fragment key={i}>{i > 0 && <br />}{l}</React.Fragment>)}</div></Line>
          <div style={{height: 26}} />
          <div style={{width: 240 * prog(f, s(D + 0.8), s(D + 1.8)), height: 1, background: LINE}} />
          <div style={{height: 22}} />
          <Line at={D + 1.1}>
            <div style={{position: 'relative'}}>
              <div style={{fontFamily: BODONI, fontWeight: 400, fontSize: 80, letterSpacing: '0.1em', marginRight: '-0.1em', lineHeight: 1.1, ...foil(f)}}>{p.date}</div>
              <div style={{position: 'absolute', inset: 0, background: `linear-gradient(100deg, transparent ${sweep - 18}%, rgba(255,246,220,.55) ${sweep}%, transparent ${sweep + 18}%)`, mixBlendMode: 'screen'}} />
            </div>
          </Line>
          <Line at={D + 1.6}><div style={{fontFamily: BODONI, fontWeight: 500, fontSize: 26, letterSpacing: '0.45em', marginRight: '-0.45em', color: GOLD, textTransform: 'uppercase', marginTop: 6}}>{p.time}</div></Line>
          <div style={{height: 26}} />
          <Line at={D + 2.4}><div style={{fontFamily: BODONI, fontStyle: 'italic', fontWeight: 500, fontSize: 58, color: CHAMP, lineHeight: 1.1}}>{p.venue}</div></Line>
          <Line at={D + 2.8}><div style={{fontFamily: BODONI, fontStyle: 'italic', fontWeight: 400, fontSize: 30, color: GOLD, marginTop: 6}}>{p.address}</div></Line>
        </Center>
        <Center top={1810}><Line at={D + 4.4} dur={1.6}><div style={{fontFamily: BODONI, fontWeight: 500, fontSize: 19, letterSpacing: '0.42em', marginRight: '-0.42em', color: GOLD, textTransform: 'uppercase'}}>{p.closing}</div></Line></Center>
        <Dust />
      </AbsoluteFill>
      {p.music && (
        <Audio src={staticFile(p.music)} startFrom={Math.round((p.musicFrom ?? 0) * fps)}
          volume={(fr) => (p.musicVolume ?? 1) * interpolate(fr, [0, 8, s(p.end) - 36, s(p.end)], [0, 1, 1, 0], clamp)} />
      )}
    </AbsoluteFill>
  );
};

export const grandInviteDuration = (p: GrandInviteProps, fps: number) => Math.round(p.end * fps);
