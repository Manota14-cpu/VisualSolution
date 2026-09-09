"use client";

import { useCallback, useRef, useState } from "react";
import { Mark3D } from "@/components/brand/Mark3D";
import { askForServices } from "@/lib/consult";
import { scrollToId } from "@/components/motion/MotionProvider";
import { hero, capabilities, heroServices, type HeroService } from "@/lib/content";

/* ============================================================
   EL HERO SE ARMA
   Las fichas de servicio se arrastran dentro del logo, que las
   absorbe y las deja orbitando. Abajo se escribe solo lo que la
   persona armó, y el botón lleva esa combinación al formulario.
   Se puede ignorar por completo: si nadie toca nada, el hero se lee
   igual que siempre. Ese es el límite que no se cruza.
   ============================================================ */

/* Posiciones en arco alrededor del escenario, sólo en pantallas
   anchas. En angosto las fichas van en una fila debajo. */
const ARC: React.CSSProperties[] = [
  { top: "4%", left: "0%" },
  { top: "40%", left: "-6%" },
  { top: "76%", left: "4%" },
  { top: "12%", right: "0%" },
  { top: "58%", right: "-5%" },
];

function Chip({
  service,
  taken,
  dragging,
  onToggle,
  onDragStart,
}: {
  service: HeroService;
  taken: boolean;
  dragging: boolean;
  onToggle: () => void;
  onDragStart: (id: string) => void;
}) {
  return (
    <button
      type="button"
      className={`chip ${taken ? "is-taken" : ""} ${dragging ? "is-dragging" : ""}`}
      aria-pressed={taken}
      onClick={onToggle}
      onPointerDown={(e) => {
        // el arrastre es el camino lindo; el clic es el que siempre funciona
        if (e.button === 0) onDragStart(service.id);
      }}
    >
      <span className="chip-code">{service.code}</span>
      <span className="chip-label">{service.label}</span>
    </button>
  );
}

export function Hero() {
  const [taken, setTaken] = useState<string[]>([]);
  const [dragging, setDragging] = useState<string | null>(null);
  const [over, setOver] = useState(false);
  const stage = useRef<HTMLDivElement>(null);

  const toggle = useCallback((id: string) => {
    setTaken((t) => (t.includes(id) ? t.filter((x) => x !== id) : [...t, id]));
  }, []);

  /* Arrastre: se escucha en la ventana y no en la ficha, para no perder
     el rastro del puntero apenas se sale de ella. */
  const startDrag = useCallback((id: string) => {
    let movido = false;

    const dentro = (e: PointerEvent) => {
      const r = stage.current?.getBoundingClientRect();
      return !!r && e.clientX > r.left && e.clientX < r.right && e.clientY > r.top && e.clientY < r.bottom;
    };

    const move = (e: PointerEvent) => {
      if (!movido) {
        movido = true;
        setDragging(id);
      }
      setOver(dentro(e));
    };
    const up = (e: PointerEvent) => {
      // sólo cuenta como arrastre si hubo movimiento: un clic seco lo
      // resuelve el onClick de la ficha, sin pisarse con esto
      if (movido && dentro(e)) setTaken((t) => (t.includes(id) ? t : [...t, id]));
      setDragging(null);
      setOver(false);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  }, []);

  const elegidos = heroServices.filter((s) => taken.includes(s.id));
  const resumen = elegidos.map((s) => s.label).join(" + ");
  /* La etiqueta no puede crecer sin límite: con los cinco servicios el
     botón se desbordaría y partiría en dos líneas. Hasta dos van los
     nombres, que es lo informativo; de ahí en más, el conteo. */
  const ctaLabel =
    elegidos.length === 0
      ? hero.primaryCta
      : elegidos.length <= 2
        ? `Empezar: ${resumen}`
        : `Empezar: ${elegidos.length} servicios`;

  const empezar = useCallback(() => {
    if (elegidos.length) {
      askForServices(elegidos.map((s) => ({ label: s.label, formValue: s.formValue })));
    }
    scrollToId("contacto");
  }, [elegidos]);

  return (
    <section className="relative overflow-hidden pb-16 pt-28 text-center md:pb-24 md:pt-32" id="top">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(58% 46% at 50% 24%, rgba(139,92,246,.42), rgba(26,11,51,.22) 58%, transparent 78%)",
          }}
        />
        <span
          className="animate-drift-a absolute left-[-8vw] top-[16%] h-28 w-[74vw] rounded-full opacity-55 blur-[46px]"
          style={{ background: "linear-gradient(90deg,transparent,rgba(236,72,153,.85),transparent)" }}
        />
        <span
          className="animate-drift-b absolute right-[-10vw] top-[34%] h-24 w-[62vw] rounded-full opacity-55 blur-[46px]"
          style={{ background: "linear-gradient(90deg,transparent,rgba(139,92,246,.8),transparent)" }}
        />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to bottom,transparent 52%,#040506 100%)" }}
        />
      </div>

      <div className="relative mx-auto w-full max-w-[1200px] px-4 md:px-10">
        {/* El escenario y las fichas en arco comparten contenedor para
            que las posiciones absolutas se midan contra la misma caja. */}
        <div className="relative mx-auto w-full max-w-[820px]">
          <div ref={stage} className={`stage mx-auto ${over ? "is-over" : ""}`}>
            <Mark3D
              className="animate-rise relative mx-auto grid aspect-video w-[min(340px,66vw)] place-items-center md:w-[min(470px,74vw)]"
              services={taken}
            />
          </div>

          {/* En pantalla ancha las fichas flotan alrededor del logo. */}
          <div className="pointer-events-none absolute inset-0 hidden md:block">
            {heroServices.map((s, i) => (
              <div key={s.id} className="pointer-events-auto absolute" style={ARC[i]}>
                <Chip
                  service={s}
                  taken={taken.includes(s.id)}
                  dragging={dragging === s.id}
                  onToggle={() => toggle(s.id)}
                  onDragStart={startDrag}
                />
              </div>
            ))}
          </div>
        </div>

        {/* En angosto van en una fila, que es donde llega el pulgar. */}
        <div className="chip-strip fade-x mt-5 md:hidden">
          {heroServices.map((s) => (
            <Chip
              key={s.id}
              service={s}
              taken={taken.includes(s.id)}
              dragging={dragging === s.id}
              onToggle={() => toggle(s.id)}
              onDragStart={startDrag}
            />
          ))}
        </div>

        <p className={`hint mt-4 font-mono text-[11px] tracking-[.6px] ${taken.length ? "is-done" : ""}`}>
          <span className="hidden md:inline">Arrastrá un servicio al logo</span>
          <span className="md:hidden">Tocá los servicios que necesitás</span>
        </p>

        <h1
          className="animate-rise mx-auto mt-6 max-w-[22ch] text-balance text-[clamp(34px,5.2vw,56px)] font-normal leading-[1.17] tracking-[.22px] text-white"
          style={{ animationDelay: ".12s" }}
        >
          {hero.headline}
        </h1>

        <p
          className="animate-rise mx-auto mt-6 max-w-[52ch] text-base leading-relaxed text-ash"
          style={{ animationDelay: ".22s" }}
        >
          {hero.sub}
        </p>

        {/* Lo armado. Aparece recién cuando hay algo, y cada pieza se
            saca desde acá: quien la puso tiene que poder deshacerlo. */}
        {elegidos.length > 0 && (
          <div className="mt-7">
            <p className="font-mono text-[11px] uppercase tracking-[.8px] text-smoke">Tu proyecto</p>
            <ul className="mt-3 flex flex-wrap justify-center gap-2">
              {elegidos.map((s) => (
                <li key={s.id}>
                  <button type="button" className="taken" onClick={() => toggle(s.id)}>
                    {s.label}
                    <span aria-hidden="true">×</span>
                    <span className="sr-only">Sacar {s.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="animate-rise mt-8 flex flex-wrap justify-center gap-2" style={{ animationDelay: ".32s" }}>
          <button className="btn btn-solid mag" type="button" onClick={empezar}>
            <i className="diamond" aria-hidden="true" />
            <span key={ctaLabel} className="cta-label">
              {ctaLabel}
            </span>
          </button>
          <a className="btn btn-ghost mag" href="#trabajos">
            {hero.secondaryCta}
          </a>
        </div>

        <p
          className="animate-rise mt-4 font-mono text-xs tracking-[.17px] text-smoke"
          style={{ animationDelay: ".42s" }}
        >
          {hero.meta.map((item, i) => (
            <span key={item}>
              <span className="px-2">{item}</span>
              {i < hero.meta.length - 1 && <span className="text-slate">|</span>}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}

/* Marquesina de capacidades. El contenido se duplica para el bucle
   infinito; la copia va oculta a lectores de pantalla. */
export function Marquee() {
  const strip = (hidden: boolean) => (
    <div
      className="flex shrink-0 items-center gap-8 pr-8 font-mono text-[13px] text-ash"
      aria-hidden={hidden || undefined}
    >
      {capabilities.map((cap, i) => (
        <span key={cap} className="contents">
          <span className="mq-word">{cap}</span>
          <span className={i % 2 === 0 ? "text-violet" : "text-pink"} aria-hidden="true">
            /
          </span>
        </span>
      ))}
    </div>
  );

  return (
    <div className="border-y border-hairline bg-card py-5">
      <div className="fade-x overflow-hidden">
        <div className="animate-marquee flex w-max">
          {strip(false)}
          {strip(true)}
        </div>
      </div>
    </div>
  );
}
