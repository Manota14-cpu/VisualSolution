"use client";

/* ============================================================
   EL ESTUDIO
   El hero es un set de rodaje: el símbolo VS colgado frente a un
   ciclorama, y una luz que la persona mueve con el puntero. Lo que
   la vuelve creíble no es que la luz se mueva, sino lo que arrastra
   con ella: el brillo especular recorre el bisel, la sombra proyectada
   sobre el fondo barre en sentido contrario, y el contraluz cambia de
   lado. Eso es lo que hace un director de fotografía, y es el servicio
   que se vende dos secciones más abajo.
   Sin WebGL queda la marca plana y no se monta nada de esto.
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

/* Entorno neutro: grises y una banda blanca arriba. El color lo ponen
   las luces. Si el entorno fuera de marca, el metal saldría teñido
   entero y el cambio de luz no se notaría. */
function envTexture(THREE: typeof THREE_NS) {
  const c = document.createElement("canvas");
  c.width = 256;
  c.height = 128;
  const g = c.getContext("2d")!;
  const grad = g.createLinearGradient(0, 0, 256, 128);
  grad.addColorStop(0.0, "#0e0e14");
  grad.addColorStop(0.3, "#8f8fa0");
  grad.addColorStop(0.52, "#26262e");
  grad.addColorStop(0.76, "#c2c2cc");
  grad.addColorStop(1.0, "#0d0d12");
  g.fillStyle = grad;
  g.fillRect(0, 0, 256, 128);
  const top = g.createLinearGradient(0, 0, 0, 62);
  top.addColorStop(0, "rgba(255,255,255,.85)");
  top.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = top;
  g.fillRect(0, 0, 256, 62);
  const tex = new THREE.CanvasTexture(c);
  tex.mapping = THREE.EquirectangularReflectionMapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export type LightColor = "violeta" | "rosa" | "blanca";

export const LIGHTS: Record<LightColor, { hex: number; css: string; label: string }> = {
  violeta: { hex: 0x8b5cf6, css: "139,92,246", label: "Violeta" },
  rosa: { hex: 0xec4899, css: "236,72,153", label: "Rosa" },
  blanca: { hex: 0xf2f0ff, css: "226,224,255", label: "Blanca" },
};

/* La posición de reposo es un key clásico: arriba y a la izquierda.
   Cuando el puntero se va, la luz vuelve ahí sola. */
const REST = { x: -0.55, y: 0.42 };

export function Mark3D({
  className,
  color,
  onFirstTouch,
}: {
  className?: string;
  color: LightColor;
  onFirstTouch?: () => void;
}) {
  const host = useRef<HTMLDivElement>(null);
  const [live, setLive] = useState(false);
  const { reduce, fine, lite } = useMotionEnv();

  /* El color viaja por un ref para que cambiarlo no vuelva a montar la
     escena entera: el bucle lo lee en el cuadro siguiente. */
  const colorRef = useRef(color);
  colorRef.current = color;

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

        /* La sombra proyectada es lo que convierte "una luz que se mueve"
           en "un objeto iluminado". En equipos modestos se apaga: cuesta
           un mapa de profundidad por cuadro. */
        const shadows = !lite;
        if (shadows) {
          renderer.shadowMap.enabled = true;
          renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        }

        const cv = renderer.domElement;
        cv.style.width = "100%";
        cv.style.height = "100%";
        cv.style.display = "block";
        cv.style.cursor = "grab";
        cv.style.touchAction = "none";
        el.appendChild(cv);
        setLive(true);

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(30, 1, 1, 3000);

        let envMap: THREE_NS.Texture | null = null;
        try {
          const pmrem = new THREE.PMREMGenerator(renderer);
          pmrem.compileEquirectangularShader();
          envMap = pmrem.fromEquirectangular(envTexture(THREE)).texture;
          scene.environment = envMap;
          pmrem.dispose();
        } catch {
          envMap = null;
        }

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
          color: 0xf2eff8,
          metalness: envMap ? 0.58 : 0.32,
          roughness: envMap ? 0.2 : 0.24,
          envMap,
          envMapIntensity: 0.9,
        });

        const group = new THREE.Group();
        const geometries: THREE_NS.ExtrudeGeometry[] = [];

        for (const shape of markShapes(THREE)) {
          const g = new THREE.ExtrudeGeometry(shape, extrude);
          g.translate(-71.75, -38, -extrude.depth / 2);
          geometries.push(g);
          const m = new THREE.Mesh(g, material);
          m.castShadow = shadows;
          group.add(m);
        }

        // halo aditivo: el bloom barato. No proyecta sombra.
        let glowMat: THREE_NS.MeshBasicMaterial | null = null;
        if (!lite) {
          glowMat = new THREE.MeshBasicMaterial({
            color: LIGHTS[colorRef.current].hex,
            transparent: true,
            opacity: 0.13,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            side: THREE.BackSide,
          });
          for (const g of geometries) {
            const halo = new THREE.Mesh(g, glowMat);
            halo.scale.set(1.05, 1.05, 1.05);
            halo.position.z = -6;
            group.add(halo);
          }
        }
        scene.add(group);

        /* El ciclorama. Es el fondo infinito de un estudio de fotos, y
           acá cumple la función real de recibir la sombra: sin una
           superficie donde caiga, la luz no tiene consecuencia visible. */
        let backdrop: THREE_NS.Mesh | null = null;
        let shadowMat: THREE_NS.ShadowMaterial | null = null;
        if (shadows) {
          /* ShadowMaterial dibuja únicamente la sombra: el plano queda
             invisible en todo lo demás. Con un material opaco, el canvas
             tapaba el resplandor de la página que hay detrás y el hero
             se leía como un recuadro oscuro pegado encima. */
          shadowMat = new THREE.ShadowMaterial({ opacity: 0.55 });
          backdrop = new THREE.Mesh(new THREE.PlaneGeometry(1600, 1100), shadowMat);
          backdrop.position.z = -210;
          backdrop.receiveShadow = true;
          scene.add(backdrop);
        }

        // campo de puntos, sólo profundidad
        let dots: THREE_NS.Points | null = null;
        if (!lite) {
          const N = 220;
          const pos = new Float32Array(N * 3);
          for (let i = 0; i < N; i++) {
            pos[i * 3] = (Math.random() - 0.5) * 460;
            pos[i * 3 + 1] = (Math.random() - 0.5) * 300;
            pos[i * 3 + 2] = -60 - Math.random() * 140;
          }
          const pg = new THREE.BufferGeometry();
          pg.setAttribute("position", new THREE.BufferAttribute(pos, 3));
          dots = new THREE.Points(
            pg,
            new THREE.PointsMaterial({
              color: 0xa98bf0,
              size: 2.1,
              sizeAttenuation: true,
              transparent: true,
              opacity: 0.5,
              depthWrite: false,
            })
          );
          scene.add(dots);
        }

        /* ---- el aparejo de luces ---- */
        scene.add(new THREE.AmbientLight(0x14101f, envMap ? 0.45 : 0.9));

        // LA luz: la que mueve la persona. Un spot para que tenga
        // penumbra y proyecte una sombra con borde blando.
        const key = new THREE.SpotLight(LIGHTS[colorRef.current].hex, 900, 1400, 0.62, 0.75, 1.4);
        key.castShadow = shadows;
        if (shadows) {
          key.shadow.mapSize.set(1024, 1024);
          key.shadow.bias = -0.0006;
          key.shadow.normalBias = 1.4;
          key.shadow.camera.near = 40;
          key.shadow.camera.far = 900;
        }
        key.position.set(-260, 190, 260);
        key.target.position.set(0, 0, 0);
        scene.add(key, key.target);

        // relleno fijo del lado opuesto, para que la cara oscura no se
        // vaya a negro absoluto y el volumen se siga leyendo
        const fill = new THREE.DirectionalLight(0xec4899, envMap ? 0.5 : 0.8);
        fill.position.set(170, -70, 120);
        scene.add(fill);

        const rim = new THREE.DirectionalLight(0xffffff, 0.55);
        rim.position.set(30, 140, -180);
        scene.add(rim);

        /* El cuerpo visible de la luz. Sin esto la persona mueve algo
           invisible y no entiende qué está haciendo. */
        const bulbMat = new THREE.MeshBasicMaterial({
          color: LIGHTS[colorRef.current].hex,
          transparent: true,
          opacity: 0.95,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        });
        const bulb = new THREE.Mesh(new THREE.SphereGeometry(5.5, 16, 16), bulbMat);
        const haloMat = new THREE.MeshBasicMaterial({
          color: LIGHTS[colorRef.current].hex,
          transparent: true,
          opacity: 0.16,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        });
        const bulbHalo = new THREE.Mesh(new THREE.SphereGeometry(22, 16, 16), haloMat);
        scene.add(bulb, bulbHalo);

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

        /* ---- la interacción ----
           El puntero no mueve el logo: mueve la luz. El objeto se queda
           quieto, como en un set. La luz llega con retardo elástico
           porque un aparejo real tiene peso. */
        let aimX = REST.x;
        let aimY = REST.y;
        let curX = REST.x;
        let curY = REST.y;
        let grabbing = false;
        let touched = false;

        const setAim = (e: PointerEvent) => {
          const r = el.getBoundingClientRect();
          aimX = ((e.clientX - r.left) / r.width) * 2 - 1;
          aimY = -(((e.clientY - r.top) / r.height) * 2 - 1);
          if (!touched) {
            touched = true;
            onFirstTouch?.();
          }
        };

        const onDown = (e: PointerEvent) => {
          grabbing = true;
          cv.style.cursor = "grabbing";
          cv.setPointerCapture?.(e.pointerId);
          setAim(e);
        };
        const onMove = (e: PointerEvent) => {
          // con puntero fino basta pasar por encima; en táctil hay que arrastrar
          if (e.pointerType === "touch" && !grabbing) return;
          setAim(e);
        };
        const onUp = (e: PointerEvent) => {
          grabbing = false;
          cv.style.cursor = "grab";
          cv.releasePointerCapture?.(e.pointerId);
        };
        const onLeave = () => {
          if (grabbing) return;
          aimX = REST.x;
          aimY = REST.y;
        };

        el.addEventListener("pointerdown", onDown);
        el.addEventListener("pointermove", onMove);
        el.addEventListener("pointerup", onUp);
        el.addEventListener("pointercancel", onUp);
        el.addEventListener("pointerleave", onLeave);

        // el logo apenas se orienta hacia la luz: da vida sin robar
        // el protagonismo, que acá lo tiene la iluminación
        group.rotation.set(-0.1, -0.45, 0);

        let currentHex = LIGHTS[colorRef.current].hex;
        const applyColor = () => {
          const next = LIGHTS[colorRef.current].hex;
          if (next === currentHex) return;
          currentHex = next;
          key.color.setHex(next);
          bulbMat.color.setHex(next);
          haloMat.color.setHex(next);
          glowMat?.color.setHex(next);
        };

        const section = el.closest("section");
        const place = () => {
          key.position.set(curX * 300, curY * 210, 250);
          bulb.position.copy(key.position);
          bulbHalo.position.copy(key.position);
          /* La escenografía CSS sigue a la luz: el resplandor barre la
             sección entera, no sólo el recuadro del canvas. Son dos
             escrituras de variable por cuadro, sin recalcular layout. */
          if (section) {
            section.style.setProperty("--lx", (50 + curX * 26).toFixed(1) + "%");
            section.style.setProperty("--ly", (34 - curY * 20).toFixed(1) + "%");
          }
        };

        if (reduce) {
          applyColor();
          place();
          renderer.render(scene, camera);
          cleanup = () => {
            ro.disconnect();
            el.removeEventListener("pointerdown", onDown);
            el.removeEventListener("pointermove", onMove);
            el.removeEventListener("pointerup", onUp);
            el.removeEventListener("pointercancel", onUp);
            el.removeEventListener("pointerleave", onLeave);
            geometries.forEach((g) => g.dispose());
            material.dispose();
            renderer.dispose();
            cv.remove();
          };
          return;
        }

        /* al salir del hero el objeto se aleja y se desvanece */
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
          applyColor();

          // el aparejo tiene peso: llega con retardo
          curX = lerp(curX, aimX, grabbing ? 0.14 : 0.07);
          curY = lerp(curY, aimY, grabbing ? 0.14 : 0.07);
          place();

          // respiración mínima del bulbo, para que la luz se sienta encendida
          const pulse = 1 + Math.sin(t * 5) * 0.05;
          bulbHalo.scale.setScalar(pulse);

          // el objeto se orienta apenas hacia donde está la luz
          group.rotation.y = -0.45 + curX * 0.26 + Math.sin(t) * 0.06 + heroProgress * 2.2;
          group.rotation.x = -0.1 - curY * 0.14 + Math.cos(t * 0.75) * 0.04;
          group.position.y = Math.sin(t * 1.15) * 1.6 - heroProgress * 26;
          group.scale.setScalar(1 - heroProgress * 0.18);
          camera.position.z = baseZ * (1 + heroProgress * 0.35);

          if (dots) {
            dots.rotation.y += 0.0006;
            dots.rotation.x = curY * 0.08;
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
          el.removeEventListener("pointerdown", onDown);
          el.removeEventListener("pointermove", onMove);
          el.removeEventListener("pointerup", onUp);
          el.removeEventListener("pointercancel", onUp);
          el.removeEventListener("pointerleave", onLeave);
          geometries.forEach((g) => g.dispose());
          dots?.geometry.dispose();
          backdrop?.geometry.dispose();
          shadowMat?.dispose();
          bulb.geometry.dispose();
          bulbHalo.geometry.dispose();
          material.dispose();
          glowMat?.dispose();
          bulbMat.dispose();
          haloMat.dispose();
          envMap?.dispose();
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
  }, [reduce, fine, lite, onFirstTouch]);

  return (
    <div
      ref={host}
      className={className}
      role="img"
      aria-label="Símbolo de Visual Solution en un estudio: se puede mover la luz que lo ilumina"
    >
      {/* respaldo: se ve mientras carga el 3D y si no hay WebGL */}
      {!live && <Mark className="absolute w-[44%] max-w-[230px]" />}
    </div>
  );
}
