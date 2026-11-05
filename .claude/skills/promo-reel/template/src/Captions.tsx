import React from 'react';
import {AbsoluteFill, Easing, Img, OffthreadVideo, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import '@fontsource/montserrat/900.css';
import {clamp, src} from './kit';

/**
 * Style K: captions-only edit of an already-cut clip (reference: the "Men tovuqman" Preppy prank).
 * Footage untouched, no shadows/filters: every glyph is white Montserrat 900 with a crisp black stroke.
 * - captions: punchy narration / subtitle lines that pop in (scale spring), **marked** words in yellow, optional Twemoji.
 * - chips: a word chain that builds one chip per spoken word ("MAN + TOE + WOK + MAN"), then lights up chip by chip
 *   when the words are read back together (karaoke), and collapses into a `title` punchline at the same spot.
 */

const FONT = "'Montserrat', 'Arial', sans-serif";
const YELLOW = '#FFD60A';
const STROKE = (w: number): React.CSSProperties => ({WebkitTextStroke: `${w}px #000`, paintOrder: 'stroke fill'});

/** icon: speaker badge drawn before the text (e.g. the real Preppy face for the AI's lines). */
export type Cap = {text: string; start: number; end: number; y?: number; size?: number; emoji?: string; icon?: string; color?: string};
export type Chip = {text: string; at: number; lit?: number};
export type CaptionsProps = {
  video: string; overlayOnly?: boolean; end: number;
  captions: Cap[];
  chips?: {y: number; items: Chip[]; outAt: number};
  title?: {text: string; at: number; y: number; size?: number; emoji?: string; color?: string};
  /** one-word fast captions: hard cut between words (no fade), snappier pop with a tiny tilt, uppercase */
  fast?: boolean;
};
let FAST = false;

const useT = () => { const f = useCurrentFrame(); const {fps} = useVideoConfig(); return {f, fps, s: (x: number) => Math.round(x * fps)}; };

/** "plain **yellow** plain" → spans. */
const Rich: React.FC<{text: string}> = ({text}) => (
  <>{text.split(/(\*\*[^*]+\*\*)/).map((p, i) => p.startsWith('**') ? <span key={i} style={{color: YELLOW}}>{p.slice(2, -2)}</span> : <span key={i}>{p}</span>)}</>
);

const Caption: React.FC<{c: Cap}> = ({c}) => {
  const {f, fps, s} = useT();
  const a = s(c.start); const b = s(c.end);
  if (f < a || f >= b) return null;
  const p = FAST ? spring({frame: f - a, fps, config: {damping: 9, stiffness: 420, mass: 0.45}}) : spring({frame: f - a, fps, config: {damping: 12, stiffness: 240, mass: 0.6}});
  const o = FAST ? 1 : interpolate(f, [b - 4, b], [1, 0], clamp);
  const size = c.size ?? 66;
  return (
    <div style={{position: 'absolute', left: 50, right: 50, top: (c.y ?? 960) - size, display: 'flex', justifyContent: 'center', opacity: o * Math.min(1, p * 2)}}>
      <div style={{fontFamily: FONT, fontWeight: 900, fontSize: size, lineHeight: 1.12, color: c.color ?? '#fff', textAlign: 'center', whiteSpace: 'pre-line',
        letterSpacing: '-0.005em', ...STROKE(size * 0.16), textTransform: FAST ? 'uppercase' : undefined, ...(FAST ? {whiteSpace: 'nowrap'} : {}),
        transform: FAST ? `scale(${interpolate(p, [0, 1], [0.55, 1])}) rotate(${(1 - Math.min(1, p)) * -6}deg)` : `scale(${interpolate(p, [0, 1], [0.72, 1])})`}}>
        {c.icon && <Img src={staticFile(c.icon)} style={{height: size * 1.0, width: 'auto', marginRight: size * 0.22, verticalAlign: '-0.16em'}} />}
        <Rich text={c.text} />
        {c.emoji && <Img src={staticFile(c.emoji)} style={{height: size * 1.05, width: size * 1.05, marginLeft: size * 0.2, verticalAlign: '-0.18em'}} />}
      </div>
    </div>
  );
};

const Chips: React.FC<{y: number; items: Chip[]; outAt: number}> = ({y, items, outAt}) => {
  const {f, fps, s} = useT();
  const out = s(outAt);
  const first = s(items[0].at);
  if (f < first || f >= out + 8) return null;
  const go = interpolate(f, [out, out + 8], [0, 1], {...clamp, easing: Easing.in(Easing.cubic)});
  return (
    <div style={{position: 'absolute', top: y, left: 0, right: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 14,
      opacity: 1 - go, transform: `scale(${1 - 0.35 * go})`}}>
      {items.map((it, i) => {
        const a = s(it.at);
        if (f < a) return null;
        const p = spring({frame: f - a, fps, config: {damping: 10, stiffness: 260, mass: 0.6}});
        const l = it.lit != null && f >= s(it.lit) ? spring({frame: f - s(it.lit), fps, config: {damping: 9, stiffness: 300, mass: 0.5}}) : 0;
        const lit = it.lit != null && f >= s(it.lit);
        return (
          <React.Fragment key={i}>
            {i > 0 && <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 56, color: '#fff', ...STROKE(9), opacity: Math.min(1, p * 2)}}>+</div>}
            <div style={{padding: '10px 22px', borderRadius: 22, background: lit ? YELLOW : '#fff', border: '5px solid #000',
              fontFamily: FONT, fontWeight: 900, fontSize: 60, lineHeight: 1, color: '#000', letterSpacing: '0.01em',
              transform: `scale(${interpolate(p, [0, 1], [0.4, 1]) * (1 + 0.22 * Math.sin(Math.min(1, l) * Math.PI))}) rotate(${(1 - p) * -12}deg)`}}>{it.text}</div>
          </React.Fragment>
        );
      })}
    </div>
  );
};

const Title: React.FC<NonNullable<CaptionsProps['title']>> = (t) => {
  const {f, fps, s} = useT();
  const a = s(t.at);
  if (f < a) return null;
  const p = spring({frame: f - a, fps, config: {damping: 8, stiffness: 220, mass: 0.7}});
  const shake = (f - a) < 14 ? Math.sin((f - a) * 2.2) * 9 * (1 - (f - a) / 14) : 0;
  const size = t.size ?? 84;
  return (
    <div style={{position: 'absolute', top: t.y, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
      <div style={{fontFamily: FONT, fontWeight: 900, fontSize: size, lineHeight: 1, color: t.color ?? YELLOW, ...STROKE(size * 0.17),
        transform: `translateX(${shake}px) scale(${interpolate(p, [0, 1], [1.8, 1])}) rotate(${(1 - p) * 6 - 2}deg)`, opacity: Math.min(1, p * 3), whiteSpace: 'nowrap'}}>
        {t.text}
        {t.emoji && <Img src={staticFile(t.emoji)} style={{height: size * 1.1, width: size * 1.1, marginLeft: size * 0.16, verticalAlign: '-0.2em'}} />}
      </div>
    </div>
  );
};

export const CaptionsReel: React.FC<CaptionsProps> = (p) => { FAST = !!p.fast; return (
  <AbsoluteFill style={{background: p.overlayOnly ? 'transparent' : '#000'}}>
    {!p.overlayOnly && <OffthreadVideo src={src(p.video)} style={{width: '100%', height: '100%', objectFit: 'cover'}} toneMapped={false} />}
    {p.chips && <Chips {...p.chips} />}
    {p.title && <Title {...p.title} />}
    {p.captions.map((c, i) => <Caption key={i} c={c} />)}
  </AbsoluteFill>
); };

export const captionsDuration = (p: CaptionsProps, fps: number) => Math.round(p.end * fps);
