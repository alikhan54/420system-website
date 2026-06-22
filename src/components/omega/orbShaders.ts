/**
 * orbShaders.ts — GLSL for the OMEGA particle sphere, inlined as strings so the
 * component is self-contained (no `?raw` loader / ambient typings needed).
 *
 * Vertex: Fibonacci sphere → optional morph → idle breathing → COHERENT structural
 * surface waves + capped radial turbulence (deforms, never scatters) → world-space
 * mouse gravity → physically-correct point-size attenuation. Also emits a per-particle
 * facing/depth brightness so the field reads as a lit volume, not a flat speckle.
 *
 * Fragment: round soft-glow point, brightened toward the camera-facing core and
 * dimmed at the rim (depth), color-managed output (pairs with convertSRGBToLinear).
 *
 * CORE_*: a soft inner glow sphere (an internal light source) behind the particles.
 */

export const ORB_VERT = /* glsl */ `
uniform float uTime, uSize, uScale, uMorph, uBreath;
uniform float uNoiseAmp, uNoiseFreq, uNoiseSpeed, uWave;
uniform vec3  uMouse;        // world-space point on z=0 plane
uniform float uMouseRadius, uMouseStrength;

attribute vec3  aMorphA;     // shape we are morphing FROM (same point count!)
attribute vec3  aMorphB;     // shape we are morphing TO
attribute float aScale;      // per-particle size variance
attribute float aRandom;     // per-particle phase

varying float vBright;       // facing/depth brightness → volume

// ---- Ashima/webgl-noise 3D simplex (MIT, Ian McEwan / Stefan Gustavson) ----
vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x,289.0);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1.0/6.0,1.0/3.0); const vec4 D=vec4(0.0,0.5,1.0,2.0);
  vec3 i=floor(v+dot(v,C.yyy)); vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz); vec3 l=1.0-g; vec3 i1=min(g.xyz,l.zxy); vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx; vec3 x2=x0-i2+2.0*C.xxx; vec3 x3=x0-1.0+3.0*C.xxx;
  i=mod(i,289.0);
  vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
  float n_=1.0/7.0; vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.0*floor(p*ns.z*ns.z); vec4 x_=floor(j*ns.z); vec4 y_=floor(j-7.0*x_);
  vec4 x=x_*ns.x+ns.yyyy; vec4 y=y_*ns.x+ns.yyyy; vec4 h=1.0-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy); vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.0+1.0; vec4 s1=floor(b1)*2.0+1.0; vec4 sh=-step(h,vec4(0.0));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy; vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x); vec3 p1=vec3(a0.zw,h.y); vec3 p2=vec3(a1.xy,h.z); vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x; p1*=norm.y; p2*=norm.z; p3*=norm.w;
  vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0); m=m*m;
  return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}

void main(){
  // 1) morph between two precomputed shape buffers (sphere↔mesh↔streams↔scatter).
  //    Both share the sphere's index ordering → each particle travels 1:1.
  vec3 pos = mix(aMorphA, aMorphB, uMorph);
  // 2) idle breathing BEFORE displacement (radial, coherent), shimmer via phase
  pos *= 1.0 + sin(uTime * 0.6 + aRandom * 6.2831) * uBreath;
  // sphere normal as the organic-shimmer basis (stable across every morph shape)
  vec3 nrm = normalize(position);
  // 3) COHERENT structural surface waves — distortion travels as ripples, not scatter.
  //    Three orthogonal travelling sines keep it organic yet sphere-preserving.
  float wave = sin(pos.y * 3.5 - uTime * 1.1)
             + sin(pos.x * 2.7 + uTime * 0.8)
             + sin(pos.z * 3.1 - uTime * 0.6);
  pos += nrm * wave * uWave * 0.06;
  // 4) capped radial turbulence (undulation along the surface, bounded amplitude)
  pos += nrm * snoise(position * uNoiseFreq + uTime * uNoiseSpeed) * uNoiseAmp;
  // 5) mouse gravity in WORLD space (sphere at origin)
  vec4 worldPos = modelMatrix * vec4(pos, 1.0);
  float d = distance(worldPos.xyz, uMouse);
  float force = 1.0 - smoothstep(0.0, uMouseRadius, d);     // 1 near cursor → 0 past radius
  worldPos.xyz += normalize(worldPos.xyz - uMouse) * force * uMouseStrength;

  // 6) facing/depth brightness — camera-facing (projected core) bright, rim falls off
  vec3 wN = normalize(mat3(modelMatrix) * nrm);
  vec3 vDir = normalize(cameraPosition - worldPos.xyz);
  vBright = smoothstep(-0.25, 1.0, dot(wN, vDir));

  vec4 mvPosition = viewMatrix * worldPos;
  // physically-correct size attenuation. uScale = drawingBufferHeight (set from JS),
  // so points hold the same pixel size regardless of viewport/dpr. uSize tunes (~0.045).
  gl_PointSize = uSize * aScale * uScale / -mvPosition.z;
  gl_Position  = projectionMatrix * mvPosition;
}
`

export const ORB_FRAG = /* glsl */ `
uniform vec3  uColor;       // already sRGB→linear (set in JS)
uniform float uIntensity;   // brightened during transitions / speaking
uniform float uAlpha;       // master opacity (loader fade / reduced tier)
varying float vBright;      // facing/depth brightness
void main(){
  vec2 uv = gl_PointCoord - 0.5;
  float dist = length(uv);
  if (dist > 0.5) discard;                       // round, not square
  float strength = smoothstep(0.5, 0.0, dist);   // soft glow falloff
  strength = pow(strength, 1.6);
  // depth: rim particles dimmer (volume), camera-facing core particles brighter
  float depth = mix(0.32, 1.15, vBright);
  gl_FragColor = vec4(uColor * uIntensity * depth, strength * uAlpha);
  // three injects linearToOutputTexel into a (non-raw) ShaderMaterial prefix, so this
  // standard include applies the working→output (linear→sRGB) transform — keeping the
  // linear uColor matched to the CSS OKLCH atmosphere instead of washing out.
  #include <colorspace_fragment>
}
`

// --- inner core glow (an internal light source behind the particle shell) ---
export const CORE_VERT = /* glsl */ `
varying float vFacing;
void main(){
  vec3 wN = normalize(mat3(modelMatrix) * normal);
  vec4 wp = modelMatrix * vec4(position, 1.0);
  vec3 vDir = normalize(cameraPosition - wp.xyz);
  vFacing = max(dot(wN, vDir), 0.0);   // 1 at the camera-facing centre, 0 at the rim
  gl_Position = projectionMatrix * viewMatrix * wp;
}
`

export const CORE_FRAG = /* glsl */ `
uniform vec3  uColor;
uniform float uIntensity, uAlpha;
varying float vFacing;
void main(){
  float a = pow(vFacing, 2.6);          // soft glow: opaque at centre, transparent at edge
  gl_FragColor = vec4(uColor * uIntensity, a * 0.6 * uAlpha);
  #include <colorspace_fragment>
}
`
