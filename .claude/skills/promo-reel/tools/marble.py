"""Procedural white marble texture (soft grey clouds + thin veins), no downloads.
usage: python3 -I marble.py <out.png> [width=2160] [height=1920] [seed=4]
Wider than the frame so a two-page reel can pan across one continuous slab.
"""
import sys
import numpy as np
from PIL import Image
from scipy.ndimage import zoom, gaussian_filter

out = sys.argv[1]; W = int(sys.argv[2]) if len(sys.argv) > 2 else 2160; H = int(sys.argv[3]) if len(sys.argv) > 3 else 1920
rng = np.random.default_rng(int(sys.argv[4]) if len(sys.argv) > 4 else 4)


def fbm(oct=6, base=4):
    acc = np.zeros((H, W)); amp = 1.0; tot = 0
    for o in range(oct):
        n = base * 2 ** o; g = rng.standard_normal((n * H // W + 2, n + 2))
        acc += amp * zoom(g, (H / (g.shape[0] - 1), W / (g.shape[1] - 1)), order=3)[:H, :W]; tot += amp; amp *= 0.5
    return acc / tot


y, x = np.mgrid[0:H, 0:W] / max(W, H)
# a few broad, broken grey ribbons (watercolour marble), not a contour map
g = 0.55 * fbm(4, 2) + 0.12 * fbm(3, 6) + 1.1 * (x * 0.8 - y * 0.55)
v = np.abs(np.sin(g * np.pi * 1.25))
width = 0.30 + 0.22 * fbm(3, 3)
ribbon = np.exp(-v / np.clip(width, 0.03, None))
core = np.exp(-v / 0.03) * 0.40
haze = gaussian_filter(ribbon, 18) * 0.35  # soft grey bloom around each vein
mask = np.clip(0.5 + 1.8 * fbm(4, 2), 0, 1)
detail = 0.75 + 0.5 * fbm(5, 12)
veins = (ribbon * 0.30 * detail + core + haze) * mask
clouds = gaussian_filter(np.clip(fbm(4, 2) * 1.2, 0, 1), 10) * 0.10
d = np.clip(veins + clouds, 0, 1)
base = np.array([246, 246, 245.0]); dark = np.array([118, 118, 120.0])
img = base[None, None] * (1 - d[..., None]) + dark[None, None] * d[..., None]
img = gaussian_filter(img, (0.8, 0.8, 0))
Image.fromarray(np.clip(img, 0, 255).astype(np.uint8)).save(out)
print('wrote', out, W, H)
