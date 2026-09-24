"""Add restrained, staggered metallic glints from 4 seconds onward."""
from pathlib import Path
import math
import cv2
import imageio_ffmpeg
import numpy as np
from PIL import Image

OUT = Path(__file__).parent / 'output'
SOURCE = OUT / 'voe-cinematic-zoom-emblem.mp4'
DEST = OUT / 'voe-cinematic-minimal-sparkles.mp4'
# Start, angle, lifetime, distance outside the rim, peak intensity.
GLINTS = [(4.00, -43, .85, 21, .88), (4.22, 161, .9, 28, .70),
          (4.65, 35, .85, 20, .82), (4.92, -122, 1.0, 25, .70),
          (5.32, 125, .88, 19, .78), (5.59, -26, .70, 23, .85)]

def smooth(x):
    x = np.clip(x, 0, 1)
    return x*x*(3-2*x)

def sparkle(frame, t):
    if t < 4: return frame
    h,w = frame.shape[:2]
    if t <= 4.7:
        distance = 4.9 + (4.35-4.9)*smooth((t-2.9)/1.8)
    else:
        distance = 4.35 + (4.05-4.35)*smooth((t-4.7)/1.6)
    radius = (h/2)/math.tan(math.radians(35)/2)*1.039/distance
    result = frame.astype(np.float32)
    for start,angle,lifetime,offset,power in GLINTS:
        p = (t-start)/lifetime
        if not 0 < p < 1: continue
        strength = math.sin(math.pi*p)**2 * power
        a = math.radians(angle)
        x = int(w/2 + (radius+offset)*math.cos(a))
        y = int(h/2 + (radius+offset)*math.sin(a))
        extent=50
        x0,x1=max(0,x-extent),min(w,x+extent+1)
        y0,y1=max(0,y-extent),min(h,y+extent+1)
        yy,xx=np.mgrid[y0:y1,x0:x1].astype(np.float32)
        dx,dy=xx-x,yy-y
        # Small four-point glints with a fine bright center and soft warm halo.
        core=np.exp(-(dx*dx+dy*dy)/5)
        arms=.48*np.exp(-(dx/15)**2-(dy/.75)**2)+.40*np.exp(-(dx/.75)**2-(dy/19)**2)
        halo=.075*np.exp(-(dx*dx+dy*dy)/220)
        result[y0:y1,x0:x1]+=(core+arms+halo)[...,None]*np.array([255,235,190])*strength
    return np.clip(result,0,255).astype(np.uint8)

cap=cv2.VideoCapture(str(SOURCE))
assert cap.isOpened()
w,h=int(cap.get(3)),int(cap.get(4))
fps=cap.get(cv2.CAP_PROP_FPS)
writer=imageio_ffmpeg.write_frames(str(DEST),(w,h),fps=fps,codec='libx264',quality=9,macro_block_size=1,pix_fmt_out='yuv420p',output_params=['-movflags','+faststart'])
writer.send(None)
previews=[]
i=0
while True:
    ok,bgr=cap.read()
    if not ok: break
    rgb=cv2.cvtColor(bgr,cv2.COLOR_BGR2RGB)
    final=sparkle(rgb,i/fps)
    if i in [132,151,177]: previews.append(Image.fromarray(final))
    writer.send(final)
    i+=1
writer.close();cap.release()
sheet=Image.new('RGB',(960,540*len(previews)))
for i,im in enumerate(previews):
    im.thumbnail((960,540));sheet.paste(im,(0,i*540))
sheet.save(OUT/'sparkles-review.jpg')
print(DEST,flush=True)
