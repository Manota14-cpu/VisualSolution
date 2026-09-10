"use client";

/* ============================================================
   LA PRENSA
   La trama de la plancha deja de ser un fondo CSS y pasa a ser
   una serigrafía de verdad, calculada por cuadro en la placa de
   video.

   Lo que cambia respecto de la versión en CSS no es que se vea
   "más brillante": es que la trama ahora se comporta como una
   trama. Cada tinta tiene su propio ángulo de pantalla —15° el
   magenta, 75° el violeta— que es exactamente lo que hace un
   taller de serigrafía para que las dos retículas no formen
   muaré al superponerse. Los puntos crecen y se achican con la
   densidad de tinta, se abren donde pasa el puntero, y el scroll
   corre una plancha contra la otra: el fuera de registro del
   monograma, pero en la tinta misma.

   Sin dependencias: es un cuadrilátero y un shader, unas ochenta
   líneas de WebGL crudo. Si el navegador no da, no se monta nada
   y queda la trama en CSS, que ya estaba y se ve bien.
   ============================================================ */

import { useEffect, useRef } from "react";
import { addTask, getScroll, useMotionEnv } from "@/lib/motion";

const VERT = `
attribute vec2 a_pos;
void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`;

const FRAG = `
precision mediump float;

uniform vec2  u_res;    // tamaño del lienzo en píxeles de dispositivo
uniform vec2  u_ptr;    // el puntero, en el mismo espacio
uniform float u_near;   // 1 si el puntero está sobre la plancha
uniform float u_cell;   // lado de la celda de trama, en píxeles
uniform float u_slip;   // cuánto se corrió una plancha contra la otra
uniform float u_ink;    // tintas en juego: sube con cada servicio elegido

const vec3 VIOLETA = vec3(0.545, 0.361, 0.965);
const vec3 MAGENTA = vec3(0.925, 0.282, 0.600);

mat2 giro(float a) {
  float c = cos(a), s = sin(a);
  return mat2(c, -s, s, c);
}

/* Un punto de trama: la celda se recorre girada según el ángulo de
   pantalla de esa tinta, y el radio del punto sale de su densidad. */
float trama(vec2 p, float ang, float dens) {
  vec2 g = fract(giro(ang) * p / u_cell) - 0.5;
  float d = length(g) * 2.0;
  return smoothstep(dens, dens - 0.3, d);
}

void main() {
  vec2 px = gl_FragCoord.xy;
  vec2 uv = px / u_res;

  /* La mezcla de las dos tintas corre en diagonal, igual que el
     degradado del sistema: violeta abajo a la izquierda, magenta
     pleno arriba a la derecha. */
  float t = clamp(uv.x * 0.62 + uv.y * 0.55 + 0.08, 0.0, 1.0);

  /* El puntero abre la trama: más tinta y puntos más gordos donde
     pasa, como una lámpara sobre la plancha. */
  float d = distance(px, u_ptr) / (u_res.x * 0.40 + 1.0);
  float halo = u_near * exp(-d * d * 2.6);

  /* Las dos planchas corridas en direcciones opuestas. */
  vec2 corre = vec2(u_slip, -u_slip * 0.8) * u_ink;

  float dM = clamp(t * 0.95 + halo * 0.45, 0.0, 1.15);
  float dV = clamp((1.0 - t) * 0.95 + halo * 0.45, 0.0, 1.15);

  float m = trama(px + corre, 0.2618, dM);   /* 15° */
  float v = trama(px - corre, 1.3090, dV);   /* 75° */

  /* Base sólida y las dos tramas impresas encima. La plancha tiene que
     seguir siendo una superficie brillante: el monograma negro se cala
     sobre ella y necesita algo de donde recortarse. */
  vec3 col = mix(VIOLETA, MAGENTA, t);
  col = mix(col, MAGENTA * 1.02, m * 0.80);
  col = mix(col, VIOLETA * 1.10, v * 0.30);
  col += halo * 0.10;

  gl_FragColor = vec4(col, 1.0);
}
`;

function compilar(gl: WebGLRenderingContext, tipo: number, src: string) {
  const sh = gl.createShader(tipo);
  if (!sh) return null;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    gl.deleteShader(sh);
    return null;
  }
  return sh;
}

export function Press({ host, tintas }: { host: React.RefObject<HTMLElement | null>; tintas: number }) {
  const lienzo = useRef<HTMLCanvasElement>(null);
  const { reduce, lite, ready } = useMotionEnv();
  /* Se lee de un ref y no de las props dentro del bucle: el bucle se
     arma una sola vez y no puede depender de cada render. */
  const ink = useRef(tintas);
  ink.current = tintas;

  useEffect(() => {
    if (!ready || lite) return;
    const cv = lienzo.current;
    const caja = host.current;
    if (!cv || !caja) return;

    const gl = cv.getContext("webgl", {
      antialias: false,
      alpha: false,
      depth: false,
      stencil: false,
      powerPreference: "low-power",
    });
    if (!gl) return;

    const vs = compilar(gl, gl.VERTEX_SHADER, VERT);
    const fs = compilar(gl, gl.FRAGMENT_SHADER, FRAG);
    const prog = vs && fs ? gl.createProgram() : null;
    if (!vs || !fs || !prog) return;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);

    /* Un cuadrilátero que cubre la pantalla entera. */
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(prog, "a_pos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const u = {
      res: gl.getUniformLocation(prog, "u_res"),
      ptr: gl.getUniformLocation(prog, "u_ptr"),
      near: gl.getUniformLocation(prog, "u_near"),
      cell: gl.getUniformLocation(prog, "u_cell"),
      slip: gl.getUniformLocation(prog, "u_slip"),
      ink: gl.getUniformLocation(prog, "u_ink"),
    };

    /* Un cuadro ya, antes de cualquier bucle. Con alpha:false el lienzo
       arranca negro opaco y tapa la trama en CSS que hay debajo: si la
       primera pintada esperara al primer tick, la plancha parpadearía
       en negro. Y si el bucle nunca corre —pestaña oculta al cargar,
       un rAF que no arranca— igual queda una plancha correcta, quieta. */
    const primerCuadro = () => {
      gl.uniform2f(u.ptr, -9999, -9999);
      gl.uniform1f(u.near, 0);
      gl.uniform1f(u.slip, 0);
      gl.uniform1f(u.ink, ink.current);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    /* La resolución se topea: en una pantalla a 3x esto serían nueve
       veces los píxeles por cuadro sin que nadie note la diferencia. */
    const dpr = () => Math.min(window.devicePixelRatio || 1, 1.5);
    let w = 0;
    let h = 0;
    const medir = () => {
      const r = caja.getBoundingClientRect();
      const p = dpr();
      w = Math.max(1, Math.round(r.width * p));
      h = Math.max(1, Math.round(r.height * p));
      cv.width = w;
      cv.height = h;
      gl.viewport(0, 0, w, h);
      gl.uniform2f(u.res, w, h);
      gl.uniform1f(u.cell, 11 * p);
    };
    medir();
    const ro = new ResizeObserver(() => {
      medir();
      primerCuadro();
    });
    ro.observe(caja);

    /* El puntero y el scroll, en refs: el bucle no puede provocar
       renders y estos valores cambian decenas de veces por segundo. */
    let ptr = { x: -9999, y: -9999 };
    let near = 0;
    const onMove = (e: PointerEvent) => {
      const r = caja.getBoundingClientRect();
      const dentro = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
      near = dentro ? 1 : 0;
      if (!dentro) return;
      const p = dpr();
      ptr = { x: (e.clientX - r.left) * p, y: (r.bottom - e.clientY) * p };
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), { threshold: 0 });
    io.observe(caja);

    let yAnterior = getScroll();
    let slip = 0;

    const pintar = () => {
      /* Fuera de pantalla no se dibuja: un bucle que nadie ve es
         batería tirada. */
      if (!visible) return;
      const y = getScroll();
      /* La velocidad de scroll corre una plancha contra la otra y vuelve
         sola a cero: el registro se abre al mover y se cierra al parar. */
      const v = Math.min(Math.abs(y - yAnterior) * 0.22, 9);
      yAnterior = y;
      slip += (v - slip) * 0.12;

      gl.uniform2f(u.ptr, ptr.x, ptr.y);
      gl.uniform1f(u.near, near);
      gl.uniform1f(u.slip, slip);
      gl.uniform1f(u.ink, ink.current);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    primerCuadro();
    caja.classList.add("is-gpu");

    let soltarTarea: (() => void) | undefined;
    /* Con movimiento reducido no se engancha el bucle: queda el cuadro
       que ya se imprimió. La plancha se ve, pero nada late. */
    if (!reduce) soltarTarea = addTask(pintar);

    return () => {
      soltarTarea?.();
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
      caja.classList.remove("is-gpu");
      gl.deleteBuffer(buf);
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [host, lite, reduce, ready]);

  return <canvas ref={lienzo} className="prensa" aria-hidden="true" />;
}
