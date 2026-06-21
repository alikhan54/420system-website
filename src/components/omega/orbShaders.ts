/**
 * orbShaders.ts — GLSL for the OMEGA particle sphere, inlined as strings so the
 * component is self-contained (no `?raw` loader / ambient typings needed).
 *
 * Vertex: Fibonacci sphere → optional morph → idle breathing → simplex
 * turbulence along the normal → world-space mouse gravity → physically-correct
 * point-size attenuation.
 *
 * Fragment: round soft-glow point, color-managed output so hex sRGB doesn't wash
 * out in linear space (paired with `.convertSRGBToLinear()` on the input color).
 */

export const ORB_VERT = /* glsl */ `
uniform float uTime, uSize, uScale, uMorph, uBreath;
uniform float uNoiseAmp, uNoiseFreq, uNoiseSpeed;
uniform vec3  uMouse;        // world-space point on z=0 plane
uniform float uMouseRadius, uMouseStrength;

attribute vec3  aTarget;     // morph target (same point count!)
attribute float aScale;      // per-particle size variance
attribute float aRandom;     // per-particle phase

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
  // 1) morph sphere → target (same N indices)
  vec3 pos = mix(position, aTarget, uMorph);
  // 2) idle breathing BEFORE gravity (apply on the surface), shimmer via per-particle phase
  pos *= 1.0 + sin(uTime * 0.6 + aRandom * 6.2831) * uBreath;
  // 3) organic turbulence along the normal
  pos += normalize(position) * snoise(position * uNoiseFreq + uTime * uNoiseSpeed) * uNoiseAmp;
  // 4) mouse gravity in WORLD space (sphere at origin)
  vec4 worldPos = modelMatrix * vec4(pos, 1.0);
  float d = distance(worldPos.xyz, uMouse);
  float force = 1.0 - smoothstep(0.0, uMouseRadius, d);     // 1 near cursor → 0 past radius
  worldPos.xyz += normalize(worldPos.xyz - uMouse) * force * uMouseStrength;

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
void main(){
  vec2 uv = gl_PointCoord - 0.5;
  float dist = length(uv);
  if (dist > 0.5) discard;                       // round, not square
  float strength = smoothstep(0.5, 0.0, dist);   // soft glow falloff
  strength = pow(strength, 1.6);
  gl_FragColor = vec4(uColor * uIntensity, strength * uAlpha);
  // three injects linearToOutputTexel into a (non-raw) ShaderMaterial prefix, so this
  // standard include applies the working→output (linear→sRGB) transform — keeping the
  // linear uColor matched to the CSS OKLCH atmosphere instead of washing out.
  #include <colorspace_fragment>
}
`
