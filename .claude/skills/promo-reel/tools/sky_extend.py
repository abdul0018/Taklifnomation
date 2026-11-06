"""Extend an illustration's sky upward so a reel can tilt up into open sky (no generative fill, no upscale of detail).
usage: python3 -I sky_extend.py <art.png> <out_sky.png> [height=1700]
Per column it averages the art's top rows, then blends upward toward a slightly deeper zenith tone with a smooth curve,
adds fine low-amplitude painterly grain, and matches the art's width so the two stack seamlessly (sky on top, art below).
"""
import sys
import numpy as np
from PIL import Image
from scipy.ndimage import gaussian_filter

art = np.asarray(Image.open(sys.argv[1]).convert('RGB')).astype(float)
H = int(sys.argv[3]) if len(sys.argv) > 3 else 1700
W = art.shape[1]
top = gaussian_filter(art[:12].mean(0), (24, 0))               # (W,3) smoothed edge colour
zen = top.mean(0) * np.array([0.9, 0.93, 0.96])                 # deeper toward the zenith
t = (np.linspace(1, 0, H) ** 1.6)[:, None, None]                # 1 at the very top, 0 at the seam
img = top[None] * (1 - t) + zen[None, None] * t
rng = np.random.default_rng(5)
grain = gaussian_filter(rng.standard_normal((H, W)), 2.2) * 2.2  # soft brush grain
img += grain[..., None]
Image.fromarray(np.clip(img, 0, 255).astype(np.uint8)).save(sys.argv[2])
print('wrote', sys.argv[2], W, H)
