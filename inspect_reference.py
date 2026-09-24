import cv2
from PIL import Image, ImageDraw
cap=cv2.VideoCapture(r'C:\Users\jmohi\OneDrive\Videos\Screen Recordings\Screen Recording 2026-08-20 185820.mp4')
sheet=Image.new('RGB',(1440,810))
for i,t in enumerate([0.3,1.2,2.2,3.2,4.3,5.8]):
 cap.set(cv2.CAP_PROP_POS_MSEC,t*1000)
 ok,f=cap.read()
 if ok:
  im=Image.fromarray(cv2.cvtColor(f,cv2.COLOR_BGR2RGB)); im.thumbnail((480,270)); sheet.paste(im,((i%3)*480,(i//3)*405))
sheet.save(r'E:\VOE_WEBSITE\output\reference-sheet.jpg')
