"""Finish an approved video and encode the lightweight website intro.

Usage: py -3 scripts/prepare_intro.py path/to/approved.mp4
Requires opencv-python, numpy, Pillow, and imageio-ffmpeg.
"""
import math
import sys
from pathlib import Path
import cv2
import imageio_ffmpeg
import numpy as np
from PIL import Image

root = Path(__file__).resolve().parents[1]
source = Path(sys.argv[1])
out = root / 'public' / 'media'
out.mkdir(parents=True, exist_ok=True)
cap = cv2.VideoCapture(str(source))
if not cap.isOpened():
    raise RuntimeError(f'Cannot open {source}')
fps = cap.get(cv2.CAP_PROP_FPS)
w, h = 1280, 720
writer = imageio_ffmpeg.write_frames(str(out/'voe-intro.mp4'), (w,h), fps=fps,
    codec='libx264', macro_block_size=1, pix_fmt_out='yuv420p',
    output_params=['-crf','22','-preset','slow','-movflags','+faststart'])
writer.send(None)
yy,xx=np.mgrid[:h,:w].astype(np.float32)
def smooth(x):
    x=np.clip(x,0,1)
    return x*x*(3-2*x)
i=0
while True:
    ok,bgr=cap.read()
    if not ok: break
    t=i/fps
    frame=cv2.resize(cv2.cvtColor(bgr,cv2.COLOR_BGR2RGB),(w,h),interpolation=cv2.INTER_AREA)
    # A controlled macro push, pullback and final approach complement the 3D camera.
    zoom=1+.10*(1-smooth(t/1.8))+.08*smooth((t-4.4)/1.9)
    transform=cv2.getRotationMatrix2D((w/2,h/2),0,zoom)
    frame=cv2.warpAffine(frame,transform,(w,h),flags=cv2.INTER_CUBIC).astype(np.float32)
    # Soft diagonal light pass during the reveal, with no full-screen flash.
    sweep=math.exp(-((t-4.72)/.33)**2)
    line=xx-(w*.20+(t-4.2)*w*.70)+yy*.28
    light=np.exp(-(line/65)**2)*sweep*.045
    frame+=light[...,None]*np.array([255,212,140])
    frame=np.clip(frame,0,255).astype(np.uint8)
    if i==165: Image.fromarray(frame).save(out/'voe-intro-poster.webp',quality=85)
    writer.send(frame)
    i+=1
writer.close()
cap.release()
print(f'Encoded {i} frames: {out / "voe-intro.mp4"}')
