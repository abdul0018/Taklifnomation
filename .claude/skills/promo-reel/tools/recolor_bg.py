"""Turn the yellow/gold/brown background purple by rotating chroma only (Y plane untouched => no detail loss).
usage: python3 -I purplebg.py <in.mp4> <out.mkv> [preview_frames,comma-sep] [preview_dir]
Kept as-is: emoji (fixed circles), yellow caption fill (bright yellow next to black stroke), Preppy (red outline + flame zone)."""
import sys, subprocess, numpy as np
from scipy.ndimage import binary_dilation, gaussian_filter
src, dst = sys.argv[1], sys.argv[2]
pv = [int(x) for x in sys.argv[3].split(',')] if len(sys.argv) > 3 else []; pdir = sys.argv[4] if len(sys.argv) > 4 else '.'
pr = subprocess.run(['ffprobe', '-v', 'error', '-select_streams', 'v', '-show_entries', 'stream=width,height', '-of', 'csv=p=0', src], capture_output=True, text=True).stdout.split(',')
W, H = int(pr[0]), int(pr[1]); w2, h2 = W // 2, H // 2
yy, xx = np.mgrid[0:h2, 0:w2]
emoji = np.zeros((h2, w2), bool)
for cx in (240, 357, 475):
    emoji |= (xx - cx / 2) ** 2 + (yy - 180 / 2) ** 2 < (58 / 2) ** 2
def uv_of(r, g, b):
    r, g, b = r / 255, g / 255, b / 255; y = 0.2126 * r + 0.7152 * g + 0.0722 * b
    return 224 * (b - y) / 1.8556, 224 * (r - y) / 1.5748
uy, vy = uv_of(205, 160, 15); A_Y = np.arctan2(vy, uy)          # gold plate
up, vp = uv_of(150, 70, 210); A_P = np.arctan2(vp, up)          # target purple
dec = subprocess.Popen(['ffmpeg', '-v', 'error', '-i', src, '-f', 'rawvideo', '-pix_fmt', 'yuv420p', '-'], stdout=subprocess.PIPE)
enc = subprocess.Popen(['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'yuv420p', '-s', f'{W}x{H}', '-r', '30', '-i', '-',
                        '-c:v', 'libx264', '-qp', '0', '-preset', 'veryfast', '-color_primaries', 'bt709', '-color_trc', 'bt709', '-colorspace', 'bt709', dst], stdin=subprocess.PIPE)
fs = W * H * 3 // 2; n = 0
while True:
    buf = dec.stdout.read(fs)
    if len(buf) < fs: break
    f = np.frombuffer(buf, np.uint8).copy()
    Y = f[:W * H].reshape(H, W); U = f[W * H:W * H + w2 * h2].reshape(h2, w2); V = f[W * H + w2 * h2:].reshape(h2, w2)
    ys = Y[::2, ::2].astype(np.float32); u = U.astype(np.float32) - 128; v = V.astype(np.float32) - 128
    mag = np.hypot(u, v); ang = np.arctan2(v, u)
    d = (ang - A_Y + np.pi) % (2 * np.pi) - np.pi                 # angle from gold
    warm = np.clip((mag - 8) / 6, 0, 1) * np.clip((1.05 - np.abs(d + 0.25)) / 0.25, 0, 1)   # gold..orange/brown, not red
    black = ys < 40
    nearblack = binary_dilation(black, iterations=5)
    capy = nearblack & (ys > 175) & (mag > 25)                    # bright yellow caption fill beside its black stroke
    capy = binary_dilation(capy, iterations=2)
    red = (np.abs((ang - uv_ang_red + np.pi) % (2 * np.pi) - np.pi) < 0.35) & (mag > 40) & (ys > 60) if (uv_ang_red := np.arctan2(*uv_of(230, 30, 40)[::-1])) else None
    preppy = binary_dilation(red & ~binary_dilation(black, iterations=5), iterations=14)
    redish = (np.abs((ang - uv_ang_red + np.pi) % (2 * np.pi) - np.pi) < 0.6) & (mag > 25)
    capr = binary_dilation(redish & nearblack, iterations=2)   # red caption words beside their black stroke
    keep = emoji | capy | preppy | capr
    m = gaussian_filter(warm * (~keep), 1.2)
    na = A_P + d * 0.5; nm = mag * 0.82
    U[:] = np.clip(128 + u * (1 - m) + m * nm * np.cos(na), 0, 255).astype(np.uint8)
    V[:] = np.clip(128 + v * (1 - m) + m * nm * np.sin(na), 0, 255).astype(np.uint8)
    enc.stdin.write(f.tobytes())
    if n in pv:
        from PIL import Image
        Image.fromarray(np.uint8(m * 255)).save(f'{pdir}/mask_{n}.png')
    n += 1
enc.stdin.close(); enc.wait(); print('frames', n, W, H)
