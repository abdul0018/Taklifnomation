"""Original viral-reel sound effects, synthesized from scratch (no samples, no third-party audio).
usage: python3 -I viral_sfx.py <out_dir>
Modelled on the sound *types* that dominate TikTok/Instagram tier lists, rankings and reveals:
  whoosh.wav   airy swoosh, band-passed noise sweeping up with a stereo pan (cards fly in)
  pop.wav      bubble pop: fast pitch drop + tiny click (any card / flip)
  wrong.wav    double "eh-eh" quiz buzzer, warm square waves (bad pick)
  correct.wav  bright two-note "correct answer" chime, C6 -> E6 (good pick)
  boom.wav     deep cinematic bass boom with saturated sub, pitch dive + long tail (the best pick / punchline)
  sparkle.wav  glittery magic shimmer, random high bell blips (sits on top of the boom)
"""
import sys, os, wave
import numpy as np
from scipy.signal import butter, sosfilt

SR = 48000
rng = np.random.default_rng(21)
T = lambda d: np.arange(int(d * SR)) / SR


def bp(x, lo, hi, o=2):
    return sosfilt(butter(o, [lo / (SR / 2), hi / (SR / 2)], 'band', output='sos'), x)


def lp(x, f, o=2):
    return sosfilt(butter(o, f / (SR / 2), 'low', output='sos'), x)


def save(name, L, R=None, peak_db=-1.0):
    R = L if R is None else R
    st = np.stack([L, R], 1); st = st / (np.abs(st).max() + 1e-9) * 10 ** (peak_db / 20)
    with wave.open(os.path.join(OUT, name), 'wb') as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((st * 32767).astype(np.int16).tobytes())


def whoosh(d=0.42):
    t = T(d); n = rng.standard_normal(len(t)); out = np.zeros(len(t)); blk = 256
    for i in range(0, len(t), blk):  # time-varying band-pass sweeping 350 -> 5000 Hz
        c = 350 * (5000 / 350) ** (i / len(t)); seg = bp(n[max(0, i - 2048):i + blk], c * 0.6, min(c * 1.6, 20000))
        out[i:i + blk] = seg[-len(out[i:i + blk]):]
    env = np.sin(np.pi * np.clip(t / d, 0, 1)) ** 1.6
    x = out * env; pan = np.clip(t / d, 0, 1)
    return x * (1 - pan * 0.7), x * (0.3 + pan * 0.7)


def pop(d=0.14):
    t = T(d); f = 300 + 900 * np.exp(-t / 0.012)
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.035)
    x += 0.5 * bp(rng.standard_normal(len(t)), 2000, 9000) * np.exp(-t / 0.002)
    return x, x


def wrong(d=0.62):
    t = T(d); x = np.zeros(len(t))
    for st, ln in ((0.0, 0.2), (0.27, 0.32)):
        m = (t >= st) & (t < st + ln); tt = t[m] - st
        f = 155 * (1 + 0.012 * np.sin(2 * np.pi * 9 * tt))
        ph = 2 * np.pi * np.cumsum(f) / SR
        sq = np.sign(np.sin(ph)) * 0.6 + np.sign(np.sin(ph * 1.5)) * 0.25 + np.sin(ph * 0.5) * 0.3
        env = np.minimum(1, tt / 0.01) * np.minimum(1, (ln - tt) / 0.04)
        x[m] = lp(sq, 2600) * env
    return x, x


def chime(f, d, a=1.0):
    t = T(d); e = np.exp(-t / 0.22) * np.minimum(1, t / 0.003)
    return a * e * (np.sin(2 * np.pi * f * t) + 0.35 * np.sin(2 * np.pi * 2 * f * t) + 0.12 * np.sin(2 * np.pi * 3.01 * f * t))


def correct(d=0.7):
    t = T(d); x = np.zeros(len(t)); a = chime(1046.5, d); b = chime(1318.5, d - 0.11)
    x += a; i = int(0.11 * SR); x[i:i + len(b)] += b
    return x * 0.9, x


def boom(d=1.6):
    t = T(d); f = 38 + 85 * np.exp(-t / 0.06)
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.55)
    x = np.tanh(2.6 * x) / np.tanh(2.6)                      # saturated sub = phone-speaker audible harmonics
    x += 0.35 * lp(rng.standard_normal(len(t)), 900) * np.exp(-t / 0.05)  # thump body
    x += 0.25 * bp(rng.standard_normal(len(t)), 1500, 8000) * np.exp(-t / 0.004)  # transient
    return x, x


def sparkle(d=1.1):
    t = T(d); L = np.zeros(len(t)); R = np.zeros(len(t))
    for k in range(16):
        at = 0.02 + k * 0.055 + rng.uniform(0, 0.02); f = rng.uniform(3200, 7600); tt = T(0.25)
        s = np.sin(2 * np.pi * f * tt) * np.exp(-tt / 0.05) * (1 - k / 18); i = int(at * SR); p = rng.uniform(0, 1)
        L[i:i + len(s)] += s[:len(L) - i] * (1 - p); R[i:i + len(s)] += s[:len(R) - i] * p
    return L, R


if __name__ == '__main__':
    OUT = sys.argv[1] if len(sys.argv) > 1 else '.'; os.makedirs(OUT, exist_ok=True)
    for name, fn, pk in (('whoosh', whoosh, -2), ('pop', pop, -1), ('wrong', wrong, -2), ('correct', correct, -1.5), ('boom', boom, -0.5), ('sparkle', sparkle, -3)):
        save(name + '.wav', *fn(), peak_db=pk)
    print('wrote whoosh, pop, wrong, correct, boom, sparkle to', OUT)
