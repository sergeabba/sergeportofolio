from PIL import Image
import numpy as np

def analyze_dark(threshold):
    img = Image.open('d:/portofolio/public/logo-dark.png').convert('RGBA')
    data = np.array(img)
    mask = (data[:,:,0] > threshold) | (data[:,:,1] > threshold) | (data[:,:,2] > threshold)
    rows = np.any(mask, axis=1)
    cols = np.any(mask, axis=0)
    if not np.any(rows):
        return None
    rmin, rmax = np.where(rows)[0][[0, -1]]
    cmin, cmax = np.where(cols)[0][[0, -1]]
    return cmin, rmin, cmax, rmax

print("Dark bbox at different thresholds:")
for t in [55, 100, 150, 200, 240]:
    bbox = analyze_dark(t)
    if bbox:
        print(f"Threshold {t}: {bbox} (w={bbox[2]-bbox[0]}, h={bbox[3]-bbox[1]})")

def analyze_light(threshold):
    img = Image.open('d:/portofolio/public/logo-light.jpg').convert('RGBA')
    data = np.array(img)
    mask = (data[:,:,0] < threshold) | (data[:,:,1] < threshold) | (data[:,:,2] < threshold)
    rows = np.any(mask, axis=1)
    cols = np.any(mask, axis=0)
    if not np.any(rows):
        return None
    rmin, rmax = np.where(rows)[0][[0, -1]]
    cmin, cmax = np.where(cols)[0][[0, -1]]
    return cmin, rmin, cmax, rmax

print("Light bbox at different thresholds:")
for t in [200, 150, 100, 50, 20]:
    bbox = analyze_light(t)
    if bbox:
        print(f"Threshold {t}: {bbox} (w={bbox[2]-bbox[0]}, h={bbox[3]-bbox[1]})")

