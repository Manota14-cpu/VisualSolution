"use client";

/* ============================================================
   MARCA EN 3D
   Las tres piezas del trazado del logo se extruyen con bisel y se
   iluminan con una luz violeta y una rosa, más un mapa de entorno
   procedural para que el metal tenga reflejo real.
   Sin WebGL queda la marca plana que este componente recibe como
   children, y el 3D nunca llega a montarse.
   ============================================================ */

import { useEffect, useRef, useState } from "react";
import type * as THREE_NS from "three";
import { Mark } from "@/components/brand/Mark";
import { useMotionEnv, lerp, clamp01, onScroll } from "@/lib/motion";

/* Contornos del logo real, normalizados a una caja de 143.5 x 76.
   El eje Y va hacia arriba, al revés que en SVG, por eso las
   coordenadas están espejadas respecto del archivo plano.
     a = trazo izquierdo de la V
     b = trazo derecho de la V fundido con la barra superior de la S
     c = gancho inferior de la S */
function markShapes(THREE: typeof THREE_NS) {
  const a = new THREE.Shape();
  a.moveTo(0.0, 76.0);
  a.lineTo(34.48, 17.73);
  a.lineTo(47.35, 35.45);
  a.lineTo(23.31, 76.0);
  a.closePath();

  const b = new THREE.Shape();
  b.moveTo(143.5, 70.66);
  b.lineTo(76.24, 68.84);
  b.lineTo(35.57, 14.81);
  b.lineTo(45.16, 0.0);
  b.lineTo(85.71, 53.9);
  b.lineTo(128.45, 54.27);
  b.closePath();

  const c = new THREE.Shape();
  c.moveTo(133.18, 32.66);
  c.lineTo(123.47, 43.71);
  c.lineTo(86.81, 43.95);
  c.lineTo(76.0, 29.87);
  c.lineTo(114.24, 28.65);
  c.lineTo(104.29, 17.6);
  c.lineTo(67.14, 17.24);
  c.lineTo(53.78, 0.85);
  c.lineTo(112.3, 2.06);
  c.lineTo(131.24, 23.55);
  c.closePath();

  return [a, b, c];
}

/* Entorno procedural: un degradado equirectangular dibujado en canvas.
   Da reflejos reales sin bajar ningún HDR. */
function envTexture(THREE: typeof THREE_NS) {
  const c = document.createElement("canvas");
  c.width = 256;
  c.height = 128;
  const g = c.getContext("2d")!;
  /* Estudio neutro: grises y una banda blanca arriba. El color de marca
     lo ponen las luces, no el entorno. Si el entorno fuera rosa y violeta
     el metal saldría teñido entero y se perdería el brillo claro. */
  const grad = g.createLinearGradient(0, 0, 256, 128);
  grad.addColorStop(0.0, "#0e0e14");
  grad.addColorStop(0.3, "#8f8fa0");
  grad.addColorStop(0.52, "#26262e");
  grad.addColorStop(0.76, "#c2c2cc");
  grad.addColorStop(1.0, "#0d0d12");
  g.fillStyle = grad;
  g.fillRect(0, 0, 256, 128);

  // banda superior clara: hace de cielo y marca el filo del bisel
  const top = g.createLinearGradient(0, 0, 0, 62);
  top.addColorStop(0, "rgba(255,255,255,.85)");
  top.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = top;
  g.fillRect(0, 0, 256, 62);

  // apenas un recuerdo de la marca en los extremos
  g.globalAlpha = 0.16;
  g.fillStyle = "#8B5CF6";
  g.fillRect(0, 62, 96, 66);
  g.fillStyle = "#EC4899";
  g.fillRect(170, 62, 86, 66);
  g.globalAlpha = 1;
  const tex = new THREE.CanvasTexture(c);
  tex.mapping = THREE.EquirectangularReflectionMapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function Mark3D({
  className,
  services = [],
}: {
  className?: string;
  /* Cada servicio absorbido queda orbitando alrededor del logo: la
     persona ve crecer lo que armó, no sólo una lista de texto. */
  services?: string[];
}) {
  const host = useRef<HTMLDivElement>(null);
  const [live, setLive] = useState(false);
  const { reduce, fine, lite } = useMotionEnv();

  /* El conteo viaja por un ref para que sumar uno no vuelva a montar la
     escena entera: el bucle lo lee en el cuadro siguiente. */
  const countRef = useRef(services.length);
  countRef.current = services.length;

  useEffect(() => {
    const el = host.current;
    if (!el) return;

    let disposed = false;
    let cleanup: (() => void) | undefined;

    // three sale del bundle inicial: sólo se descarga al montar el hero
    import("three")
      .then((THREE) => {
        if (disposed || !el) return;

        let renderer: THREE_NS.WebGLRenderer;
        try {
          renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
          });
        } catch {
          return; // sin WebGL se queda la marca plana
        }

        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, lite ? 1.5 : 2));
        renderer.setClearAlpha(0);
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        const cv = renderer.domElement;
        cv.style.width = "100%";
        cv.style.height = "100%";
        cv.style.display = "block";
        cv.style.cursor = "grab";
        el.appendChild(cv);
        setLive(true);

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(30, 1, 1, 3000);


        const extrude = {
          depth: 22,
          bevelEnabled: true,
          bevelThickness: 2.6,
          bevelSize: 2.2,
          bevelOffset: 0,
          bevelSegments: 3,
          curveSegments: 4,
        };

const material = new THREE.MeshStandardMaterial({
          color: 0x8b5cf6,
          metalness: 0,
          roughness: 0.92,
          flatShading: false,
        });

        const group = new THREE.Group();
        const geometries: THREE_NS.ExtrudeGeometry[] = [];

        // El logo ya trae su propia inclinación en el trazado: acá sólo
        // se centra la caja de 143.5 x 76 en el origen.
        for (const shape of markShapes(THREE)) {
          const g = new THREE.ExtrudeGeometry(shape, extrude);
          g.translate(-71.75, -38, -extrude.depth / 2);
          geometries.push(g);
          group.add(new THREE.Mesh(g, material));
        }

        /* El contorno recortado a mano: una copia de cada pieza, un poco
           más grande y con las caras dadas vuelta, pintada de negro. Sólo
           asoma por fuera del volumen, así que se lee como el mismo trazo
           de 1px que el sistema usa en botones y tarjetas. */
        const outlineMat = new THREE.MeshBasicMaterial({
          color: 0x000000,
          side: THREE.BackSide,
        });
        for (const g of geometries) {
          const outline = new THREE.Mesh(g, outlineMat);
          outline.scale.set(1.04, 1.04, 1.05);
          group.add(outline);
        }
        scene.add(group);


        /* Los satélites. Hay cinco preparados y se van revelando a medida
           que la persona mete servicios: crecen desde cero con un rebote
           corto, en vez de aparecer de golpe. */
        const MAX_ORBIT = 5;
const orbitMat = new THREE.MeshStandardMaterial({
          color: 0xffd24a,
          metalness: 0,
          roughness: 0.9,
        });
        const orbitGeo = new THREE.OctahedronGeometry(7, 0);
        const orbits: { mesh: THREE_NS.Mesh; r: number; speed: number; phase: number; tilt: number }[] = [];
        for (let i = 0; i < MAX_ORBIT; i++) {
          const mesh = new THREE.Mesh(orbitGeo, orbitMat);
          mesh.scale.setScalar(0);
          mesh.visible = false;
          orbits.push({
            mesh,
            r: 108 + i * 15,
            speed: 0.34 - i * 0.035,
            phase: (i / MAX_ORBIT) * Math.PI * 2,
            tilt: (i - 2) * 0.22,
          });
          scene.add(mesh);
        }

scene.add(new THREE.AmbientLight(0xffffff, 1.35));
        const key = new THREE.DirectionalLight(0xffffff, 1.5);
        key.position.set(-150, 120, 160);
        const fill = new THREE.DirectionalLight(0xd9c7ff, 0.9);
        fill.position.set(170, -70, 120);
        const rim = new THREE.DirectionalLight(0xffffff, 0.7);
        rim.position.set(30, 140, -180);
        const spark = new THREE.PointLight(0xffffff, 0.3, 900);
        spark.position.set(-40, 60, 220);
        scene.add(key, fill, rim, spark);

        const HALF_W = 76;
        const HALF_H = 42;
        let baseZ = 300;

        const resize = () => {
          const w = el.clientWidth;
          const h = el.clientHeight;
          if (!w || !h) return;
          renderer.setSize(w, h, false);
          camera.aspect = w / h;
          const half = Math.tan((camera.fov * Math.PI) / 360);
          baseZ = Math.max(HALF_H / half, HALF_W / (half * camera.aspect)) * 1.12;
          camera.position.z = baseZ;
          camera.updateProjectionMatrix();
        };
        resize();

        const ro = new ResizeObserver(resize);
        ro.observe(el);

        /* puntero: el objeto se orienta hacia el cursor y, al soltarlo,
           sigue girando con decaimiento en vez de volver de golpe */
        let aimX = 0, aimY = 0, curX = 0, curY = 0, velX = 0, velY = 0, free = false;

        const onMove = (e: PointerEvent) => {
          const r = el.getBoundingClientRect();
          const ny = ((e.clientX - (r.left + r.width / 2)) / r.width) * 1.1;
          const nx = ((e.clientY - (r.top + r.height / 2)) / r.height) * 0.65;
          velX = nx - aimX;
          velY = ny - aimY;
          aimX = nx;
          aimY = ny;
          free = false;
        };
        const onLeave = () => {
          free = true;
          velX *= 6;
          velY *= 6;
        };
        if (fine) {
          el.addEventListener("pointermove", onMove);
          el.addEventListener("pointerleave", onLeave);
        }

        group.rotation.set(-0.1, -0.45, 0);

        if (reduce) {
          renderer.render(scene, camera);
          cleanup = () => {
            ro.disconnect();
            el.removeEventListener("pointermove", onMove);
            el.removeEventListener("pointerleave", onLeave);
            geometries.forEach((g) => g.dispose());
            material.dispose();
            renderer.dispose();
            cv.remove();
          };
          return;
        }

        /* respuesta al scroll: al salir del hero gira más rápido,
           se achica y se aleja en vez de cortar en seco */
        let heroProgress = 0;
        const offScroll = onScroll(() => {
          const r = el.getBoundingClientRect();
          heroProgress = clamp01((-r.top + 40) / (window.innerHeight * 0.85));
        });

        let raf = 0;
        let visible = true;
        let t = 0;

        const frame = () => {
          t += 0.006;
          if (free) {
            aimX += velX * 0.02;
            aimY += velY * 0.02;
            velX *= 0.94;
            velY *= 0.94;
            if (Math.abs(velX) < 0.0004 && Math.abs(velY) < 0.0004) {
              aimX = lerp(aimX, 0, 0.03);
              aimY = lerp(aimY, 0, 0.03);
            }
          }
          curX = lerp(curX, aimX, 0.06);
          curY = lerp(curY, aimY, 0.06);

          const spin = heroProgress * 2.6;
          group.rotation.y = -0.45 + Math.sin(t) * 0.4 + curY + spin;
          group.rotation.x = -0.1 + Math.cos(t * 0.75) * 0.1 + curX;
          group.position.y = Math.sin(t * 1.15) * 2 - heroProgress * 26;
          group.scale.setScalar(1 - heroProgress * 0.18);
          camera.position.z = baseZ * (1 + heroProgress * 0.35);


          /* Cada satélite crece hasta 1 si su índice entra en el conteo,
             y se encoge a 0 si la persona lo sacó. La escala es lo que
             da el rebote al entrar y la desaparición limpia al salir. */
          const activos = countRef.current;
          for (let i = 0; i < orbits.length; i++) {
            const o = orbits[i];
            const objetivo = i < activos ? 1 : 0;
            const s = lerp(o.mesh.scale.x, objetivo, 0.12);
            o.mesh.scale.setScalar(s);
            o.mesh.visible = s > 0.01;
            if (!o.mesh.visible) continue;
            const a = t * o.speed * 6 + o.phase;
            o.mesh.position.set(
              Math.cos(a) * o.r,
              Math.sin(a) * o.r * 0.42 + Math.sin(t * 2 + o.phase) * 5,
              Math.sin(a) * o.r * 0.6 - 20
            );
            o.mesh.rotation.x = a * 0.8 + o.tilt;
            o.mesh.rotation.y = a * 1.1;
          }

          renderer.render(scene, camera);
          raf = requestAnimationFrame(frame);
        };
        frame();

        const pause = () => {
          if (visible) {
            visible = false;
            cancelAnimationFrame(raf);
          }
        };
        const resume = () => {
          if (!visible && !document.hidden) {
            visible = true;
            frame();
          }
        };

        // se detiene fuera de pantalla y con la pestaña oculta
        const io = new IntersectionObserver(
          (entries) => (entries[0].isIntersecting ? resume() : pause()),
          { threshold: 0 }
        );
        io.observe(el);
        const onVis = () => (document.hidden ? pause() : resume());
        document.addEventListener("visibilitychange", onVis);

        cleanup = () => {
          cancelAnimationFrame(raf);
          io.disconnect();
          ro.disconnect();
          offScroll();
          document.removeEventListener("visibilitychange", onVis);
          el.removeEventListener("pointermove", onMove);
          el.removeEventListener("pointerleave", onLeave);
          geometries.forEach((g) => g.dispose());
          orbitGeo.dispose();
          orbitMat.dispose();
          material.dispose();
          outlineMat.dispose();
          renderer.dispose();
          cv.remove();
        };
      })
      .catch(() => {
        /* si three no carga, queda la marca plana */
      });

    return () => {
      disposed = true;
      cleanup?.();
    };
  }, [reduce, fine, lite]);

  return (
    <div
      ref={host}
      className={className}
      role="img"
      aria-label="Símbolo de Visual Solution en tres dimensiones, girando lentamente"
      style={{ touchAction: "pan-y" }}
    >
      {/* respaldo: se ve mientras carga el 3D y si no hay WebGL */}
      {!live && <Mark className="absolute w-[44%] max-w-[230px]" />}
    </div>
  );
}
