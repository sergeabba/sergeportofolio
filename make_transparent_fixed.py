import sys
from PIL import Image
import numpy as np

try:
    # --- Light logo ---
    img = Image.open('d:/portofolio/public/logo-light.jpg').convert('RGBA')
    data = np.array(img)
    white_mask = (data[:,:,0] > 200) & (data[:,:,1] > 200) & (data[:,:,2] > 200)
    data[white_mask, 3] = 0
    gray_mask = (data[:,:,0] > 140) & (data[:,:,1] > 140) & (data[:,:,2] > 140) & ~white_mask
    brightness = (data[gray_mask,0].astype(int) + data[gray_mask,1].astype(int) + data[gray_mask,2].astype(int)) / 3
    data[gray_mask, 3] = (255 - brightness).clip(0, 255).astype(np.uint8)
    data[gray_mask, 0] = 0
    data[gray_mask, 1] = 0
    data[gray_mask, 2] = 0
    
    # Find bounding box based on alpha
    alpha_mask = data[:,:,3] > 0
    rows = np.any(alpha_mask, axis=1)
    cols = np.any(alpha_mask, axis=0)
    rmin, rmax = np.where(rows)[0][[0, -1]]
    cmin, cmax = np.where(cols)[0][[0, -1]]
    
    result = Image.fromarray(data).crop((cmin, rmin, cmax+1, rmax+1))
    
    # Optional padding to make them identical aspect ratio (e.g., width 432, height 288)
    w, h = result.size
    print(f'Light cropped size: {w}x{h}')
    
    # We will pad both to 440x300
    target_w, target_h = 440, 300
    padded = Image.new('RGBA', (target_w, target_h), (0, 0, 0, 0))
    padded.paste(result, ((target_w - w) // 2, (target_h - h) // 2))
    padded.save('d:/portofolio/public/logo-light-transparent.png', 'PNG')
    print('Light logo saved')

    # --- Dark logo ---
    img2 = Image.open('d:/portofolio/public/logo-dark.png').convert('RGBA')
    data2 = np.array(img2)
    # The dark logo has some dark noise. 
    # Black pixels (R<150, G<150, B<150) become transparent to remove the noise circle
    black_mask = (data2[:,:,0] < 150) & (data2[:,:,1] < 150) & (data2[:,:,2] < 150)
    data2[black_mask, 3] = 0
    
    # Dark anti-alias: for near-black pixels
    dark_mask = (data2[:,:,0] < 180) & (data2[:,:,1] < 180) & (data2[:,:,2] < 180) & ~black_mask
    brightness2 = (data2[dark_mask,0].astype(int) + data2[dark_mask,1].astype(int) + data2[dark_mask,2].astype(int)) / 3
    data2[dark_mask, 3] = brightness2.clip(0, 255).astype(np.uint8)
    data2[dark_mask, 0] = 255
    data2[dark_mask, 1] = 255
    data2[dark_mask, 2] = 255
    
    # Find bounding box based on alpha > 50 (to ignore faint noise)
    alpha_mask2 = data2[:,:,3] > 50
    rows2 = np.any(alpha_mask2, axis=1)
    cols2 = np.any(alpha_mask2, axis=0)
    rmin2, rmax2 = np.where(rows2)[0][[0, -1]]
    cmin2, cmax2 = np.where(cols2)[0][[0, -1]]
    
    result2 = Image.fromarray(data2).crop((cmin2, rmin2, cmax2+1, rmax2+1))
    
    w2, h2 = result2.size
    print(f'Dark cropped size: {w2}x{h2}')
    
    padded2 = Image.new('RGBA', (target_w, target_h), (0, 0, 0, 0))
    padded2.paste(result2, ((target_w - w2) // 2, (target_h - h2) // 2))
    
    padded2.save('d:/portofolio/public/logo-dark-transparent.png', 'PNG')
    print('Dark logo saved')
except Exception as e:
    print(f"Error: {e}")
