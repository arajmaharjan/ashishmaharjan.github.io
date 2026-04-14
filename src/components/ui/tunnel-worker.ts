/// <reference lib="webworker" />
// Off-main-thread WebGL renderer for the tunnel shader. Running inside a
// dedicated worker means scroll, layout, and React work on the main thread
// cannot stall the animation — the rAF loop here has its own event loop.

const vertexShader = `#version 300 es
in vec2 aPos;
void main(){ gl_Position = vec4(aPos, 0.0, 1.0); }`;

const fragmentShader = `#version 300 es
precision highp float;
uniform float iTime;
uniform vec3 iResolution;
uniform vec2 iMouse;
out vec4 outColor;

#define TAU 6.2831853071795865
#define TUNNEL_LAYERS 72
#define RING_POINTS 96
#define POINT_SIZE 1.8
#define POINT_COLOR_A vec3(1.0)
#define POINT_COLOR_B vec3(0.7)
#define SPEED 0.7

float sq(float x){ return x*x; }

vec2 AngRep(vec2 uv, float angle){
  vec2 polar = vec2(atan(uv.y, uv.x), length(uv));
  polar.x = mod(polar.x + angle/2.0, angle) - angle/2.0;
  return polar.y * vec2(cos(polar.x), sin(polar.x));
}

float sdCircle(vec2 uv, float r){ return length(uv) - r; }

vec3 MixShape(float sd, vec3 fill, vec3 target){
  float minDim = min(iResolution.x, iResolution.y);
  float blend = smoothstep(0.0, 1.0/minDim, sd);
  return mix(fill, target, blend);
}

vec2 TunnelPath(float x){
  vec2 offs = vec2(
    0.2 * sin(TAU * x * 0.5) + 0.4 * sin(TAU * x * 0.2 + 0.3),
    0.3 * cos(TAU * x * 0.3) + 0.2 * cos(TAU * x * 0.1)
  );
  offs *= smoothstep(1.0, 4.0, x);
  return offs;
}

void main(){
  vec2 res = iResolution.xy / iResolution.y;
  vec2 uv = gl_FragCoord.xy / iResolution.y - res / 2.0;
  vec2 mouseOffset = (iMouse - 0.5) * 0.3;
  uv += mouseOffset;

  float minDim = min(iResolution.x, iResolution.y);
  vec3 color = vec3(0.0);
  float repAngle = TAU / float(RING_POINTS);
  float pointSize = POINT_SIZE / (2.0 * minDim);
  float camZ = iTime * SPEED;
  vec2 camOffs = TunnelPath(camZ);

  float halfDiag = length(iResolution.xy * 0.5) / minDim;
  float baseRadius = halfDiag / 6.25 * 1.3;

  for(int i = 1; i <= TUNNEL_LAYERS; i++){
    float pz = 1.0 - (float(i) / float(TUNNEL_LAYERS));
    pz -= mod(camZ, 4.0 / float(TUNNEL_LAYERS));
    vec2 offs = TunnelPath(camZ + pz) - camOffs;
    float ringRad = baseRadius * (1.0 / sq(pz * 0.8 + 0.4));
    if(abs(length(uv + offs) - ringRad) < pointSize * 1.5){
      vec2 aruv = AngRep(uv + offs, repAngle);
      float pdist = sdCircle(aruv - vec2(ringRad, 0), pointSize);
      vec3 ptColor = (mod(float(i/2), 2.0) == 0.0) ? POINT_COLOR_A : POINT_COLOR_B;
      float shade = (1.0 - pz);
      color = MixShape(pdist, ptColor * shade, color);
    }
  }

  outColor = vec4(color, 1.0);
}`;

type InitMsg = { type: "init"; canvas: OffscreenCanvas; width: number; height: number; dpr: number };
type ResizeMsg = { type: "resize"; width: number; height: number; dpr: number };
type MouseMsg = { type: "mouse"; x: number; y: number };
type PauseMsg = { type: "pause"; paused: boolean };
type Msg = InitMsg | ResizeMsg | MouseMsg | PauseMsg;

let gl: WebGL2RenderingContext | null = null;
let uTime: WebGLUniformLocation | null = null;
let uRes: WebGLUniformLocation | null = null;
let uMouse: WebGLUniformLocation | null = null;
let canvas: OffscreenCanvas | null = null;
let dpr = 1;
let raf = 0;
let last = 0;
let iTime = 0;
let paused = false;
const mouseTarget = { x: 0.5, y: 0.5 };
const mouseCurrent = { x: 0.5, y: 0.5 };

function compile(gl: WebGL2RenderingContext, type: number, src: string) {
  const s = gl.createShader(type)!;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    console.error("shader:", gl.getShaderInfoLog(s));
  }
  return s;
}

function init(c: OffscreenCanvas, width: number, height: number, d: number) {
  canvas = c;
  dpr = d;
  c.width = Math.floor(width * dpr);
  c.height = Math.floor(height * dpr);
  const ctx = c.getContext("webgl2", { antialias: false, powerPreference: "high-performance" });
  if (!ctx) return;
  gl = ctx;

  const vs = compile(gl, gl.VERTEX_SHADER, vertexShader);
  const fs = compile(gl, gl.FRAGMENT_SHADER, fragmentShader);
  const prog = gl.createProgram()!;
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.bindAttribLocation(prog, 0, "aPos");
  gl.linkProgram(prog);
  gl.useProgram(prog);

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
    gl.STATIC_DRAW,
  );
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

  uTime = gl.getUniformLocation(prog, "iTime");
  uRes = gl.getUniformLocation(prog, "iResolution");
  uMouse = gl.getUniformLocation(prog, "iMouse");

  gl.viewport(0, 0, c.width, c.height);
  if (uRes) gl.uniform3f(uRes, c.width, c.height, 1);

  last = performance.now();
  raf = self.requestAnimationFrame(loop);
}

function loop(now: number) {
  raf = self.requestAnimationFrame(loop);
  if (!gl || !canvas || paused) {
    last = now;
    return;
  }
  const raw = (now - last) / 1000;
  last = now;
  const delta = raw > 0.25 ? 0.016 : raw;
  iTime += delta * 0.08;

  const lerp = 1 - Math.pow(0.02, delta);
  mouseCurrent.x += (mouseTarget.x - mouseCurrent.x) * lerp;
  mouseCurrent.y += (mouseTarget.y - mouseCurrent.y) * lerp;

  if (uTime) gl.uniform1f(uTime, iTime);
  if (uMouse) gl.uniform2f(uMouse, mouseCurrent.x, mouseCurrent.y);
  gl.drawArrays(gl.TRIANGLES, 0, 6);
}

self.onmessage = (e: MessageEvent<Msg>) => {
  const msg = e.data;
  if (msg.type === "init") {
    init(msg.canvas, msg.width, msg.height, msg.dpr);
  } else if (msg.type === "resize") {
    if (!canvas || !gl) return;
    dpr = msg.dpr;
    canvas.width = Math.floor(msg.width * dpr);
    canvas.height = Math.floor(msg.height * dpr);
    gl.viewport(0, 0, canvas.width, canvas.height);
    if (uRes) gl.uniform3f(uRes, canvas.width, canvas.height, 1);
  } else if (msg.type === "mouse") {
    mouseTarget.x = msg.x;
    mouseTarget.y = msg.y;
  } else if (msg.type === "pause") {
    paused = msg.paused;
  }
};
