"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { Reveal, SplitHeading, useReveal } from "@/components/motion/Reveal";
import { useMotionEnv } from "@/lib/motion";
import { services, type Service } from "@/lib/content";

/* Foco de luz que sigue al cursor e inclinación 3D con el origen en el
   punto del cursor. Se escriben variables CSS: el degradado y el giro
   viven en la hoja de estilos, así que no hay trabajo de layout por
   cada movimiento. */
function useCardMotion<T extends HTMLElement>(strength = 5) {
  const ref = useRef<T>(null);
  const { fine, reduce } = useMotionEnv();

  useEffect(() => {
    const el = ref.current;
    if (!el || !fine || reduce) return;
    let queued = false;
    let px = 0;
    let py = 0;

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${e.clientX - r.left}px`);
      el.style.setProperty("--my", `${e.clientY - r.top}px`);
      px = (e.clientX - r.left) / r.width;
      py = (e.clientY - r.top) / r.height;
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => {
        queued = false;
        el.style.transformOrigin = `${(px * 100).toFixed(1)}% ${(py * 100).toFixed(1)}%`;
        el.style.setProperty("--ry", `${((px - 0.5) * strength).toFixed(2)}deg`);
        el.style.setProperty("--rx", `${((py - 0.5) * -strength * 0.86).toFixed(2)}deg`);
      });
    };
    const onLeave = () => {
      el.style.transformOrigin = "";
      el.style.setProperty("--ry", "0deg");
      el.style.setProperty("--rx", "0deg");
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      onLeave();
    };
  }, [fine, reduce, strength]);

  return ref;
}

function Token({ text, className = "" }: { text: string; className?: string }) {
  const ref = useReveal<HTMLSpanElement>();
  return (
    <span ref={ref} className={`token ${className}`} data-pulse="">
      {text}
    </span>
  );
}

function Shot({ src, alt }: { src: string; alt: string }) {
  const ref = useReveal<HTMLDivElement>();
  return (
    <div ref={ref} className="shot wipe relative aspect-video border-b border-carbon">
      <Image src={src} alt={alt} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
    </div>
  );
}

function PlainCard({ service }: { service: Service }) {
  const ref = useCardMotion<HTMLElement>(service.image ? 4 : 5);
  // el <article> lleva .rv: hay que registrarlo aunque el ref sea del tilt
  useReveal<HTMLElement>(ref);
  return (
    <article ref={ref} className={`card group rv ${service.image ? "" : "gap-4 p-6"} ${service.span}`}>
      {service.image && <Shot src={service.image.src} alt={service.image.alt} />}
      {service.token && <Token text={service.token} />}
      <div className={`flex flex-col gap-2 ${service.image ? "flex-1 p-6" : ""}`}>
        <h3 className="text-xl font-bold leading-snug text-carbon">{service.title}</h3>
        <p className="text-base leading-relaxed text-ash">{service.body}</p>
        {service.tags && (
          <ul className="mt-auto flex flex-wrap gap-2 pt-4">
            {service.tags.map((t) => (
              <li key={t} className="badge">
                {t}
              </li>
            ))}
          </ul>
        )}
      </div>
    </article>
  );
}

/* La tarjeta destacada: no se distingue por brillar sino por estar
   apoyada torcida sobre las demas, tenida y con el sello amarillo.
   El borde conico giratorio, el brillo diagonal y los degradados de
   esquina se fueron: pertenecian al mundo oscuro. */
function FeaturedCard({ service }: { service: Service }) {
  return (
    <Reveal className={service.span}>
      <article className="sticker-card flex h-full flex-col gap-4 rounded-cardlg border border-carbon bg-tint p-6">
        {service.token && <Token text={service.token} className="bg-sun text-carbon" />}
        <div className="flex flex-col gap-2">
          <h3 className="text-xl font-bold leading-snug text-carbon">{service.title}</h3>
          <p className="text-base leading-relaxed text-ash">{service.body}</p>
        </div>
        {service.tags && (
          <ul className="mt-auto flex flex-wrap gap-2 pt-4">
            {service.tags.map((t) => (
              <li key={t} className="badge bg-sun">
                {t}
              </li>
            ))}
          </ul>
        )}
      </article>
    </Reveal>
  );
}

export function Services() {
  return (
    <section className="bg-card border-y border-carbon py-20 md:py-28" id="servicios">
      <div className="mx-auto w-full max-w-[1200px] px-4 md:px-10">
        <Reveal className="mb-10 max-w-[44ch] md:mb-14">
          <SplitHeading
            text="Todo lo que tu marca necesita para verse y funcionar bien."
            className="display display-md"
          />
          <p className="mt-4 max-w-[62ch] text-base leading-relaxed text-ash">
            Trabajamos las dos mitades del mismo problema: la pieza técnica que sostiene el negocio y el
            contenido que lo hace visible.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-12">
          {services.map((service) =>
            service.featured ? (
              <FeaturedCard key={service.id} service={service} />
            ) : (
              <PlainCard key={service.id} service={service} />
            )
          )}
        </div>
      </div>
    </section>
  );
}
