import math, subprocess, sys
from pathlib import Path
import numpy as np
import cv2
import moderngl
import imageio_ffmpeg
from PIL import Image

OUT=Path(__file__).parent/'output'
SOURCE=r'C:\Users\jmohi\AppData\Local\Temp\codex-clipboard-d32a5904-367b-44ed-97b7-2fc83691fc9e.png'
W,H=1920,1080
ctx=moderngl.create_standalone_context()
fbo=ctx.simple_framebuffer((W,H),components=3); fbo.use()
ctx.enable(moderngl.DEPTH_TEST)
prog=ctx.program(vertex_shader='''#version 330
in vec3 pos; in vec3 normal; in vec2 uv;
uniform mat4 model; uniform mat4 projection;
out vec3 p; out vec3 n; out vec2 tex;
void main(){vec4 w=model*vec4(pos,1);p=w.xyz;n=mat3(model)*normal;tex=uv;gl_Position=projection*w;}
''',fragment_shader='''#version 330
uniform sampler2D artwork; uniform vec3 eye; uniform float clock;
in vec3 p; in vec3 n; in vec2 tex; out vec4 color;
void main(){
 vec3 N=normalize(n); vec3 V=normalize(eye-p);
 vec3 art=texture(artwork,tex).rgb;
 float lum=dot(art,vec3(.299,.587,.114));
 float face=abs(n.z);
 // The supplied artwork becomes a relief on the gold face.
 float h1=dot(texture(artwork,tex+vec2(.001,0)).rgb,vec3(.299,.587,.114));
 float h2=dot(texture(artwork,tex+vec2(0,.001)).rgb,vec3(.299,.587,.114));
 if(face>.10) N=normalize(N+vec3((lum-h1)*.65,(lum-h2)*.65,0));
 float detail=mix(.06,1.0,smoothstep(.035,.85,lum));
 float faceWeight=step(.001,tex.x)*step(.001,tex.y);
 detail=mix(1.0,detail,faceWeight);
 vec3 gold=vec3(1.0,.72,.32);
 vec3 base=gold*detail;
 vec3 result=base*.09;
 vec3 lights[3]=vec3[3](vec3(-3.2+sin(clock*1.15)*2.0,3.6,1.8),vec3(3.2,cos(clock*.9)*1.8,.8),vec3(-1,-2.5,1.5));
 for(int i=0;i<3;i++){
   vec3 L=normalize(lights[i]-p); vec3 halfV=normalize(L+V);
   float diffuse=max(dot(N,L),0.0);
   float spec=pow(max(dot(N,halfV),0.0),i==0?55.0:90.0);
   result+=base*diffuse*(i==0?.48:.15);
   result+=vec3(1,.85,.51)*spec*(i==0?1.3:.7)*(.06+.94*detail);
 }
 float rim=pow(1-abs(dot(N,V)),3.0);
 result+=gold*rim*.32;
 color=vec4(result,1);
}
''')
im=Image.open(SOURCE).convert('RGB')
# Circular geometry provides the silhouette; no rectangular picture plane exists.
iw,ih=im.size
im=im.crop((0,0,iw,int(ih*.975))).resize((1536,1536),Image.Resampling.LANCZOS)
texture=ctx.texture(im.size,3,im.transpose(Image.Transpose.FLIP_TOP_BOTTOM).tobytes())
texture.build_mipmaps(); texture.use()
prog['artwork']=0

def mesh(ri,ro,thick=.065):
 vertices=[]
 def vertex(r,a,z,n,face):
  x,y=r*math.cos(a),r*math.sin(a)
  return [x,y,z,*n, .5+x/2 if face else 0, .5+y/2 if face else 0]
 def quad(a,b,c,d):
  vertices.extend([a,b,c,a,c,d])
 seg=384; bevel=.009
 # Front and back annular surfaces plus rounded edge bands.
 bands=[(ri+bevel,ro-bevel,thick/2,1),(ri+bevel,ro-bevel,-thick/2,-1)]
 for r0,r1,z,nz in bands:
  for j in range(seg):
   a=j*math.tau/seg;b=(j+1)*math.tau/seg
   quad(vertex(r0,a,z,(0,0,nz),True),vertex(r1,a,z,(0,0,nz),True),vertex(r1,b,z,(0,0,nz),True),vertex(r0,b,z,(0,0,nz),True))
 for radius,sign in [(ro,1),(ri,-1)]:
  if radius==0:continue
  profile=[(radius-sign*bevel,-thick/2),(radius,-thick/2+bevel),(radius,thick/2-bevel),(radius-sign*bevel,thick/2)]
  for k in range(3):
   r0,z0=profile[k];r1,z1=profile[k+1]
   for j in range(seg):
    a=j*math.tau/seg;b=(j+1)*math.tau/seg
    nz=(-.7 if k==0 else .7 if k==2 else 0)
    na=(sign*math.cos(a),sign*math.sin(a),nz);nb=(sign*math.cos(b),sign*math.sin(b),nz)
    quad(vertex(r0,a,z0,na,False),vertex(r1,a,z1,na,False),vertex(r1,b,z1,nb,False),vertex(r0,b,z0,nb,False))
 data=np.array(vertices,dtype='f4')
 return ctx.vertex_array(prog,[(ctx.buffer(data.tobytes()),'3f 3f 2f','pos','normal','uv')])

pieces=[mesh(0,.665),mesh(.669,.964),mesh(.969,1.0),mesh(1.027,1.039,.035)]

def rot(x,y,z):
 x,y,z=np.radians([x,y,z]);cx,sx=np.cos(x),np.sin(x);cy,sy=np.cos(y),np.sin(y);cz,sz=np.cos(z),np.sin(z)
 return np.array([[cz,-sz,0],[sz,cz,0],[0,0,1]])@np.array([[cy,0,sy],[0,1,0],[-sy,0,cy]])@np.array([[1,0,0],[0,cx,-sx],[0,sx,cx]])
def smooth(v):
 v=np.clip(v,0,1);return v*v*(3-2*v)

yy,xx=np.mgrid[0:H,0:W].astype(np.float32)
halo=np.exp(-(((xx-W*.5)/(W*.24))**2+((yy-H*.47)/(H*.43))**2)*2)
background=np.stack([3+halo*17,3+halo*10,4+halo*3],axis=2).astype(np.float32)
rng=np.random.default_rng(42)
dust=rng.random((65,4))

def camera_value(t,keys):
 for i in range(len(keys)-1):
  a,va=keys[i];b,vb=keys[i+1]
  if t<=b:return va+(vb-va)*smooth((t-a)/(b-a))
 return keys[-1][1]

def frame(t):
 fbo.clear(0,0,0,1,depth=1)
 progress=smooth((t-.15)/4.55);remain=1-progress
 # Macro opening, dramatic retreat through the rotating rings, final gentle push.
 distance=camera_value(t,[(0,1.6),(.65,1.9),(1.55,2.6),(2.9,4.9),(4.7,4.35),(6.3,4.05)])
 orbit=rot(12*remain,-18*remain,-19*remain)
 offset_x=camera_value(t,[(0,-.38),(.8,-.16),(2.9,0)])
 offset_y=camera_value(t,[(0,-.22),(1.2,.08),(2.9,0)])
 f=1/math.tan(math.radians(35)/2);near=.1;far=30
 projection=np.array([[f/(W/H),0,0,0],[0,f,0,0],[0,0,(far+near)/(near-far),2*far*near/(near-far)],[0,0,-1,0]],dtype='f4')
 prog['projection'].write(projection.T.tobytes());prog['eye'].value=(0,0,0);prog['clock']=t
 angles=[(18*remain,300*remain,-13*remain),(-72*remain,-410*remain,22*remain),(50*remain,500*remain,0),(-40*remain,-290*remain,-20*remain)]
 for m,ang in zip(pieces,angles):
  model=np.eye(4,dtype='f4'); model[:3,:3]=orbit@rot(*ang);model[2,3]=-distance
  model[0,3]=offset_x;model[1,3]=offset_y
  prog['model'].write(model.T.tobytes());m.render()
 raw=np.frombuffer(fbo.read(components=3,alignment=1),np.uint8).reshape(H,W,3)[::-1].astype(np.float32)
 mask=(raw.max(axis=2)>0)[...,None]
 atmosphere=background.copy()
 for dx,dy,speed,phase in dust:
  px=int((dx*W+math.sin(t*.3+phase*6)*35)%W)
  py=int((dy*H-t*(8+speed*15))%H)
  strength=(.4+.6*math.sin(phase*12+t)**2)
  cv2.circle(atmosphere,(px,py),1 if speed<.7 else 2,(65*strength,45*strength,17*strength),-1,cv2.LINE_AA)
 composite=np.where(mask,raw,atmosphere)
 bright=np.maximum(raw-160,0)
 glow=cv2.GaussianBlur(bright,(0,0),9)*.65+cv2.GaussianBlur(bright,(0,0),28)*.35
 composite+=glow
 # Restrained anamorphic highlights sweep around the metal and flare at lock-in.
 pulse=math.exp(-((t-4.65)/.18)**2)
 for fx,fy,power in [(W*(.72-.08*math.sin(t)),H*(.27+.12*math.cos(t)),.28+.15*math.sin(t*2)**2),(W*.5,H*.54,pulse*.85)]:
  streak=np.exp(-((xx-fx)/310)**2-((yy-fy)/2.2)**2)
  core=np.exp(-((xx-fx)/18)**2-((yy-fy)/18)**2)
  haze=np.exp(-((xx-fx)/95)**2-((yy-fy)/62)**2)
  composite+=(streak*.55+core+haze*.12)[...,None]*np.array([230,172,74])*power
 fade=.25+.75*smooth(t/.3)
 composite*=fade
 return np.clip(composite,0,255).astype(np.uint8)

if '--preview' in sys.argv:
 sheet=Image.new('RGB',(1280,1080))
 for i,t in enumerate([.25,1.2,2.2,3.2,4.4,5.7]):
  img=Image.fromarray(frame(t));img.thumbnail((640,360));sheet.paste(img,((i%2)*640,(i//2)*360))
 sheet.save(OUT/'cinematic-preview.jpg')
 print('preview ready',flush=True)
else:
 path=OUT/'voe-cinematic-zoom-emblem.mp4'
 writer=imageio_ffmpeg.write_frames(str(path),(W,H),fps=30,codec='libx264',quality=9,macro_block_size=1,pix_fmt_out='yuv420p',output_params=['-movflags','+faststart'])
 writer.send(None)
 for i in range(189):
  writer.send(frame(i/30))
  if i%30==0:print(f'{i}/189',flush=True)
 writer.close();print(path,flush=True)
