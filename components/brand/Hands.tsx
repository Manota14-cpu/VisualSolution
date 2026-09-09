"use client";

/* ============================================================
   EL ENCUENTRO
   Dos manos a punto de tocarse: la de la máquina entra por la
   izquierda, la de la persona por la derecha, y entre las yemas
   queda el hueco donde salta la chispa.

   No es una foto: está dibujada con la misma lógica que todo el
   resto del sitio, relleno plano y contorno negro. Por eso se
   construye en dos pasadas. La primera dibuja todas las piezas
   rellenas Y trazadas de negro: como se pisan entre sí, el trazo
   sobrevive solamente por afuera del conjunto. La segunda vuelve
   a dibujarlas rellenas y sin trazo, tapando las costuras. El
   resultado es una silueta única con contorno parejo, sin una
   sola línea interna que no hayamos puesto a propósito.

   Las falanges se generan: escribir treinta paths a mano es
   donde se cuela el error que después no se encuentra.
   ============================================================ */

import { useCallback, useEffect, useRef } from "react";
import { useMotionEnv } from "@/lib/motion";
import { heroServices } from "@/lib/content";

const RAD = Math.PI / 180;
type Pt = { x: number; y: number };

/* Una falange: cápsula que arranca plana (la tapa la pieza anterior)
   y termina en semicírculo. */
function seg(x: number, y: number, deg: number, len: number, w1: number, w2: number) {
  const a = deg * RAD;
  const c = Math.cos(a);
  const s = Math.sin(a);
  const ex = x + c * len;
  const ey = y + s * len;
  const f = (v: number) => v.toFixed(1);
  return (
    `M ${f(x - s * w1)} ${f(y + c * w1)} ` +
    `L ${f(ex - s * w2)} ${f(ey + c * w2)} ` +
    `A ${f(w2)} ${f(w2)} 0 0 0 ${f(ex + s * w2)} ${f(ey - c * w2)} ` +
    `L ${f(x + s * w1)} ${f(y - c * w1)} Z`
  );
}

/** Un dedo entero: falanges encadenadas, los nudillos y la yema. */
function finger(base: Pt, degs: number[], lens: number[], ws: number[]) {
  const d: string[] = [];
  const joints: (Pt & { r: number })[] = [];
  let p = { ...base };
  for (let i = 0; i < degs.length; i++) {
    d.push(seg(p.x, p.y, degs[i], lens[i], ws[i], ws[i + 1]));
    if (i > 0) joints.push({ x: p.x, y: p.y, r: ws[i] * 0.64 });
    const a = degs[i] * RAD;
    p = { x: p.x + Math.cos(a) * lens[i], y: p.y + Math.sin(a) * lens[i] };
  }
  return { d, joints, tip: p, fin: degs[degs.length - 1], w: ws[ws.length - 1] };
}

/* ---------- LA MANO DE LA MÁQUINA ---------- */

const rIndex = finger({ x: 420, y: 252 }, [2, 6, 10], [56, 48, 42], [17, 15, 12.5, 9]);
const rMiddle = finger({ x: 418, y: 292 }, [10, 16, 22], [54, 46, 38], [17, 15, 12.5, 9]);
const rRing = finger({ x: 412, y: 328 }, [18, 26, 34], [50, 42, 34], [16, 14, 11.5, 8.5]);
const rPinky = finger({ x: 402, y: 358 }, [26, 34, 42], [42, 35, 28], [14, 12.5, 10.5, 8]);
const rThumb = finger({ x: 352, y: 370 }, [46, 34], [58, 44], [20, 17, 12]);

const ROBOT_BODY = [
  "M -40 288 L 154 266 L 160 340 L -40 364 Z", // brazo
  "M 150 266 L 192 260 L 198 346 L 156 340 Z", // codo
  "M 186 262 L 294 248 L 300 356 L 192 344 Z", // antebrazo
  "M 286 244 L 324 236 L 332 364 L 292 356 Z", // muñeca
  "M 318 230 L 400 222 L 434 250 L 438 348 L 404 382 L 326 368 Z", // palma
];

const ROBOT_FINGERS = [rIndex, rMiddle, rRing, rPinky, rThumb];
const ROBOT = [...ROBOT_BODY, ...ROBOT_FINGERS.flatMap((f) => f.d)];

/* ---------- LA MANO DE LA PERSONA ---------- */

const hIndex = finger({ x: 780, y: 256 }, [177, 176, 175], [56, 48, 42], [16, 14, 12, 9]);
const hMiddle = finger({ x: 782, y: 296 }, [162, 148, 132], [54, 46, 38], [16.5, 14.5, 12, 9]);
const hRing = finger({ x: 786, y: 330 }, [152, 136, 120], [50, 42, 34], [15.5, 13.5, 11, 8.5]);
const hPinky = finger({ x: 794, y: 358 }, [144, 128, 112], [42, 35, 28], [13.5, 12, 10, 7.5]);
const hThumb = finger({ x: 856, y: 366 }, [125, 112], [58, 44], [19, 16, 11]);

const HUMAN_BODY = [
  "M 962 248 L 1240 266 L 1246 338 L 968 358 Z", // antebrazo
  "M 926 242 L 970 250 L 976 356 L 934 352 Z", // muñeca
  "M 772 234 C 812 214, 858 212, 888 226 C 914 238, 930 246, 934 256 L 938 346 L 890 384 L 782 368 Z", // palma
];

const HUMAN = [...HUMAN_BODY, ...[hIndex, hMiddle, hRing, hPinky, hThumb].flatMap((f) => f.d)];

/* Las uñas: una elipse apoyada en cada yema, girada con el dedo. Es el
   detalle que separa una mano de una manopla. */
const UNAS = [hIndex, hMiddle, hRing, hPinky, hThumb].map((d) => ({
  x: d.tip.x - Math.cos(d.fin * RAD) * 3.5,
  y: d.tip.y - Math.sin(d.fin * RAD) * 3.5,
  rx: d.w * 0.92,
  ry: d.w * 0.6,
  rot: d.fin,
}));

/* El hueco: exactamente entre las dos yemas del índice. */
const GAP = { x: (rIndex.tip.x + hIndex.tip.x) / 2, y: (rIndex.tip.y + hIndex.tip.y) / 2 };

/* La chispa: ocho rayos recortados, no un degradado. */
const RAYOS = Array.from({ length: 8 }, (_, i) => {
  const a = (i * 45 - 67.5) * RAD;
  const largo = i % 2 === 0 ? 56 : 34;
  const w = 7;
  const c = Math.cos(a);
  const s = Math.sin(a);
  const f = (v: number) => v.toFixed(1);
  return (
    `M ${f(GAP.x + c * largo)} ${f(GAP.y + s * largo)} ` +
    `L ${f(GAP.x - s * w)} ${f(GAP.y + c * w)} ` +
    `L ${f(GAP.x + s * w)} ${f(GAP.y - c * w)} Z`
  );
});

/* Lo que ya se eligió se queda orbitando el punto de contacto, en
   arco por encima de las manos. */
const ORBITA = [-145, -117.5, -90, -62.5, -35].map((deg) => ({
  x: GAP.x + Math.cos(deg * RAD) * 148,
  y: GAP.y + Math.sin(deg * RAD) * 148,
}));

export function Hands({ className, services = [] }: { className?: string; services?: string[] }) {
  const box = useRef<HTMLDivElement>(null);
  const { reduce, fine } = useMotionEnv();

  /* Cuánto se acercan las manos. Lo lleva una custom property y no el
     estado de React: son decenas de eventos por segundo y ninguno
     tiene por qué provocar un render. */
  const acercar = useCallback((v: number) => {
    box.current?.style.setProperty("--reach", v.toFixed(3));
  }, []);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    /* Sin puntero fino, o con movimiento reducido, las manos se quedan
       quietas y ya cerca: la escena tiene que leerse sin mover nada. */
    if (!fine || reduce) {
      acercar(0.62);
      return;
    }
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height * 0.38;
      const d = Math.hypot(e.clientX - cx, e.clientY - cy);
      acercar(Math.max(0, Math.min(1, 1 - d / (r.width * 0.62))));
    };
    const salir = () => acercar(0);
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerleave", salir);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerleave", salir);
    };
  }, [acercar, fine, reduce]);

  const tomados = heroServices.filter((s) => services.includes(s.id));

  return (
    <div ref={box} className={`hands ${tomados.length ? "is-linked" : ""} ${className ?? ""}`}>
      <svg viewBox="0 58 1200 560" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        {/* ---- la máquina ---- */}
        <g className="hand hand-robot">
          <g className="ink">
            {ROBOT.map((d, i) => (
              <path key={i} d={d} />
            ))}
          </g>
          <g className="piel-robot">
            {ROBOT.map((d, i) => (
              <path key={i} d={d} />
            ))}
          </g>
          {/* las costuras que sí van: chapas, respiraderos y nudillos */}
          <g className="detalle">
            <path d="M 206 268 L 292 258" />
            <path d="M 208 300 L 296 296" />
            <path d="M 210 334 L 298 336" />
            <path d="M 298 250 L 304 354" />
            <path d="M 316 240 L 322 360" />
            <path d="M 332 250 L 424 240 L 428 344 L 338 356 Z" />
            <path d="M -20 306 L 60 298" />
            <path d="M -18 330 L 62 322" />
          </g>
          <g className="perno">
            <circle cx="174" cy="303" r="15" />
            <circle cx="380" cy="298" r="13" />
            {ROBOT_FINGERS.flatMap((f, fi) =>
              f.joints.map((j, ji) => <circle key={`${fi}-${ji}`} cx={j.x} cy={j.y} r={j.r} />)
            )}
          </g>
        </g>

        {/* ---- la persona ---- */}
        <g className="hand hand-human">
          <g className="ink">
            {HUMAN.map((d, i) => (
              <path key={i} d={d} />
            ))}
          </g>
          <g className="piel-humana">
            {HUMAN.map((d, i) => (
              <path key={i} d={d} />
            ))}
          </g>
          {/* tres pliegues, lo justo para que la mano no sea una mancha */}
          <g className="detalle">
            <path d="M 800 262 C 812 276, 812 292, 802 306" />
            <path d="M 826 332 C 844 342, 862 346, 882 342" />
            <path d="M 866 250 C 874 264, 876 280, 872 296" />
          </g>
          <g className="unas">
            {UNAS.map((u, i) => (
              <ellipse
                key={i}
                cx={u.x}
                cy={u.y}
                rx={u.rx}
                ry={u.ry}
                transform={`rotate(${u.rot} ${u.x} ${u.y})`}
              />
            ))}
          </g>
        </g>

        {/* ---- la chispa ---- */}
        <g className="chispa" style={{ transformOrigin: `${GAP.x}px ${GAP.y}px` }}>
          <g className="rayos">
            {RAYOS.map((d, i) => (
              <path key={i} d={d} />
            ))}
          </g>
          <circle className="nucleo" cx={GAP.x} cy={GAP.y} r="15" />
        </g>

        {/* ---- lo que la persona ya eligió ---- */}
        <g className="orbita">
          {tomados.map((s, i) => (
            <g key={s.id} style={{ animationDelay: `${i * 70}ms` }}>
              <circle cx={ORBITA[i].x} cy={ORBITA[i].y} r="26" style={{ fill: s.sticker }} />
              <text x={ORBITA[i].x} y={ORBITA[i].y + 5}>
                {s.code}
              </text>
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
}
