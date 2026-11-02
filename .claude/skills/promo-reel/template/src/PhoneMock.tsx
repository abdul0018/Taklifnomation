import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import '@fontsource/montserrat/800.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import {clamp} from './kit';

/**
 * Style L: phone-mockup reel for a screen recording (reference: invitestudio.uz wedding-site promo).
 * A white phone floats over a blurred, dimmed still of the recording; the phone glides up at the start and an end card pops.
 * Rendered as two layers so the recording never passes through the browser:
 *   layer 'bg' (opaque): background still with a slow push-in;
 *   layer 'fg' (alpha): phone body with a rounded screen hole, side buttons, end card.
 * ffmpeg puts the pre-scaled recording between them at (SCREEN_X, SCREEN_Y + phoneOffset(n)), see `phoneOffsetExpr`.
 */

export const PHONE = {sw: 696, sh: 1546, bez: 16, r: 92};
export const PHONE_W = PHONE.sw + 2 * PHONE.bez;
export const PHONE_H = PHONE.sh + 2 * PHONE.bez;
export const PHONE_X = (1080 - PHONE_W) / 2;
export const PHONE_Y = (1920 - PHONE_H) / 2;
export const SCREEN_X = PHONE_X + PHONE.bez;
export const SCREEN_Y = PHONE_Y + PHONE.bez;
const ENTER = 20; const DROP = 1700;
/** Vertical offset of the phone at frame n (ease-out cubic). Mirrored exactly by `phoneOffsetExpr` for ffmpeg. */
export const phoneOffset = (n: number) => Math.round(DROP * Math.pow(1 - Math.min(1, n / ENTER), 3));
/** Use t (seconds), not n: overlay's n ran one frame ahead of the Remotion layer. */
export const phoneOffsetExpr = `${DROP}*pow(1-min(1\\,t*30/${ENTER})\\,3)`;

/**
 * intro: an "opened from the browser" opening drawn inside the screen, in the phone's own Chrome look (dark bar measured from the
 *   recording): empty tab → tap → `url` typed with a suggestion row → tap → load bar → fades into the recording at `handoff` (s).
 *   The recording must be delayed by `handoff` in ffmpeg (tpad + adelay).
 * header: website line above the phone for the whole video (globe + url), crisp stroke, no shadow.
 */
export type PhoneMockProps = {layer: 'bg' | 'fg'; bg: string; end: number; outro?: {at: number; text: string; icon?: string};
  intro?: {url: string; placeholder?: string; time?: string; tabs?: number; handoff: number}; header?: string};

const FONT = "'Montserrat', 'Arial', sans-serif";
const UI = "'Roboto', 'Arial', sans-serif";
const BAR = '#19100C'; const PILL = '#3C312C'; const INK = '#DCD3CF';

/** Chrome-on-Android opening, drawn in recording pixels (1080 wide) and scaled to the screen. */
const BrowserIntro: React.FC<{i: NonNullable<PhoneMockProps['intro']>; f: number; fps: number}> = ({i, f, fps}) => {
  const k = PHONE.sw / 1080; const H = PHONE.sh / k;
  const hand = Math.round(i.handoff * fps);
  const tap1 = 22; const t0 = 28; const per = 1.6; const typed = Math.max(0, Math.min(i.url.length, Math.floor((f - t0) / per)));
  const tDone = t0 + Math.ceil(i.url.length * per); const tap2 = tDone + 4; const load0 = tap2 + 3;
  const loading = f >= load0; const prog = interpolate(f, [load0, hand], [0.08, 1], {...clamp, easing: Easing.out(Easing.quad)});
  const fade = interpolate(f, [hand, hand + 6], [1, 0], clamp);
  if (fade <= 0) return null;
  const focused = f >= tap1 && !loading;
  const ripple = (at: number, x: number, y: number) => f >= at && f < at + 12 ? (
    <div style={{position: 'absolute', left: x - 60, top: y - 60, width: 120, height: 120, borderRadius: 60, background: 'rgba(255,255,255,.35)',
      transform: `scale(${interpolate(f - at, [0, 12], [0.4, 1.3])})`, opacity: interpolate(f - at, [0, 12], [1, 0])}} />) : null;
  const caret = focused && Math.floor(f / 8) % 2 === 0;
  return (
    <div style={{position: 'absolute', left: PHONE.bez, top: PHONE.bez, width: PHONE.sw, height: PHONE.sh, borderRadius: PHONE.r - PHONE.bez, overflow: 'hidden', opacity: fade}}>
      <div style={{width: 1080, height: H, transform: `scale(${k})`, transformOrigin: '0 0', background: '#202124', fontFamily: UI, position: 'relative'}}>
        <div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 250, background: BAR}}>
          {/* status bar */}
          <div style={{position: 'absolute', left: 48, top: 38, fontSize: 40, fontWeight: 500, color: '#fff'}}>{i.time ?? '1:56'}</div>
          <div style={{position: 'absolute', right: 66, top: 46, display: 'flex', gap: 12, alignItems: 'flex-end'}}>
            {[14, 20, 26, 32].map((h, j) => <div key={j} style={{width: 7, height: h, background: '#fff', borderRadius: 1}} />)}
            <div style={{marginLeft: 14, width: 62, height: 30, border: '3px solid #fff', borderRadius: 8, boxSizing: 'border-box', fontSize: 22, fontWeight: 700, color: '#fff', textAlign: 'center', lineHeight: '24px'}}>24</div>
          </div>
          {/* toolbar */}
          <svg style={{position: 'absolute', left: 44, top: 150}} width="48" height="50" viewBox="0 0 24 25" fill="none" stroke={INK} strokeWidth={2.4} strokeLinejoin="round"><path d="M3 11 L12 3 L21 11 V22 H15 V15 H9 V22 H3 Z" /></svg>
          <div style={{position: 'absolute', left: 132, top: 120, width: focused ? 900 : 540, height: 110, borderRadius: 55, background: PILL, display: 'flex', alignItems: 'center', paddingLeft: 24, boxSizing: 'border-box',
            boxShadow: focused ? `inset 0 0 0 3px #8AB4F8` : undefined}}>
            <span style={{fontSize: 46, color: typed ? INK : '#A39791', whiteSpace: 'nowrap'}}>{typed ? i.url.slice(0, typed) : (i.placeholder ?? 'Qidiring yoki URL kiriting')}</span>
            {caret && <span style={{width: 4, height: 52, background: '#8AB4F8', marginLeft: 3}} />}
          </div>
          {!focused && <>
            <div style={{position: 'absolute', left: 722, top: 132, fontSize: 80, lineHeight: '80px', color: INK, fontWeight: 300}}>+</div>
            <div style={{position: 'absolute', left: 856, top: 152, width: 50, height: 50, border: `4px solid ${INK}`, borderRadius: 10, boxSizing: 'border-box', fontSize: 24, fontWeight: 700, color: INK, textAlign: 'center', lineHeight: '42px'}}>{i.tabs ?? 38}</div>
            <div style={{position: 'absolute', left: 1006, top: 150, display: 'flex', flexDirection: 'column', gap: 8}}>{[0, 1, 2].map((j) => <div key={j} style={{width: 12, height: 12, borderRadius: 6, background: INK}} />)}</div>
          </>}
          {loading && <div style={{position: 'absolute', left: 0, bottom: 0, height: 8, width: 1080 * prog, background: '#8AB4F8'}} />}
        </div>
        {/* suggestion row while typing */}
        {typed > 3 && !loading && (
          <div style={{position: 'absolute', left: 0, top: 250, width: 1080, height: 150, display: 'flex', alignItems: 'center', gap: 36, paddingLeft: 52, boxSizing: 'border-box', background: f >= tap2 ? '#3A3B3F' : 'transparent'}}>
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#C4C7C5" strokeWidth={1.8}><circle cx="12" cy="12" r="9.5" /><path d="M2.5 12h19M12 2.5c3 3 3 16 0 19M12 2.5c-3 3-3 16 0 19" /></svg>
            <div><div style={{fontSize: 46, color: '#E8EAED'}}>{i.url}</div><div style={{fontSize: 32, color: '#9AA0A6', marginTop: 4}}>https://{i.url}</div></div>
          </div>
        )}
        {loading && <div style={{position: 'absolute', left: 0, top: 250, width: 1080, height: H - 250, background: '#161412'}} />}
        {ripple(tap1, 420, 175)}
        {ripple(tap2, 420, 325)}
      </div>
    </div>
  );
};

const Body: React.FC = () => {
  const {sw, sh, bez, r} = PHONE; const W = PHONE_W; const H = PHONE_H; const ri = r - bez;
  const rr = (x: number, y: number, w: number, h: number, q: number) => `M${x + q},${y} H${x + w - q} A${q},${q} 0 0 1 ${x + w},${y + q} V${y + h - q} A${q},${q} 0 0 1 ${x + w - q},${y + h} H${x + q} A${q},${q} 0 0 1 ${x},${y + h - q} V${y + q} A${q},${q} 0 0 1 ${x + q},${y} Z`;
  return (
    <svg width={W + 20} height={H} viewBox={`-10 0 ${W + 20} ${H}`} style={{position: 'absolute', left: -10, top: 0, overflow: 'visible'}}>
      {/* side buttons */}
      <rect x={-6} y={300} width={8} height={70} rx={3} fill="#D9D9DE" />
      <rect x={-6} y={400} width={8} height={120} rx={3} fill="#D9D9DE" />
      <rect x={-6} y={540} width={8} height={120} rx={3} fill="#D9D9DE" />
      <rect x={W - 2} y={430} width={8} height={170} rx={3} fill="#D9D9DE" />
      {/* frame with screen hole */}
      <path d={rr(0, 0, W, H, r) + ' ' + rr(bez, bez, sw, sh, ri)} fill="#F4F4F6" fillRule="evenodd" />
      <path d={rr(0.75, 0.75, W - 1.5, H - 1.5, r)} fill="none" stroke="#C9C9D0" strokeWidth={1.5} />
      <path d={rr(bez - 1, bez - 1, sw + 2, sh + 2, ri + 1)} fill="none" stroke="#111" strokeWidth={2} />
    </svg>
  );
};

const Globe: React.FC<{size: number}> = ({size}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#7A1F1F" strokeWidth={2} strokeLinecap="round">
    <circle cx="12" cy="12" r="9.5" /><path d="M2.5 12h19M12 2.5c3 3 3 16 0 19M12 2.5c-3 3-3 16 0 19" />
  </svg>
);

export const PhoneMockReel: React.FC<PhoneMockProps> = (p) => {
  const f = useCurrentFrame(); const {fps, durationInFrames} = useVideoConfig();
  if (p.layer === 'bg') {
    const z = interpolate(f, [0, durationInFrames], [1.04, 1.12]);
    return (
      <AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
        <Img src={staticFile(p.bg)} style={{width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${z})`}} />
      </AbsoluteFill>
    );
  }
  const o = p.outro; const oa = o ? Math.round(o.at * fps) : 1e9;
  const pop = f >= oa ? spring({frame: f - oa, fps, config: {damping: 11, stiffness: 200, mass: 0.7}}) : 0;
  return (
    <AbsoluteFill style={{background: 'transparent'}}>
      {p.header && (
        <div style={{position: 'absolute', left: 0, right: 0, top: 62, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 14,
          opacity: interpolate(f, [8, 20], [0, 1], clamp)}}>
          <svg width="46" height="46" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2.2} strokeLinecap="round"><circle cx="12" cy="12" r="9.5" /><path d="M2.5 12h19M12 2.5c3 3 3 16 0 19M12 2.5c-3 3-3 16 0 19" /></svg>
          <span style={{fontFamily: FONT, fontWeight: 800, fontSize: 46, color: '#fff', letterSpacing: '0.02em', WebkitTextStroke: '5px #1a1210', paintOrder: 'stroke fill'}}>{p.header}</span>
        </div>
      )}
      <div style={{position: 'absolute', left: PHONE_X, top: PHONE_Y + phoneOffset(f), width: PHONE_W, height: PHONE_H}}>
        {p.intro && <BrowserIntro i={p.intro} f={f} fps={fps} />}
        <Body />
      </div>
      {o && pop > 0 && (
        <div style={{position: 'absolute', left: 0, right: 0, top: 1280, display: 'flex', justifyContent: 'center', opacity: Math.min(1, pop * 2)}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 18, background: '#FFFFFF', border: '3px solid #7A1F1F', borderRadius: 999, padding: '22px 40px',
            transform: `scale(${interpolate(pop, [0, 1], [0.5, 1])}) translateY(${interpolate(f - oa, [0, 12], [30, 0], {...clamp, easing: Easing.out(Easing.cubic)})}px)`}}>
            {o.icon ? <Img src={staticFile(o.icon)} style={{width: 64, height: 64}} /> : <Globe size={60} />}
            <span style={{fontFamily: FONT, fontWeight: 800, fontSize: 54, color: '#2A1A14', letterSpacing: '0.01em'}}>{o.text}</span>
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};

export const phoneMockDuration = (p: PhoneMockProps, fps: number) => Math.round(p.end * fps);
