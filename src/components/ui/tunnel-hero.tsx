"use client";

import * as THREE from "three";
import { useRef, useEffect, useCallback } from "react";

const vertexShader = `void main(){ gl_Position = vec4(position, 1.0); }`;

// The shader normalizes UVs by the SHORTER screen dimension and scales
// ring radii by the aspect ratio so that the outermost rings always
// extend well past every edge — portrait, landscape, or ultrawide.
const fragmentShader = `
uniform float iTime;
uniform vec3 iResolution;
uniform vec2 iMouse;

#define TAU 6.2831853071795865
#define TUNNEL_LAYERS 128
#define RING_POINTS 128
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
  // Normalize by height and center — guarantees full coverage on any aspect ratio
  vec2 res = iResolution.xy / iResolution.y;
  vec2 uv = gl_FragCoord.xy / iResolution.y - res / 2.0;

  // Mouse offset: shift the view based on cursor position (-0.15 to 0.15 range)
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

  gl_FragColor = vec4(color, 1.0);
}
`;

type ThreeContext = {
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.OrthographicCamera;
  material: THREE.ShaderMaterial;
  mesh: THREE.Mesh;
  geometry: THREE.PlaneGeometry;
};

function createThreeForCanvas(canvas: HTMLCanvasElement, width: number, height: number): ThreeContext {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  renderer.setPixelRatio(dpr);
  renderer.setSize(width, height);

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

  const material = new THREE.ShaderMaterial({
    uniforms: {
      iTime: { value: 0 },
      iResolution: { value: new THREE.Vector3(width * dpr, height * dpr, 1) },
      iMouse: { value: new THREE.Vector2(0.5, 0.5) },
    },
    vertexShader,
    fragmentShader,
  });

  const geometry = new THREE.PlaneGeometry(2, 2);
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  return { renderer, scene, camera, material, mesh, geometry };
}

function disposeThree(ctx: ThreeContext) {
  try {
    ctx.scene.remove(ctx.mesh);
    ctx.mesh.geometry.dispose();
    ctx.material.dispose();
    ctx.renderer.dispose();
  } catch {
    // ignore
  }
}

export default function TunnelShowcase() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<ThreeContext | null>(null);
  const lastTimeRef = useRef<number>(0);
  const animRef = useRef<number | null>(null);
  const pausedRef = useRef<boolean>(false);
  const rafResizeRef = useRef<boolean>(false);
  const mouseTargetRef = useRef<THREE.Vector2>(new THREE.Vector2(0.5, 0.5));
  const mouseCurrentRef = useRef<THREE.Vector2>(new THREE.Vector2(0.5, 0.5));

  const animateFnRef = useRef<((time: number) => void) | null>(null);

  const animate = useCallback((time: number) => {
    if (!ctxRef.current) return;
    animRef.current = requestAnimationFrame((t) => animateFnRef.current?.(t));
    if (pausedRef.current) {
      lastTimeRef.current = time;
      return;
    }
    time *= 0.001;
    const delta = time - (lastTimeRef.current || time);
    lastTimeRef.current = time;
    ctxRef.current.material.uniforms.iTime.value += delta * 0.333;

    // Smooth lerp mouse position toward target
    const lerpSpeed = 1 - Math.pow(0.05, delta);
    mouseCurrentRef.current.x += (mouseTargetRef.current.x - mouseCurrentRef.current.x) * lerpSpeed;
    mouseCurrentRef.current.y += (mouseTargetRef.current.y - mouseCurrentRef.current.y) * lerpSpeed;
    (ctxRef.current.material.uniforms.iMouse.value as THREE.Vector2).copy(mouseCurrentRef.current);

    ctxRef.current.renderer.render(ctxRef.current.scene, ctxRef.current.camera);
  }, []);

  useEffect(() => {
    animateFnRef.current = animate;
  }, [animate]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || typeof window === "undefined") return;

    const width = window.innerWidth;
    const height = window.innerHeight;
    const ctx = createThreeForCanvas(canvas, width, height);
    ctxRef.current = ctx;

    const doResize = () => {
      if (!ctxRef.current) return;
      const w = window.innerWidth;
      const h = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      ctxRef.current.renderer.setPixelRatio(dpr);
      ctxRef.current.renderer.setSize(w, h);
      (ctxRef.current.material.uniforms.iResolution.value as THREE.Vector3).set(w * dpr, h * dpr, 1);
    };

    const handleResize = () => {
      if (rafResizeRef.current) return;
      rafResizeRef.current = true;
      requestAnimationFrame(() => {
        rafResizeRef.current = false;
        doResize();
      });
    };

    const handleOrientation = () => setTimeout(doResize, 150);

    const handleMouseMove = (e: MouseEvent) => {
      mouseTargetRef.current.set(
        e.clientX / window.innerWidth,
        1.0 - e.clientY / window.innerHeight
      );
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleOrientation);
    window.addEventListener("mousemove", handleMouseMove);

    const handleVisibility = () => {
      pausedRef.current = !!document.hidden;
    };
    document.addEventListener("visibilitychange", handleVisibility);
    handleVisibility();

    animRef.current = requestAnimationFrame(animate);

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleOrientation);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("visibilitychange", handleVisibility);
      if (ctxRef.current) {
        disposeThree(ctxRef.current);
        ctxRef.current = null;
      }
    };
  }, [animate]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none"
      style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%" }}
    />
  );
}
