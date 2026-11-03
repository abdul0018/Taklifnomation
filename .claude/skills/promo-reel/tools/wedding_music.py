"""Original soft wedding waltz (3/4), synthesized — no samples. For e-invitation reels.
usage: python3 -I wedding_music.py <out.wav> <seconds> [bpm=84]
Felt-piano arpeggios (I–vi–IV–V in D, then I–iii–IV–V), a gentle top melody, a warm string pad, light room reverb,
fade in/out. Peaks ≈ −3 dBFS; loudness ≈ −18 LUFS (leave headroom; no limiter).
"""
import sys, wave
import numpy as np
from scipy.signal import butter, sosfilt, fftconvolve

SR = 48000
out, dur = sys.argv[1], float(sys.argv[2])
bpm = float(sys.argv[3]) if len(sys.argv) > 3 else 84.0
beat = 60 / bpm; bar = 3 * beat
N = int((dur + 2.5) * SR)
L = np.zeros(N); R = np.zeros(N)
rng = np.random.default_rng(11)
hz = lambda m: 440 * 2 ** ((m - 69) / 12)


def piano(m, d, v):
    t = np.arange(int(d * SR)) / SR; f = hz(m)
    env = np.exp(-t / (0.9 + 0.6 * (60 / m))) * np.minimum(1, t / 0.004)
    x = sum(a * np.sin(2 * np.pi * f * k * (1 + 0.0004 * k * k) * t) * np.exp(-t * k * 0.9) for k, a in ((1, 1), (2, .45), (3, .18), (4, .08), (5, .04)))
    x = x * env * v
    return sosfilt(butter(2, 3800 / (SR / 2), 'low', output='sos'), x)  # felt: soft top


def place(x, at, pan=0.0):
    i = int(at * SR); x = x[: N - i]
    L[i:i + len(x)] += x * (1 - pan) ** 0.5; R[i:i + len(x)] += x * (1 + pan) ** 0.5


prog = [[62, 66, 69], [59, 62, 66], [55, 59, 62], [57, 61, 64], [62, 66, 69], [54, 57, 61], [55, 59, 62], [57, 61, 64]]
mel = [[78, 76, 74], [74, 73, 71], [71, 74, 76], [76, 73, 69], [78, 81, 78], [76, 73, 73], [74, 71, 74], [73, 76, 73]]
nb = int(dur / bar) + 1
for b in range(nb):
    t0 = b * bar; ch = prog[b % 8]
    place(piano(ch[0] - 12, bar * 1.6, .55), t0, -0.25)                      # bass on 1
    for k, n in enumerate([ch[1], ch[2], ch[1] + 12, ch[2], ch[1] + 12, ch[2]]):
        place(piano(n, beat * 2.2, .22), t0 + k * beat / 2, 0.15 if k % 2 else -0.1)  # broken chord in 8ths
    if b >= 2:                                                             # melody enters after the intro
        for k, n in enumerate(mel[b % 8]):
            place(piano(n, beat * 2.5, .26), t0 + k * beat, 0.05)
    # string pad
    t = np.arange(int(bar * 1.05 * SR)) / SR
    pad = sum(np.sin(2 * np.pi * hz(n) * t + rng.uniform(0, 6)) + .5 * np.sin(2 * np.pi * hz(n) * 1.003 * t) for n in ch)
    pad *= np.minimum(1, t / 0.5) * np.minimum(1, (t[-1] - t) / 0.5) * 0.035
    place(pad, t0)

ir_t = np.arange(int(2.2 * SR)) / SR
ir = rng.standard_normal(len(ir_t)) * np.exp(-ir_t / 0.55); ir = sosfilt(butter(2, 5000 / (SR / 2), 'low', output='sos'), ir); ir /= np.abs(ir).sum() / 6
L = L + 0.35 * fftconvolve(L, ir)[:N]; R = R + 0.35 * fftconvolve(R, ir[::-1] * 0 + ir)[:N]
n = int(dur * SR); st = np.stack([L[:n], R[:n]], 1)
fade = np.ones(n); fi = int(0.8 * SR); fo = int(2.0 * SR)
fade[:fi] = np.linspace(0, 1, fi); fade[-fo:] = np.linspace(1, 0, fo)
st *= fade[:, None]; st /= np.abs(st).max() / 10 ** (-3 / 20)
with wave.open(out, 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((st * 32767).astype(np.int16).tobytes())
print('wrote', out, f'{dur:.1f}s @ {bpm} bpm')
