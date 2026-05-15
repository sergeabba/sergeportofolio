from PIL import Image
import numpy as np

img_light = Image.open('d:/portofolio/public/logo-light.jpg')
img_dark = Image.open('d:/portofolio/public/logo-dark.png')

print(f'Light original: {img_light.size}')
print(f'Dark original: {img_dark.size}')

def get_bbox(img_path, is_light):
    img = Image.open(img_path).convert('RGBA')
    data = np.array(img)
    if is_light:
        mask = (data[:,:,0] < 200) | (data[:,:,1] < 200) | (data[:,:,2] < 200)
    else:
        mask = (data[:,:,0] > 55) | (data[:,:,1] > 55) | (data[:,:,2] > 55)
    rows = np.any(mask, axis=1)
    cols = np.any(mask, axis=0)
    rmin, rmax = np.where(rows)[0][[0, -1]]
    cmin, cmax = np.where(cols)[0][[0, -1]]
    return cmin, rmin, cmax, rmax

bbox_light = get_bbox('d:/portofolio/public/logo-light.jpg', True)
bbox_dark = get_bbox('d:/portofolio/public/logo-dark.png', False)
print(f'Light bbox: {bbox_light} (w={bbox_light[2]-bbox_light[0]}, h={bbox_light[3]-bbox_light[1]})')
print(f'Dark bbox: {bbox_dark} (w={bbox_dark[2]-bbox_dark[0]}, h={bbox_dark[3]-bbox_dark[1]})')
