import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import '@fontsource/montserrat/800.css';
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

export type PhoneMockProps = {layer: 'bg' | 'fg'; bg: string; end: number; outro?: {at: number; text: string; icon?: string}};

const FONT = "'Montserrat', 'Arial', sans-serif";

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
      <div style={{position: 'absolute', left: PHONE_X, top: PHONE_Y + phoneOffset(f), width: PHONE_W, height: PHONE_H}}><Body /></div>
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
