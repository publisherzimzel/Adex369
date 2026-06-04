from PIL import Image
import numpy as np
import sys

src = sys.argv[1]
out = sys.argv[2]

img = Image.open(src).convert('RGBA')
data = np.array(img, dtype=np.int16)
r, g, b, a = data[:, :, 0], data[:, :, 1], data[:, :, 2], data[:, :, 3]

max_c = np.maximum.reduce([r, g, b])
min_c = np.minimum.reduce([r, g, b])
chroma = max_c - min_c
neutral = (np.abs(r - g) < 20) & (np.abs(g - b) < 20)

# Black background only (conservative — keeps dark navy rings in logo)
black = max_c < 28
dark_matte = (max_c < 55) & (chroma < 18)
light = neutral & (r > 175) & (g > 175) & (b > 175)

mask = black | dark_matte | light
new_a = np.where(mask, 0, np.maximum(a, 255)).astype(np.uint8)
data = np.clip(data, 0, 255).astype(np.uint8)
data[:, :, 3] = new_a

alpha = data[:, :, 3]
ys, xs = np.where(alpha > 15)
if len(xs):
    pad = 8
    y0, y1 = max(0, ys.min() - pad), min(data.shape[0], ys.max() + pad)
    x0, x1 = max(0, xs.min() - pad), min(data.shape[1], xs.max() + pad)
    data = data[y0:y1, x0:x1]

out_img = Image.fromarray(data)
out_img.save(out, optimize=True)
print('Saved', out_img.size, 'TL alpha', out_img.getpixel((0, 0))[3])
