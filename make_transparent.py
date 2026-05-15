import sys
from PIL import Image
import numpy as np

try:
    # --- Light logo (black LD on white bg) -> black LD on transparent ---
    img = Image.open('d:/portofolio/public/logo-light.jpg').convert('RGBA')
    data = np.array(img)
    # White pixels (R>200, G>200, B>200) become transparent
    white_mask = (data[:,:,0] > 200) & (data[:,:,1] > 200) & (data[:,:,2] > 200)
    data[white_mask, 3] = 0  # Set alpha to 0 for white pixels
    # Anti-alias: for near-white pixels, set partial transparency
    gray_mask = (data[:,:,0] > 140) & (data[:,:,1] > 140) & (data[:,:,2] > 140) & ~white_mask
    brightness = (data[gray_mask,0].astype(int) + data[gray_mask,1].astype(int) + data[gray_mask,2].astype(int)) / 3
    data[gray_mask, 3] = (255 - brightness).clip(0, 255).astype(np.uint8)
    data[gray_mask, 0] = 0
    data[gray_mask, 1] = 0
    data[gray_mask, 2] = 0
    result = Image.fromarray(data)
    result.save('d:/portofolio/public/logo-light-transparent.png', 'PNG')
    print('Light logo saved as transparent PNG')

    # --- Dark logo (white LD on black bg) -> white LD on transparent ---
    img2 = Image.open('d:/portofolio/public/logo-dark.png').convert('RGBA')
    data2 = np.array(img2)
    # Black pixels (R<55, G<55, B<55) become transparent
    black_mask = (data2[:,:,0] < 55) & (data2[:,:,1] < 55) & (data2[:,:,2] < 55)
    data2[black_mask, 3] = 0
    # Anti-alias: for near-black pixels, set partial transparency
    dark_mask = (data2[:,:,0] < 115) & (data2[:,:,1] < 115) & (data2[:,:,2] < 115) & ~black_mask
    brightness2 = (data2[dark_mask,0].astype(int) + data2[dark_mask,1].astype(int) + data2[dark_mask,2].astype(int)) / 3
    data2[dark_mask, 3] = brightness2.clip(0, 255).astype(np.uint8)
    data2[dark_mask, 0] = 255
    data2[dark_mask, 1] = 255
    data2[dark_mask, 2] = 255
    result2 = Image.fromarray(data2)
    result2.save('d:/portofolio/public/logo-dark-transparent.png', 'PNG')
    print('Dark logo saved as transparent PNG')
except Exception as e:
    print(f"Error: {e}")
